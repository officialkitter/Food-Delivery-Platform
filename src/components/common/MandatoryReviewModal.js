// src/components/MandatoryReviewModal.js
import React, { useState } from 'react';
import propTypes from 'prop-types';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';

// Import high-contrast scaleable vector star directly
import { Star } from 'lucide-react-native';

export default function MandatoryReviewModal({ visible, orderId, vendorName, activeTheme, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitReviewPayload = () => {
    if (rating === 0) {
      Alert.alert("Verification Locked", "Please select a star value before closing this verification gate.");
      return;
    }
    // Fires evaluation tokens straight back to your universal app hooks
    onReviewSubmitted({ orderId, rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.darkScrimOverlay}>
        <View style={[styles.modalCard, { backgroundColor: activeTheme.surface, borderColor: activeTheme.border }]}>
          
          <Text style={[styles.lockBadgeText, { color: activeTheme.primary }]}>DELIVERY VERIFICATION LOCKED</Text>
          <Text style={[styles.headlineText, { color: activeTheme.text }]}>Evaluate Your Experience</Text>
          
          <Text style={[styles.descText, { color: activeTheme.muted }]}>
            To protect our marketplace standard, please rate your order from {vendorName || 'Previous Kitchen'}.
          </Text>

          {/* Clean 1-to-5 Architectural Star Row Picker */}
          <View style={styles.starClusterRow}>
            {[1, 2, 3, 4, 5].map((index) => {
              const isSelected = rating >= index;
              return (
                <TouchableOpacity key={`star-${index}`} onPress={() => setRating(index)} style={styles.starCell}>
                  <Star 
                    size={28} 
                    color={isSelected ? activeTheme.primary : activeTheme.muted} 
                    fill={isSelected ? activeTheme.primary : 'transparent'}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Professional Text Input Block */}
          <TextInput
            style={[styles.feedbackInputField, { color: activeTheme.text, borderColor: activeTheme.border, backgroundColor: activeTheme.background }]}
            placeholder="Provide architectural taste or logistics notes (Optional)..."
            placeholderTextColor={activeTheme.muted}
            multiline
            numberOfLines={3}
            value={comment}
            onChangeText={setComment}
          />

          {/* Rigid Action Block */}
          <TouchableOpacity 
            style={[styles.executionButton, { backgroundColor: activeTheme.primary }]}
            onPress={submitReviewPayload}
          >
            <Text style={[styles.executionText, { color: activeTheme.background }]}>SUBMIT VERIFICATION DISPATCH</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

MandatoryReviewModal.propTypes = {
  visible: propTypes.bool.isRequired,
  orderId: propTypes.oneOfType([propTypes.string, propTypes.number]),
  vendorName: propTypes.string,
  activeTheme: propTypes.shape({
    surface: propTypes.string,
    border: propTypes.string,
    primary: propTypes.string,
    text: propTypes.string,
    muted: propTypes.string,
    background: propTypes.string,
  }).isRequired,
  onReviewSubmitted: propTypes.func.isRequired,
};

const styles = StyleSheet.create({
  // Structured with crisp single-line alignment profiles to match platform guidelines
  darkScrimOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.65)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', borderRadius: 24, borderWidth: 1, padding: 24, alignItems: 'center', shadowColor: '#000000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 15, elevation: 12 },
  lockBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
  headlineText: { fontSize: 20, fontWeight: 'bold', marginBottom: 6, letterSpacing: 0 },
  descText: { fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 20, paddingHorizontal: 10 },
  starClusterRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  starCell: { marginHorizontal: 6 },
  feedbackInputField: { width: '100%', borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 13, height: 80, textAlignVertical: 'top', marginBottom: 20 },
  executionButton: { width: '100%', paddingVertical: 14, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  executionText: { fontSize: 12, fontWeight: '700', letterSpacing: 1 }
});
