/**
 * Buza Food Delivery Mobile Application
 * Core Vendor Operational Status & Restaurant Profile View
 * src/screens/vendorstatus.js
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Easing
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width, height } = Dimensions.get('window');

const STAT_COLORS = {
  primary: '#FF7F50',       
  background: '#FFFFFF',    
  textDark: '#052A30',      
  textMuted: '#1E6B7B',     
  surfaceLight: '#F4FAFA',  
  borderLine: '#D1E5E7',
  successGreen: '#22C55E'
};

const SAMPLE_VENDOR_DATA = {
  name: 'Buza Grill House',
  isOpen: true,
  isBusy: false,
  openingHours: '08:00 AM - 10:00 PM',
  hygieneRating: 'Pass (Excellent)',
  averagePrepTime: '15 mins'
};

export default function VendorStatusScreen({ routeVendor, onRefreshStatus, onBackPress }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || STAT_COLORS.primary;

  const vendor = routeVendor || SAMPLE_VENDOR_DATA;

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

    // Constant breathing loops simulating steam rising behind operational metrics cards
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
            <CustomIcon name="arrow-left" size={18} color={STAT_COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.mainHeadingTitle}>Kitchen Status</Text>
            <Text style={styles.supportingTaglineText}>Real-time restaurant operational settings</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPaddingContent} bounces={false}>
          {/* CORE STATUS DISPLAY CARD */}
          <View style={styles.statusDisplayCard}>
            <Text style={styles.restaurantNameLabel}>{vendor.name}</Text>
            
            <View style={styles.statusBadgeRow}>
              {vendor.isOpen ? (
                <View style={[styles.badgeBase, { backgroundColor: 'rgba(34, 197, 94, 0.12)' }]}>
                  <View style={[styles.statusDot, { backgroundColor: STAT_COLORS.successGreen }]} />
                  <Text style={[styles.badgeText, { color: STAT_COLORS.successGreen }]}>{vendor.isBusy ? 'Busy Cooking' : 'Open for Orders'}</Text>
                </View>
              ) : (
                <View style={[styles.badgeBase, { backgroundColor: 'rgba(220, 38, 38, 0.12)' }]}>
                  <View style={[styles.statusDot, { backgroundColor: '#DC2626' }]} />
                  <Text style={[styles.badgeText, { color: '#DC2626' }]}>Closed Temporarily</Text>
                </View>
              )}
            </View>
          </View>

          {/* OPERATIONAL METRICS BACKDROP CARDS */}
          <View style={styles.metricsGroupGrid}>
            <View style={styles.infoCardBackdrop}>
              <Text style={styles.infoCardTitle}>Kitchen Hours</Text>
              <Text style={styles.infoCardBody}>{vendor.openingHours}</Text>
            </View>

            <View style={styles.infoCardBackdrop}>
              <Text style={styles.infoCardTitle}>Average Cooking Speed</Text>
              <Text style={styles.infoCardBody}>{vendor.averagePrepTime} per meal</Text>
            </View>

            <View style={styles.infoCardBackdrop}>
              <Text style={styles.infoCardTitle}>Safety & Hygiene Check</Text>
              <Text style={styles.infoCardBody}>{vendor.hygieneRating}</Text>
            </View>
          </View>
        </ScrollView>
        {/* LOWER REFRESH DATA ACTIONS FOOTER */}
        <View style={[styles.footerActionContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity 
            style={[styles.primaryActionBtnFrame, { backgroundColor: themePrimary }]} 
            activeOpacity={0.85}
            onPress={onRefreshStatus}
          >
            <Text style={styles.primaryActionBtnText}>Check Live Status</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: STAT_COLORS.background },
  contentWorkspace: { flex: 1 },
  topHeaderControlRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 24 },
  backCircleBtnFrame: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#052A30', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: STAT_COLORS.borderLine },
  headerTitleContainer: { marginLeft: 16, flex: 1 },
  mainHeadingTitle: { fontSize: 24, fontWeight: '900', color: STAT_COLORS.textDark, letterSpacing: -0.5 },
  supportingTaglineText: { fontSize: 13, fontWeight: '600', color: STAT_COLORS.textMuted, marginTop: 1 },
  scrollPaddingContent: { paddingHorizontal: 24, paddingBottom: 24 },
  statusDisplayCard: { width: '100%', backgroundColor: STAT_COLORS.surfaceLight, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: STAT_COLORS.borderLine, alignItems: 'center', marginBottom: 24 },
  restaurantNameLabel: { fontSize: 20, fontWeight: '900', color: STAT_COLORS.textDark, marginBottom: 12, textAlign: 'center' },
  statusBadgeRow: { flexDirection: 'row', alignItems: 'center' },
  badgeBase: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  badgeText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.2 },
  metricsGroupGrid: { width: '100%' },
  infoCardBackdrop: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: STAT_COLORS.borderLine, marginBottom: 14, shadowColor: '#052A30', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 6, elevation: 2 },
  infoCardTitle: { fontSize: 14, fontWeight: '800', color: STAT_COLORS.textDark, marginBottom: 6 },
  infoCardBody: { fontSize: 13, fontWeight: '600', color: STAT_COLORS.textMuted, lineHeight: 18 },
  footerActionContainer: { width: '100%', paddingHorizontal: 24, marginTop: 'auto' },
  primaryActionBtnFrame: { width: '100%', height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4 },
  primaryActionBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', bottom: height * 0.45, left: '20%', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(30, 107, 123, 0.04)' }
});
