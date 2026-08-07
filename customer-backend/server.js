const express = require('express');
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// =========================================================================
// DATABASE INITIALIZATION
// =========================================================================

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connection initialized successfully.'))
    .catch(err => console.error('MongoDB connection error encountered:', err));
} else {
  console.warn('MongoDB URI not provided. Mongo-backed routes may fail until MONGODB_URI is configured.');
}

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('Supabase infrastructure service client initialized successfully.');
} else {
  console.warn('Supabase env vars missing. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable auth routes.');
}

const API_V1 = '/api/v1';

const normalizeIdentifier = (identifier) => {
  const value = String(identifier || '').trim();
  if (!value) return null;
  if (value.includes('@')) return { email: value };
  if (/^\+?[0-9]{7,15}$/.test(value)) return { phone: value };
  return null;
};

// =========================================================================
// MONGODB SCHEMAS (PLAYBOOK CONFORMANCE SPECIFICATIONS)
// =========================================================================

// Playbook Component 3: Transaction and Dispute Database Schema
const DisputeSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  user_id: { type: String, required: true }, 
  merchant_id: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['submitted', 'under_review', 'resolved', 'closed'], 
    default: 'submitted',
    required: true
  },
  original_claim_text: { type: String, required: true, immutable: true },
  correlation_id: { type: String, required: true }
}, { timestamps: true });

const Dispute = mongoose.model('Dispute', DisputeSchema);

// Playbook Component 4: Security and Account Audit Log Store Schema
const SecurityAuditSchema = new mongoose.Schema({
  actor_id: { type: String, required: true },
  action_type: { 
    type: String, 
    enum: ['lockout', 'vault_reset', 'high_risk_payout'], 
    required: true 
  },
  source_ip: { type: String, required: true },
  correlation_id: { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

// Playbook Enforced Constraint: Block descriptive manual data alterations
SecurityAuditSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next(new Error('Playbook Error: System audit structures are strictly append-only. Updates are rejected.'));
  }
  next();
});

const SecurityAudit = mongoose.model('SecurityAudit', SecurityAuditSchema);

// Operational Domain Schema: Menu Management Store
const RestaurantMenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  cloudinary_banner_url: { type: String, required: true },
  cuisine_types: [{ type: String }],
  menu_sections: [{
    section_name: { type: String, required: true },
    items: [{
      name: { type: String, required: true },
      price: { type: Number, required: true },
      cloudinary_image_url: { type: String, required: true },
      modifiers: [{
        modifier_name: { type: String, required: true },
        is_required: { type: Boolean, default: false },
        options: [{
          name: { type: String, required: true },
          price_adjustment: { type: Number, default: 0.00 }
        }]
      }]
    }]
  }]
}, { timestamps: true });

const RestaurantMenu = mongoose.model('RestaurantMenu', RestaurantMenuSchema);

// =========================================================================
// APPLICATION ENDPOINTS
// =========================================================================

app.get(`${API_V1}/health`, (_req, res) => {
  res.status(200).json({ success: true, message: 'Backend is healthy.' });
});

// Route 0A: Register user credentials with Supabase Auth
app.post(`${API_V1}/auth/register`, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase is not configured on the backend.' });
    }

    const { fullName, identifier, password } = req.body;
    const authTarget = normalizeIdentifier(identifier);

    if (!fullName || !authTarget || !password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Invalid registration payload. fullName, identifier, and password(min 6 chars) are required.'
      });
    }

    const signUpPayload = {
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    };

    if (authTarget.email) {
      signUpPayload.email = authTarget.email;
    } else {
      signUpPayload.phone = authTarget.phone;
    }

    const { data, error } = await supabase.auth.signUp(signUpPayload);
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    const session = data?.session || null;
    const user = data?.user || null;

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user,
        accessToken: session?.access_token || null,
        refreshToken: session?.refresh_token || null,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Route 0B: Login user credentials with Supabase Auth
app.post(`${API_V1}/auth/login`, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase is not configured on the backend.' });
    }

    const { identifier, password } = req.body;
    const authTarget = normalizeIdentifier(identifier);

    if (!authTarget || !password) {
      return res.status(400).json({ success: false, error: 'identifier and password are required.' });
    }

    const signInPayload = { password };
    if (authTarget.email) {
      signInPayload.email = authTarget.email;
    } else {
      signInPayload.phone = authTarget.phone;
    }

    const { data, error } = await supabase.auth.signInWithPassword(signInPayload);
    if (error) {
      return res.status(401).json({ success: false, error: error.message });
    }

    const user = data?.user || null;
    const session = data?.session || null;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user,
        accessToken: session?.access_token || null,
        refreshToken: session?.refresh_token || null,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Route 1: Post Transaction Dispute Records (Component 3)
app.post('/api/disputes', async (req, res) => {
  try {
    const { order_id, user_id, merchant_id, original_claim_text, correlation_id } = req.body;

    if (!order_id || !user_id || !merchant_id || !original_claim_text || !correlation_id) {
      return res.status(400).json({ success: false, error: 'Validation constraint violated: Missing parameters.' });
    }

    const transactionDispute = new Dispute({
      order_id,
      user_id,
      merchant_id,
      original_claim_text,
      correlation_id
    });
    await transactionDispute.save();

    res.status(201).json({ success: true, data: transactionDispute });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route 2: Execute Account Lockout and Sync Audit Trace (Component 2 + Component 4 Synchronization)
app.post('/api/security/lockout', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase is not configured on the backend.' });
    }

    const { user_id, correlation_id } = req.body;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    if (!user_id || !correlation_id) {
      return res.status(400).json({ success: false, error: 'Validation constraint violated: Required parameters absent.' });
    }

    // Execution Block 1: Append Audit Record into MongoDB
    const auditRecord = new SecurityAudit({
      actor_id: user_id,
      action_type: 'lockout',
      source_ip: clientIp,
      correlation_id
    });
    await auditRecord.save();

    // Execution Block 2: Sync State Target into Supabase Relational Schema
    const { error } = await supabase
      .from('credential_audit_logs')
      .insert([
        { 
          user_id: user_id, 
          event_type: 'account_locked', 
          source_ip: clientIp, 
          request_correlation_id: correlation_id 
        }
      ]);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Cross-database audit operations synchronized correctly.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route 3: Fetch Menu Items for Client Ingestion
app.get('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const targetMenu = await RestaurantMenu.findOne({ _id: req.params.id, is_active: true });
    if (!targetMenu) {
      return res.status(404).json({ success: false, error: 'Target resource entity location not resolved.' });
    }
    res.status(200).json({ success: true, data: targetMenu });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =========================================================================
// APPLICATION PORT ACTIVATION
// =========================================================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend delivery server interface executing on port execution target: ${PORT}`);
});
