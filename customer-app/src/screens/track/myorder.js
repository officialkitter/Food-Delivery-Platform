/**
 * Buza Food Delivery Mobile Application
 * Core Customer Active Order Summary & Checkout Receipt Matrix View
 * File: src/screens/myorder.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, FlatList, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const BASKET_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2'
};

const INITIAL_BASKET_ITEMS = [
  { id: 'item1', name: 'Crispy Premium Chicken Burger', qty: 1, basePrice: 8.50, image: require('../../assets/images/6.png') },
  { id: 'item2', name: 'Tropical Mango Smoothie Bowl', qty: 2, basePrice: 4.20, image: require('../../assets/images/8.png') }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Customer Active Order Summary & Checkout Receipt Matrix View
 * File: src/screens/myorder.js (Part 2 of 3)
 */

export default function MyOrderScreen({
  vendorName = "Buza Grill House",
  deliveryFee = 2.00,
  onProceedToPaymentPress,
  onBackToMarketplacePress
}) {
  const insets = useSafeAreaInsets();
  useTheme();

  // --- Basket State Controller ---
  const [basketItems, setBasketItems] = useState(INITIAL_BASKET_ITEMS);
  const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

  // --- Animation Refs ---
  const layoutFadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundDriftY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(layoutFadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    // Constant video-style running vector drift loops
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundDriftY, { toValue: -80, duration: 9500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(backgroundDriftY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // Structural quantity state mutations handlers
  const updateQuantityValue = (targetId, currentDelta) => {
    setBasketItems((prev) =>
      prev.map((item) => {
        if (item.id === targetId) {
          const updatedQty = Math.max(1, item.qty + currentDelta);
          return { ...item, qty: updatedQty };
        }
        return item;
      })
    );
  };

  // Automated pricing balance aggregate calculations engines
  const subtotalBalance = basketItems.reduce((acc, curr) => acc + curr.basePrice * curr.qty, 0);
  const aggregateTotalBill = subtotalBalance + deliveryFee;
/**
 * Buza Food Delivery Mobile Application
 * Core Customer Active Order Summary & Checkout Receipt Matrix View
 * File: src/screens/myorder.js (Part 3 of 3)
 */

  const renderBasketRowCard = ({ item }) => (
    <View style={styles.basketRowItemCard}>
      <Image source={item.image} style={styles.productThumbnailFrame} resizeMode="cover" />
      <View style={{ flex: 1, paddingHorizontal: 12 }}>
        <Text style={styles.productNameHeaderTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPriceMetaValue}>{formatTZS(item.basePrice * item.qty)}</Text>
      </View>
      
      {/* Dynamic Quantity Controller Panel (100% Circular Counters) */}
      <View style={styles.quantityCounterWrapperRow}>
        <TouchableOpacity style={styles.microCircleCounterKey} activeOpacity={0.7} onPress={() => updateQuantityValue(item.id, -1)}>
          <CustomIcon name="minus" size={10} color={BASKET_COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.quantityDisplayCountValueText}>{item.qty}</Text>
        <TouchableOpacity style={styles.microCircleCounterKey} activeOpacity={0.7} onPress={() => updateQuantityValue(item.id, 1)}>
          <CustomIcon name="plus" size={10} color={BASKET_COLORS.textDark} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="cart" size={24} color={BASKET_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Control Top Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onBackToMarketplacePress}>
            <CustomIcon name="arrow-left" size={18} color={BASKET_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.basketOriginVendorLabel}>REVIEW BASKET</Text>
            <Text style={styles.vendorNameHeadlineText} numberOfLines={1}>{vendorName}</Text>
          </View>
        </View>

        {/* Scrollable Summary List Area */}
        <FlatList
          data={basketItems}
          keyExtractor={(item) => item.id}
          renderItem={renderBasketRowCard}
          contentContainerStyle={{ paddingVertical: 14 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Bottom Absolute Financial Receipt Breakdown Wrapper */}
        <View style={styles.financialReceiptBreakdownPanel}>
          <View style={[styles.rowSpaceBetween, { marginBottom: 10 }]}>
            <Text style={styles.receiptLineLabelText}>Items Subtotal</Text>
            <Text style={styles.receiptLineValueText}>{formatTZS(subtotalBalance)}</Text>
          </View>
          <View style={[styles.rowSpaceBetween, { borderBottomWidth: 1, borderBottomColor: BASKET_COLORS.borderLine, paddingBottom: 12, marginBottom: 14 }]}>
            <Text style={styles.receiptLineLabelText}>Fulfillment Courier Fee</Text>
            <Text style={styles.receiptLineValueText}>{formatTZS(deliveryFee)}</Text>
          </View>
          <View style={[styles.rowSpaceBetween, { marginBottom: 20 }]}>
            <Text style={styles.aggregateTotalLabelText}>Grand Total Bill</Text>
            <Text style={styles.aggregateTotalValueText}>{formatTZS(aggregateTotalBill)}</Text>
          </View>

          {/* Core Call-To-Action (100% Round Pill Checkout Trigger) */}
          <TouchableOpacity style={styles.primaryPaymentActionButtonPill} activeOpacity={0.85} onPress={onProceedToPaymentPress}>
            <Text style={styles.primaryActionButtonText}>Proceed to Secure Payment</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: BASKET_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: BASKET_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: BASKET_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: BASKET_COLORS.borderLine },
  basketOriginVendorLabel: { fontSize: 9, fontWeight: '800', color: BASKET_COLORS.textMuted, letterSpacing: 0.5 },
  vendorNameHeadlineText: { fontSize: 15, fontWeight: '800', color: BASKET_COLORS.textDark, marginTop: 2, maxWidth: DEVICE_WIDTH * 0.45 },

  // Basket Line Cards Element Layout Rules
  basketRowItemCard: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: BASKET_COLORS.background, borderRadius: 14, borderWidth: 1, borderColor: BASKET_COLORS.borderLine, padding: 10, marginBottom: 12 },
  productThumbnailFrame: { width: 56, height: 56, borderRadius: 10, backgroundColor: BASKET_COLORS.surfaceLight },
  productNameHeaderTitle: { fontSize: 14, fontWeight: '700', color: BASKET_COLORS.textDark },
  productPriceMetaValue: { fontSize: 13, fontWeight: '800', color: BASKET_COLORS.primary, marginTop: 4 },
  
  // 100% Round Increment Counter Components
  quantityCounterWrapperRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: BASKET_COLORS.surfaceLight, borderRadius: 20, borderWidth: 1, borderColor: BASKET_COLORS.borderLine, padding: 4 },
  microCircleCounterKey: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: BASKET_COLORS.borderLine },
  quantityDisplayCountValueText: { fontSize: 13, fontWeight: '700', color: BASKET_COLORS.textDark, paddingHorizontal: 10 },

  // Final Summary Receipt Breakdown Sheet Layout Rules
  financialReceiptBreakdownPanel: { width: '100%', backgroundColor: BASKET_COLORS.surfaceLight, borderRadius: 20, borderWidth: 1, borderColor: BASKET_COLORS.borderLine, padding: 18, marginTop: 8 },
  receiptLineLabelText: { fontSize: 13, fontWeight: '600', color: BASKET_COLORS.textMuted },
  receiptLineValueText: { fontSize: 14, fontWeight: '700', color: BASKET_COLORS.textDark },
  aggregateTotalLabelText: { fontSize: 15, fontWeight: '800', color: BASKET_COLORS.textDark },
  aggregateTotalValueText: { fontSize: 18, fontWeight: '900', color: BASKET_COLORS.primary, letterSpacing: -0.2 },
  
  // 100% Circular Primary Call-To-Action Pill Key
  primaryPaymentActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: BASKET_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: BASKET_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
