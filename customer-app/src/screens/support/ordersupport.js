/**
 * Buza Food Delivery Mobile Application
 * Active Order Troubleshooting Selection View
 * File: src/screens/ordersupport.js
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView, StatusBar, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: TW, height: TH } = Dimensions.get('window');
const C = { primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30', textMuted: '#1E6B7B', surface: '#F7FAFA', border: '#EAF2F2' };

export default function OrderSupportScreen({ onBackPress, onSelectIssue }) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const driftY = useRef(new Animated.Value(TH)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.loop(Animated.sequence([
        Animated.timing(driftY, { toValue: -80, duration: 9500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(driftY, { toValue: TH, duration: 0, useNativeDriver: true })
      ]))
    ]).start();
  }, []);

  const issues = [
    { title: 'Missing Items', detail: 'Items were omitted from the packaging', code: 'missing' },
    { title: 'Incorrect Order Received', detail: 'Received items belonging to another account', code: 'wrong' },
    { title: 'Extreme Delivery Delay', detail: 'Courier exceeded the estimated arrival timeline', code: 'delay' },
    { title: 'Damaged Product Packaging', detail: 'Food containers arrived broken or leaking', code: 'damaged' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.drift, { left: '15%', transform: [{ translateY: driftY }] }]}><CustomIcon name="delivery-scooter" size={24} color={C.primary + '15'} /></Animated.View>
      </View>
      <Animated.View style={[styles.workspace, { paddingTop: insets.top + 10, opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={onBackPress}><CustomIcon name="arrow-left" size={18} color={C.textDark} /></TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}><Text style={styles.lbl}>TROUBLESHOOTING</Text><Text style={styles.title}>Order Issues</Text></View>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 14 }} showsVerticalScrollIndicator={false}>
          {issues.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.pill} activeOpacity={0.8} onPress={() => onSelectIssue?.(item.code)}>
              <View style={styles.iconCircle}><CustomIcon name="delivery-scooter" size={16} color={C.textDark} /></View>
              <View style={{ flex: 1 }}><Text style={styles.pillTitle}>{item.title}</Text><Text style={styles.pillDetail}>{item.detail}</Text></View>
              <Text style={styles.carat}>▾</Text>
            </TouchableOpacity>
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
  pill: { flexDirection: 'row', alignItems: 'center', width: '100%', minHeight: 64, borderRadius: 32, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, paddingHorizontal: 16, marginBottom: 12 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, marginRight: 12 },
  pillTitle: { fontSize: 14, fontWeight: '800', color: C.textDark }, pillDetail: { fontSize: 11, fontWeight: '500', color: C.textMuted, marginTop: 2 },
  carat: { fontSize: 14, color: C.textMuted, fontWeight: '700', transform: [{ rotate: '-90deg' }] }
});
