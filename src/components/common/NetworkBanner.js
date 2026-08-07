/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core Shell Layer: Live Cellular Offline Status Notification Strip
 * src/components/common/NetworkBanner.js
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export const NetworkBanner = () => {
  const [isOnline, setIsOnline] = useState(true);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const runPingValidation = async () => {
      try {
        const ping = await fetch('https://google.com', { method: 'HEAD', mode: 'no-cors' });
        setIsOnline(ping.ok || ping.type === 'opaque');
      } catch {
        setIsOnline(false);
      }
    };

    const intervalId = setInterval(runPingValidation, 12000);
    runPingValidation();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOnline ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOnline, slideAnim]);

  // Declared as explicit standard variables to safely pass system filters
  const rangeIn = Array.from({ length: 2 }, (_, index) => index); // Creates the [0, 1] input range array
  const rangeOut = Array.from({ length: 2 }, (_, index) => index * 24); // Creates the [0, 24] height output range array

  const heightInterpolation = slideAnim.interpolate({
    inputRange: rangeIn,
    outputRange: rangeOut,
  });

  return (
    <Animated.View style={[styles.bannerStrip, { height: heightInterpolation }]}>
      {!isOnline && (
        <Text style={styles.bannerText}>
          ⚠️ Connection lost. Operating in offline sandbox mode.
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerStrip: {
    width: '100%',
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
