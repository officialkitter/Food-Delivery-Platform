import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const QuantitySelector = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  disabled = false,
}) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.border, 
          borderRadius: radius.full,
          padding: spacing.xs
        }
      ]}
    >
      <TouchableOpacity
        onPress={onDecrement}
        disabled={disabled || quantity <= min}
        style={[
          styles.actionButton, 
          { backgroundColor: colors.surface, borderRadius: radius.full }
        ]}
      >
        <Text style={[styles.actionText, { color: quantity <= min ? colors.textSecondary : colors.text }]}>-</Text>
      </TouchableOpacity>
      
      <Text style={[styles.valueText, { color: colors.text, marginHorizontal: spacing.md }]}>
        {quantity}
      </Text>

      <TouchableOpacity
        onPress={onIncrement}
        disabled={disabled || quantity >= max}
        style={[
          styles.actionButton, 
          { backgroundColor: colors.surface, borderRadius: radius.full }
        ]}
      >
        <Text style={[styles.actionText, { color: quantity >= max ? colors.textSecondary : colors.text }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  actionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  valueText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
