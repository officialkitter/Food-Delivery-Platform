import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { QuantitySelector } from './QuantitySelector';

export const CartItemRow = ({
  title,
  price,
  quantity,
  customizations = [],
  onIncrement,
  onDecrement,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: spacing.md, borderBottomWidth: 1, borderColor: colors.border }]}>
      <View style={styles.detailsBlock}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {customizations.length > 0 && (
          <Text style={[styles.customText, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            {customizations.join(', ')}
          </Text>
        )}
        <Text style={[styles.price, { color: colors.text, marginTop: spacing.sm }]}>
          {price}
        </Text>
      </View>

      <View style={styles.actionBlock}>
        <QuantitySelector 
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          min={0} // Allows removing item when it reaches zero if logic dictates
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  detailsBlock: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  customText: {
    fontSize: 12,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionBlock: {
    justifyContent: 'center',
  },
});
