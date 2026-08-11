/**
 * Buza Food Delivery Mobile Application
 * Premium Food & Drink Product Details View
 * src/screens/product.js
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
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';

const { width, height } = Dimensions.get('window');

const PROD_COLORS = {
  primary: '#FF7F50',       
  background: '#FFFFFF',    
  textDark: '#052A30',      
  textMuted: '#1E6B7B',     
  surfaceLight: '#F4FAFA',  
  borderLine: '#D1E5E7'     
};

const SAMPLE_PRODUCT = {
  id: '1',
  name: 'Cheesy Spicy Burger',
  description: 'A juicy grilled beef patty topped with melted cheddar cheese, hot jalapeños, crisp lettuce, and our secret homemade spicy sauce.',
  basePrice: 12.50,
  image: require('../../assets/images/6.png'),
  rating: '4.9'
};

export default function ProductDetailScreen({ routeItem, onAddToBasket, onBackPress }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || PROD_COLORS.primary;

  const product = routeItem || SAMPLE_PRODUCT;
  const resolvedUnitPrice = Number(
    product?.basePrice ?? product?.price ?? SAMPLE_PRODUCT.basePrice
  );
  const unitPrice = Number.isFinite(resolvedUnitPrice)
    ? resolvedUnitPrice
    : SAMPLE_PRODUCT.basePrice;
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

  // Entrance and background layout fade/slide variables
  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(25)).current;
  const smokeOneOpacity = useRef(new Animated.Value(0)).current;
  const smokeOneScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeElementAnim, { toValue: 1, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideContentAnim, { toValue: 0, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();

    // Constant breathing loops simulating steam rising directly from your selected hot meal
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

  const changeQuantity = (delta) => {
    const newQty = quantity + delta;
    if (newQty > 0) setQuantity(newQty);
  };

  const totalPrice = unitPrice * quantity;
  const handleAddToBasket = () => {
    if (onAddToBasket) {
      onAddToBasket({ ...product, basePrice: unitPrice, quantity, finalPrice: totalPrice });
      Alert.alert("Added to Basket", `${quantity}x ${product.name} has been added to your order basket.`);
    }
  };

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* TOP PORTION: Proportional Product Image with Custom Back & Favorite Anchors */}
      <View style={styles.imageHeaderFrame}>
        <Image source={product.image} style={styles.productCoverImage} resizeMode="cover" />
        
        {/* Floating Screen Controls */}
        <View style={[styles.floatingBarRow, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.circleIconBtn} onPress={onBackPress} activeOpacity={0.7}>
            <CustomIcon name="arrow-left" size={18} color={PROD_COLORS.textDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleIconBtn} onPress={() => setIsFavorite(!isFavorite)} activeOpacity={0.7}>
            <CustomIcon name={isFavorite ? "favorite-filled" : "heart"} size={18} color={PROD_COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTTOM PORTION: Unified Item Card details panel */}
      <View style={styles.detailsContentContainer}>
        
        {/* Ambient Decorative Accents & Moving Steam Matrix */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.bubbleDarkTurquoise} />
          <View style={styles.bubbleSalmon} />
          <Animated.View style={[styles.smokeEffectCloud, { opacity: smokeOneOpacity, transform: [{ scale: smokeOneScale }] }]} />
        </View>

        <Animated.View style={[styles.animatedContentWrapper, { opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPaddingContent} bounces={false}>
            
            {/* Title & Ratings Block */}
            <View style={styles.titleRatingContainerRow}>
              <View style={styles.nameBlock}>
                <Text style={styles.productNameTitleText}>{product.name}</Text>
                <Text style={styles.productPriceText}>{formatTZS(unitPrice)} each</Text>
              </View>
              <View style={styles.ratingBadgeElement}>
                <CustomIcon name="star" size={12} color={PROD_COLORS.primary} />
                <Text style={styles.ratingValueLabelText}>{product.rating}</Text>
              </View>
            </View>

            {/* Product Wording Body */}
            <Text style={styles.descriptionBodyText}>{product.description}</Text>

            {/* Quantity Selector Layout Control */}
            <View style={styles.quantitySectionRow}>
              <Text style={styles.quantityLabelText}>Select Quantity</Text>
              <View style={styles.quantityControlGroup}>
                <TouchableOpacity style={styles.qtyControlBtn} onPress={() => changeQuantity(-1)}>
                  <Text style={styles.qtyControlBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyDisplayValue}>{quantity}</Text>
                <TouchableOpacity style={styles.qtyControlBtn} onPress={() => changeQuantity(1)}>
                  <Text style={styles.qtyControlBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Lower Basket Add Action Footer Trigger */}
          <View style={[styles.basketActionFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.basketTotalSummaryColumn}>
              <Text style={styles.basketTotalLabelText}>Total Cost</Text>
              <Text style={styles.basketTotalValueText}>{formatTZS(totalPrice)}</Text>
            </View>
            <TouchableOpacity style={[styles.primaryActionBtnFrame, { backgroundColor: themePrimary }]} activeOpacity={0.85} onPress={handleAddToBasket}>
              <Text style={styles.primaryActionBtnText}>Add to Basket</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix
 */
const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: PROD_COLORS.background },
  imageHeaderFrame: { width: width, height: height * 0.38, backgroundColor: PROD_COLORS.surfaceLight, position: 'relative' },
  productCoverImage: { ...StyleSheet.absoluteFillObject },
  floatingBarRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 },
  circleIconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#052A30', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  detailsContentContainer: { flex: 1, backgroundColor: PROD_COLORS.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, paddingHorizontal: 24, overflow: 'hidden' },
  animatedContentWrapper: { flex: 1 },
  scrollPaddingContent: { paddingTop: 28, paddingBottom: 24 },
  titleRatingContainerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  nameBlock: { flex: 1, paddingRight: 16 },
  productNameTitleText: { fontSize: 22, fontWeight: '900', color: PROD_COLORS.textDark, letterSpacing: -0.5, marginBottom: 4 },
  productPriceText: { fontSize: 14, fontWeight: '700', color: PROD_COLORS.textMuted },
  ratingBadgeElement: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 127, 80, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingValueLabelText: { fontSize: 12, fontWeight: '800', color: PROD_COLORS.primary, marginLeft: 4 },
  descriptionBodyText: { fontSize: 14, fontWeight: '600', color: PROD_COLORS.textMuted, lineHeight: 22, marginBottom: 24 },
  quantitySectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: PROD_COLORS.borderLine, paddingTop: 20 },
  quantityLabelText: { fontSize: 15, fontWeight: '800', color: PROD_COLORS.textDark },
  quantityControlGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: PROD_COLORS.surfaceLight, borderRadius: 20, padding: 4, borderWidth: 1, borderColor: PROD_COLORS.borderLine },
  qtyControlBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: PROD_COLORS.borderLine },
  qtyControlBtnText: { fontSize: 18, fontWeight: '700', color: PROD_COLORS.textDark, marginTop: -2 },
  qtyDisplayValue: { fontSize: 15, fontWeight: '700', color: PROD_COLORS.textDark, paddingHorizontal: 16 },
  basketActionFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: PROD_COLORS.borderLine, paddingTop: 16, marginTop: 'auto', backgroundColor: '#FFFFFF' },
  basketTotalSummaryColumn: { flex: 0.4 },
  basketTotalLabelText: { fontSize: 11, fontWeight: '700', color: PROD_COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  basketTotalValueText: { fontSize: 20, fontWeight: '900', color: PROD_COLORS.textDark, marginTop: 2 },
  primaryActionBtnFrame: { flex: 0.6, height: 50, borderRadius: 25, alignItems: 'center', zIndex: 5, justifyContent: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4 },
  primaryActionBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  bubbleDarkTurquoise: { position: 'absolute', top: 20, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  bubbleSalmon: { position: 'absolute', bottom: -40, left: -20, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  smokeEffectCloud: { position: 'absolute', top: 20, left: '15%', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(30, 107, 123, 0.04)' }
});
