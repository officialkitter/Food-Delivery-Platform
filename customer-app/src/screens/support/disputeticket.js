/**
 * Buza Food Delivery Mobile Application
 * Secure Offline Dispute Ticket Submission Intake View
 * File: src/screens/disputeticket.js
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Easing, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: TW, height: TH } = Dimensions.get('window');
const C = { primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30', textMuted: '#1E6B7B', surface: '#F7FAFA', border: '#EAF2F2', success: '#4CD964' };

export default function DisputeTicketScreen({ onBackPress, onSubmitSuccess }) {
  const insets = useSafeAreaInsets();
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const driftY = useRef(new Animated.Value(TH)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.loop(Animated.sequence([
        Animated.timing(driftY, { toValue: -80, duration: 9500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(driftY, { toValue: TH, duration: 0, useNativeDriver: true })
      ]))
    ]).start();
  }, []);

  const saveTicket = () => {
    if (!topic.trim() || !details.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert("Ticket Logged", "Dispute file accepted. Case token generated.");
      onSubmitSuccess?.();
    }, 1500);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.drift, { left: '15%', transform: [{ translateY: driftY }] }]}><CustomIcon name="shield-check" size={24} color={C.primary + '15'} /></Animated.View>
      </View>
      <Animated.View style={[styles.workspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={onBackPress}><CustomIcon name="arrow-left" size={18} color={C.textDark} /></TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}><Text style={styles.lbl}>DISPUTE PROTOCOL</Text><Text style={styles.title}>File Ticket</Text></View>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 14 }} showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.inputPill}><CustomIcon name="profile" size={16} color={C.textMuted} style={{ marginRight: 12 }} /><TextInput style={styles.field} placeholder="Case Subject / Order ID" placeholderTextColor={C.textMuted + '70'} value={topic} onChangeText={setTopic} /></View>
          <View style={[styles.inputPill, { height: 120, borderRadius: 16, alignItems: 'flex-start', paddingTop: 12 }]}><CustomIcon name="message" size={16} color={C.textMuted} style={{ marginRight: 12, marginTop: 2 }} /><TextInput style={[styles.field, { textAlignVertical: 'top' }]} placeholder="Provide detailed operational metrics regarding the conflict context..." placeholderTextColor={C.textMuted + '70'} value={details} onChangeText={setDetails} multiline numberOfLines={4} /></View>
          <View style={styles.footerLine}><CustomIcon name="shield-check" size={12} color={C.success} style={{ marginRight: 6 }} /><Text style={styles.footerTxt}>Tickets are managed securely by the legal audit queue.</Text></View>
        </ScrollView>
        <TouchableOpacity style={[styles.btn, (!topic.trim() || !details.trim() || isSaving) && { opacity: 0.5 }]} disabled={!topic.trim() || !details.trim() || isSaving} onPress={saveTicket}><Text style={styles.btnTxt}>{isSaving ? "Verifying Token Records..." : "Authorize Dispute Submission"}</Text></TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background }, workspace: { flex: 1, justifyContent: 'space-between' }, drift: { position: 'absolute', opacity: 0.8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: 24 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  lbl: { fontSize: 9, fontWeight: '800', color: C.textMuted, letterSpacing: 0.5 }, title: { fontSize: 14, fontWeight: '800', color: C.textDark, marginTop: 2 },
  inputPill: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, paddingHorizontal: 16, width: '100%', marginBottom: 12 },
  field: { flex: 1, fontSize: 14, color: C.textDark, fontWeight: '600', padding: 0 },
  footerLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20 }, footerTxt: { fontSize: 11, fontWeight: '700', color: C.textMuted },
  btn: { width: TW - 48, height: 54, borderRadius: 27, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', mx: 24, marginHorizontal: 24 }, btnTxt: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
