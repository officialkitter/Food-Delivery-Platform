# FCM + Supabase Push Setup

## 1) Frontend prerequisites

- `google-services.json` must exist at `customer-app/google-services.json`.
- `GoogleService-Info.plist` must exist at `customer-app/GoogleService-Info.plist` for iOS builds.
- `expo-notifications` must be installed.
- The app must run as a development build or production build for native push tokens.

## 2) Supabase schema changes

Run the SQL in:

- `supabase/migrations/20260810_fcm_push_tokens_and_order_status_webhook.sql`

This adds:

- `profiles.push_token`
- `profiles.push_token_type`
- `profiles.push_token_updated_at`
- Trigger on `orders` status updates that calls Edge Function `order-status-fcm`.

## 3) Set Edge Function secrets

Use Supabase CLI to set required secrets:

```bash
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
supabase secrets set FIREBASE_PROJECT_ID=your-firebase-project-id
supabase secrets set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
supabase secrets set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
supabase secrets set EDGE_WEBHOOK_SECRET=your_random_webhook_secret
```

## 4) Deploy Edge Function

```bash
supabase functions deploy order-status-fcm
```

## 5) Configure database runtime settings

Set these in SQL editor once per database (replace placeholders):

```sql
alter database postgres set app.settings.supabase_url = 'https://YOUR_PROJECT_REF.supabase.co';
alter database postgres set app.settings.edge_webhook_secret = 'your_random_webhook_secret';
```

## 6) How it works

- App logs in.
- App requests notification permission.
- App saves native push token into `profiles.push_token`.
- When `orders.status` changes, PostgreSQL trigger calls Edge Function.
- Edge Function looks up the customer profile push token and sends FCM notification.

## Notes

- Keep Firebase service account JSON secret; do not commit it.
- If you rotate Firebase keys, update Edge Function secrets and redeploy.
- For local testing, invoke the function with a sample payload using Supabase CLI.
