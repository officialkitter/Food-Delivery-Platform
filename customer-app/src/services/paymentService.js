/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Payment authorization service
 * src/services/paymentService.js
 */

import { apiclient } from './apiClient';
import { ApiEndpoints } from '../constants/apiEndpoints';

export const paymentService = {
  async authorizePayment({ orderId, amount, method, channel }) {
    return apiclient.post(ApiEndpoints.payments.authorize, {
      orderId,
      amount,
      method,
      channel,
    });
  },
};
