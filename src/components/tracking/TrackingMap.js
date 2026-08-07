import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { DriverMarker } from './DriverMarker';

export const TrackingMap = ({
  isLoading = false,
  fallbackMessage = 'Map streaming services initialization pending...',
  children,
  style,
}) => {
  const { colors, spacing, radius } = useTheme();

  let content = null;

  if (isLoading) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  } else if (children) {
    content = children;
  } else {
    content = (
      /* UI Simulation Engine Wrapper Frame */
      <View style={styles.simulatedCanvas}>
        <View style={[styles.gridPattern, { borderColor: colors.surface }]} />
        <View style={styles.centerNode}>
          <DriverMarker />
        </View>
        <View style={[styles.hudLabel, { backgroundColor: colors.surface + 'D0', borderRadius: radius.sm, padding: spacing.sm }]}>
          <Text style={[styles.hudText, { color: colors.text }]}>{fallbackMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.mapCanvas, { backgroundColor: colors.border, borderRadius: radius.md }, style]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  mapCanvas: {
    width: '100%',
    height: 240,
    overflow: 'hidden',
    position: 'relative',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulatedCanvas: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.15,
  },
  centerNode: {
    zIndex: 2,
  },
  hudLabel: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    zIndex: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  hudText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
