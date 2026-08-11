/**
 * Buza Food Delivery Mobile Application
 * Core Account Capital Wallet & Transaction Ledger Summary View
 * File: src/screens/wallet.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const WALLET_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  cardGradient: '#1A363A', creditGreen: '#4CD964'
};

const MOCK_TRANSACTIONS = [
  { id: '1', title: 'Buza Grill House Order', date: '08 Aug 2026', amount: '-$10.50', type: 'debit' },
  { id: '2', title: 'Wallet Balance Top Up', date: '05 Aug 2026', amount: '+$25.00', type: 'credit' },
  { id: '3', title: 'Drinks & Shakes Purchase', date: '02 Aug 2026', amount: '-$4.20', type: 'debit' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Account Capital Wallet & Transaction Ledger Summary View
 * File: src/screens/wallet.js (Part 2 of 3)
 */

export default function WalletScreen({
  creditBalanceAmount = 45.30,
  cardNumberMask = '•••• •••• •••• 8841',
  onTopUpBalancePress,
  onBackRoutePress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core State Directories Controllers ---
  const [transactionLedger, setTransactionLedger] = useState(MOCK_TRANSACTIONS);

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

  const renderLedgerItemCard = ({ item }) => {
    const isCredit = item.type === 'credit';
    return (
      <View style={styles.ledgerRoundRowPill}>
        <View style={styles.providerIconWrapperCircle}>
          <CustomIcon name={isCredit ? "plus" : "cart"} size={14} color={WALLET_COLORS.textDark} />
        </View>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.ledgerItemTitleLabel}>{item.title}</Text>
          <Text style={styles.ledgerItemDetailCopy}>{item.date}</Text>
        </View>
        <Text style={[styles.ledgerAmountText, isCredit ? { color: WALLET_COLORS.creditGreen } : { color: WALLET_COLORS.textDark }]}>
          {item.amount}
        </Text>
      </View>
    );
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Account Capital Wallet & Transaction Ledger Summary View
 * File: src/screens/wallet.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="cart" size={24} color={WALLET_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onBackRoutePress}>
            <CustomIcon name="arrow-left" size={18} color={WALLET_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.walletLabelHeading}>DIGITAL CAPITAL</Text>
            <Text style={styles.walletTitleText}>My Wallet</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1, marginTop: 10 }} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* High-Fidelity Skeuomorphic Virtual Digital Debit Card Display */}
          <View style={styles.virtualCardFrame}>
            <View style={styles.rowSpaceBetween}>
              <CustomIcon name="shield-check" size={24} color="#FFFFFF" />
              <Text style={styles.virtualCardVendorLabel}>BUZA DIGITAL WALLET</Text>
            </View>
            <Text style={styles.creditBalanceValueText}>
              ${creditBalanceAmount.toFixed(2)}
            </Text>
            <View style={[styles.rowSpaceBetween, { marginTop: 'auto' }]}>
              <View>
                <Text style={styles.virtualCardMetaTitle}>ACCOUNT BALANCE</Text>
                <Text style={styles.virtualCardMetaValue} numberOfLines={1}>ACTIVE CREDITS</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.virtualCardMetaTitle}>MAPPED CARD</Text>
                <Text style={styles.virtualCardMetaValue}>{cardNumberMask}</Text>
              </View>
            </View>
          </View>

          {/* Transaction History Section Header */}
          <View style={{ width: '100%', paddingHorizontal: 4, marginTop: 10, marginBottom: 4 }}>
            <Text style={styles.sectionHeadingText}>Transaction Ledger History</Text>
          </View>

          {/* Ledger FlatList Implementation Inside ScrollView Engine via mapping array rows */}
          <View style={{ width: '100%' }}>
            {transactionLedger.map((item) => (
              <View key={item.id}>
                {renderLedgerItemCard({ item })}
              </View>
            ))}
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Top Up Execution Trigger Key) */}
        <TouchableOpacity style={styles.primaryAddActionButtonPill} activeOpacity={0.85} onPress={onTopUpBalancePress}>
          <CustomIcon name="plus" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryActionButtonText}>Top Up Account Credit Balance</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: WALLET_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: WALLET_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: WALLET_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: WALLET_COLORS.borderLine },
  walletLabelHeading: { fontSize: 9, fontWeight: '800', color: WALLET_COLORS.textMuted, letterSpacing: 0.5 },
  walletTitleText: { fontSize: 14, fontWeight: '800', color: WALLET_COLORS.textDark, marginTop: 2 },

  // Virtual Card Presentation Frame
  virtualCardFrame: { width: '100%', height: 180, backgroundColor: WALLET_COLORS.cardGradient, borderRadius: 20, padding: 20, shadowColor: WALLET_COLORS.textDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4, marginVertical: 14 },
  virtualCardVendorLabel: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  creditBalanceValueText: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', letterSpacing: -0.5, marginTop: 24 },
  virtualCardMetaTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  virtualCardMetaValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', maxWidth: DEVICE_WIDTH * 0.45 },

  // Vertical Ledger List Item Rows Component Framework (100% Round Pills)
  sectionHeadingText: { fontSize: 14, fontWeight: '800', color: WALLET_COLORS.textDark, letterSpacing: -0.1 },
  ledgerRoundRowPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 60, borderRadius: 30, backgroundColor: WALLET_COLORS.surfaceLight, borderWidth: 1, borderColor: WALLET_COLORS.borderLine, paddingHorizontal: 16, marginBottom: 10 },
  providerIconWrapperCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: WALLET_COLORS.borderLine, marginRight: 12 },
  ledgerItemTitleLabel: { fontSize: 13, fontWeight: '800', color: WALLET_COLORS.textDark },
  ledgerItemDetailCopy: { fontSize: 11, fontWeight: '500', color: WALLET_COLORS.textMuted, marginTop: 1 },
  ledgerAmountText: { fontSize: 14, fontWeight: '800', letterSpacing: -0.1 },

  // 100% Circular Primary Top Up Action Pill Key
  primaryAddActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: WALLET_COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: WALLET_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4, marginTop: 12 }
});
