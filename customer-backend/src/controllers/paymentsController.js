const { supabase } = require('../config/clients');
const { env } = require('../config/env');
const { toNumeric } = require('../utils/common');

const authorizePayment = async (req, res) => {
  const orderId = req.body?.orderId || null;
  const amount = toNumeric(req.body?.amount, Number.NaN);
  const method = String(req.body?.method || '').trim() || 'unknown';

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'A valid payment amount is required.',
      error: 'Invalid payment amount.',
    });
  }

  let updatedOrder = null;
  if (orderId) {
    const { data: orderRow, error: orderError } = await supabase
      .from(env.SUPABASE_ORDER_TABLE)
      .update({ payment_status: 'authorized' })
      .eq('id', orderId)
      .select('*')
      .maybeSingle();

    if (orderError) {
      return res.status(500).json({
        success: false,
        message: `Failed to update payment_status in Supabase table ${env.SUPABASE_ORDER_TABLE}.`,
        error: orderError.message,
      });
    }

    updatedOrder = orderRow;
  }

  const authorizationResult = {
    order_id: orderId,
    method,
    amount,
    currency: 'TZS',
    status: 'authorized',
    provider_reference: `SIM-${Date.now()}`,
    metadata: {
      channel: req.body?.channel || null,
      storageMode: orderId ? 'orders.payment_status' : 'none',
    },
    order: updatedOrder,
  };

  return res.status(201).json({
    success: true,
    message: 'Payment authorized successfully.',
    data: authorizationResult,
  });
};

module.exports = {
  authorizePayment,
};
