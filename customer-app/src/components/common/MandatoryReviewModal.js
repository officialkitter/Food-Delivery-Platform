/**
 * Buza Food Delivery Mobile Application
 * Mandatory Order Review Rating Gateway Sheet Component
 * src/components/MandatoryReviewModal.js
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
  Easing,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { CustomIcon } from '../common/CustomIcon';

const { width, height } = Dimensions.get('window');

const REVIEW_COLORS = {
  primary: '#FF7F50',       // Salmon brand accent color
  background: '#FFFFFF',    // Primary sheet fill baseline
  textDark: '#052A30',      // High-density Dark Turquoise for headings
  textMuted: '#1E6B7B',     // Soft turquoise for descriptions
  surfaceLight: '#F4FAFA',  // Input container shade fill
  borderLine: '#D1E5E7'     // Separation line divider color
};

export default function MandatoryReviewModal({ visible, orderId, vendorName, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Micro-interaction fluid asset transition parameters
  const scaleSheetAnim = useRef(new Animated.Value(0.85)).current;
  const opacityFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setRating(0);
      setComment('');
      Animated.parallel([
        Animated.timing(opacityFadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(scaleSheetAnim, { toValue: 1, duration: 400, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityFadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleSheetAnim, { toValue: 0.85, duration: 300, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert("Please choose a star rating to share your feedback!");
      return;
    }
    setSubmitting(true);
    
    // Simulate background tracking cloud registry network save handshakes
    setTimeout(() => {
      setSubmitting(false);
      if (onReviewSubmitted) {
        onReviewSubmitted({ orderId, rating, comment });
      }
    }, 1500);
  };
  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* 1. Backdrop Tint Layer */}
      <Animated.View style={[styles.modalBackdrop, { opacity: opacityFadeAnim }]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardContainer}>
          
          {/* 2. Centralized Layout Card Panel Sheet */}
          <Animated.View style={[styles.reviewCardSheet, { transform: [{ scale: scaleSheetAnim }] }]}>
            
            {/* Header Identity Row Blocks */}
            <View style={styles.cardHeaderArea}>
              <View style={styles.success3DIconBadge}>
                <CustomIcon name="checkmark" size={24} />
              </View>
              <Text style={styles.mainHeadingTitle}>Rate Your Last Order</Text>
              <Text style={styles.subtextSupportParagraph}>How was your delivery experience from {"\n"}<Text style={styles.vendorHighlightText}>{vendorName || 'Our Partner Kitchen'}</Text>?</Text>
            </View>

            {/* Interactive Stars Metrics Grid Row Selection */}
            <View style={styles.starsSelectorGroupRow}>
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isSelected = starIndex <= rating;
                return (
                  <TouchableOpacity
                    key={starIndex}
                    activeOpacity={0.7}
                    onPress={() => setRating(starIndex)}
                    style={styles.starTouchCell}
                  >
                    <CustomIcon 
                      name="star" 
                      size={32} 
                      color={isSelected ? '#FFD700' : 'rgba(30, 107, 123, 0.2)'} 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Input Segment Context Fields Section */}
            <View style={styles.inputCommentBlock}>
              <TextInput
                style={styles.textInputCommentNode}
                placeholder="Tell us about the food, drinks or driver delivery tracking... (Optional)"
                placeholderTextColor="rgba(30, 107, 123, 0.4)"
                multiline
                numberOfLines={3}
                value={comment}
                onChangeText={setComment}
                maxLength={140}
                editable={!submitting}
              />
            </View>

            {/* Primary Operation Button Footer Link */}
            <TouchableOpacity 
              style={[styles.primaryActionBtnFrame, submitting && { opacity: 0.6 }]} 
              activeOpacity={0.85}
              onPress={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryActionBtnText}>Submit Feedback</Text>
              )}
            </TouchableOpacity>

          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}
/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix (Compact Single-Row Format)
 */
const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(5, 42, 48, 0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  keyboardContainer: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  reviewCardSheet: { width: '100%', backgroundColor: REVIEW_COLORS.background, borderRadius: 24, padding: 24, shadowColor: '#052A30', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 6, borderWidth: 1, borderColor: REVIEW_COLORS.borderLine },
  cardHeaderArea: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  success3DIconBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#052A30', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, marginBottom: 16, borderWidth: 1, borderColor: REVIEW_COLORS.borderLine },
  mainHeadingTitle: { fontSize: 20, fontWeight: '900', color: REVIEW_COLORS.textDark, marginBottom: 6, letterSpacing: -0.3 },
  subtextSupportParagraph: { fontSize: 13, fontWeight: '600', color: REVIEW_COLORS.textMuted, textAlign: 'center', lineHeight: 18, paddingHorizontal: 8 },
  vendorHighlightText: { color: REVIEW_COLORS.primary, fontWeight: '800' },
  starsSelectorGroupRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 },
  starTouchCell: { padding: 4 },
  inputCommentBlock: { width: '100%', backgroundColor: REVIEW_COLORS.surfaceLight, borderWidth: 1.5, borderColor: REVIEW_COLORS.borderLine, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20, height: 84 },
  textInputCommentNode: { fontSize: 13, color: REVIEW_COLORS.textDark, fontWeight: '600', textAlignVertical: 'top', height: '100%', padding: 0 },
  primaryActionBtnFrame: { width: '100%', height: 50, borderRadius: 25, backgroundColor: REVIEW_COLORS.textDark, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 4 },
  primaryActionBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' }
});
