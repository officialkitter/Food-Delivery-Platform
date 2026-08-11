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
    return await apiclient.post(ApiEndpoints.cart.applyCoupon, { code: voucherStringCode, subtotal: currentCartSubtotal });
  },

  /**
   * Finalizes the order payload structure to process secure financial checkout
   */
  async dispatchCartOrder(finalizedCartPayload) {
    return await apiclient.post(ApiEndpoints.cart.checkout, finalizedCartPayload);
  }
};
