/**
 * Buza Food Delivery Mobile Application
 * Core Operational Knowledge Base & Accordion FAQ Interface View
 * File: src/screens/FAQ.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ScrollView, LayoutAnimation, Platform, UIManager
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2'
};

const FAQ_KNOWLEDGE_BASE = [
  { id: '1', question: 'How is free delivery calculated on the platform?', answer: 'Free delivery status is dynamically configured based on individual local vendor campaigns. Proximity zones matching active promo partner criteria qualify automatically during checkout pipelines.', category: 'orders' },
  { id: '2', question: 'What payment routing channels are securely supported?', answer: 'The application enforces standard PCI-DSS compliant handshakes supporting end-to-end encrypted Credit/Debit card processors, localized mobile money banking STK push layers, and external digital wallets.', category: 'payment' },
  { id: '3', question: 'How do I track active shipment fulfillments in realtime?', answer: 'Upon successful transaction settlement, the dispatch monitoring screen opens a direct route map visualizer tracking driver coordinates alongside a vertical milestone progression check tracker.', category: 'delivery' },
  { id: '4', question: 'Can I directly communicate text messages with my driver?', answer: 'Yes. Secure, direct direct messaging text cells are initialized directly inside the driver interface dashboard wrapper, allowing encrypted text coordinates exchange without leaking user phone identities.', category: 'delivery' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Operational Knowledge Base & Accordion FAQ Interface View
 * File: src/screens/FAQ.js (Part 2 of 3)
 */

export default function FAQScreen({ onBackRoutePress }) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core State Controllers ---
  const [activeExpandedId, setActiveExpandedId] = useState(null);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('all');

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

  const toggleAccordionSection = (targetId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveExpandedId(activeExpandedId === targetId ? null : targetId);
  };

  const filteredKnowledgeBase = selectedFilterCategory === 'all'
    ? FAQ_KNOWLEDGE_BASE
    : FAQ_KNOWLEDGE_BASE.filter(item => item.category === selectedFilterCategory);
/**
 * Buza Food Delivery Mobile Application
 * Core Operational Knowledge Base & Accordion FAQ Interface View
 * File: src/screens/FAQ.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '80%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="shield-check" size={24} color={FAQ_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onBackRoutePress}>
            <CustomIcon name="arrow-left" size={18} color={FAQ_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.faqLabelHeading}>HELP CENTER</Text>
            <Text style={styles.faqTitleText}>Knowledge Base</Text>
          </View>
        </View>

        {/* Horizontal Category Filtering Sliders (100% Round Buttons) */}
        <View style={styles.filterSliderContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {['all', 'orders', 'payment', 'delivery'].map((category) => {
              const isChosen = selectedFilterCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryFilterPillButton, isChosen && styles.categoryFilterPillButtonActive]}
                  activeOpacity={0.8}
                  onPress={() => { setSelectedFilterCategory(category); setActiveExpandedId(null); }}
                >
                  <Text style={[styles.categoryFilterLabelText, isChosen && { color: '#FFFFFF' }]}>
                    {category.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Core Accordion View List Feed */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
          {filteredKnowledgeBase.map((item) => {
            const isOpen = activeExpandedId === item.id;
            return (
              <View key={item.id} style={styles.accordionContainerCard}>
                <TouchableOpacity
                  style={styles.accordionHeaderTriggerRow}
                  activeOpacity={0.85}
                  onPress={() => toggleAccordionSection(item.id)}
                >
                  <Text style={styles.questionTextHeadline}>{item.question}</Text>
                  <View style={[styles.caratCircleIndicator, isOpen && { transform: [{ rotate: '180deg' }] }]}>
                    <Text style={styles.caratSymbolText}>▾</Text>
                  </View>
                </TouchableOpacity>
                
                {isOpen && (
                  <View style={styles.accordionContentExpandedBody}>
                    <Text style={styles.answerTextCopy}>{item.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: FAQ_COLORS.background },
  viewportWorkspace: { flex: 1 },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: FAQ_COLORS.borderLine, paddingHorizontal: 24 },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: FAQ_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: FAQ_COLORS.borderLine },
  faqLabelHeading: { fontSize: 9, fontWeight: '800', color: FAQ_COLORS.textMuted, letterSpacing: 0.5 },
  faqTitleText: { fontSize: 14, fontWeight: '800', color: FAQ_COLORS.textDark, marginTop: 2 },

  // Horizontal Quick Filters Slider Matrix Layout Rules
  filterSliderContainer: { marginVertical: 14, height: 38, width: '100%' },
  categoryFilterPillButton: { paddingHorizontal: 16, height: 36, borderRadius: 18, backgroundColor: FAQ_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: FAQ_COLORS.borderLine, marginRight: 8 },
  categoryFilterPillButtonActive: { backgroundColor: FAQ_COLORS.textDark, borderColor: FAQ_COLORS.textDark },
  categoryFilterLabelText: { fontSize: 11, fontWeight: '800', color: FAQ_COLORS.textDark, letterSpacing: 0.5 },

  // Accordion Expandable Structure Framing Layout Rules
  accordionContainerCard: { width: '100%', backgroundColor: FAQ_COLORS.surfaceLight, borderRadius: 16, borderWidth: 1, borderColor: FAQ_COLORS.borderLine, marginBottom: 12, overflow: 'hidden' },
  accordionHeaderTriggerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, width: '100%' },
  questionTextHeadline: { fontSize: 14, fontWeight: '800', color: FAQ_COLORS.textDark, flex: 1, paddingRight: 12, lineHeight: 20 },
  caratCircleIndicator: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: FAQ_COLORS.borderLine },
  caratSymbolText: { fontSize: 12, color: FAQ_COLORS.textMuted, fontWeight: '700' },
  accordionContentExpandedBody: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 2, borderTopWidth: 1, borderTopColor: FAQ_COLORS.borderLine },
  answerTextCopy: { fontSize: 13, fontWeight: '500', color: FAQ_COLORS.textMuted, lineHeight: 20 }
});
