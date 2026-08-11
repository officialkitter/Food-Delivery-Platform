/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core API Client & Global Network Communication Wrapper
 * src/services/apiclient.js
 */

import { ApiEndpoints, ApiRuntime } from '../constants/apiEndpoints';
import { localStorage } from './localStorage';
import { StorageKeys, AppConfig } from '../constants/config';

const normalizeRequestUrl = (rawUrl) => {
  let safeUrl = String(rawUrl || '').trim();
  if (!safeUrl) return safeUrl;

  if (safeUrl.startsWith('host://')) {
    safeUrl = `http://${safeUrl.slice('host://'.length)}`;
  }

  safeUrl = safeUrl.replace('10.2.2', '10.0.2.2');

  // Repair malformed scheme values like "https:10.0.2.2:5001/..."
  if (!/^[a-z]+:\/\//i.test(safeUrl) && /^[a-z]+:[^/]/i.test(safeUrl)) {
    const match = /^([a-z]+):(.*)$/i.exec(safeUrl);
    if (match?.[1]) {
      const normalizedProtocol = match[1].toLowerCase() === 'host' ? 'http' : match[1];
      safeUrl = `${normalizedProtocol}://${match[2]}`;
    }
  }

  // Normalize common stale API version typo.
  safeUrl = safeUrl.replace(/\/api\/(va|v)(?=\/|$)/i, '/api/v1');

  // Normalize legacy home endpoint path.
  safeUrl = safeUrl.replace(/\/vendors\/home(?=\?|$)/i, '/vendors/home-feed');

  return safeUrl;
};

class ApiClient {
  constructor() {
    this.timeoutMs = AppConfig.clientTimeoutMs || 30000;
  }

  _createNetworkError(targetUrl, currentBaseUrl) {
    if (ApiRuntime?.isLikelyTunnelHost) {
      return new Error(
        `Unable to reach backend at ${targetUrl}. Expo appears to be running in Tunnel mode. Switch Expo connection to LAN and keep backend running on port 5001.`
      );
    }

    return new Error(
      `Unable to reach backend at ${targetUrl}. Check that backend is running and your device can access host ${currentBaseUrl}.`
    );
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

      const message =
        errorJson?.message ||
        errorJson?.error ||
        errorJson?.msg ||
        `Network error encountered: status ${response.status}`;
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
    const currentBaseUrl = ApiEndpoints.BASE_URL;
    const rawTargetUrl = endpointUrl.startsWith('http') ? endpointUrl : `${currentBaseUrl}${endpointUrl}`;
    const targetUrl = normalizeRequestUrl(rawTargetUrl);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers,
        signal: abortController.signal,
      });
      clearTimeout(timeoutId);
      return await this._handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);

      const normalizedErrorMessage = String(error?.message || '').toLowerCase();
      if (
        error?.name === 'TypeError' ||
        normalizedErrorMessage.includes('network request failed') ||
        normalizedErrorMessage.includes('cancelled') ||
        normalizedErrorMessage.includes('canceled')
      ) {
        throw this._createNetworkError(targetUrl, currentBaseUrl);
      }

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
    const currentBaseUrl = ApiEndpoints.BASE_URL;
    const rawTargetUrl = endpointUrl.startsWith('http') ? endpointUrl : `${currentBaseUrl}${endpointUrl}`;
    const targetUrl = normalizeRequestUrl(rawTargetUrl);

    try {
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

      if (error?.name === 'AbortError') {
        throw new Error(
          `Request timed out while contacting ${targetUrl}. Ensure Expo is on LAN mode and backend is reachable on port 5001.`
        );
      }

      const normalizedErrorMessage = String(error?.message || '').toLowerCase();
      if (
        error?.name === 'TypeError' ||
        normalizedErrorMessage.includes('network request failed') ||
        normalizedErrorMessage.includes('cancelled') ||
        normalizedErrorMessage.includes('canceled')
      ) {
        throw this._createNetworkError(targetUrl, currentBaseUrl);
      }

      throw error;
    }
  }
}

export const apiclient = new ApiClient();
