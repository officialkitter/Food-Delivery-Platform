/**
 * Buza Food Delivery Mobile Application
 * Core Food & Drink Marketplace Home Navigation Hub - Premium Edition
 * File: src/screens/home.js (Part 1 of 4)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  ScrollView, FlatList, StatusBar, Easing, Image, PanResponder,
  ActivityIndicator, Alert, TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from '../../context/LocationContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import MandatoryReviewModal from '../../components/common/MandatoryReviewModal';
import { vendorService } from '../../services/vendorService';
import { Formatter } from '../../shared/utils/formatters';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const HOME_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',      
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2'     
};

const PROMO_BANNERS = [
  { id: '1', title: 'Free Delivery Weekend', subtitle: 'Valid on all premium kitchens nearby', tag: 'PROMO', color: '#1E6B7B' },
  { id: '2', title: '50% Off First Drink Order', subtitle: 'Refresh your schedule with Buza Select', tag: 'EXCLUSIVE', color: '#FF7F50' }
];

const QUICK_CATEGORIES = [
  { id: '1', name: 'Hot Meals', icon: 'fudcamp' },
  { id: '2', name: 'Cold Drinks', icon: 'cart' },
  { id: '3', name: 'Express', icon: 'delivery-scooter' },
  { id: '4', name: 'Top Offers', icon: 'service' },
  { id: '5', name: 'Healthy Salad', icon: 'fudcamp' },
  { id: '6', name: 'Sweet Desserts', icon: 'cart' },
  { id: '7', name: 'Pizza & Grill', icon: 'fudcamp' },
  { id: '8', name: 'Local Specials', icon: 'service' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Food & Drink Marketplace Home Navigation Hub - Premium Edition
 * File: src/screens/home.js (Part 2 of 4)
 */

