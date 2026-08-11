/**
 * Buza Food Delivery Mobile Application
 * Core Favorite Food, Drinks, and Restaurants Management View
 * src/screens/favorite.js
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Easing,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';

const { width, height } = Dimensions.get('window');

const FAV_COLORS = {
  primary: '#FF7F50',       
  background: '#FFFFFF',    
  textDark: '#052A30',      
  textMuted: '#1E6B7B',     
  surfaceLight: '#F4FAFA',  
  borderLine: '#D1E5E7'     
};

// Simplified seed dataset for favorites tracking
const INITIAL_FAVORITES = [
  { id: '1', name: 'Cheesy Spicy Burger', restaurant: 'Buza Grill House', price: 12500, image: require('../../assets/images/6.png') },
  { id: '2', name: 'Ice Cold Passion Fruit Juice', restaurant: 'Fresh Drinks Bar', price: 4000, image: require('../../assets/images/8.png') },
  { id: '3', name: 'Crispy Fried Chicken', restaurant: 'Grand Kitchen', price: 14000, image: require('../../assets/images/7.png') }
];

const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

export default function FavoriteScreen({ onSelectFavorite, onDiscoverFood }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || FAV_COLORS.primary;

  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

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

    // Constant breathing loops simulating steam rising behind saved warm meals
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

  const removeFavoriteItem = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };
  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteRowCard}>
      <TouchableOpacity 
        style={styles.clickableCardArea} 
        activeOpacity={0.8} 
        onPress={() => onSelectFavorite?.(item)}
      >
        <Image source={item.image} style={styles.itemThumbnail} resizeMode="cover" />
        <View style={styles.itemDetailsColumn}>
          <Text style={styles.itemNameText}>{item.name}</Text>
          <Text style={styles.restaurantNameText}>{item.restaurant}</Text>
          <Text style={styles.itemPriceText}>{formatTZS(item.price)}</Text>
        </View>
      </TouchableOpacity>

      {/* Instant Heart De-selection Control Component */}
      <TouchableOpacity 
        style={styles.heartButtonAnchor} 
        onPress={() => removeFavoriteItem(item.id)}
        activeOpacity={0.7}
      >
        <CustomIcon name="favorite-filled" size={20} color={FAV_COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Decorative Atmosphere Elements and Floating Steam Layout Canvas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bubbleDarkTurquoise} />
        <View style={styles.bubbleSalmon} />
        <Animated.View style={[styles.smokeEffectCloud, { opacity: smokeOneOpacity, transform: [{ scale: smokeOneScale }] }]} />
      </View>

      <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 16, opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]}>
        
        {/* Upper Headline Section */}
        <View style={styles.headerLayoutRow}>
          <Text style={styles.mainTitleHeader}>My Favorites</Text>
          <Text style={styles.supportingTaglineText}>Your top choices for quick, easy meals and drinks</Text>
        </View>

        {/* Dynamic List Render Area */}
        <View style={styles.listContainerWorkspace}>
          {favorites.length > 0 ? (
            <FlatList
              data={favorites}
              renderItem={renderFavoriteItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.listScrollPadding, { paddingBottom: Math.max(insets.bottom, 20) }]}
            />
          ) : (
            <View style={styles.emptySavedStateFrame}>
              <View style={styles.emptyIconCircle}>
                <CustomIcon name="heart" size={40} color={FAV_COLORS.textMuted} />
              </View>
              <Text style={styles.emptyStateHeading}>No favorites saved yet</Text>
              <Text style={styles.emptyStateSubText}>Tap the heart icon on any meal or drink menu to save it here for fast ordering.</Text>
              
              <TouchableOpacity 
                style={[styles.primaryActionBtnFrame, { backgroundColor: themePrimary }]} 
                activeOpacity={0.85}
                onPress={onDiscoverFood}
              >
                <Text style={styles.primaryActionBtnText}>Browse Menu</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

      </Animated.View>
    </View>
  );
}
/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix
 */
const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: FAV_COLORS.background },
  contentWorkspace: { flex: 1 },
  headerLayoutRow: { paddingHorizontal: 24, marginBottom: 20 },
  mainTitleHeader: { fontSize: 26, fontWeight: '900', color: FAV_COLORS.textDark, letterSpacing: -0.5 },
  supportingTaglineText: { fontSize: 13, fontWeight: '600', color: FAV_COLORS.textMuted, marginTop: 2 },
  listContainerWorkspace: { flex: 1, paddingHorizontal: 24 },
  listScrollPadding: { paddingVertical: 4 },
  favoriteRowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: FAV_COLORS.borderLine, padding: 12, marginBottom: 14, shadowColor: '#052A30', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  clickableCardArea: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  itemThumbnail: { width: 70, height: 70, borderRadius: 12, backgroundColor: FAV_COLORS.surfaceLight },
  itemDetailsColumn: { flex: 1, paddingLeft: 14, paddingRight: 8 },
  itemNameText: { fontSize: 15, fontWeight: '800', color: FAV_COLORS.textDark, marginBottom: 2 },
  restaurantNameText: { fontSize: 12, fontWeight: '600', color: FAV_COLORS.textMuted, marginBottom: 6 },
  itemPriceText: { fontSize: 14, fontWeight: '800', color: FAV_COLORS.primary },
  heartButtonAnchor: { width: 40, height: 40, borderRadius: 20, backgroundColor: FAV_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: FAV_COLORS.borderLine },
  emptySavedStateFrame: { flex: 0.85, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyIconCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(5, 42, 48, 0.04)', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(5, 42, 48, 0.08)' },
  emptyStateHeading: { fontSize: 18, fontWeight: '800', color: FAV_COLORS.textDark, marginBottom: 8 },
  emptyStateSubText: { fontSize: 13, fontWeight: '600', color: FAV_COLORS.textMuted, textAlign: 'center', lineHeight: 19, marginBottom: 28, paddingHorizontal: 12 },
  primaryActionBtnFrame: { width: '70%', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4 },
  primaryActionBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', bottom: height * 0.4, left: '20%', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(30, 107, 123, 0.04)' }
});
