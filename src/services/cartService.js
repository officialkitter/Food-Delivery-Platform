/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Invoice Processing & Checkout Cart Validation Service
 * src/services/cartService.js
 */

import { apiclient } from './apiClient';
import { ApiEndpoints } from '../constants/apiEndpoints';

export const cartService = {
  /**
   * Validates promo parameters with the remote checkout engine
   */
  async claimVoucherCode(voucherStringCode, currentCartSubtotal) {
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 600));
      if (voucherStringCode.toUpperCase() === 'BUZAFRESH') {
        return { isValid: true, deductionValue: currentCartSubtotal * 0.15, text: '15% Discount Applied' };
      }
      const error = new Error('This coupon code is unrecognized within this regional outlet.');
      error.status = 422;
      throw error;
    }
    return await apiclient.post(ApiEndpoints.cart.applyCoupon, { code: voucherStringCode, subtotal: currentCartSubtotal });
  },

  /**
   * Finalizes the order payload structure to process secure financial checkout
   */
  async dispatchCartOrder(finalizedCartPayload) {
    return await apiclient.post(ApiEndpoints.cart.checkout, finalizedCartPayload);
  }
};
