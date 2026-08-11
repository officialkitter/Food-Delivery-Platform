/**
 * Buza Food Delivery Mobile Application
 * Core Master Resolution Support Center & Sub-screen Wiring Hub
 * File: src/screens/support.js (Part 1 of 3)
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

const SUPPORT_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2'
};

export default function SupportScreen({ navigation }) {
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

  // Structural sub-screen wiring dictionary definitions array mapping components
  const SUPPORT_ROUTING_OPTIONS = [
    { title: 'Troubleshoot Active Order', detail: 'Report missing items or delivery delays', targetScreen: 'ordersupport.js', vectorIcon: 'delivery-scooter' },
    { title: 'Live Chat Agent', detail: 'Open a real-time text stream with operators', targetScreen: 'livechat.js', vectorIcon: 'message' },
    { title: 'File Dispute Ticket', detail: 'Log refund or payment request forms', targetScreen: 'disputeticket.js', vectorIcon: 'shield-check' },
    { title: 'Support Ticket Monitor', detail: 'Track resolution progress of open cases', targetScreen: 'ticketmonitor.js', vectorIcon: 'list' },
    { title: 'Help Center Hub', detail: 'Browse platform tutorials and answers', targetScreen: 'helpcenter.js', vectorIcon: 'service' },
    { title: 'System Alert Updates', detail: 'Review maintenance and network bulletins', targetScreen: 'updates.js', vectorIcon: 'bell' },
    { title: 'Terms of Service Compliance', detail: 'Review marketplace legal regulations', targetScreen: 'termofservice.js', vectorIcon: 'list' },
    { title: 'Privacy Regulation Policy', detail: 'Review data logging protection rules', targetScreen: 'privacypolicy.js', vectorIcon: 'lock' }
  ];
/**
 * Buza Food Delivery Mobile Application
 * Core Master Resolution Support Center & Sub-screen Wiring Hub
 * File: src/screens/support.js (Part 2 of 3)
 */

  const handleSupportScreenRouting = (targetDestinationKey) => {
    // Navigates securely down to the target subsystem file route path parameter
    console.log(`Wiring target pipeline resolution node -> ${targetDestinationKey}`);
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
          <CustomIcon name="shield-check" size={24} color={SUPPORT_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={() => navigation?.goBack()}>
            <CustomIcon name="arrow-left" size={18} color={SUPPORT_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.supportLabelHeading}>RESOLUTION DESK</Text>
            <Text style={styles.supportTitleText}>Customer Support</Text>
          </View>
        </View>

        {/* Dynamic Navigational Menu Tree Matrix Viewport */}
        <ScrollView style={{ flex: 1, marginTop: 10 }} showsVerticalScrollIndicator={false}>
          <View style={styles.menuItemsBlockWrapper}>
            {SUPPORT_ROUTING_OPTIONS.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.menuRowItemPillButton}
                activeOpacity={0.8}
                onPress={() => handleSupportScreenRouting(option.targetScreen)}
              >
                <View style={styles.itemContentGroupLeft}>
                  <View style={styles.menuIconWrapperCircle}>
                    <CustomIcon name={option.vectorIcon} size={16} color={SUPPORT_COLORS.textDark} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.menuItemTitleLabel}>{option.title}</Text>
                    <Text style={styles.menuItemDetailCopy}>{option.detail}</Text>
                  </View>
                </View>
                <Text style={styles.menuCaratSymbolIndicator}>▾</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Verification Compliance Space Padding */}
          <View style={{ height: insets.bottom + 30 }} />
        </ScrollView>

      </Animated.View>
    </View>
  );
}
/**
 * Buza Food Delivery Mobile Application
 * Core Master Resolution Support Center & Sub-screen Wiring Hub
 * File: src/screens/support.js (Part 3 of 3)
 */

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: SUPPORT_COLORS.background },
  viewportWorkspace: { flex: 1 },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: SUPPORT_COLORS.borderLine, paddingHorizontal: 24 },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: SUPPORT_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SUPPORT_COLORS.borderLine },
  supportLabelHeading: { fontSize: 9, fontWeight: '800', color: SUPPORT_COLORS.textMuted, letterSpacing: 0.5 },
  supportTitleText: { fontSize: 14, fontWeight: '800', color: SUPPORT_COLORS.textDark, marginTop: 2 },

  // Vertical Navigation Row Component Selectors (100% Circular Formats)
  menuItemsBlockWrapper: { width: '100%', paddingHorizontal: 16, gap: 10, marginTop: 12 },
  menuRowItemPillButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 64, borderRadius: 32, backgroundColor: SUPPORT_COLORS.surfaceLight, borderWidth: 1, borderColor: SUPPORT_COLORS.borderLine, paddingHorizontal: 16, paddingVertical: 10 },
  itemContentGroupLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIconWrapperCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SUPPORT_COLORS.borderLine, marginRight: 12 },
  menuItemTitleLabel: { fontSize: 14, fontWeight: '800', color: SUPPORT_COLORS.textDark },
  menuItemDetailCopy: { fontSize: 11, fontWeight: '500', color: SUPPORT_COLORS.textMuted, marginTop: 2 },
  menuCaratSymbolIndicator: { fontSize: 14, color: SUPPORT_COLORS.textMuted, fontWeight: '700', transform: [{ rotate: '-90deg' }] }
});
