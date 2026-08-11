/**
 * Buza Food Delivery Mobile Application
 * Core Food & Drink Discovery Browsing Marketplace View
 * src/screens/discovery.js
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  TextInput,
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

const DISCO_COLORS = {
  primary: '#FF7F50',       
  background: '#FFFFFF',    
  textDark: '#052A30',      
  textMuted: '#1E6B7B',     
  surfaceLight: '#F4FAFA',  
  borderLine: '#D1E5E7'     
};

// Simplified terminology category mappings
const FOOD_CATEGORIES = [
  { id: '1', name: 'All Food', icon: 'home' },
  { id: '2', name: 'Hot Meals', icon: 'fudcamp' },
  { id: '3', name: 'Cold Drinks', icon: 'cart' },
  { id: '4', name: 'Specials', icon: 'service' }
];

const DISH_ITEMS = [
  { id: '1', name: 'Cheesy Spicy Burger', restaurant: 'Buza Grill House', price: 12500, rating: '4.9', image: require('../../assets/images/6.png') },
  { id: '2', name: 'Crispy Fried Chicken', restaurant: 'Grand Kitchen', price: 14000, rating: '4.8', image: require('../../assets/images/7.png') },
  { id: '3', name: 'Ice Cold Passion Fruit Juice', restaurant: 'Fresh Drinks Bar', price: 4000, rating: '4.7', image: require('../../assets/images/8.png') },
  { id: '4', name: 'Creamy Vanilla Shake', restaurant: 'Sweet Treats Cafe', price: 5500, rating: '4.9', image: require('../../assets/images/9.png') }
];

const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

export default function DiscoveryScreen({ onSelectDish, onFilterPress }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || DISCO_COLORS.primary;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1');

  // Entrance and visual fluid animation parameters
  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(25)).current;
  const smokeOneOpacity = useRef(new Animated.Value(0)).current;
  const smokeOneScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeElementAnim, { toValue: 1, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideContentAnim, { toValue: 0, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();

    // Constant breathing loops simulating steam rising from local restaurant food
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
  const renderCategoryItem = ({ item }) => {
    const isActive = selectedCategory === item.id;
    return (
      <TouchableOpacity 
        style={[styles.categoryCell, isActive && { backgroundColor: themePrimary, borderColor: themePrimary }]} 
        onPress={() => setSelectedCategory(item.id)}
        activeOpacity={0.7}
      >
        <CustomIcon name={item.icon} size={16} color={isActive ? '#FFFFFF' : DISCO_COLORS.textMuted} />
        <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderDishItem = ({ item }) => (
    <TouchableOpacity style={styles.dishCardFrame} activeOpacity={0.85} onPress={() => onSelectDish?.(item)}>
      <Image source={item.image} style={styles.dishImageCover} resizeMode="cover" />
      <View style={styles.dishInfoBlock}>
        <Text style={styles.dishNameTitle}>{item.name}</Text>
        <Text style={styles.restaurantSubText}>{item.restaurant}</Text>
        <View style={styles.priceRatingRow}>
          <Text style={styles.dishPriceText}>{formatTZS(item.price)}</Text>
          <View style={styles.ratingBadge}>
            <CustomIcon name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingValueText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Atmospheric Background Layers (Consistent Accent Bubbles & Steam Elements) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bubbleDarkTurquoise} />
        <View style={styles.bubbleSalmon} />
        <Animated.View style={[styles.smokeEffectCloud, { opacity: smokeOneOpacity, transform: [{ scale: smokeOneScale }] }]} />
      </View>

      <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 16, opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]}>
        
        {/* Marketplace Headline Header row */}
        <View style={styles.headerLayoutRow}>
          <Text style={styles.mainTitleHeader}>Find Good Food</Text>
          <Text style={styles.supportingTaglineText}>Browse menus from your favorite local restaurants</Text>
        </View>

        {/* Input Bar Component Row with Filter Triggers */}
        <View style={styles.searchBarContainer}>
          <View style={styles.inputFieldWrapper}>
            <CustomIcon name="search" size={18} color={DISCO_COLORS.textMuted} style={styles.searchIconPadding} />
            <TextInput 
              style={styles.searchTextInputElement} 
              placeholder="Search dishes, restaurants or drinks..." 
              placeholderTextColor="rgba(30, 107, 123, 0.5)" 
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={[styles.filterButtonCell, { backgroundColor: themePrimary }]} onPress={onFilterPress} activeOpacity={0.8}>
            <CustomIcon name="list" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Horizontal Category Selection Slider Bar */}
        <View style={styles.categoriesSliderWrapper}>
          <FlatList 
            data={FOOD_CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContentPadding}
          />
        </View>
        {/* Main Food and Drinks Grid Display Workspace */}
        <FlatList 
          data={DISH_ITEMS}
          renderItem={renderDishItem}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.gridColumnsSpacingRow}
          contentContainerStyle={[styles.gridContentContainerPadding, { paddingBottom: Math.max(insets.bottom, 16) }]}
        />

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: DISCO_COLORS.background },
  contentWorkspace: { flex: 1 },
  headerLayoutRow: { paddingHorizontal: 24, marginBottom: 16 },
  mainTitleHeader: { fontSize: 26, fontWeight: '900', color: DISCO_COLORS.textDark, letterSpacing: -0.5 },
  supportingTaglineText: { fontSize: 13, fontWeight: '600', color: DISCO_COLORS.textMuted, marginTop: 2 },
  searchBarContainer: { flexDirection: 'row', paddingHorizontal: 24, alignItems: 'center', marginBottom: 20 },
  inputFieldWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: DISCO_COLORS.surfaceLight, borderWidth: 1, borderColor: DISCO_COLORS.borderLine, borderRadius: 14, height: 48, paddingHorizontal: 12 },
  searchIconPadding: { marginRight: 8 },
  searchTextInputElement: { flex: 1, fontSize: 14, color: DISCO_COLORS.textDark, height: '100%', padding: 0 },
  filterButtonCell: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 12, elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  categoriesSliderWrapper: { marginBottom: 12 },
  categoriesContentPadding: { paddingHorizontal: 24, paddingVertical: 4 },
  categoryCell: { flexDirection: 'row', alignItems: 'center', backgroundColor: DISCO_COLORS.surfaceLight, borderWidth: 1, borderColor: DISCO_COLORS.borderLine, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  categoryText: { fontSize: 13, fontWeight: '700', color: DISCO_COLORS.textMuted, marginLeft: 6 },
  categoryTextActive: { color: '#FFFFFF' },
  gridContentContainerPadding: { paddingHorizontal: 16, paddingTop: 4 },
  gridColumnsSpacingRow: { justifyContent: 'space-between', paddingHorizontal: 8 },
  dishCardFrame: { width: (width - 64) / 2, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: DISCO_COLORS.borderLine, marginBottom: 16, overflow: 'hidden', shadowColor: '#052A30', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  dishImageCover: { width: '100%', height: 110, backgroundColor: DISCO_COLORS.surfaceLight },
  dishInfoBlock: { padding: 12 },
  dishNameTitle: { fontSize: 14, fontWeight: '800', color: DISCO_COLORS.textDark, marginBottom: 2 },
  restaurantSubText: { fontSize: 11, fontWeight: '600', color: DISCO_COLORS.textMuted, marginBottom: 8 },
  priceRatingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dishPriceText: { fontSize: 14, fontWeight: '800', color: DISCO_COLORS.primary },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 215, 0, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingValueText: { fontSize: 11, fontWeight: '700', color: '#B39200', marginLeft: 3 },
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', bottom: height * 0.45, left: '25%', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(30, 107, 123, 0.04)' }
});
