/**
 * Buza Food Delivery Mobile Application
 * Core System Broadcast Bulletins & Log updates Feed View
 * File: src/screens/updates.js
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView, StatusBar, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: TW, height: TH } = Dimensions.get('window');
const C = { primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30', textMuted: '#1E6B7B', surface: '#F7FAFA', border: '#EAF2F2' };

export default function UpdatesScreen({ onBackPress }) {
  const insets = useSafeAreaInsets();
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

  const logs = [
    { label: 'Server Maintenance Notice', date: '10 Aug 2026', body: 'Database indices optimized safely. Transaction processing rates elevated across payment gateways.' },
    { label: 'Holiday Logistics Timeline', date: '04 Aug 2026', body: 'Courier operational schedules extended during peak festival intervals to ensure zero delay metrics.' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.drift, { left: '15%', transform: [{ translateY: driftY }] }]}><CustomIcon name="bell" size={24} color={C.primary + '15'} /></Animated.View>
      </View>
      <Animated.View style={[styles.workspace, { paddingTop: insets.top + 10, opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={onBackPress}><CustomIcon name="arrow-left" size={18} color={C.textDark} /></TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}><Text style={styles.lbl}>BROADCAST LOGS</Text><Text style={styles.title}>System Updates</Text></View>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14 }} showsVerticalScrollIndicator={false}>
          {logs.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.top}><Text style={styles.cTitle}>{item.label}</Text><View style={styles.dot} /></View>
              <Text style={styles.cDate}>Logged: {item.date}</Text><Text style={styles.cBody}>{item.body}</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background }, workspace: { flex: 1 }, drift: { position: 'absolute', opacity: 0.8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  lbl: { fontSize: 9, fontWeight: '800', color: C.textMuted, letterSpacing: 0.5 }, title: { fontSize: 14, fontWeight: '800', color: C.textDark, marginTop: 2 },
  card: { width: '100%', backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 12 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  cTitle: { fontSize: 15, fontWeight: '800', color: C.textDark, flex: 1 }, dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30' },
  cDate: { fontSize: 11, fontWeight: '600', color: C.textMuted, marginTop: 2 }, cBody: { fontSize: 13, fontWeight: '500', color: C.textMuted, lineHeight: 20, marginTop: 6 }
});
