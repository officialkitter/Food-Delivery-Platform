/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Shared Core Layer: Form Processing & Local Field Validation Engine
 * src/core/hooks/useForm.js
 */

import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Universal text input mutator mapping data entries reactively
   */
  const handleChange = useCallback((fieldName, incomingTextValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: incomingTextValue,
    }));

    // Erase active validation exceptions instantly upon client text revisions
    setErrors((prevErrors) => {
      if (!prevErrors[fieldName]) return prevErrors;
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  }, []);

  /**
   * Iterates through active rules to validate the form structure completely
   */
  const validateFormFields = useCallback(() => {
    const freshValidationErrors = {};
    
    Object.keys(validationRules).forEach((fieldName) => {
      const fieldRuleFunction = validationRules[fieldName];
      const targetValueToTest = values[fieldName];
      
      if (fieldRuleFunction) {
        const errorResultText = fieldRuleFunction(targetValueToTest, values);
        if (errorResultText) {
          freshValidationErrors[fieldName] = errorResultText;
        }
      }
    });

    setErrors(freshValidationErrors);
    return Object.keys(freshValidationErrors).length === 0;
  }, [values, validationRules]);

  /**
   * Higher-order handler that intercepts submissions if validation rules are broken
   */
  const handleSubmit = useCallback((submitCallback) => {
    return async (eventEvent) => {
      if (eventEvent && typeof eventEvent.preventDefault === 'function') {
        eventEvent.preventDefault();
      }

      const isFormValid = validateFormFields();
      if (!isFormValid) return;

      setIsSubmitting(true);
      try {
        await submitCallback(values);
      } catch (submissionException) {
        console.warn('[useForm Submission Failure Interception]:', submissionException);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateFormFields]);

  /**
   * Flushes form fields back to their default structural states
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    setValues,
    setErrors,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
