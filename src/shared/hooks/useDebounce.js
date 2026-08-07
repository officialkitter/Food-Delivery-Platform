/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Shared Core Layer: Higher-Order Keystroke Debouncer Performance Optimizer
 * src/core/hooks/useDebounce.js
 */

import { useState, useEffect } from 'react';

export const useDebounce = (targetInputValue, delayTimeoutMs = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(targetInputValue);

  useEffect(() => {
    const activeHandlerId = setTimeout(() => {
      setDebouncedValue(targetInputValue);
    }, delayTimeoutMs);

    // Instantly wipe timers if dependency variables shift before the delay window closes
    return () => clearTimeout(activeHandlerId);
  }, [targetInputValue, delayTimeoutMs]);

  return debouncedValue;
};
