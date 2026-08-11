/**
 * Buza Food Delivery Mobile Application
 * Core Optional Order Services & Extras Marketplace View
 * src/screens/service.js
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
  Easing
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';

const { width, height } = Dimensions.get('window');

const SER_COLORS = {
  primary: '#FF7F50',       
  background: '#FFFFFF',    
  textDark: '#052A30',      
  textMuted: '#1E6B7B',     
  surfaceLight: '#F4FAFA',  
  borderLine: '#D1E5E7'     
};

// Simplified terminology dataset for order add-ons and services
const SERVICE_ITEMS = [
  { id: '1', name: 'Eco-Friendly Pack', detail: 'Biodegradable containers and wooden utensils', price: 0.50, icon: 'home' },
  { id: '2', name: 'Priority Rider Dispatch', detail: 'Your food gets assigned first and delivered direct', price: 1.99, icon: 'delivery-scooter' },
  { id: '3', name: 'Gift Wrap Packaging', detail: 'Premium insulated box wrapper with a personalized note', price: 2.50, icon: 'service' }
];

const toAmount = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const formatTZS = (value) => Formatter.formatCurrency(toAmount(value), 'TZS');

export default function ServiceScreen({ onSaveServices, onBackPress }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || SER_COLORS.primary;

  const [selectedServices, setSelectedServices] = useState([]);

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

    // Constant breathing loops simulating steam rising directly across the view layers
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

  const toggleServiceItem = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  const renderServiceCard = ({ item }) => {
    const isChecked = selectedServices.includes(item.id);
    return (
      <TouchableOpacity 
        style={[styles.serviceRowCard, isChecked && { borderColor: themePrimary }]} 
        onPress={() => toggleServiceItem(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardLayoutRow}>
          <View style={[styles.iconCircleBadge, isChecked && { backgroundColor: 'rgba(255, 127, 80, 0.1)' }]}>
            <CustomIcon name={item.icon} size={20} color={isChecked ? themePrimary : SER_COLORS.textMuted} />
          </View>
          <View style={styles.itemTextDetailsBlock}>
            <Text style={styles.itemNameText}>{item.name}</Text>
            <Text style={styles.itemDetailText}>{item.detail}</Text>
            <Text style={styles.itemPriceText}>+{formatTZS(item.price)}</Text>
          </View>
          
          {/* Custom Checkbox Indicator Layout */}
          <View style={[styles.checkboxOutline, isChecked && { backgroundColor: themePrimary, borderColor: themePrimary }]}>
            {isChecked && <CustomIcon name="checkmark" size={12} color="#FFFFFF" />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Decorative Atmosphere Elements and Floating Steam Matrix */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bubbleDarkTurquoise} />
        <View style={styles.bubbleSalmon} />
        <Animated.View style={[styles.smokeEffectCloud, { opacity: smokeOneOpacity, transform: [{ scale: smokeOneScale }] }]} />
      </View>

      <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 12, opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]}>
        
        {/* UPPER NAVIGATION BAR HEADER BLOCK */}
        <View style={styles.topHeaderControlRow}>
          <TouchableOpacity style={styles.backCircleBtnFrame} onPress={onBackPress} activeOpacity={0.7}>
            <CustomIcon name="arrow-left" size={18} color={SER_COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.mainHeadingTitle}>Extra Options</Text>
            <Text style={styles.supportingTaglineText}>Add-ons to customize your food & drink delivery</Text>
          </View>
        </View>

        {/* CORE SERVICES GRID FEED AREA */}
        <FlatList
          data={SERVICE_ITEMS}
          renderItem={renderServiceCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listScrollPadding}
        />
        {/* LOWER SAVED ACTION FOOTER BUTTON */}
        <View style={[styles.footerActionContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity 
            style={[styles.primaryActionBtnFrame, { backgroundColor: themePrimary }]} 
            activeOpacity={0.85}
            onPress={() => onSaveServices?.(selectedServices)}
          >
            <Text style={styles.primaryActionBtnText}>Apply Options</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: SER_COLORS.background },
  contentWorkspace: { flex: 1 },
  topHeaderControlRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  backCircleBtnFrame: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#052A30', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: SER_COLORS.borderLine },
  headerTitleContainer: { marginLeft: 16, flex: 1 },
  mainHeadingTitle: { fontSize: 24, fontWeight: '900', color: SER_COLORS.textDark, letterSpacing: -0.5 },
  supportingTaglineText: { fontSize: 13, fontWeight: '600', color: SER_COLORS.textMuted, marginTop: 1 },
  listScrollPadding: { paddingHorizontal: 24, paddingBottom: 24 },
  serviceRowCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: SER_COLORS.borderLine, marginBottom: 14, padding: 16, shadowColor: '#052A30', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  cardLayoutRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircleBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: SER_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SER_COLORS.borderLine },
  itemTextDetailsBlock: { flex: 1, paddingHorizontal: 14 },
  itemNameText: { fontSize: 15, fontWeight: '800', color: SER_COLORS.textDark, marginBottom: 2 },
  itemDetailText: { fontSize: 12, fontWeight: '600', color: SER_COLORS.textMuted, lineHeight: 16, marginBottom: 6 },
  itemPriceText: { fontSize: 13, fontWeight: '800', color: SER_COLORS.primary },
  checkboxOutline: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: SER_COLORS.borderLine, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  footerActionContainer: { width: '100%', paddingHorizontal: 24, marginTop: 'auto' },
  primaryActionBtnFrame: { width: '100%', height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4 },
  primaryActionBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', bottom: height * 0.35, left: '20%', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(30, 107, 123, 0.04)' }
});
