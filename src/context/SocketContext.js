/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * High-Performance Real-Time WebSocket Infrastructure Context
 * src/context/SocketContext.js
 */

import React, { createContext, useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { ApiEndpoints, FeatureFlags } from '../constants';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  
  // Keep socket instance immutable across component re-renders
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const activeSubscriptionsRef = useRef(new Set());

  // Connection closer layout logic
  const disconnectSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Primary WebSocket initialization routine
  const connectSocket = useCallback(() => {
    if (!isAuthenticated || !token || socketRef.current) return;

    try {
      // Convert standard HTTPS api endpoint base string to standard secure WebSocket protocol line
      const wsUrl = ApiEndpoints.BASE_URL.replace(/^http/, 'ws') + `/stream?token=${token}`;
      
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        setIsConnected(true);
        console.log('[Buza Socket Engine]: Telemetry pipe successfully multiplexed.');
        
        // Re-establish subscriptions if recovering from an unexpected dropout
        activeSubscriptionsRef.current.forEach(topic => {
          sendSocketPayload('SUBSCRIBE', { topic });
        });
      };

      socketRef.current.onmessage = (event) => {
        const parsedData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        setLastMessage(parsedData);
      };

      socketRef.current.onerror = (error) => {
        console.error('[Buza Socket Engine]: Pipe communication channel error event.', error);
      };

      socketRef.current.onclose = (event) => {
        setIsConnected(false);
        socketRef.current = null;
        console.log(`[Buza Socket Engine]: Connection closed. Code: ${event.code}`);
        
        // Exponential backoff mock recovery loop for volatile cellular networks
        if (isAuthenticated) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('[Buza Socket Engine]: Attempting background telemetry pipe recovery...');
            connectSocket();
          }, 5000);
        }
      };

    } catch (error) {
      console.error('[Buza Socket Engine]: Connection setup critical thread error.', error);
    }
  }, [token, isAuthenticated, disconnectSocket]);

  // Handle connection lifecycle reactively based on identity auth changes
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [isAuthenticated, connectSocket, disconnectSocket]);

  // Thread-safe downstream delivery trigger method
  const sendSocketPayload = useCallback((action, payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action, payload, timestamp: Date.now() }));
      return true;
    }
    
    // Core Simulator layer fallback to handle MVP runtime flow smoothly if maps flags are toggled off
    if (!FeatureFlags.ENABLE_REAL_TIME_DRIVER_MAP_STREAMING) {
      console.log(`[Buza Socket Core Simulation]: Triggered Action [${action}]`, payload);
      return true;
    }
    return false;
  }, []);

  // Action: Live order tracking stream setup channel gateway
  const subscribeToOrderTelemetry = useCallback((orderId) => {
    const topic = `order:${orderId}`;
    activeSubscriptionsRef.current.add(topic);
    sendSocketPayload('SUBSCRIBE', { topic });

    // Local runtime simulation sequence to keep the map hot during client review stages
    let mockInterval = null;
    if (!FeatureFlags.ENABLE_REAL_TIME_DRIVER_MAP_STREAMING) {
      let simulatedStep = 0;
      mockInterval = setInterval(() => {
        simulatedStep += 0.02;
        if (simulatedStep > 1) simulatedStep = 0;
        
        setLastMessage({
          topic,
          type: 'DRIVER_LOCATION_UPDATE',
          payload: {
            orderId,
            coordinates: {
              latitude: -6.1751 + (simulatedStep * 0.005),
              longitude: 35.7419 + (simulatedStep * 0.005)
            },
            bearing: 45,
            speedKmh: 42
          }
        });
      }, 2500);
    }

    // Return custom hook unmount handler to automatically clear event listener payloads
    return () => {
      activeSubscriptionsRef.current.delete(topic);
      sendSocketPayload('UNSUBSCRIBE', { topic });
      if (mockInterval) clearInterval(mockInterval);
    };
  }, [sendSocketPayload]);

  const value = useMemo(() => ({
    isConnected,
    lastMessage,
    sendSocketPayload,
    subscribeToOrderTelemetry
  }), [isConnected, lastMessage, sendSocketPayload, subscribeToOrderTelemetry]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket runtime consumption requires matching SocketProvider encapsulation structure.');
  return context;
};
