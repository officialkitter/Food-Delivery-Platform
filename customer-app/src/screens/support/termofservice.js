/**
 * Buza Food Delivery Mobile Application
 * Marketplace Legal Terms of Compliance Service View
 * File: src/screens/termofservice.js
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView, StatusBar, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: TW, height: TH } = Dimensions.get('window');
const C = { primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30', textMuted: '#1E6B7B', surface: '#F7FAFA', border: '#EAF2F2' };

export default function TermOfServiceScreen({ onBackPress }) {
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.drift, { left: '15%', transform: [{ translateY: driftY }] }]}><CustomIcon name="list" size={24} color={C.primary + '15'} /></Animated.View>
      </View>
      <Animated.View style={[styles.workspace, { paddingTop: insets.top + 10, opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={onBackPress}><CustomIcon name="arrow-left" size={18} color={C.textDark} /></TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}><Text style={styles.lbl}>LEGAL SYSTEM</Text><Text style={styles.title}>Terms of Service</Text></View>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.h}>1. Agreement parameters</Text><Text style={styles.p}>By accessing the digital marketplace systems integrated across this mobile application, you authorize binding compliance structures regulating purchase contracts, menu pricing aggregates, and fulfillment timelines.</Text>
          <Text style={styles.h}>2. Transaction settlement</Text><Text style={styles.p}>Fulfillment fees, delivery totals, and item balances are calculated dynamically prior to authorization pipelines. All transactions processed via integrated gateways are encrypted and verified immediately.</Text>
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
  h: { fontSize: 15, fontWeight: '800', color: C.textDark, marginBottom: 8, letterSpacing: -0.1 }, p: { fontSize: 13, fontWeight: '500', color: C.textMuted, lineHeight: 22, marginBottom: 20 }
});
