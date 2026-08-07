/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core Checkout Volumetric Math & Voucher Reducer Layer
 * src/context/CartContext.js
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QTY: 'UPDATE_QTY',
  APPLY_VOUCHER: 'APPLY_VOUCHER',
  CLEAR_CART: 'CLEAR_CART'
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += 1;
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case CART_ACTIONS.UPDATE_QTY: {
      const targetIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (targetIndex === -1) return state;
      
      const updatedItems = [...state.items];
      updatedItems[targetIndex].quantity = action.payload.quantity;
      
      if (updatedItems[targetIndex].quantity <= 0) {
        updatedItems.splice(targetIndex, 1);
      }
      return { ...state, items: updatedItems };
    }
    case CART_ACTIONS.APPLY_VOUCHER:
      return { ...state, voucher: action.payload };
    case CART_ACTIONS.CLEAR_CART:
      return { items: [], voucher: null };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], voucher: null });

  // Atomic Action Enforcers
  const addItemToBasket = useCallback((product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
  }, []);

  const updateItemQuantity = useCallback((id, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QTY, payload: { id, quantity } });
  }, []);

  const clearBasket = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR_CART }), []);

  const applyVoucherCode = useCallback(async (code) => {
    // Future API link: Validate coupon configuration matching merchant rules
    if (code.toUpperCase() === 'BUZAFRESH') {
      dispatch({ type: CART_ACTIONS.APPLY_VOUCHER, payload: { code, percentage: 15 } });
      return true;
    }
    return false;
  }, []);

  // Compute live cart sums on demand using optimized deep-cache lookups
  const financialMetrics = useMemo(() => {
    const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 3.99 : 0;
    const tax = subtotal * 0.05; // 5% base tax configuration
    const discount = state.voucher ? (subtotal * (state.voucher.percentage / 100)) : 0;
    const total = Math.max((subtotal + deliveryFee + tax) - discount, 0);

    return { subtotal, deliveryFee, tax, discount, total };
  }, [state.items, state.voucher]);

  const value = useMemo(() => ({
    items: state.items,
    voucher: state.voucher,
    ...financialMetrics,
    addItemToBasket,
    updateItemQuantity,
    clearBasket,
    applyVoucherCode
  }), [state.items, state.voucher, financialMetrics, addItemToBasket, updateItemQuantity, clearBasket, applyVoucherCode]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart hook requires matching CartProvider architecture context.');
  return context;
};
