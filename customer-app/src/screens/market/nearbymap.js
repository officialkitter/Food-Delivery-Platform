/**
 * Buza Food Delivery Mobile Application
 * Core Local Kitchens & Rider Tracking Map View
 * src/screens/nearbymap.js
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
  ScrollView,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width, height } = Dimensions.get('window');

const MAP_COLORS = {
  primary: '#FF7F50',       
  background: '#FFFFFF',    
  textDark: '#052A30',      
  textMuted: '#1E6B7B',     
  surfaceLight: '#F4FAFA',  
  borderLine: '#D1E5E7'     
};

// Simplified seed dataset for nearby restaurants
const LOCAL_KITCHENS = [
  { id: '1', name: 'Buza Grill House', food: 'Burgers & Fries', distance: '5 min away', rating: '4.9', top: '32%', left: '45%' },
  { id: '2', name: 'Fresh Drinks Bar', food: 'Juices & Shakes', distance: '8 min away', rating: '4.8', top: '48%', left: '25%' },
  { id: '3', name: 'Grand Hot Meals', food: 'Local Rice Dishes', distance: '12 min away', rating: '4.7', top: '22%', left: '70%' }
];

export default function NearbyMapScreen({ onSelectKitchen, onBackPress }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || MAP_COLORS.primary;

  const [selectedKitchen, setSelectedCategory] = useState(LOCAL_KITCHENS[0]);

  // Entrance and background layout animation drivers
  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(25)).current;
  const smokeOneOpacity = useRef(new Animated.Value(0)).current;
  const smokeOneScale = useRef(new Animated.Value(1)).current;

  // Active map pin pulsing anchor drivers
  const mapPinPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeElementAnim, { toValue: 1, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideContentAnim, { toValue: 0, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();

    // Constant breathing loops simulating steam rising across our marketplace food cards
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

    // Infinite breathing layout pulses for the custom map pins
    Animated.loop(
      Animated.sequence([
        Animated.timing(mapPinPulse, { toValue: 1.2, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(mapPinPulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    ).start();
  }, []);
  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* MOCK MAP CANVAS BACKDROP FRAME LAYER */}
      <View style={styles.mapCanvasPlaceholder}>
        {/* Abstract vector road graphics rendering grid system */}
        <View style={styles.mapRoadHorizontal} />
        <View style={[styles.mapRoadHorizontal, { top: '65%' }]} />
        <View style={styles.mapRoadVertical} />
        <View style={[styles.mapRoadVertical, { left: '60%' }]} />

        {/* Map Center User Location Indicator Badge */}
        <View style={styles.userLocationMarker}>
          <View style={styles.userLocationCoreRing} />
        </View>

        {/* Map Plot Coordinates: Loop and plot kitchen pins across the display matrix */}
        {LOCAL_KITCHENS.map((kitchen) => {
          const isCurrentSelection = selectedKitchen.id === kitchen.id;
          return (
            <TouchableOpacity
              key={kitchen.id}
              style={[styles.mapPinWrapperAnchor, { top: kitchen.top, left: kitchen.left }]}
              onPress={() => setSelectedCategory(kitchen)}
              activeOpacity={0.8}
            >
              <Animated.View style={[
                styles.mapPinBubbleIndicator, 
                isCurrentSelection && { backgroundColor: themePrimary, borderColor: '#FFFFFF' },
                isCurrentSelection && { transform: [{ scale: mapPinPulse }] }
              ]}>
                <CustomIcon name="fudcamp" size={14} color={isCurrentSelection ? '#FFFFFF' : MAP_COLORS.primary} />
              </Animated.View>
              {isCurrentSelection && <View style={[styles.pinBottomTrianglePointer, { borderTopColor: themePrimary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Atmospheric Background Layers (Consistent Ambient Accent Bubbles) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bubbleDarkTurquoise} />
        <View style={styles.bubbleSalmon} />
        <Animated.View style={[styles.smokeEffectCloud, { opacity: smokeOneOpacity, transform: [{ scale: smokeOneScale }] }]} />
      </View>

      {/* FLOATING ACTION INTERFACE MODULES BLOCK */}
      <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 12, opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]} pointerEvents="box-none">
        
        {/* Upper Segment Row: Back buttons track bar layout */}
        <View style={styles.topHeaderControlRow}>
          <TouchableOpacity style={styles.backCircleBtnFrame} onPress={onBackPress} activeOpacity={0.7}>
            <CustomIcon name="arrow-left" size={18} color={MAP_COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.mapTitleCardBadge}>
            <Text style={styles.mapTitleBadgeLabelText}>Nearby Kitchens</Text>
          </View>
        </View>
        {/* Lower Segment Layer: Proportional sliding details summary card */}
        <View style={[styles.footerActionContainer, { paddingBottom: Math.max(insets.bottom, 20) }]} pointerEvents="box-none">
          <View style={styles.kitchenDetailCardBackdrop}>
            <View style={styles.cardHeaderFlexRow}>
              <View style={styles.cardInfoTextBlock}>
                <Text style={styles.kitchenNameTitleText}>{selectedKitchen.name}</Text>
                <Text style={styles.kitchenFoodSubtext}>{selectedKitchen.food}</Text>
              </View>
              <View style={styles.ratingBadgeElement}>
                <CustomIcon name="star" size={12} color={MAP_COLORS.primary} />
                <Text style={styles.ratingValueLabelText}>{selectedKitchen.rating}</Text>
              </View>
            </View>

            <View style={styles.cardTimelineMetaBarRow}>
              <View style={styles.metaRowIndicatorCell}>
                <CustomIcon name="clock" size={14} color={MAP_COLORS.textMuted} />
                <Text style={styles.metaRowValueLabelText}>{selectedKitchen.distance}</Text>
              </View>
              <View style={styles.metaRowIndicatorCell}>
                <CustomIcon name="delivery-scooter" size={15} color={MAP_COLORS.primary} />
                <Text style={[styles.metaRowValueLabelText, { color: MAP_COLORS.primary, fontWeight: '700' }]}>Free Delivery</Text>
              </View>
            </View>

            {/* Primary Action Button: Route Context Handlers */}
            <TouchableOpacity 
              style={[styles.primaryActionBtnFrame, { backgroundColor: themePrimary }]} 
              activeOpacity={0.85}
              onPress={() => onSelectKitchen?.(selectedKitchen)}
            >
              <Text style={styles.primaryActionBtnText}>Open Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: MAP_COLORS.background },
  mapCanvasPlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#E2E8F0' },
  mapRoadHorizontal: { position: 'absolute', top: '35%', left: 0, right: 0, height: 28, backgroundColor: '#FFFFFF', opacity: 0.8 },
  mapRoadVertical: { position: 'absolute', left: '30%', top: 0, bottom: 0, width: 28, backgroundColor: '#FFFFFF', opacity: 0.8 },
  userLocationMarker: { position: 'absolute', top: '50%', left: '50%', width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(37, 99, 235, 0.2)', alignItems: 'center', justifyContent: 'center', marginTop: -12, marginLeft: -12 },
  userLocationCoreRing: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2563EB', borderWidth: 2, borderColor: '#FFFFFF' },
  mapPinWrapperAnchor: { position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 },
  mapPinBubbleIndicator: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: MAP_COLORS.primary, shadowColor: '#052A30', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4 },
  pinBottomTrianglePointer: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -1 },
  contentWorkspace: { flex: 1, justifyContent: 'space-between' },
  topHeaderControlRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  backCircleBtnFrame: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#052A30', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  mapTitleCardBadge: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 12, shadowColor: '#052A30', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  mapTitleBadgeLabelText: { fontSize: 13, fontWeight: '800', color: MAP_COLORS.textDark },
  footerActionContainer: { width: '100%', paddingHorizontal: 24 },
  kitchenDetailCardBackdrop: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, shadowColor: '#052A30', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: MAP_COLORS.borderLine },
  cardHeaderFlexRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardInfoTextBlock: { flex: 1, paddingRight: 12 },
  kitchenNameTitleText: { fontSize: 17, fontWeight: '900', color: MAP_COLORS.textDark },
  kitchenFoodSubtext: { fontSize: 12, fontWeight: '600', color: MAP_COLORS.textMuted, marginTop: 2 },
  ratingBadgeElement: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 127, 80, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingValueLabelText: { fontSize: 12, fontWeight: '800', color: MAP_COLORS.primary, marginLeft: 4 },
  cardTimelineMetaBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: MAP_COLORS.surfaceLight, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: MAP_COLORS.borderLine },
  metaRowIndicatorCell: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  metaRowValueLabelText: { fontSize: 12, fontWeight: '600', color: MAP_COLORS.textDark, marginLeft: 6 },
  primaryActionBtnFrame: { width: '100%', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4 },
  primaryActionBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', bottom: height * 0.35, left: '20%', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(30, 107, 123, 0.04)' }
});
