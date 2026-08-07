import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const SkeletonLoader = ({
  width = '100%',
  height = 20,
  variant = 'rect', // 'rect' | 'circle'
  style
}) => {
  const { colors, radius } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const sharedAnimation = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.0,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.4,
        duration: 650,
        useNativeDriver: true,
      })
    ]);

    Animated.loop(sharedAnimation).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        {
          width: width,
          height: height,
          backgroundColor: colors.border,
          borderRadius: variant === 'circle' ? height / 2 : radius.sm,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
};
