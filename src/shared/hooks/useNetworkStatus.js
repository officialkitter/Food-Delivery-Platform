/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Shared Core Layer: Reactive Device Network Connectivity Monitor Hook
 * src/core/hooks/useNetworkStatus.js
 */

import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Cross-platform sandbox abstraction checking connectivity statuses
    // Works inline across fetch pipeline connection listener loops natively
    const registerDevicePingCheck = async () => {
      try {
        const pingResponse = await fetch('https://google.com', {
          method: 'HEAD',
          mode: 'no-cors'
        });
        setIsOnline(pingResponse.ok || pingResponse.type === 'opaque');
      } catch {
        setIsOnline(false);
      }
    };

    // Instantiate routine periodic background health validations
    const healthTimerId = setInterval(registerDevicePingCheck, 10000);
    registerDevicePingCheck();

    return () => clearInterval(healthTimerId);
  }, []);

  return isOnline;
};
