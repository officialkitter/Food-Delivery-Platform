/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Shared Core Layer: Global Application Exception Parser Engine
 * src/core/utils/errorHandler.js
 */

import { Strings } from '../constants/strings';

export const ErrorHandler = {
  /**
   * Destructures unexpected code runtime or network server response errors down
   * to clear, user-facing alert messages
   */
  parseAppException: (thrownExceptionObject) => {
    console.log('[Buza Exception Hub Interception]:', thrownExceptionObject);

    // 1. Evaluate explicit API Network Client Error Shapes
    if (thrownExceptionObject && typeof thrownExceptionObject === 'object') {
      if (thrownExceptionObject.status) {
        switch (thrownExceptionObject.status) {
          case 401:
            return 'Your authentication session has expired. Please re-verify.';
          case 403:
            return 'Access Denied. This merchant is currently restricted in this sector.';
          case 404:
            return 'The requested kitchen menu or order record could not be found.';
          case 422:
            return thrownExceptionObject.message || 'Validation layer mismatch on data endpoints.';
          case 500:
          case 502:
          case 503:
            return Strings?.errors?.generic || 'Buza servers are currently cooking up optimizations. Try shortly.';
          default:
            break;
        }
      }

      // 2. Capture platform native hardware abort/timeout patterns
      if (thrownExceptionObject.name === 'AbortError' || thrownExceptionObject.message?.toLowerCase().includes('timeout')) {
        return 'The request timed out. Please check your data connectivity and retry.';
      }
    }

    // 3. Fallback to structural localization dictionary string parameters
    return Strings?.errors?.networkError || 'A structural connection interruption occurred. Check your cellular data state.';
  }
};