export default function HomeScreen({ 
  onSelectRestaurant, onSelectCategory, onSelectProduct, onNotificationPress, 
  onSettingsPress, onCartPress, cartItemsCount = 3, 
  userAddress = "City Center, Block 4" 
}) {
  const insets = useSafeAreaInsets();
  useTheme();
  const { currentAddress, captureDeviceLocation, isLoading: locationLoading } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [aiProcessing, setAIProcessing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [homeFeedLoading, setHomeFeedLoading] = useState(false);
  const [homeFeedError, setHomeFeedError] = useState('');
  const [liveProducts, setLiveProducts] = useState([]);
  const [liveVendors, setLiveVendors] = useState([]);
  const [liveCategories, setLiveCategories] = useState([]);

  // --- Dynamic Flowing Visual Asset Animations ---
  const fadeLayoutAnim = useRef(new Animated.Value(0)).current;
  const deliveryFlowOneY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;
  const deliveryFlowTwoY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;
  const deliveryFlowThreeY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  // Draggable Interactive AI Floating Panel Coordinates
  const marketPanInstance = useRef(new Animated.ValueXY({ x: DEVICE_WIDTH - 72, y: DEVICE_HEIGHT - 180 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        marketPanInstance.setOffset({ x: marketPanInstance.x._value, y: marketPanInstance.y._value });
        marketPanInstance.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: marketPanInstance.x, dy: marketPanInstance.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => { marketPanInstance.flattenOffset(); }
    })
  ).current;

  useEffect(() => {
    Animated.timing(fadeLayoutAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();

    // Constant video-style running vector drift loops
    const runDeliveryDriftLoop = (animatedValue, duration, delayTime) => {
      Animated.loop(Animated.sequence([
        Animated.delay(delayTime),
        Animated.timing(animatedValue, { toValue: -100, duration, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])).start();
    };

    runDeliveryDriftLoop(deliveryFlowOneY, 7000, 0);
    runDeliveryDriftLoop(deliveryFlowTwoY, 9500, 1500);
    runDeliveryDriftLoop(deliveryFlowThreeY, 8200, 3500);

    const checkModalTimer = setTimeout(() => setShowReviewModal(true), 1200);
    return () => clearTimeout(checkModalTimer);
  }, []);

  useEffect(() => {
    const loadFeed = async () => {
      setHomeFeedLoading(true);
      setHomeFeedError('');
      try {
        const feed = await vendorService.fetchHomeMarketplaceFeed('');
        setLiveProducts(Array.isArray(feed?.products) ? feed.products : []);
        setLiveVendors(Array.isArray(feed?.vendors) ? feed.vendors : []);
        setLiveCategories(Array.isArray(feed?.categories) ? feed.categories : []);
      } catch (error) {
        setHomeFeedError(error?.message || 'Failed to load marketplace feed.');
      } finally {
        setHomeFeedLoading(false);
      }
    };

    loadFeed();
  }, []);

  const displayAddressParts = [currentAddress?.street || userAddress, currentAddress?.city].filter(Boolean);
  const displayAddress = displayAddressParts.join(', ');

  const normalizeText = (value) => String(value || '').toLowerCase();
  const searchToken = normalizeText(searchQuery).trim();

  const viewProducts = liveProducts.filter((item) => {
    if (!searchToken) return true;
    return normalizeText(item?.name).includes(searchToken) || normalizeText(item?.vendor).includes(searchToken);
  });

  const viewVendors = liveVendors.filter((vendor) => {
    if (!searchToken) return true;
    return normalizeText(vendor?.name).includes(searchToken) || normalizeText(vendor?.specialty).includes(searchToken);
  });

  const mergedCategoryNames = [...new Set(liveCategories)];

  const viewCategories = mergedCategoryNames.map((name, index) => {
    const iconMap = ['fudcamp', 'cart', 'delivery-scooter', 'service'];
    return {
      id: String(index + 1),
      name,
      icon: iconMap[index % iconMap.length],
    };
  });

  const toImageSource = (imageValue, fallbackLocal) => {
    if (typeof imageValue === 'string' && imageValue.length > 0) {
      return { uri: imageValue };
    }
    return imageValue || fallbackLocal;
  };

  const formatTZS = (rawAmount) => {
    const normalizedAmount = typeof rawAmount === 'string'
      ? Number(rawAmount.replace(/[^0-9.-]/g, ''))
      : Number(rawAmount);

    if (Number.isNaN(normalizedAmount)) {
      return Formatter.formatCurrency(0, 'TZS');
    }
    return Formatter.formatCurrency(normalizedAmount, 'TZS');
  };

  const executeSmartOrderingEngine = () => {
    setAIProcessing(true);
    setTimeout(() => {
      setAIProcessing(false);
      Alert.alert("Smart Assistant", "Your customized premium meal combination has been added to the basket!");
    }, 1200);
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Food & Drink Marketplace Home Navigation Hub - Premium Edition
 * File: src/screens/home.js (Part 3a of 5)
 */

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Canvas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        
        <Animated.View style={[styles.floatingVectorWrapper, { left: '12%', transform: [{ translateY: deliveryFlowOneY }] }]}>
          <CustomIcon name="fudcamp" size={26} color={HOME_COLORS.primary + '25'} />
        </Animated.View>
        <Animated.View style={[styles.floatingVectorWrapper, { left: '82%', transform: [{ translateY: deliveryFlowTwoY }] }]}>
          <CustomIcon name="delivery-scooter" size={28} color={HOME_COLORS.textMuted + '20'} />
        </Animated.View>
        <Animated.View style={[styles.floatingVectorWrapper, { left: '48%', transform: [{ translateY: deliveryFlowThreeY }] }]}>
          <CustomIcon name="cart" size={24} color={HOME_COLORS.primary + '20'} />
        </Animated.View>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeLayoutAnim }}>
        
        {/* Modern Header Row Block */}
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
          <View style={[styles.rowSpaceBetween, { paddingHorizontal: 16 }]}> 
            
            {/* Top-Left Corner: Settings Entry */}
            <TouchableOpacity style={styles.roundActionButton} onPress={onSettingsPress}>
              <CustomIcon name="more-vertical" size={18} color={HOME_COLORS.textDark} />
            </TouchableOpacity>

            {/* Top-Center Corner: Interactive Address Selector Dropdown */}
            <TouchableOpacity style={styles.locationPillDropdownButton} activeOpacity={0.85} onPress={captureDeviceLocation}>
              <Text style={styles.locationLabelSmall}>DELIVER TO</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomIcon name="map-pin" size={12} color={HOME_COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={styles.locationAddressText} numberOfLines={1}>{displayAddress}</Text>
                <Text style={styles.dropdownCaratSymbol}>▾</Text>
              </View>
              {locationLoading ? <Text style={styles.locationLoadingText}>Updating location...</Text> : null}
            </TouchableOpacity>

            {/* Top-Right Area Actions */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={[styles.roundActionButton, { marginRight: 8 }]} onPress={onCartPress}>
                <CustomIcon name="cart" size={18} color={HOME_COLORS.textDark} />
                {cartItemsCount > 0 && (
                  <View style={styles.cartCountPill}><Text style={styles.cartCountPillText}>{cartItemsCount}</Text></View>
                )}
              </TouchableOpacity>

              {/* Top-Right Corner: Notification Icon */}
              <TouchableOpacity style={styles.roundActionButton} onPress={onNotificationPress}>
                <CustomIcon name="bell" size={18} color={HOME_COLORS.textDark} />
                <View style={styles.notificationBadgeMarker} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Under Layout Area: Flat Styled Search bar */}
          <View style={styles.searchBarWrapper}>
            <CustomIcon name="search" size={16} color={HOME_COLORS.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInputField}
              placeholder="Search dishes, restaurants or drinks..."
              placeholderTextColor={HOME_COLORS.textMuted + '80'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Scroll Content Feed Matrix */}
        <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          
          {/* Slider Row 1: Marketing Campaign Banners */}
          <View style={styles.sectionContainer}>
            <FlatList
              data={PROMO_BANNERS}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={DEVICE_WIDTH * 0.84 + 12}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => (
                <View style={[styles.promoCard, { backgroundColor: item.color }]}>
                  <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>{item.tag}</Text></View>
                  <Text style={styles.promoTitle}>{item.title}</Text>
                  <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
                </View>
              )}
            />
          </View>

          {/* Slider Row 2: Extended Categories Horizontal Slider */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}><Text style={styles.sectionHeadingText}>Browse Categories</Text></View>
            <FlatList
              data={viewCategories}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.categoryCell} activeOpacity={0.75} onPress={() => onSelectCategory?.(item)}>
                  <View style={styles.categoryIconCircle}>
                    <CustomIcon name={item.icon} size={20} color={HOME_COLORS.primary} />
                  </View>
                  <Text style={styles.categoryLabelText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Slider Row 3: High-Radius Circular Product Slider */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}><Text style={styles.sectionHeadingText}>Featured Products</Text></View>
            <FlatList
              data={viewProducts}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.productCard} activeOpacity={0.9} onPress={() => onSelectProduct?.(item)}>
                  <View style={styles.productCircleImageContainer}>
                    <Image source={toImageSource(item.image, require('../../assets/images/6.png'))} style={styles.productCircleImage} resizeMode="cover" />
                  </View>
                  <View style={{ padding: 10, alignItems: 'center' }}>
                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.productVendor}>{item.vendor}</Text>
                    <Text style={styles.productPrice}>{formatTZS(item.price)}</Text>
                    <View style={styles.productRatingBadge}>
                      <CustomIcon name="star" size={10} color={HOME_COLORS.textDark} style={{ marginRight: 2 }} />
                      <Text style={styles.productRatingText}>{item.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Structured Vendor Display Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}><Text style={styles.sectionHeadingText}>Popular Kitchens Near You</Text></View>
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              {viewVendors.map((restaurant) => (
                <TouchableOpacity key={restaurant.id} style={styles.vendorCardFrame} activeOpacity={0.9} onPress={() => onSelectRestaurant?.(restaurant)}>
                  <Image source={toImageSource(restaurant.image, require('../../assets/images/8.png'))} style={styles.vendorImageBanner} resizeMode="cover" />
                  <View style={[styles.rowSpaceBetween, { padding: 14 }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.vendorNameTitle}>{restaurant.name}</Text>
                      <Text style={styles.vendorSpecialtyText}>{restaurant.specialty}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <CustomIcon name="clock" size={12} color={HOME_COLORS.textMuted} style={{ marginRight: 4 }} />
                        <Text style={styles.vendorMetaText}>{restaurant.ETA}</Text>
                        <Text style={[styles.vendorMetaText, { color: HOME_COLORS.primary, fontWeight: '700', marginLeft: 8 }]}>{restaurant.delivery} Delivery</Text>
                      </View>
                    </View>
                    <View style={styles.vendorRatingBadge}>
                      <CustomIcon name="star" size={12} color={HOME_COLORS.textDark} style={{ marginRight: 4 }} />
                      <Text style={styles.ratingValueText}>{restaurant.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Floating Smart AI Intelligence Layer */}
      <Animated.View {...panResponder.panHandlers} style={[marketPanInstance.getLayout(), { position: 'absolute', zIndex: 99 }]}>
        <TouchableOpacity style={styles.smartOrderingFloatingWidget} activeOpacity={0.85} onPress={executeSmartOrderingEngine}>
          {aiProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={styles.aiSparkleIconLayout}>
              <CustomIcon name="service" size={24} color="#FFFFFF" />
              <View style={styles.aiCoreDotIndicator} />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {!!homeFeedError && !homeFeedLoading && (
        <View style={styles.homeFeedErrorPanel}>
          <Text style={styles.homeFeedErrorText}>{homeFeedError}</Text>
        </View>
      )}

      <MandatoryReviewModal visible={showReviewModal} vendorName="Buza Grill House" onReviewSubmitted={() => setShowReviewModal(false)} />
    </View>
  );
}
/**
 * Buza Food Delivery Mobile Application
 * Core Food & Drink Marketplace Home Navigation Hub - Premium Edition
 * File: src/screens/home.js (Part 4 of 4)
 */

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: HOME_COLORS.background },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Background Architecture Styles
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Platform Header Elements
  headerContainer: { backgroundColor: HOME_COLORS.background, borderBottomWidth: 1, borderBottomColor: HOME_COLORS.borderLine, paddingBottom: 14, zIndex: 20 },
  roundActionButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: HOME_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: HOME_COLORS.borderLine, position: 'relative' },
  notificationBadgeMarker: { position: 'absolute', top: 12, right: 14, width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30' },
  cartCountPill: { position: 'absolute', right: -4, top: -2, backgroundColor: HOME_COLORS.primary, borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  cartCountPillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  
  // UberEats / DoorDash Style Dropdown Field
  locationPillDropdownButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  locationLabelSmall: { fontSize: 9, fontWeight: '800', color: HOME_COLORS.textMuted, letterSpacing: 1, marginBottom: 1, textAlign: 'center' },
  locationAddressText: { fontSize: 14, fontWeight: '700', color: HOME_COLORS.textDark, maxWidth: DEVICE_WIDTH * 0.4 },
  locationLoadingText: { fontSize: 10, color: HOME_COLORS.textMuted, marginTop: 2, fontWeight: '600' },
  dropdownCaratSymbol: { fontSize: 12, color: HOME_COLORS.textMuted, marginLeft: 4, fontWeight: '700' },

  // Search Engine Bar
  searchBarWrapper: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24, paddingHorizontal: 16, backgroundColor: HOME_COLORS.surfaceLight, borderWidth: 1, borderColor: HOME_COLORS.borderLine, marginHorizontal: 16, marginTop: 14 },
  searchInputField: { flex: 1, fontSize: 14, color: HOME_COLORS.textDark, fontWeight: '600', padding: 0 },

  // Sections Core Titles
  sectionContainer: { marginTop: 22, width: '100%' },
  sectionHeaderRow: { paddingHorizontal: 16, marginBottom: 4 },
  sectionHeadingText: { fontSize: 16, fontWeight: '800', color: HOME_COLORS.textDark, letterSpacing: -0.1 },

  // Marketing Slider Promo Cards
  promoCard: { width: DEVICE_WIDTH * 0.84, padding: 16, borderRadius: 16, marginRight: 12, justifyContent: 'center' },
  promoBadge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  promoBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  promoTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  promoSubtitle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, fontWeight: '500' },

  // Categories Slider Item Cards
  categoryCell: { alignItems: 'center', marginRight: 20 },
  categoryIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: HOME_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: HOME_COLORS.borderLine, marginBottom: 6 },
  categoryLabelText: { fontSize: 12, fontWeight: '700', color: HOME_COLORS.textDark },

  // Circular Product Showcase System Layout (>50% Overlays)
  productCard: { width: 140, backgroundColor: HOME_COLORS.background, borderRadius: 14, borderWidth: 1, borderColor: HOME_COLORS.borderLine, marginRight: 12, paddingVertical: 12, alignItems: 'center' },
  productCircleImageContainer: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', backgroundColor: HOME_COLORS.surfaceLight, borderWidth: 1, borderColor: HOME_COLORS.borderLine },
  productCircleImage: { width: '100%', height: '100%' },
  productName: { fontSize: 13, fontWeight: '700', color: HOME_COLORS.textDark, marginTop: 6, textAlign: 'center' },
  productVendor: { fontSize: 11, color: HOME_COLORS.textMuted, marginTop: 1, marginBottom: 8, textAlign: 'center' },
  productPrice: { fontSize: 13, fontWeight: '800', color: HOME_COLORS.primary },
  productRatingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: HOME_COLORS.surfaceLight, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  productRatingText: { fontSize: 10, fontWeight: '700', color: HOME_COLORS.textDark },

  // Highly Organized Grid Kitchen Frame Layouts
  vendorCardFrame: { backgroundColor: HOME_COLORS.background, borderRadius: 16, borderWidth: 1, borderColor: HOME_COLORS.borderLine, marginBottom: 16, overflow: 'hidden' },
  vendorImageBanner: { width: '100%', height: 170 },
  vendorNameTitle: { fontSize: 16, fontWeight: '800', color: HOME_COLORS.textDark },
  vendorSpecialtyText: { fontSize: 12, color: HOME_COLORS.textMuted, marginTop: 2 },
  vendorMetaText: { fontSize: 12, color: HOME_COLORS.textMuted, fontWeight: '600' },
  vendorRatingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: HOME_COLORS.surfaceLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: HOME_COLORS.borderLine },
  ratingValueText: { fontSize: 12, fontWeight: '700', color: HOME_COLORS.textDark },

  // Smart AI Engine Float Components
  smartOrderingFloatingWidget: { width: 56, height: 56, borderRadius: 28, backgroundColor: HOME_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: HOME_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 },
  aiSparkleIconLayout: { position: 'relative', width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  aiCoreDotIndicator: { position: 'absolute', top: -1, right: -1, width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },

  homeFeedErrorPanel: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 86,
    backgroundColor: '#FFE8E2',
    borderColor: '#FFC9BC',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  homeFeedErrorText: {
    color: '#7A2A1B',
    fontSize: 12,
    fontWeight: '600',
  }
});
