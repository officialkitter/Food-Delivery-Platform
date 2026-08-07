/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Feature State Engine: Cart & Basket Slice
 * src/features/cart/cartSlice.js
 */

import { useState, useCallback, useMemo } from 'react';

export const useCartSlice = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Core Mutation: Add item to basket or compound its volumetrics
  const addToBasket = useCallback((item, customizations = []) => {
    setError(null);
    setBasketItems((prevItems) => {
      // Create a deterministic unique hash grouping identity matching item id + chosen optional additions
      const sortedCustomizations = [...customizations].sort((a, b) => String(a).localeCompare(String(b)));
      const customHash = `${item.id}-${sortedCustomizations.join('_')}`;
      const existingIndex = prevItems.findIndex((p) => p.cartId === customHash);

      if (existingIndex > -1) {
        const mutableCopy = [...prevItems];
        mutableCopy[existingIndex].quantity += 1;
        return mutableCopy;
      }

      return [
        ...prevItems,
        {
          ...item,
          cartId: customHash,
          quantity: 1,
          selectedCustomizations: customizations,
        },
      ];
    });
  }, []);

  // Core Mutation: Direct volumetric manipulation or line destruction
  const updateQuantity = useCallback((cartId, newQuantity) => {
    setError(null);
    setBasketItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.cartId !== cartId);
      }
      return prevItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  // API Call simulation: Validate and latch on voucher configurations
  const validateAndApplyPromo = useCallback(async (couponCode) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const formattedCode = couponCode.trim().toUpperCase();

      if (formattedCode === 'BUZASTARTUP') {
        setAppliedPromo({ code: formattedCode, discountPercentage: 20 });
        return true;
      }
      setError('The promo code entered is invalid or expired.');
      return false;
    } catch (err) {
      if (err) {
        console.warn('[cartSlice] Promo validation failed.', err);
      }
      setError(err?.message || 'Fulfillment server coupon processing error.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Structural Action: Clear all basket variables
  const resetCart = useCallback(() => {
    setBasketItems([]);
    setAppliedPromo(null);
    setError(null);
  }, []);

  // Optimized Mathematical Selectors Engine
  const checkoutMetrics = useMemo(() => {
    const subtotal = basketItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const serviceFee = subtotal > 0 ? 1.50 : 0;
    let deliveryFee = 0;
    if (subtotal > 0 && subtotal <= 15) {
      deliveryFee = 3.99;
    }
    const discount = appliedPromo ? subtotal * (appliedPromo.discountPercentage / 100) : 0;
    const total = Math.max(subtotal + serviceFee + deliveryFee - discount, 0);

    return {
      subtotal,
      serviceFee,
      deliveryFee,
      discount,
      total,
      itemCount: basketItems.reduce((acc, item) => acc + item.quantity, 0),
    };
  }, [basketItems, appliedPromo]);

  return {
    basketItems,
    appliedPromo,
    isLoading,
    error,
    ...checkoutMetrics,
    addToBasket,
    updateQuantity,
    validateAndApplyPromo,
    resetCart,
  };
};
