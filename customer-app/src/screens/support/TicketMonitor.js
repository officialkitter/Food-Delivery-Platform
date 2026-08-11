/**
 * Buza Food Delivery Mobile Application
 * Open Support Cases Milestone Timeline Monitor View
 * File: src/screens/ticketmonitor.js
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, ScrollView, StatusBar, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: TW, height: TH } = Dimensions.get('window');
const C = { primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30', textMuted: '#1E6B7B', surface: '#F7FAFA', border: '#EAF2F2', success: '#4CD964' };

export default function TicketMonitorScreen({ onBackPress, ticketId = "TCK-48102" }) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const driftY = useRef(new Animated.Value(TH)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.loop(Animated.sequence([
        Animated.timing(pulseScale, { toValue: 1.25, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 1, duration: 1200, easing: Easing.in(Easing.ease), useNativeDriver: true })
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(driftY, { toValue: -80, duration: 9000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(driftY, { toValue: TH, duration: 0, useNativeDriver: true })
      ]))
    ]).start();
  }, []);

  const milestones = [
    { title: 'Ticket Registered', body: 'Dispute filed successfully inside account databases.', done: true, time: '10:00 AM' },
    { title: 'Legal Queue Allocation', body: 'Assigned to specialized care auditors for diagnostics.', done: true, time: '11:15 AM' },
    { title: 'Investigation Routine', body: 'Reviewing delivery coordinates, receipt tallies, and logs.', done: false, time: 'Processing' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.drift, { left: '80%', transform: [{ translateY: driftY }] }]}><CustomIcon name="list" size={24} color={C.primary + '15'} /></Animated.View>
      </View>
      <Animated.View style={[styles.workspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={onBackPress}><CustomIcon name="arrow-left" size={18} color={C.textDark} /></TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}><Text style={styles.lbl}>CASE MONITOR</Text><Text style={styles.title}>ID: {ticketId}</Text></View>
        </View>
        <ScrollView style={{ flex: 1, marginVertical: 16 }} showsVerticalScrollIndicator={false}>
          {milestones.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <View style={styles.indicatorAxis}>
                {!item.done && <Animated.View style={[styles.radar, { transform: [{ scale: pulseScale }] }]} />}
                <View style={[styles.node, item.done ? styles.nodeDone : styles.nodePending]}><CustomIcon name={item.done ? "check" : "clock"} size={12} color={item.done ? '#FFFFFF' : C.textMuted} /></View>
                {idx !== milestones.length - 1 && <View style={[styles.axisLine, item.done && { backgroundColor: C.success }]} />}
              </View>
              <View style={styles.content}>
                <View style={styles.rowSpace}><Text style={[styles.mTitle, !item.done && { color: C.primary }]}>{item.title}</Text><Text style={styles.mTime}>{item.time}</Text></View>
                <Text style={styles.mBody}>{item.body}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.btn} activeOpacity={0.85} onPress={onBackPress}><Text style={styles.btnTxt}>Return to Support Desk</Text></TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background }, workspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' }, rowSpace: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }, drift: { position: 'absolute', opacity: 0.8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  lbl: { fontSize: 9, fontWeight: '800', color: C.textMuted, letterSpacing: 0.5 }, title: { fontSize: 14, fontWeight: '800', color: C.textDark, marginTop: 2 },
  row: { flexDirection: 'row', width: '100%', minHeight: 74 }, indicatorAxis: { alignItems: 'center', marginRight: 16, width: 24, position: 'relative' },
  node: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, zIndex: 10, backgroundColor: '#FFFFFF' }, nodeDone: { backgroundColor: C.success, borderColor: C.success }, nodePending: { borderColor: C.border },
  radar: { position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255, 127, 80, 0.08)', borderWidth: 1, borderColor: 'rgba(255, 127, 80, 0.15)', top: -6 },
  axisLine: { width: 2, flex: 1, backgroundColor: C.border, marginVertical: -2 }, content: { flex: 1, paddingBottom: 20, justifyContent: 'flex-start', paddingTop: 2 },
  mTitle: { fontSize: 15, fontWeight: '800', color: C.textDark, letterSpacing: -0.1 }, mTime: { fontSize: 11, fontWeight: '700', color: C.textMuted }, mBody: { fontSize: 12, fontWeight: '500', color: C.textMuted, marginTop: 4, lineHeight: 18 },
  btn: { width: '100%', height: 54, borderRadius: 27, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }, btnTxt: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
