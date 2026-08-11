/**
 * Buza Food Delivery Mobile Application
 * Core Master Account Settings Dashboard & Sub-screen Wiring Hub
 * File: src/screens/AccountScreen.js (Part 1 of 3)
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const ACCOUNT_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  dangerRed: '#FF3B30'
};

export default function AccountScreen({
  userName = "Jane Doe",
  userEmail = "jane.doe@buzapremium.com",
  navigation, // Core navigation router prop to wire underlying channels
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Animation Vector References ---
  const layoutFadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundDriftY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(layoutFadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();

    // Constant video-style running vector drift loops tracking vertically
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundDriftY, { toValue: -80, duration: 9500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(backgroundDriftY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // Structural sub-screen wiring dictionary definitions array mapping lists
  const ACCOUNT_ROUTING_OPTIONS = [
    { title: 'Personal Profile Data', detail: 'View your identity summary', targetScreen: 'profile.js', vectorIcon: 'profile' },
    { title: 'Modify Account Identity', detail: 'Edit name and credentials', targetScreen: 'profileedit.js', vectorIcon: 'profile' },
    { title: 'Digital Capital Wallet', detail: 'Manage payments and credit metrics', targetScreen: 'wallet.js', vectorIcon: 'cart' },
    { title: 'Saved Delivery Locations', detail: 'Review personal location coordinates', targetScreen: 'saveaddress.js', vectorIcon: 'map-pin' },
    { title: 'Register Destination Address', detail: 'Add new fulfillment address pins', targetScreen: 'addaddress.js', vectorIcon: 'plus' },
    { title: 'Update Alert Preferences', detail: 'Configure push transmission logs', targetScreen: 'notification.js', vectorIcon: 'bell' },
    { title: 'Language Localization', detail: 'Switch platform interface dialects', targetScreen: 'language.js', vectorIcon: 'service' },
    { title: 'Platform Parameters', detail: 'Core operational utility settings', targetScreen: 'sattings.js', vectorIcon: 'service' },
    { title: 'Logged Customer Reviews', detail: 'Track experience ratings histories', targetScreen: 'userreview.js', vectorIcon: 'star' },
    { title: 'Frequently Asked Questions', detail: 'Platform knowledge base lookups', targetScreen: 'FAQ.js', vectorIcon: 'shield-check' }
  ];
/**
 * Buza Food Delivery Mobile Application
 * Core Master Account Settings Dashboard & Sub-screen Wiring Hub
 * File: src/screens/AccountScreen.js (Part 2 of 3)
 */

  const handleSubScreenNavigationRouting = (targetDestinationKey) => {
    // Navigates securely down to the target subsystem file route path parameter
    console.log(`Wiring target pipeline redirection node -> ${targetDestinationKey}`);
    if (navigation && navigation.navigate) {
      navigation.navigate(targetDestinationKey);
    }
  };

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="profile" size={24} color={ACCOUNT_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, opacity: layoutFadeAnim }]}>
        
        {/* Core Top Customer Profile Banner Framework */}
        <View style={styles.customerSummaryCardRow}>
          <View style={styles.avatarWrapperCircle}>
            <CustomIcon name="profile" size={32} color={ACCOUNT_COLORS.textDark} />
          </View>
          <View style={{ flex: 1, paddingLeft: 14 }}>
            <Text style={styles.userNameHeaderTitle}>{userName}</Text>
            <Text style={styles.userEmailSubtitleText}>{userEmail}</Text>
          </View>
        </View>

        {/* Dynamic Navigational Menu Tree Matrix Viewport */}
        <ScrollView style={{ flex: 1, marginTop: 10 }} showsVerticalScrollIndicator={false}>
          <View style={styles.menuItemsBlockWrapper}>
            {ACCOUNT_ROUTING_OPTIONS.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.menuRowItemPillButton}
                activeOpacity={0.8}
                onPress={() => handleSubScreenNavigationRouting(option.targetScreen)}
              >
                <View style={styles.itemContentGroupLeft}>
                  <View style={styles.menuIconWrapperCircle}>
                    <CustomIcon name={option.vectorIcon} size={16} color={ACCOUNT_COLORS.textDark} />
                  </View>
                  <View>
                    <Text style={styles.menuItemTitleLabel}>{option.title}</Text>
                    <Text style={styles.menuItemDetailCopy}>{option.detail}</Text>
                  </View>
                </View>
                <Text style={styles.menuCaratSymbolIndicator}>▾</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Explicit Termination Account Route Block Link (logout.js Wiring) */}
          <View style={{ width: '100%', paddingHorizontal: 16, marginTop: 14, marginBottom: insets.bottom + 20 }}>
            <TouchableOpacity 
              style={styles.logoutActionButtonPill} 
              activeOpacity={0.85}
              onPress={() => handleSubScreenNavigationRouting('logout.js')}
            >
              <CustomIcon name="lock" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.logoutButtonText}>Terminate Session Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </Animated.View>
    </View>
  );
}
/**
 * Buza Food Delivery Mobile Application
 * Core Master Account Settings Dashboard & Sub-screen Wiring Hub
 * File: src/screens/AccountScreen.js (Part 3 of 3)
 */

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: ACCOUNT_COLORS.background },
  viewportWorkspace: { flex: 1 },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Customer Identity Headers
  customerSummaryCardRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: ACCOUNT_COLORS.borderLine, width: '100%', marginTop: 10 },
  avatarWrapperCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: ACCOUNT_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ACCOUNT_COLORS.borderLine, shadowColor: ACCOUNT_COLORS.textDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 6, elevation: 1 },
  userNameHeaderTitle: { fontSize: 18, fontWeight: '800', color: ACCOUNT_COLORS.textDark, letterSpacing: -0.2 },
  userEmailSubtitleText: { fontSize: 13, fontWeight: '600', color: ACCOUNT_COLORS.textMuted, marginTop: 2 },

  // Vertical Navigation Row Component Selectors (100% Circular Formats)
  menuItemsBlockWrapper: { width: '100%', paddingHorizontal: 16, gap: 10, marginTop: 12 },
  menuRowItemPillButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 58, borderRadius: 29, backgroundColor: ACCOUNT_COLORS.surfaceLight, borderWidth: 1, borderColor: ACCOUNT_COLORS.borderLine, paddingHorizontal: 16 },
  itemContentGroupLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  menuIconWrapperCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ACCOUNT_COLORS.borderLine, marginRight: 12 },
  menuItemTitleLabel: { fontSize: 14, fontWeight: '800', color: ACCOUNT_COLORS.textDark },
  menuItemDetailCopy: { fontSize: 11, fontWeight: '500', color: ACCOUNT_COLORS.textMuted, marginTop: 1 },
  menuCaratSymbolIndicator: { fontSize: 14, color: ACCOUNT_COLORS.textMuted, fontWeight: '700', transform: [{ rotate: '-90deg' }] },

  // 100% Circular Termination Session Primary Pill Key
  logoutActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: ACCOUNT_COLORS.dangerRed, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: ACCOUNT_COLORS.dangerRed, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  logoutButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
