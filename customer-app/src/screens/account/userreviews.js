/**
 * Buza Food Delivery Mobile Application
 * Core Customer Historical Feedback Logs & Ratings Feed View
 * File: src/screens/userreview.js (Part 1 of 3)
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

const REVIEW_FEED_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  starActive: '#C5A059'
};

const MOCK_HISTORICAL_REVIEWS = [
  { id: '1', vendorName: 'Buza Grill House', orderDate: '08 Aug 2026', rating: 5, feedbackText: 'The crispy premium chicken burger was delivered perfectly warm. Crisp layout, highly recommended.' },
  { id: '2', vendorName: 'Fresh Drinks & Shakes Bar', orderDate: '02 Aug 2026', rating: 4, feedbackText: 'Excellent tropical smoothie taste profile. Delivery was fast but box seal was tight.' },
  { id: '3', vendorName: 'Buza Grill House', orderDate: '24 Jul 2026', rating: 5, feedbackText: 'Consistent flavor metrics and speedy destination route execution.' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Customer Historical Feedback Logs & Ratings Feed View
 * File: src/screens/userreview.js (Part 2 of 3)
 */

export default function UserReviewHistoryScreen({ onBackRoutePress }) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core State Directories Controllers ---
  const [reviewHistory, setReviewHistory] = useState(MOCK_HISTORICAL_REVIEWS);

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

  const renderReviewItemCard = ({ item }) => (
    <View style={styles.reviewRoundCardFrame}>
      <View style={[styles.rowSpaceBetween, { marginBottom: 8 }]}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.vendorNameTitleText}>{item.vendorName}</Text>
          <Text style={styles.orderDateSubtitleText}>Fulfillment Date: {item.orderDate}</Text>
        </View>
        
        {/* 100% Round Badge Displaying Numeric Score Metric */}
        <View style={styles.scoreBadgeCircle}>
          <CustomIcon name="star" size={10} color={REVIEW_FEED_COLORS.starActive} style={{ marginRight: 3 }} />
          <Text style={styles.scoreBadgeValueText}>{item.rating}</Text>
        </View>
      </View>
      
      <Text style={styles.feedbackLogCommentText}>{item.feedbackText}</Text>
    </View>
  );
/**
 * Buza Food Delivery Mobile Application
 * Core Customer Historical Feedback Logs & Ratings Feed View
 * File: src/screens/userreview.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="star" size={24} color={REVIEW_FEED_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onBackRoutePress}>
            <CustomIcon name="arrow-left" size={18} color={REVIEW_FEED_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.historyLabelHeading}>ACCOUNT REVIEWS</Text>
            <Text style={styles.historyTitleText}>My Feedback Logs</Text>
          </View>
        </View>

        {/* Feedback Timeline Entries Stream Loop Container */}
        <FlatList
          data={reviewHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderReviewItemCard}
          contentContainerStyle={styles.scrollContentLayout}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyStateBox}>
              <Text style={styles.emptyStateHeading}>No Reviews Registered</Text>
              <Text style={styles.emptyStateCopy}>Your history log contains zero entries. Complete completed order processes to register platform experience evaluations.</Text>
            </View>
          }
        />

        {/* Action Panel Lower Controls (100% Circular Navigation Return Button) */}
        <TouchableOpacity style={styles.primaryBackActionButtonPill} activeOpacity={0.85} onPress={onBackRoutePress}>
          <Text style={styles.primaryActionButtonText}>Return to Account Hub</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: REVIEW_FEED_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: REVIEW_FEED_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: REVIEW_FEED_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: REVIEW_FEED_COLORS.borderLine },
  historyLabelHeading: { fontSize: 9, fontWeight: '800', color: REVIEW_FEED_COLORS.textMuted, letterSpacing: 0.5 },
  historyTitleText: { fontSize: 14, fontWeight: '800', color: REVIEW_FEED_COLORS.textDark, marginTop: 2 },

  // Scroll Content Feedback Timeline Cards
  scrollContentLayout: { paddingVertical: 14, width: '100%' },
  reviewRoundCardFrame: { width: '100%', backgroundColor: REVIEW_FEED_COLORS.surfaceLight, borderRadius: 20, borderWidth: 1, borderColor: REVIEW_FEED_COLORS.borderLine, padding: 16, marginBottom: 12 },
  vendorNameTitleText: { fontSize: 15, fontWeight: '800', color: REVIEW_FEED_COLORS.textDark },
  orderDateSubtitleText: { fontSize: 11, fontWeight: '600', color: REVIEW_FEED_COLORS.textMuted, marginTop: 2 },
  feedbackLogCommentText: { fontSize: 13, fontWeight: '500', color: REVIEW_FEED_COLORS.textMuted, lineHeight: 20, marginTop: 6 },
  
  // 100% Round Score Badge Rings
  scoreBadgeCircle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: REVIEW_FEED_COLORS.borderLine },
  scoreBadgeValueText: { fontSize: 12, fontWeight: '800', color: REVIEW_FEED_COLORS.textDark },

  // Empty State Presentation Styles
  emptyStateBox: { width: '100%', alignItems: 'center', paddingVertical: 64, paddingHorizontal: 16 },
  emptyStateHeading: { fontSize: 16, fontWeight: '800', color: REVIEW_FEED_COLORS.textDark },
  emptyStateCopy: { fontSize: 13, fontWeight: '500', color: REVIEW_FEED_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // 100% Round Call-To-Action Controls
  primaryBackActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: REVIEW_FEED_COLORS.textDark, alignItems: 'center', justifyContent: 'center', shadowColor: REVIEW_FEED_COLORS.textDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }
});
