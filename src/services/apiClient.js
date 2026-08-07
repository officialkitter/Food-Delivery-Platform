/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core API Client & Global Network Communication Wrapper
 * src/services/apiclient.js
 */

import { ApiEndpoints } from '../constants/apiEndpoints';
import { localStorage } from './localStorage';
import { StorageKeys, AppConfig } from '../constants/config';

class ApiClient {
  constructor() {
    this.baseUrl = ApiEndpoints.BASE_URL;
    this.timeoutMs = AppConfig.clientTimeoutMs || 15000;
  }

  /**
   * Request Interceptor Block
   * Assembles dynamic system configurations and secure validation tokens from cache
   */
  async _getRequestHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-App-Platform': 'ReactNative_Android_iOS',
    };

    const cachedToken = await localStorage.getSecureItem(StorageKeys.USER_TOKEN);
    if (cachedToken) {
      headers['Authorization'] = `Bearer ${cachedToken}`;
    }
    return headers;
  }

  /**
   * Response Interceptor Block
   * Evaluates network response payloads, routing global states or exceptions instantly
   */
  async _handleResponse(response) {
    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      
      // Hook: Intercept authorization dropouts globally
      if (response.status === 401) {
        console.warn('[Buza Security Core]: Authorization token expired or invalid.');
        // Optional: Trigger global event bus logout routines here
      }

      const message = errorJson.message || `Network error encountered: status ${response.status}`;
      const error = Object.assign(new Error(message), {
        status: response.status,
        raw: errorJson,
      });
      throw error;
    }
    return response.json();
  }

  /**
   * HTTP GET Call Wrapper Engine
   */
  async get(endpointUrl) {
    const headers = await this._getRequestHeaders();
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), this.timeoutMs);

    try {
      const targetUrl = endpointUrl.startsWith('http') ? endpointUrl : `${this.baseUrl}${endpointUrl}`;
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers,
        signal: abortController.signal,
      });
      clearTimeout(timeoutId);
      return await this._handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * HTTP POST Call Wrapper Engine
   */
  async post(endpointUrl, payloadBody = {}) {
    const headers = await this._getRequestHeaders();
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), this.timeoutMs);

    try {
      const targetUrl = endpointUrl.startsWith('http') ? endpointUrl : `${this.baseUrl}${endpointUrl}`;
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payloadBody),
        signal: abortController.signal,
      });
      clearTimeout(timeoutId);
      return await this._handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

export const apiclient = new ApiClient();
