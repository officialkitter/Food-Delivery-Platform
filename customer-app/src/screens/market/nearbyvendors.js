/**
 * Buza Food Delivery Mobile Application
 * Core Nearby Restaurant & Food Vendors Marketplace View
 * src/screens/nearbyvendors.js
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

const { width, height } = Dimensions.get('window');

const VENDOR_COLORS = {
  primary: '#FF7F50',       
  background: '#FFFFFF',    
  textDark: '#052A30',      
  textMuted: '#1E6B7B',     
  surfaceLight: '#F4FAFA',  
  borderLine: '#D1E5E7'     
};

// Simplified seed dataset for open kitchens and bars nearby
const LOCAL_VENDORS = [
  { id: '1', name: 'Buza Grill House', specialty: 'Burgers, Fries & Wings', ETA: '15-25 min', delivery: 'Free', rating: '4.9', image: require('../../assets/images/6.png') },
  { id: '2', name: 'Fresh Drinks & Shakes Bar', specialty: 'Cold Juices, Smoothies', ETA: '10-20 min', delivery: 'Free', rating: '4.8', image: require('../../assets/images/8.png') },
  { id: '3', name: 'Grand Hot Meals', specialty: 'Rice Bowls & Roasted Meats', ETA: '20-30 min', delivery: 'Free', rating: '4.7', image: require('../../assets/images/7.png') }
];

export default function NearbyVendorsScreen({ onSelectVendor, onBackPress }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || VENDOR_COLORS.primary;

  const [vendors] = useState(LOCAL_VENDORS);

  // Entrance and background layout animation drivers
  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(25)).current;
  const smokeOneOpacity = useRef(new Animated.Value(0)).current;
  const smokeOneScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeElementAnim, { toValue: 1, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideContentAnim, { toValue: 0, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();

    // Constant breathing loops simulating steam rising behind your nearby active restaurants card grid
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
  const renderVendorCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.vendorCardFrame} 
      activeOpacity={0.9} 
      onPress={() => onSelectVendor?.(item)}
    >
      <Image source={item.image} style={styles.vendorImageBanner} resizeMode="cover" />
      <View style={styles.vendorDetailsRow}>
        <View style={styles.vendorInfoColumn}>
          <Text style={styles.vendorNameTitle}>{item.name}</Text>
          <Text style={styles.vendorSpecialtyText}>{item.specialty}</Text>
          
          <View style={styles.vendorMetaRow}>
            <View style={styles.metaCell}>
              <CustomIcon name="clock" size={13} color={VENDOR_COLORS.textMuted} />
              <Text style={styles.vendorMetaText}>{item.ETA}</Text>
            </View>
            <View style={styles.metaDotDivider} />
            <View style={styles.metaCell}>
              <CustomIcon name="delivery-scooter" size={14} color={VENDOR_COLORS.primary} />
              <Text style={[styles.vendorMetaText, { color: VENDOR_COLORS.primary, fontWeight: '700' }]}>{item.delivery} Delivery</Text>
            </View>
          </View>
        </View>

        {/* Floating Star Rating Badge */}
        <View style={styles.ratingBadge}>
          <CustomIcon name="star" size={12} color={VENDOR_COLORS.primary} />
          <Text style={styles.ratingValueText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
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

      <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 12, opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]}>
        
        {/* UPPER NAVIGATION BAR LAYER */}
        <View style={styles.topHeaderControlRow}>
          <TouchableOpacity style={styles.backCircleBtnFrame} onPress={onBackPress} activeOpacity={0.7}>
            <CustomIcon name="arrow-left" size={18} color={VENDOR_COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.mainHeadingTitle}>Open Kitchens</Text>
            <Text style={styles.supportingTaglineText}>Active food & drink spots close to you</Text>
          </View>
        </View>

        {/* MAIN VENDORS LIST FRAME */}
        <FlatList
          data={vendors}
          renderItem={renderVendorCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listScrollPadding, { paddingBottom: Math.max(insets.bottom, 20) }]}
        />

      </Animated.View>
    </View>
  );
}
/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix
 */
const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: VENDOR_COLORS.background },
  contentWorkspace: { flex: 1 },
  topHeaderControlRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  backCircleBtnFrame: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#052A30', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: VENDOR_COLORS.borderLine },
  headerTitleContainer: { marginLeft: 16, flex: 1 },
  mainHeadingTitle: { fontSize: 24, fontWeight: '900', color: VENDOR_COLORS.textDark, letterSpacing: -0.5 },
  supportingTaglineText: { fontSize: 13, fontWeight: '600', color: VENDOR_COLORS.textMuted, marginTop: 1 },
  listScrollPadding: { paddingHorizontal: 24, paddingTop: 2, paddingBottom: 24 },
  vendorCardFrame: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: VENDOR_COLORS.borderLine, marginBottom: 20, overflow: 'hidden', shadowColor: '#052A30', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  vendorImageBanner: { width: '100%', height: 140, backgroundColor: VENDOR_COLORS.surfaceLight },
  vendorDetailsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  vendorInfoColumn: { flex: 1, paddingRight: 12 },
  vendorNameTitle: { fontSize: 16, fontWeight: '800', color: VENDOR_COLORS.textDark, marginBottom: 2 },
  vendorSpecialtyText: { fontSize: 12, fontWeight: '600', color: VENDOR_COLORS.textMuted, marginBottom: 10 },
  vendorMetaRow: { flexDirection: 'row', alignItems: 'center' },
  metaCell: { flexDirection: 'row', alignItems: 'center' },
  vendorMetaText: { fontSize: 12, fontWeight: '600', color: VENDOR_COLORS.textDark, marginLeft: 4 },
  metaDotDivider: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(30, 107, 123, 0.3)', marginHorizontal: 10 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 127, 80, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  ratingValueText: { fontSize: 12, fontWeight: '800', color: VENDOR_COLORS.primary, marginLeft: 4 },
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', top: height * 0.3, left: '20%', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(30, 107, 123, 0.03)' }
});
