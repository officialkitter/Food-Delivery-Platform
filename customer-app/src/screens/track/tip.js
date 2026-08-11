/**
 * Buza Food Delivery Mobile Application
 * Core Courier Tip Selection & Payment Processing View
 * File: src/screens/tip.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const TIP_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964'
};

const PRESET_TIPS = [
  { id: '1', amount: 1000 },
  { id: '2', amount: 2000 },
  { id: '3', amount: 3000 },
  { id: '4', amount: 5000 }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Courier Tip Selection & Payment Processing View
 * File: src/screens/tip.js (Part 2 of 3)
 */

export default function TipScreen({
  courierName = "Alex K.",
  onProcessTipSubmit,
  onSkipTipPress
}) {
  const insets = useSafeAreaInsets();
  useTheme();

  // --- Core Configuration States ---
  const [selectedPresetId, setSelectedPresetId] = useState('2');
  const [customTipValue, setCustomTipValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

  // --- Animation Refs ---
  const fadeLayoutAnim = useRef(new Animated.Value(0)).current;
  const backgroundDriftY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(fadeLayoutAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();

    // Constant video-style running vector drift loops tracking vertically
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundDriftY, { toValue: -80, duration: 9000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(backgroundDriftY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // Compute final tip currency magnitude from raw user selections
  const activeSelectedPreset = PRESET_TIPS.find(t => t.id === selectedPresetId);
  const hasCustomTipValue = customTipValue.length > 0;
  const parsedCustomTipValue = Number.parseFloat(customTipValue);
  let calculatedTipTotal = activeSelectedPreset ? activeSelectedPreset.amount : 0;
  if (hasCustomTipValue) {
    calculatedTipTotal = Number.isFinite(parsedCustomTipValue) ? parsedCustomTipValue : 0;
  }

  const handleTipSubmission = () => {
    if (calculatedTipTotal <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onProcessTipSubmit?.(calculatedTipTotal);
    }, 1200);
  };
  /**
 * Buza Food Delivery Mobile Application
 * Core Courier Tip Selection & Payment Processing View
 * File: src/screens/tip.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="cart" size={24} color={TIP_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: fadeLayoutAnim }]}>
        
        {/* Navigation Ribbon Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onSkipTipPress}>
            <CustomIcon name="arrow-left" size={18} color={TIP_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.tipTitleLabel}>COURIER GRATUITY</Text>
            <Text style={styles.courierHeadlineText} numberOfLines={1}>{courierName}</Text>
          </View>
        </View>

        {/* Central Gratuity Context Information Card */}
        <View style={styles.centralContextProfileBox}>
          <View style={styles.courierProfileIconCircle}>
            <CustomIcon name="profile" size={32} color={TIP_COLORS.textDark} />
          </View>
          <Text style={styles.mainPromptTitle}>Support Your Driver</Text>
          <Text style={styles.supportingContextCopy}>One hundred percent of tips go directly to {courierName} for exceptional delivery fulfillment service.</Text>
        </View>

        {/* Horizontal Preset Selectors Grid Row (100% Round Option Rings) */}
        <View style={styles.presetOptionsMatrixRow}>
          {PRESET_TIPS.map((preset) => {
            const isChosen = selectedPresetId === preset.id && !customTipValue;
            return (
              <TouchableOpacity
                key={preset.id}
                style={[styles.presetCircleKey, isChosen && styles.presetCircleActive]}
                activeOpacity={0.8}
                onPress={() => { setSelectedPresetId(preset.id); setCustomTipValue(''); }}
              >
                <Text style={[styles.presetCircleLabelText, isChosen && { color: '#FFFFFF' }]}>{formatTZS(preset.amount)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Numerical Value Gratuity Input Entry Zone */}
        <View style={styles.customTipInputWrapperField}>
          <Text style={styles.currencySymbolHeader}>TSh</Text>
          <TextInput
            style={styles.customTipInputField}
            placeholder="Enter custom tip amount..."
            placeholderTextColor={TIP_COLORS.textMuted + '70'}
            keyboardType="numeric"
            value={customTipValue}
            onChangeText={(text) => { setCustomTipValue(text); setSelectedPresetId(''); }}
          />
        </View>

        {/* Action Panel Lower Controls (100% Round Pill Execution Keys) */}
        <View style={styles.lowerActionPanelGroup}>
          <TouchableOpacity 
            style={[styles.primaryActionButtonPill, calculatedTipTotal <= 0 && { opacity: 0.5 }]} 
            activeOpacity={0.85} 
            onPress={handleTipSubmission}
            disabled={calculatedTipTotal <= 0 || isProcessing}
          >
            <Text style={styles.primaryActionButtonText}>
                {isProcessing ? "Authorizing Tip Transaction..." : `Submit Tip Premium ${formatTZS(calculatedTipTotal)}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButtonPill} activeOpacity={0.75} onPress={onSkipTipPress}>
            <Text style={styles.secondaryActionButtonText}>Skip Gratuity Selection</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: TIP_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: TIP_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: TIP_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: TIP_COLORS.borderLine },
  tipTitleLabel: { fontSize: 9, fontWeight: '800', color: TIP_COLORS.textMuted, letterSpacing: 0.5 },
  courierHeadlineText: { fontSize: 14, fontWeight: '800', color: TIP_COLORS.textDark, marginTop: 2, maxWidth: DEVICE_WIDTH * 0.45 },

  // Central Driver Context Framing
  centralContextProfileBox: { width: '100%', alignItems: 'center', paddingHorizontal: 8, marginTop: 10 },
  courierProfileIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: TIP_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: TIP_COLORS.borderLine, marginBottom: 14 },
  mainPromptTitle: { fontSize: 20, fontWeight: '900', color: TIP_COLORS.textDark, letterSpacing: -0.2 },
  supportingContextCopy: { fontSize: 13, fontWeight: '500', color: TIP_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // 100% Spherical Presets Alignment Matrix
  presetOptionsMatrixRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 14 },
  presetCircleKey: { width: 56, height: 56, borderRadius: 28, backgroundColor: TIP_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: TIP_COLORS.borderLine },
  presetCircleActive: { backgroundColor: TIP_COLORS.textDark, borderColor: TIP_COLORS.textDark },
  presetCircleLabelText: { fontSize: 13, fontWeight: '800', color: TIP_COLORS.textDark },

  // Custom Value Entry Wrappers
  customTipInputWrapperField: { flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: 26, backgroundColor: TIP_COLORS.surfaceLight, borderWidth: 1, borderColor: TIP_COLORS.borderLine, paddingHorizontal: 18, width: '100%' },
  currencySymbolHeader: { fontSize: 16, fontWeight: '800', color: TIP_COLORS.textDark, marginRight: 8 },
  customTipInputField: { flex: 1, fontSize: 14, color: TIP_COLORS.textDark, fontWeight: '600', padding: 0 },

  // Lower Action Panel Layout Clusters (100% Round Circle Pill Formats)
  lowerActionPanelGroup: { width: '100%', gap: 10 },
  primaryActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: TIP_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: TIP_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryActionButtonPill: { width: '100%', height: 52, borderRadius: 26, backgroundColor: TIP_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: TIP_COLORS.borderLine },
  secondaryActionButtonText: { color: TIP_COLORS.textDark, fontSize: 14, fontWeight: '700' }
});

