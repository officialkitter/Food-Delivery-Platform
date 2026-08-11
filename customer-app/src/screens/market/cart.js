/**
 * Buza Food Delivery Mobile Application
 * Premium Integrated Shopping Cart View (Animation Model Match)
 * src/screens/cart.js
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  Easing,
  FlatList,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';

const { width, height } = Dimensions.get('window');

const CART_COLORS = {
  primary: '#FF7F50',       // Salmon brand accent color
  background: '#FFFFFF',    // Crisp premium white canvas baseline
  textDark: '#052A30',      // High-density Dark Turquoise for headings
  textMuted: '#1E6B7B',     // Soft turquoise for supporting descriptions
  surfaceLight: '#F4FAFA',  // Very soft turquoise-tinted card background
  borderLine: '#D1E5E7'     // Clean divider border color
};

// Simple sample dataset for food and drink cart tracking
const INITIAL_CART_ITEMS = [
  { id: '1', name: 'Signature Spicy Burger', detail: 'Extra cheese, no onions', price: 12.50, quantity: 1 },
  { id: '2', name: 'Ice Cold Passion Fruit Juice', detail: 'Large glass, less ice', price: 4.00, quantity: 2 }
];

export default function CartScreen({ onCheckoutProceed, onContinueShopping }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || CART_COLORS.primary;

  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [isProcessing, setIsProcessing] = useState(false);
  const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

  // Layout micro-interaction entry animations
  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(25)).current;

  // Hot food rising steam animation loops
  const smokeOneOpacity = useRef(new Animated.Value(0)).current;
  const smokeOneScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeElementAnim, { toValue: 1, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideContentAnim, { toValue: 0, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();

    // Continuous rising steam cloud animation loop matching standard screens
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(smokeOneOpacity, { toValue: 0.35, duration: 1800, useNativeDriver: true }),
          Animated.timing(smokeOneScale, { toValue: 1.4, duration: 4500, useNativeDriver: true })
        ]),
        Animated.timing(smokeOneOpacity, { toValue: 0, duration: 2700, useNativeDriver: true }),
        Animated.timing(smokeOneScale, { toValue: 1, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 2.50 : 0.00;
  const totalAmount = calculateSubtotal() + deliveryFee;
  const handleCheckoutRequest = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Add some delicious food to your basket first!");
      return;
    }
    setIsProcessing(true);

    try {
      if (onCheckoutProceed) {
        await Promise.resolve(onCheckoutProceed({ items: cartItems, total: totalAmount }));
      }
    } catch (error) {
      Alert.alert('Checkout Error', error?.message || 'Unable to complete checkout right now.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemRow}>
      <View style={styles.itemInfoBlock}>
        <Text style={styles.itemNameText}>{item.name}</Text>
        <Text style={styles.itemDetailText}>{item.detail}</Text>
        <Text style={styles.itemPriceText}>{formatTZS(item.price * item.quantity)}</Text>
      </View>
      
      {/* Dynamic Quantity Selector Controls */}
      <View style={styles.quantityControlGroup}>
        <TouchableOpacity style={styles.qtyControlBtn} onPress={() => updateQuantity(item.id, -1)}>
          <Text style={styles.qtyControlBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyDisplayValue}>{item.quantity}</Text>
        <TouchableOpacity style={styles.qtyControlBtn} onPress={() => updateQuantity(item.id, 1)}>
          <Text style={styles.qtyControlBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Decorative Atmosphere Elements and Floating Steam Matrix */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bubbleDarkTurquoise} />
        <View style={styles.bubbleSalmon} />
        <Animated.View style={[styles.smokeEffectCloud, { opacity: smokeOneOpacity, transform: [{ scale: smokeOneScale }] }]} />
      </View>

      <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 24, paddingBottom: Math.max(insets.bottom, 16), opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]}>
        
        {/* Header Layout Grid Block */}
        <View style={styles.cartHeaderRow}>
          <Text style={styles.mainHeadingTitle}>My Basket</Text>
          <Text style={styles.basketCountText}>{cartItems.length} items selected</Text>
        </View>

        {/* Core Products List View Area */}
        <View style={styles.itemsListContainer}>
          {cartItems.length > 0 ? (
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listScrollPadding}
            />
          ) : (
            <View style={styles.emptyBasketState}>
              <CustomIcon name="cart" size={48} color={CART_COLORS.textMuted} />
              <Text style={styles.emptyBasketHeading}>Your basket is empty</Text>
              <Text style={styles.emptyBasketSub}>Browse nearby kitchens to find your favorite food and drinks.</Text>
            </View>
          )}
        </View>
        {/* Lower Summary Segment Details and Action Triggers */}
        <View style={styles.footerActionContainer}>
          {cartItems.length > 0 && (
            <View style={styles.summaryCardBackdrop}>
              <View style={styles.summaryBreakdownRow}>
                <Text style={styles.summaryLabelText}>Food & Drinks Subtotal</Text>
                <Text style={styles.summaryValueText}>{formatTZS(calculateSubtotal())}</Text>
              </View>
              <View style={styles.summaryBreakdownRow}>
                <Text style={styles.summaryLabelText}>Delivery Rider Fee</Text>
                <Text style={styles.summaryValueText}>{formatTZS(deliveryFee)}</Text>
              </View>
              <View style={[styles.summaryBreakdownRow, styles.totalRowDivider]}>
                <Text style={styles.totalLabelText}>Total Cost</Text>
                <Text style={styles.totalValueText}>{formatTZS(totalAmount)}</Text>
              </View>
            </View>
          )}

          {/* Primary Action Button: Confirm Order Parameters */}
          <TouchableOpacity style={[styles.primaryActionBtnFrame, { backgroundColor: themePrimary }, isProcessing && { opacity: 0.6 }]} activeOpacity={0.85} onPress={handleCheckoutRequest} disabled={isProcessing}>
            <Text style={styles.primaryActionBtnText}>{isProcessing ? "Processing Order..." : "Proceed to Checkout"}</Text>
          </TouchableOpacity>

          {/* Secondary Action Button: Backtrack Options */}
          <TouchableOpacity style={styles.secondaryActionBtnFrame} activeOpacity={0.7} onPress={onContinueShopping} disabled={isProcessing}>
            <Text style={styles.secondaryActionBtnText}>Add More Items</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: CART_COLORS.background },
  contentWorkspace: { flex: 1, paddingHorizontal: 24 },
  cartHeaderRow: { marginBottom: 16 },
  mainHeadingTitle: { fontSize: 26, fontWeight: '900', color: CART_COLORS.textDark, letterSpacing: -0.5 },
  basketCountText: { fontSize: 13, fontWeight: '600', color: CART_COLORS.textMuted, marginTop: 2 },
  itemsListContainer: { flex: 1, marginBottom: 16 },
  listScrollPadding: { paddingVertical: 4 },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: CART_COLORS.borderLine },
  itemInfoBlock: { flex: 1, paddingRight: 16 },
  itemNameText: { fontSize: 15, fontWeight: '800', color: CART_COLORS.textDark, marginBottom: 2 },
  itemDetailText: { fontSize: 12, fontWeight: '600', color: CART_COLORS.textMuted, marginBottom: 6 },
  itemPriceText: { fontSize: 14, fontWeight: '700', color: CART_COLORS.primary },
  quantityControlGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: CART_COLORS.surfaceLight, borderRadius: 20, padding: 4, borderWidth: 1, borderColor: CART_COLORS.borderLine },
  qtyControlBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CART_COLORS.borderLine },
  qtyControlBtnText: { fontSize: 16, fontWeight: '700', color: CART_COLORS.textDark, marginTop: -2 },
  qtyDisplayValue: { fontSize: 14, fontWeight: '700', color: CART_COLORS.textDark, paddingHorizontal: 12 },
  emptyBasketState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyBasketHeading: { fontSize: 18, fontWeight: '800', color: CART_COLORS.textDark, marginTop: 16, marginBottom: 6 },
  emptyBasketSub: { fontSize: 13, fontWeight: '600', color: CART_COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
  footerActionContainer: { width: '100%', alignItems: 'center', marginTop: 'auto' },
  summaryCardBackdrop: { width: '100%', backgroundColor: CART_COLORS.surfaceLight, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: CART_COLORS.borderLine, marginBottom: 16 },
  summaryBreakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabelText: { fontSize: 13, fontWeight: '600', color: CART_COLORS.textMuted },
  summaryValueText: { fontSize: 13, fontWeight: '700', color: CART_COLORS.textDark },
  totalRowDivider: { borderTopWidth: 1, borderTopColor: CART_COLORS.borderLine, paddingTop: 10, marginTop: 4, marginBottom: 0 },
  totalLabelText: { fontSize: 14, fontWeight: '800', color: CART_COLORS.textDark },
  totalValueText: { fontSize: 16, fontWeight: '900', color: CART_COLORS.textDark },
  primaryActionBtnFrame: { width: '100%', height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 10 },
  primaryActionBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  secondaryActionBtnFrame: { paddingVertical: 10 },
  secondaryActionBtnText: { fontSize: 14, fontWeight: '700', color: CART_COLORS.textMuted, textDecorationLine: 'underline' },
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', bottom: height * 0.35, left: '20%', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(30, 107, 123, 0.04)' }
});
