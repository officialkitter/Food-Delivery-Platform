/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Shared Core Layer: Regional Data String Formatter Helpers
 * src/core/utils/formatters.js
 */


export const Formatter = {
  /**
   * Encapsulates raw numeric figures cleanly into highly stylized localized currency patterns
   * Handles custom trailing/leading notation structures seamlessly
   */
  formatCurrency: (amountValue, targetCurrencyCode = 'USD') => {
    const numericAmount = Number(amountValue);
    if (Number.isNaN(numericAmount)) return '0.00';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericAmount);
  },

  /**
   * Translates incoming ISO timestamp string segments into short delivery-friendly time formats
   */
  formatTimeAgo: (isoDateString) => {
    if (!isoDateString) return '';
    const dateInstance = new Date(isoDateString);
    if (Number.isNaN(dateInstance.getTime())) return '';

    const timestampSeconds = Math.floor((Date.now() - dateInstance.getTime()) / 1000);
    if (timestampSeconds < 60) return 'Just now';

    const timestampMinutes = Math.floor(timestampSeconds / 60);
    if (timestampMinutes < 60) return `${timestampMinutes}m ago`;

    const timestampHours = Math.floor(timestampMinutes / 60);
    if (timestampHours < 24) return `${timestampHours}h ago`;

    return dateInstance.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};
