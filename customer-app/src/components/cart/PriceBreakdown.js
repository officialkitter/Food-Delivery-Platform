import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Formatter } from '../../shared/utils/formatters';

const toAmount = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const RowItem = ({ label, value, isBold = false, isDiscount = false, colors, spacing }) => (
  <View style={[styles.row, { marginVertical: spacing.xs }]}>
    <Text style={[isBold ? styles.boldText : styles.normalText, { color: colors.textSecondary }]}>
      {label}
    </Text>
    <Text style={[
      isBold ? styles.boldValue : styles.normalValue, 
      { color: isDiscount ? colors.secondary : colors.text }
    ]}>
      {isDiscount ? '-' : ''}{Formatter.formatCurrency(toAmount(value), 'TZS')}
    </Text>
  </View>
);

export const PriceBreakdown = ({
  subtotal,
  deliveryFee,
  tax,
  discount,
  total,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: spacing.md }]}>
      <RowItem label="Subtotal" value={subtotal} colors={colors} spacing={spacing} />
      <RowItem label="Delivery Fee" value={deliveryFee} colors={colors} spacing={spacing} />
      <RowItem label="Tax & Fees" value={tax} colors={colors} spacing={spacing} />
      {discount > 0 && <RowItem label="Promo Discount" value={discount} isDiscount colors={colors} spacing={spacing} />}
      
      <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: spacing.sm }]} />
      
      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total Price</Text>
        <Text style={[styles.totalValue, { color: colors.accent }]}>
          {Formatter.formatCurrency(toAmount(total), 'TZS')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  normalText: {
    fontSize: 14,
    fontWeight: '400',
  },
  normalValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  boldText: {
    fontSize: 14,
    fontWeight: '600',
  },
  boldValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
