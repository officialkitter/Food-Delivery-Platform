/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Feature State Engine: Order Tracking & Live Telemetry Slice
 * src/features/tracking/trackingSlice.js
 */

import { useState, useCallback } from 'react';
import { OrderStatus, DeliveryStatus } from '../../constants/config';

export const useTrackingSlice = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [driverCoordinates, setDriverCoordinates] = useState(null);
  const [estimatedArrivalMins, setEstimatedArrivalMins] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Call simulation: Latch on and instantiate order lookup telemetry records
  const bootstrapOrderTracking = useCallback(async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Seed operational initial state
      setActiveOrder({
        id: orderId,
        restaurantName: 'The Premium Burger Co.',
        orderStep: OrderStatus.CONFIRMED,
        deliveryStep: DeliveryStatus.ASSIGNING_DRIVER,
      });
      setEstimatedArrivalMins(35);
      setDriverCoordinates({ latitude: -6.1751, longitude: 35.7419 });
    } catch (err) {
      if (err) {
        console.warn('[trackingSlice] Order bootstrap failed.', err);
      }
      setError(err?.message || 'Telemetry mapping server unreachable.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // WebSocket Live Stream Event Listener Callback Router Hook
  const ingestLiveStreamUpdate = useCallback((eventFrame) => {
    if (!eventFrame) return;

    switch (eventFrame.type) {
      case 'ORDER_STATUS_MUTATION':
        setActiveOrder((prev) => prev ? { ...prev, orderStep: eventFrame.payload.step } : null);
        break;
      case 'DRIVER_LOCATION_UPDATE':
        setDriverCoordinates(eventFrame.payload.coordinates);
        if (eventFrame.payload.etaMins) {
          setEstimatedArrivalMins(eventFrame.payload.etaMins);
        }
        break;
      case 'DELIVERY_STATUS_MUTATION':
        setActiveOrder((prev) => prev ? { ...prev, deliveryStep: eventFrame.payload.step } : null);
        break;
      default:
        break;
    }
  }, []);

  return {
    activeOrder,
    driverCoordinates,
    estimatedArrivalMins,
    isLoading,
    error,
    bootstrapOrderTracking,
    ingestLiveStreamUpdate,
  };
};
