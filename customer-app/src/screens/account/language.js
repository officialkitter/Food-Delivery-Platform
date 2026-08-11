/**
 * Buza Food Delivery Mobile Application
 * Core Regional Language Preference & Localization Selection Hub
 * File: src/screens/language.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const LANG_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964'
};

const LANGUAGE_PRESETS = [
  { id: 'en', name: 'English', nativeName: 'UK & US Standard', indicatorCode: 'EN' },
  { id: 'sw', name: 'Kiswahili', nativeName: 'Afrika Mashariki', indicatorCode: 'SW' },
  { id: 'fr', name: 'Français', nativeName: 'Standard Européen', indicatorCode: 'FR' },
  { id: 'es', name: 'Español', nativeName: 'Castellano Tradicional', indicatorCode: 'ES' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Regional Language Preference & Localization Selection Hub
 * File: src/screens/language.js (Part 2 of 3)
 */

export default function LanguageScreen({
  currentLanguageId = 'en',
  onLanguageConfirmedChange,
  onAbortSelectionPress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core Configuration States ---
  const [selectedLanguageId, setSelectedLanguageId] = useState(currentLanguageId);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Animation Vector Streams ---
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

  const handleLanguageUpdateSave = () => {
    if (!selectedLanguageId) return;
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      onLanguageConfirmedChange?.(selectedLanguageId);
    }, 1200);
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Regional Language Preference & Localization Selection Hub
 * File: src/screens/language.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="service" size={24} color={LANG_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onAbortSelectionPress}>
            <CustomIcon name="arrow-left" size={18} color={LANG_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.localizationLabelHeading}>LOCALIZATION</Text>
            <Text style={styles.localizationTitleText}>App Language</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* Top Informational Header Framework */}
          <View style={styles.centralHeaderPromptWorkspace}>
            <View style={styles.globeIconCircle}>
              <CustomIcon name="service" size={28} color={LANG_COLORS.primary} />
            </View>
            <Text style={styles.mainVerificationPrompt}>Select Language</Text>
            <Text style={styles.instructionContextCopy}>Configure your preferred marketplace interface dialect settings to translate navigation systems, copy texts, and receipt balances.</Text>
          </View>

          {/* Vertical Stacked Selection List (100% Round Item Pill Wrappers) */}
          <View style={styles.languageSelectorVerticalStack}>
            {LANGUAGE_PRESETS.map((language) => {
              const isChosen = selectedLanguageId === language.id;
              return (
                <TouchableOpacity
                  key={language.id}
                  style={[styles.languageRoundRowPill, isChosen && styles.languageRoundRowPillActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedLanguageId(language.id)}
                >
                  <View style={styles.languageContentGroupLeft}>
                    <View style={styles.indicatorWrapperCircle}>
                      <Text style={[styles.indicatorCodeText, isChosen && { color: LANG_COLORS.textDark }]}>
                        {language.indicatorCode}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.languageNameLabel, isChosen && { color: '#FFFFFF' }]}>{language.name}</Text>
                      <Text style={[styles.languageNativeLabel, isChosen && { color: 'rgba(255,255,255,0.6)' }]}>{language.nativeName}</Text>
                    </View>
                  </View>
                  <View style={[styles.radioCircleOuter, isChosen && { borderColor: '#FFFFFF' }]}>
                    {isChosen && <View style={styles.radioCircleInnerCore} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Verification Compliance Footer Line */}
          <View style={styles.complianceRibbonRow}>
            <CustomIcon name="shield-check" size={12} color={LANG_COLORS.successGreen} style={{ marginRight: 6 }} />
            <Text style={styles.complianceTextCopy}>Dynamic translation modules auto-reload on confirmation</Text>
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Layout Save Trigger Key) */}
        <TouchableOpacity 
          style={[styles.primarySaveActionButtonPill, (isUpdating || !selectedLanguageId) && { opacity: 0.5 }]} 
          activeOpacity={0.85} 
          onPress={handleLanguageUpdateSave}
          disabled={isUpdating || !selectedLanguageId}
        >
          <Text style={styles.primaryActionButtonText}>
            {isUpdating ? "Applying Linguistic Settings..." : "Save Language Preferences"}
          </Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: LANG_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: LANG_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: LANG_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: LANG_COLORS.borderLine },
  localizationLabelHeading: { fontSize: 9, fontWeight: '800', color: LANG_COLORS.textMuted, letterSpacing: 0.5 },
  localizationTitleText: { fontSize: 14, fontWeight: '800', color: LANG_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  scrollContentLayout: { paddingVertical: 10, alignItems: 'center', width: '100%' },
  centralHeaderPromptWorkspace: { width: '100%', alignItems: 'center', marginVertical: 12, paddingHorizontal: 4 },
  globeIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: LANG_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: LANG_COLORS.borderLine, marginBottom: 14 },
  mainVerificationPrompt: { fontSize: 20, fontWeight: '900', color: LANG_COLORS.textDark, letterSpacing: -0.2 },
  instructionContextCopy: { fontSize: 13, fontWeight: '500', color: LANG_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // Vertical Selector Item Row Structures (100% Spherical Borders)
  languageSelectorVerticalStack: { width: '100%', gap: 10, marginTop: 12 },
  languageRoundRowPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 64, borderRadius: 32, backgroundColor: LANG_COLORS.surfaceLight, borderWidth: 1, borderColor: LANG_COLORS.borderLine, paddingHorizontal: 16, paddingVertical: 10 },
  languageRoundRowPillActive: { backgroundColor: LANG_COLORS.textDark, borderColor: LANG_COLORS.textDark },
  languageContentGroupLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  indicatorWrapperCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: LANG_COLORS.borderLine, marginRight: 12 },
  indicatorCodeText: { fontSize: 11, fontWeight: '800', color: LANG_COLORS.textMuted },
  languageNameLabel: { fontSize: 14, fontWeight: '800', color: LANG_COLORS.textDark },
  languageNativeLabel: { fontSize: 11, fontWeight: '500', color: LANG_COLORS.textMuted, marginTop: 2 },
  
  // Custom Radio Buttons (100% Round Framework Circles)
  radioCircleOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: LANG_COLORS.borderLine, alignItems: 'center', justifyContent: 'center' },
  radioCircleInnerCore: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' },

  // Compliance Layout Line
  complianceRibbonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 24 },
  complianceTextCopy: { fontSize: 11, fontWeight: '700', color: LANG_COLORS.textMuted },

  // 100% Circular Primary Save Action Pill Key
  primarySaveActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: LANG_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: LANG_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }
});
