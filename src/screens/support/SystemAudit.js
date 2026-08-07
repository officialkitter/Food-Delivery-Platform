import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ArrowLeft, Fingerprint, Lock, ShieldCheck, RefreshCw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import propTypes from 'prop-types';
SystemAudit.propTypes = {
  navigation: propTypes.object.isRequired,
};

export default function SystemAudit({ navigation }) {
  const { styles } = useAppTheme();

  const ledgers = [
    { id: 1, action: 'FaceID Biometric Trust Verified', timestamp: '2026-06-11 14:02:11 UTC', ref: 'AUTH-SEC-8902', icon: Fingerprint },
    { id: 2, action: 'Master Encryption Key Rollover', timestamp: '2026-06-09 08:34:55 UTC', ref: 'KEY-ROT-4110', icon: RefreshCw },
    { id: 3, action: 'Account Access Password Modified', timestamp: '2026-05-18 22:15:01 UTC', ref: 'PWD-CHG-1029', icon: Lock },
    { id: 4, action: 'Root Device Integrity Validation', timestamp: '2026-05-01 06:00:00 UTC', ref: 'SYS-CHK-0012', icon: ShieldCheck }
  ];

  return (
    <SafeAreaView style={[stylesAudit.container, { backgroundColor: styles.background }]}>
      <View style={stylesAudit.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={styles.textPrimary} />
        </TouchableOpacity>
        <Text style={[stylesAudit.headerTitle, { color: styles.textPrimary }]}>Immutable Account Ledger</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={[stylesAudit.metaLabel, { color: styles.textSecondary }]}>
          A comprehensive record of security updates, device fingerprint handshakes, and access profile modifications.
        </Text>

        {ledgers.map((log) => {
          const LogIcon = log.icon;
          return (
            <View key={log.id} style={[stylesAudit.logCard, { backgroundColor: styles.surface, borderColor: styles.accentGlow }]}>
              <View style={[stylesAudit.iconBox, { backgroundColor: styles.background }]}>
                <LogIcon size={16} color={styles.accentSolid} />
              </View>
              <View style={stylesAudit.metaSpace}>
                <Text style={[stylesAudit.actionText, { color: styles.textPrimary }]}>{log.action}</Text>
                <Text style={[stylesAudit.timeText, { color: styles.textSecondary }]}>{log.timestamp}</Text>
                <Text style={[stylesAudit.refText, { color: styles.accentSolid }]}>HASH REFERENCE: {log.ref}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesAudit = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 16 },
  metaLabel: { fontSize: 13, lineHeight: 18, marginBottom: 24, paddingHorizontal: 4 },
  logCard: { flexDirection: 'row', padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 12, alignItems: 'flex-start' },
  iconBox: { padding: 10, borderRadius: 10 },
  metaSpace: { marginLeft: 14, flex: 1 },
  actionText: { fontSize: 14, fontWeight: '600' },
  timeText: { fontSize: 11, marginTop: 3 },
  refText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginTop: 6 }
});
