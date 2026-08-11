/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core Geolocation Tracking Context Router
 * src/context/LocationContext.js
 */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import * as Location from 'expo-location';
import { locationService } from '../services/locationService';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [currentAddress, setCurrentAddress] = useState({
    label: 'Current Location',
    street: 'Unknown street',
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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied. Please enable location access for exact address detection.');
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = position?.coords?.latitude;
      const longitude = position?.coords?.longitude;

      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        throw new TypeError('Unable to read GPS coordinates from device sensors.');
      }

      const reverse = await locationService.reverseGeocodeCoordinates(latitude, longitude);

      setCurrentAddress({
        label: reverse?.label || 'Current Location',
        street: reverse?.street || reverse?.formattedAddress || 'Unknown street',
        city: reverse?.city || '',
        country: reverse?.country || '',
        formattedAddress: reverse?.formattedAddress || '',
        coordinates: reverse?.coordinates || { latitude, longitude },
      });
    } catch (err) {
      setError(err?.message || 'Unable to resolve exact location using Google Maps services.');
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
