/**
 * Buza Food Delivery Mobile Application
 * Core Delivery Address Registration & Geolocation Intake View
 * File: src/screens/addaddress.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, TextInput, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const ADDRESS_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964'
};

const LOCATION_TAGS = [
  { id: 'home', title: 'Home', icon: 'home' },
  { id: 'work', title: 'Work', icon: 'service' },
  { id: 'other', title: 'Other', icon: 'map-pin' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Delivery Address Registration & Geolocation Intake View
 * File: src/screens/addaddress.js (Part 2 of 3)
 */

export default function AddAddressScreen({
  onAddressSavedCallback,
  onAbortRegistrationPress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core Intake Field States ---
  const [streetAddress, setStreetAddress] = useState('');
  const [apartmentUnit, setApartmentUnit] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [selectedTagId, setSelectedTagId] = useState('home');
  const [isSaving, setIsSaving] = useState(false);

  // --- Animation Vector Channels ---
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

  const handleSaveAddressSubmission = () => {
    if (streetAddress.trim().length === 0) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onAddressSavedCallback?.({
        street: streetAddress.trim(),
        unit: apartmentUnit.trim(),
        instructions: deliveryInstructions.trim(),
        tag: selectedTagId
      });
    }, 1400);
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Delivery Address Registration & Geolocation Intake View
 * File: src/screens/addaddress.js (Part 3 of 3)
 */

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="map-pin" size={24} color={ADDRESS_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onAbortRegistrationPress}>
            <CustomIcon name="arrow-left" size={18} color={ADDRESS_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.addressLabelHeading}>ADD NEW DESTINATION</Text>
            <Text style={styles.addressTitleText}>Address Details</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* Main Informational Icon Badge Header */}
          <View style={styles.centralHeaderPromptWorkspace}>
            <View style={styles.mapIconCircle}>
              <CustomIcon name="map-pin" size={28} color={ADDRESS_COLORS.primary} />
            </View>
            <Text style={styles.mainPromptTitle}>Register Coordinates</Text>
            <Text style={styles.instructionContextCopy}>Input your explicit building descriptors and landmark directions to streamline courier route execution metrics.</Text>
          </View>

          {/* Secure Coordinate Intakes Fields Matrix (100% Circular Pills) */}
          <View style={styles.inputContainerMatrix}>
            <View style={styles.pillInputFieldWrapper}>
              <CustomIcon name="nearby" size={16} color={ADDRESS_COLORS.textMuted} style={{ marginRight: 12 }} />
              <TextInput style={styles.textInputFieldNode} placeholder="Street Address, Building Name" placeholderTextColor={ADDRESS_COLORS.textMuted + '70'} value={streetAddress} onChangeText={setStreetAddress} />
            </View>

            <View style={styles.pillInputFieldWrapper}>
              <CustomIcon name="service" size={16} color={ADDRESS_COLORS.textMuted} style={{ marginRight: 12 }} />
              <TextInput style={styles.textInputFieldNode} placeholder="Apartment, Suite, Unit Number (Optional)" placeholderTextColor={ADDRESS_COLORS.textMuted + '70'} value={apartmentUnit} onChangeText={setApartmentUnit} />
            </View>

            <View style={[styles.pillInputFieldWrapper, { height: 80, borderRadius: 16, alignItems: 'flex-start', paddingTop: 12 }]}>
              <CustomIcon name="message" size={16} color={ADDRESS_COLORS.textMuted} style={{ marginRight: 12, marginTop: 2 }} />
              <TextInput style={[styles.textInputFieldNode, { textAlignVertical: 'top' }]} placeholder="Drop-off Notes (e.g. Leave with security desk)" placeholderTextColor={ADDRESS_COLORS.textMuted + '70'} value={deliveryInstructions} onChangeText={setDeliveryInstructions} multiline numberOfLines={3} />
            </View>
          </View>

          {/* Horizontal Profile Classification Selection Grid Row (100% Round Option Rings) */}
          <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 4 }}>
            <Text style={styles.sectionHeadingText}>Label Destination As</Text>
            <View style={styles.tagOptionsMatrixRow}>
              {LOCATION_TAGS.map((tag) => {
                const isChosen = selectedTagId === tag.id;
                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={[styles.tagCircleKey, isChosen && styles.tagCircleActive]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedTagId(tag.id)}
                  >
                    <CustomIcon name={tag.icon} size={16} color={isChosen ? '#FFFFFF' : ADDRESS_COLORS.textDark} style={{ marginBottom: 4 }} />
                    <Text style={[styles.tagCircleLabelText, isChosen && { color: '#FFFFFF' }]}>{tag.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Address Registration Trigger Key) */}
        <TouchableOpacity 
          style={[styles.primaryPaymentActionButtonPill, (isSaving || streetAddress.trim().length === 0) && { opacity: 0.5 }]} 
          activeOpacity={0.85} 
          onPress={handleSaveAddressSubmission}
          disabled={isSaving || streetAddress.trim().length === 0}
        >
          <Text style={styles.primaryActionButtonText}>
            {isSaving ? "Saving Location Parameters..." : "Verify and Save Delivery Address"}
          </Text>
        </TouchableOpacity>

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: ADDRESS_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: ADDRESS_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: ADDRESS_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ADDRESS_COLORS.borderLine },
  addressLabelHeading: { fontSize: 9, fontWeight: '800', color: ADDRESS_COLORS.textMuted, letterSpacing: 0.5 },
  addressTitleText: { fontSize: 14, fontWeight: '800', color: ADDRESS_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  scrollContentLayout: { paddingVertical: 10, alignItems: 'center', width: '100%' },
  centralHeaderPromptWorkspace: { width: '100%', alignItems: 'center', marginVertical: 12, paddingHorizontal: 4 },
  mapIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: ADDRESS_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ADDRESS_COLORS.borderLine, marginBottom: 14 },
  mainPromptTitle: { fontSize: 20, fontWeight: '900', color: ADDRESS_COLORS.textDark, letterSpacing: -0.2 },
  instructionContextCopy: { fontSize: 13, fontWeight: '500', color: ADDRESS_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // Intake Input Field Matrices (100% Circular Pills)
  inputContainerMatrix: { width: '100%', gap: 12, marginTop: 12 },
  pillInputFieldWrapper: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24, backgroundColor: ADDRESS_COLORS.surfaceLight, borderWidth: 1, borderColor: ADDRESS_COLORS.borderLine, paddingHorizontal: 16 },
  textInputFieldNode: { flex: 1, fontSize: 14, color: ADDRESS_COLORS.textDark, fontWeight: '600', padding: 0 },

  // 100% Spherical Label Presets Alignment Matrix
  sectionHeadingText: { fontSize: 13, fontWeight: '800', color: ADDRESS_COLORS.textDark, marginBottom: 10, letterSpacing: 0.2 },
  tagOptionsMatrixRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  tagCircleKey: { width: '31%', height: 64, borderRadius: 16, backgroundColor: ADDRESS_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ADDRESS_COLORS.borderLine },
  tagCircleActive: { backgroundColor: ADDRESS_COLORS.textDark, borderColor: ADDRESS_COLORS.textDark },
  tagCircleLabelText: { fontSize: 12, fontWeight: '700', color: ADDRESS_COLORS.textDark },

  // 100% Circular Primary Call-To-Action Pill Key
  primaryPaymentActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: ADDRESS_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: ADDRESS_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }
});
