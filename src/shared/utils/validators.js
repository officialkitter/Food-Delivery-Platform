/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Shared Core Layer: System Data Validation Matrix
 * src/core/utils/validators.js
 */

import { ValidationRegex } from '../../constants/config';

const isValidEmailFormat = (emailString) => {
  if (!emailString) return false;
  const cleanEmail = emailString.trim();
  if (!cleanEmail || cleanEmail.includes(' ') || !cleanEmail.includes('@')) return false;

  const [localPart, domainPart] = cleanEmail.split('@');
  if (!localPart || !domainPart || domainPart.includes('@')) return false;

  const domainSegments = domainPart.split('.');
  return domainSegments.length >= 2 && domainSegments.every((segment) => segment.length > 0);
};

export const Validators = {
  /**
   * Verifies standard string values against formal RFC email structures
   */
  validateEmail: (emailString) => {
    if (!emailString) return false;
    const cleanEmail = emailString.trim();
    if (typeof ValidationRegex?.email === 'function') {
      return ValidationRegex.email(cleanEmail);
    }
    return isValidEmailFormat(cleanEmail);
  },

  /**
   * Validates international cellular contact strings against strict E.164 protocol criteria
   */
  validatePhoneNumber: (phoneString) => {
    if (!phoneString) return false;
    const cleanPhone = phoneString.trim().replace(/[\s()-]/g, '');
    const pattern = ValidationRegex?.phoneNumber || /^\+?[1-9]\d{1,14}$/;
    return pattern.test(cleanPhone);
  },

  /**
   * Verifies secondary transactional token length rules
   */
  validateOtpCode: (otpString, expectedLength = 4) => {
    if (!otpString) return false;
    const cleanOtp = otpString.trim();
    if (Number.isNaN(Number(cleanOtp))) return false;
    return cleanOtp.length === expectedLength;
  }
};
