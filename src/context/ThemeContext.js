/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Global UI Theme Provider & System Context
 * src/context/ThemeContext.js
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';

// Direct, explicit path resolution to avoid index resolution failures
import { Colors, Spacing, Radius, Shadows } from '../constants/theme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Capture native OS systems level color scheme configurations on boot
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === 'dark');

  // Runtime context interaction hook to flip UI view states dynamically
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Memoize theme calculations to prevent unnecessary child node re-renders
  const value = useMemo(() => ({
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? Colors.dark : Colors.light,
    spacing: Spacing,
    radius: Radius,
    shadows: isDarkMode ? Shadows.dark : Shadows.light,
  }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Universal Theme Hook for Consumer Sub-Components
 * Provides lightning-fast access to design system tokens with type-safety checks
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be dynamically consumed within a valid ThemeProvider wrapper.');
  }
  return context;
};
