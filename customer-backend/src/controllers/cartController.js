const { supabase } = require('../config/clients');
const { env } = require('../config/env');
const { isUuid, toNumeric } = require('../utils/common');

const validateCoupon = async (req, res) => {
  const code = String(req.body?.code || '').trim().toUpperCase();
  const subtotal = toNumeric(req.body?.subtotal, 0);

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Coupon code is required.',
      error: 'Coupon code is required.',
    });
  }

  const { data: coupon, error } = await supabase
    .from(env.SUPABASE_COUPON_TABLE)
    .select('id, code, is_active, discount_type, discount_value, min_subtotal')
    .eq('code', code)
    .limit(1)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to validate coupon in Supabase table ${env.SUPABASE_COUPON_TABLE}.`,
      error: error.message,
    });
  }

  if (!coupon || coupon.is_active === false) {
    return res.status(422).json({
      success: false,
      message: 'This coupon code is unrecognized within this regional outlet.',
      error: 'Coupon not found or inactive.',
    });
  }

  const minSubtotal = toNumeric(coupon.min_subtotal, 0);
  if (subtotal < minSubtotal) {
    return res.status(422).json({
      success: false,
      message: `Coupon requires a minimum subtotal of ${minSubtotal}.`,
      error: 'Minimum subtotal not met.',
    });
  }

  const discountValue = toNumeric(coupon.discount_value, 0);
  const isPercentage = String(coupon.discount_type || '').toLowerCase() === 'percentage';
  const deductionValue = isPercentage
    ? subtotal * (discountValue / 100)
    : discountValue;

  return res.status(200).json({
    success: true,
    data: {
      isValid: true,
      deductionValue,
      text: isPercentage ? `${discountValue}% Discount Applied` : 'Discount Applied',
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue,
      },
    },
  });
};

const checkout = async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const subtotal = toNumeric(req.body?.subtotal, items.reduce((sum, item) => {
    const price = toNumeric(item?.price, 0);
    const quantity = toNumeric(item?.quantity, 1);
    return sum + (price * quantity);
  }, 0));
  const deliveryFee = toNumeric(req.body?.deliveryFee, 0);
  const tax = toNumeric(req.body?.tax, 0);
  const discount = toNumeric(req.body?.discount, 0);
  const total = toNumeric(req.body?.total, subtotal + deliveryFee + tax - discount);

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart must contain at least one item.',
      error: 'Empty cart payload.',
    });
  }

  const customerId = isUuid(req.body?.userId) ? String(req.body.userId).trim() : null;
  const restaurantId = String(req.body?.restaurantId || req.body?.vendorId || 'buza-default-restaurant').trim();
  const deliveryAddress = String(
    req.body?.deliveryAddressSnapshot || req.body?.deliveryAddress || req.body?.address || 'Address pending'
  ).trim();

  const orderPayload = {
    customer_id: customerId,
    restaurant_id: restaurantId,
    status: 'submitted',
    delivery_fee: deliveryFee,
    total_amount: total,
    payment_status: 'unpaid',
    delivery_address_snapshot: deliveryAddress,
  };

  const { data: createdOrder, error: orderError } = await supabase
    .from(env.SUPABASE_ORDER_TABLE)
    .insert([orderPayload])
    .select('*')
    .single();

  if (orderError) {
    return res.status(500).json({
      success: false,
      message: `Failed to write order into Supabase table ${env.SUPABASE_ORDER_TABLE}.`,
      error: orderError.message,
    });
  }

  const orderItemsPayload = items.map((item, index) => ({
    order_id: createdOrder.id,
    mongo_item_id: String(item?.mongo_item_id || item?.mongoItemId || item?.id || `item-${index + 1}`),
    item_name: String(item?.name || item?.item_name || `Item ${index + 1}`),
    quantity: Math.max(1, Number.parseInt(item?.quantity, 10) || 1),
    price_per_unit: toNumeric(item?.price_per_unit, toNumeric(item?.price, 0)),
    customizations_json: item?.customizations_json || item?.customizations || {},
  }));

  const { data: createdItems, error: itemsError } = await supabase
    .from(env.SUPABASE_ORDER_ITEM_TABLE)
    .insert(orderItemsPayload)
    .select('*');

  if (itemsError) {
    await supabase
      .from(env.SUPABASE_ORDER_TABLE)
      .delete()
      .eq('id', createdOrder.id);

    return res.status(500).json({
      success: false,
      message: `Failed to write order items into Supabase table ${env.SUPABASE_ORDER_ITEM_TABLE}.`,
      error: itemsError.message,
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Order submitted successfully.',
    data: {
      order: createdOrder,
      orderItems: createdItems,
    },
  });
};

const getCurrentCart = async (req, res) => {
  const userIdentifier = String(req.query?.userId || req.query?.identifier || '').trim();
  const hasCustomerIdFilter = isUuid(userIdentifier);
  let query = supabase
    .from(env.SUPABASE_ORDER_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (hasCustomerIdFilter) {
    query = query.eq('customer_id', userIdentifier);
  }

  const { data, error } = await query;
  if (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to load orders from Supabase table ${env.SUPABASE_ORDER_TABLE}.`,
      error: error.message,
    });
  }

  return res.status(200).json({ success: true, data });
};

module.exports = {
  validateCoupon,
  checkout,
  getCurrentCart,
};
