const { supabase } = require('../config/clients');
const { Dispute, SecurityAudit } = require('../models');

const createDispute = async (req, res) => {
  const { order_id, user_id, merchant_id, original_claim_text, correlation_id } = req.body;

  if (!order_id || !user_id || !merchant_id || !original_claim_text || !correlation_id) {
    return res.status(400).json({ success: false, error: 'Validation constraint violated: Missing parameters.' });
  }

  const transactionDispute = new Dispute({
    order_id,
    user_id,
    merchant_id,
    original_claim_text,
    correlation_id,
  });
  await transactionDispute.save();

  return res.status(201).json({ success: true, data: transactionDispute });
};

const lockout = async (req, res) => {
  const { user_id, correlation_id } = req.body;
  const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

  if (!user_id || !correlation_id) {
    return res.status(400).json({ success: false, error: 'Validation constraint violated: Required parameters absent.' });
  }

  const auditRecord = new SecurityAudit({
    actor_id: user_id,
    action_type: 'lockout',
    source_ip: clientIp,
    correlation_id,
  });
  await auditRecord.save();

  const { error } = await supabase
    .from('credential_audit_logs')
    .insert([
      {
        user_id,
        event_type: 'account_locked',
        source_ip: clientIp,
        request_correlation_id: correlation_id,
      },
    ]);

  if (error) {
    throw error;
  }

  return res.status(200).json({ success: true, message: 'Cross-database audit operations synchronized correctly.' });
};

module.exports = {
  createDispute,
  lockout,
};
