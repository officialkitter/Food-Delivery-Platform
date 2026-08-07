/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core Geolocation Tracking Context Router
 * src/context/LocationContext.js
 */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [currentAddress, setCurrentAddress] = useState({
    label: 'Home Dashboard',
    street: '34 Park Avenue High-Rise Complex',
    city: 'Dodoma',
    coordinates: { latitude: -6.1751, longitude: 35.7419 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Action: Access core device sensor locations and reverse map coordinates to formal physical lines
  const captureDeviceLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Future Implementation Point: 
      // const geoPos = await Geolocation.getCurrentPosition();
      // const addressStr = await reverseGeocode(geoPos.coords);
      
      setCurrentAddress({
        label: 'Current Geolocation Sensor Pin',
        street: '72 Premium Culinary Boulevard',
        city: 'Dodoma',
        coordinates: { latitude: -6.1689, longitude: 35.7482 }
      });
    } catch (err) {
      setError(err?.message || 'System location hardware execution block authorization failure.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Action: Hardcode custom drop pins directly from address searches
  const overrideTargetAddress = useCallback((explicitAddressPayload) => {
    setCurrentAddress(explicitAddressPayload);
  }, []);

  const value = useMemo(() => ({
    currentAddress,
    isLoading,
    error,
    captureDeviceLocation,
    overrideTargetAddress
  }), [currentAddress, isLoading, error, captureDeviceLocation, overrideTargetAddress]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation context requires structural root context integration.');
  return context;
};
