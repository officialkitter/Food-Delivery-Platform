import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const ETAWidget = ({
  etaMinutes,
  statusText = 'Preparing your order',
  progressPercent = 0.35, // 0.0 to 1.0
}) => {
  const { colors, spacing, radius, shadows } = useTheme();

  return (
    <View style={[styles.card, shadows, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.etaLabel, { color: colors.textSecondary }]}>Estimated Arrival</Text>
          <Text style={[styles.etaValue, { color: colors.text }]}>{etaMinutes} Mins</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: colors.accent + '15', borderRadius: radius.sm }]}>
          <Text style={[styles.statusText, { color: colors.accent }]}>{statusText}</Text>
        </View>
      </View>

      {/* Progress Track Micro-Bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.border, borderRadius: radius.full, marginTop: spacing.md }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: colors.primary, 
              borderRadius: radius.full, 
              width: `${Math.min(Math.max(progressPercent * 100, 0), 100)}%` 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  etaLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  etaValue: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});
