import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const DriverMarker = () => {
  const { colors, radius } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.6,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.markerContainer}>
      {/* Dynamic Radar Ring Effect */}
      <Animated.View 
        style={[
          styles.radarRing, 
          { 
            backgroundColor: colors.primary, 
            borderRadius: radius.full,
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.6],
              outputRange: [0.4, 0]
            })
          }
        ]} 
      />
      {/* High Contrast Center Core Asset Pin */}
      <View style={[styles.corePin, { backgroundColor: colors.primary, borderColor: '#FFFFFF', borderRadius: radius.full }]}>
        <View style={[styles.innerIconCore, { backgroundColor: colors.surface, borderRadius: radius.full }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarRing: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  corePin: {
    width: 20,
    height: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  innerIconCore: {
    width: 6,
    height: 6,
  },
});
