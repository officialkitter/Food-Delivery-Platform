/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Unified Root Context Tree Component
 * src/context/AppContext.js
 */

import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext'; // Fixed path: Pointing back to AuthContext.js
import { CartProvider } from './CartContext';
import { LocationProvider } from './LocationContext';
import { SocketProvider } from './SocketContext';

export const AppStateComposer = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
