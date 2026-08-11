import { createClient } from 'npm:@supabase/supabase-js@2';
import { importPKCS8, SignJWT } from 'npm:jose@5.9.6';

type OrderRecord = {
  id: string;
  customer_id: string | null;
  status: string | null;
  payment_status?: string | null;
  total_amount?: number | null;
  restaurant_id?: string | null;
};

type WebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: OrderRecord;
  old_record?: OrderRecord;
};

const statusCopy: Record<string, { title: string; body: string }> = {
  submitted: {
    title: 'Order Received',
    body: 'Your order was received and is being prepared.',
  },
  preparing: {
    title: 'Kitchen Update',
    body: 'Your order is now being prepared.',
  },
  ready_for_pickup: {
    title: 'Ready For Pickup',
    body: 'Your order is ready and waiting for a rider.',
  },
  out_for_delivery: {
    title: 'Out For Delivery',
    body: 'Your rider is on the way with your order.',
  },
  delivered: {
    title: 'Delivered',
    body: 'Your order has been delivered. Enjoy your meal.',
  },
  cancelled: {
    title: 'Order Cancelled',
    body: 'Your order was cancelled. Contact support if needed.',
  },
};

const ensureEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const unique = <T>(values: T[]) => [...new Set(values)];

const isMissingRelationError = (error: { code?: string; message?: string } | null | undefined): boolean => {
  if (!error) return false;
  if (String(error.code || '') === '42P01') return true;
  return /relation .* does not exist/i.test(String(error.message || ''));
};

const getProfileTableCandidates = (): string[] => unique([
  Deno.env.get('SUPABASE_PROFILE_TABLE') || 'profiles',
  'profiles',
  'account_profiles',
  'customer_profiles',
]);

const readProfilePushToken = async (
  supabase: ReturnType<typeof createClient>,
  customerId: string
) => {
  for (const tableName of getProfileTableCandidates()) {
    const { data, error } = await supabase
      .from(tableName)
      .select('id,push_token,push_token_type')
      .eq('id', customerId)
      .maybeSingle();

    if (error) {
      if (isMissingRelationError(error)) {
        continue;
      }

      throw new Error(`Failed to load profile push token from ${tableName}: ${error.message}`);
    }

    return { tableName, data };
  }

  throw new Error('No supported profile table found for push token lookup.');
};

const normalizePrivateKey = (value: string): string => value.replaceAll(String.raw`\n`, '\n');

const buildAccessToken = async () => {
  const clientEmail = ensureEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = normalizePrivateKey(ensureEnv('FIREBASE_PRIVATE_KEY'));

  const key = await importPKCS8(privateKey, 'RS256');
  const now = Math.floor(Date.now() / 1000);

  const assertion = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!tokenResponse.ok) {
    const errText = await tokenResponse.text();
    throw new Error(`Failed to fetch Google OAuth token: ${errText}`);
  }

  const tokenPayload = await tokenResponse.json();
  return tokenPayload.access_token as string;
};

const sendFcm = async (pushToken: string, order: OrderRecord, oldStatus: string | null, newStatus: string) => {
  const projectId = ensureEnv('FIREBASE_PROJECT_ID');
  const accessToken = await buildAccessToken();
  const copy = statusCopy[newStatus] || {
    title: 'Order Update',
    body: `Your order status changed to ${newStatus}.`,
  };

  const response = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        token: pushToken,
        notification: {
          title: copy.title,
          body: copy.body,
        },
        data: {
          order_id: String(order.id || ''),
          status: String(newStatus || ''),
          previous_status: String(oldStatus || ''),
          payment_status: String(order.payment_status || ''),
          restaurant_id: String(order.restaurant_id || ''),
          total_amount: String(order.total_amount || ''),
        },
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`FCM send failed: ${errText}`);
  }

  return response.json();
};

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed.' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const webhookSecret = Deno.env.get('EDGE_WEBHOOK_SECRET');
    if (webhookSecret) {
      const incomingSecret = req.headers.get('x-webhook-secret');
      if (incomingSecret !== webhookSecret) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized webhook.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const payload = (await req.json()) as WebhookPayload;
    const newOrder = payload.record;
    const oldOrder = payload.old_record;

    if (!newOrder?.id || !newOrder?.customer_id) {
      return new Response(JSON.stringify({ success: true, skipped: true, reason: 'Missing order id or customer_id.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const previousStatus = oldOrder?.status || null;
    const currentStatus = newOrder.status || null;

    if (!currentStatus || previousStatus === currentStatus) {
      return new Response(JSON.stringify({ success: true, skipped: true, reason: 'Order status unchanged.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      ensureEnv('SUPABASE_URL'),
      ensureEnv('SUPABASE_SERVICE_ROLE_KEY')
    );

    const { data: profileRow } = await readProfilePushToken(supabase, newOrder.customer_id);

    const pushToken = profileRow?.push_token;
    if (!pushToken) {
      return new Response(JSON.stringify({ success: true, skipped: true, reason: 'No push token saved for profile.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fcmResponse = await sendFcm(pushToken, newOrder, previousStatus, currentStatus);

    return new Response(JSON.stringify({ success: true, data: fcmResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
