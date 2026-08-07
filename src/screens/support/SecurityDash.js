import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ArrowLeft, Monitor, Smartphone, MapPin, Radio, ShieldAlert } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import propTypes from 'prop-types';
SecurityDash.propTypes = {
  navigation: propTypes.object.isRequired,
};

export default function SecurityDash({ navigation }) {
  const { styles } = useAppTheme();

  const sessions = [
    { id: 1, device: 'iPhone 15 Pro Max (Active Session)', meta: 'Hardware ID: OPR-9902-X', loc: 'Nairobi, Kenya', ip: '197.248.31.84', active: true },
    { id: 2, device: 'SM-G998B Pad Link', meta: 'Hardware ID: AND-4011-P', loc: 'Mombasa, Kenya', ip: '41.90.112.5', active: false }
  ];

  return (
    <SafeAreaView style={[stylesSecurity.container, { backgroundColor: styles.background }]}>
      <View style={stylesSecurity.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('HelpCenter')}>
          <ArrowLeft size={22} color={styles.textPrimary} />
        </TouchableOpacity>
        <Text style={[stylesSecurity.headerTitle, { color: styles.textPrimary }]}>Access & Session Controls</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={[stylesSecurity.threatBanner, { backgroundColor: styles.accentGlow, borderColor: styles.accentBorder }]}>
          <Radio size={18} color={styles.accentSolid} />
          <Text style={[stylesSecurity.threatText, { color: styles.textPrimary }]}>
            Real-time biometric validation handshakes operational. Network telemetry is encrypted.
          </Text>
        </View>

        <Text style={[stylesSecurity.sectionLabel, { color: styles.textPrimary }]}>Registered Hardware Sessions</Text>

        {sessions.map((session) => (
          <View key={session.id} style={[stylesSecurity.sessionCard, { backgroundColor: styles.surface }]}>
            <View style={stylesSecurity.sessionTop}>
              {session.active ? <Smartphone size={20} color={styles.accentSolid} /> : <Monitor size={20} color={styles.textSecondary} />}
              <View style={stylesSecurity.sessionMetaFrame}>
                <Text style={[stylesSecurity.deviceName, { color: styles.textPrimary }]}>{session.device}</Text>
                <Text style={[stylesSecurity.deviceHardware, { color: styles.textSecondary }]}>{session.meta}</Text>
              </View>
            </View>

            <View style={[stylesSecurity.divider, { backgroundColor: styles.accentGlow }]} />

            <View style={stylesSecurity.telemetryRow}>
              <View style={stylesSecurity.telItem}>
                <MapPin size={12} color={styles.textSecondary} />
                <Text style={[stylesSecurity.telText, { color: styles.textSecondary }]}>{session.loc}</Text>
              </View>
              <View style={stylesSecurity.telItem}>
                <ShieldAlert size={12} color={styles.textSecondary} />
                <Text style={[stylesSecurity.telText, { color: styles.textSecondary }]}>{session.ip}</Text>
              </View>
            </View>

            {!session.active && (
              <TouchableOpacity style={[stylesSecurity.terminateBtn, { borderColor: styles.accentBorder }]}>
                <Text style={[stylesSecurity.terminateText, { color: styles.accentSolid }]}>Revoke Authentication Token</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity 
          style={[stylesSecurity.panicBtn, { backgroundColor: styles.accentGlow, borderColor: styles.accentSolid }]}
          onPress={() => navigation.navigate('VaultReset')}
          activeOpacity={0.8}
        >
          <Text style={[stylesSecurity.panicText, { color: styles.accentSolid }]}>Initialize Emergency Wipe Terminal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesSecurity = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 16 },
  threatBanner: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  threatText: { fontSize: 12, marginLeft: 10, flex: 1, lineHeight: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  sessionCard: { padding: 16, borderRadius: 16, marginBottom: 12 },
  sessionTop: { flexDirection: 'row', alignItems: 'center' },
  sessionMetaFrame: { marginLeft: 12 },
  deviceName: { fontSize: 14, fontWeight: '600' },
  deviceHardware: { fontSize: 11, marginTop: 2 },
  divider: { height: 1, marginVertical: 12 },
  telemetryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  telItem: { flexDirection: 'row', alignItems: 'center' },
  telText: { fontSize: 12, marginLeft: 4 },
  terminateBtn: { borderWidth: 1, borderRadius: 8, height: 32, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  terminateText: { fontSize: 11, fontWeight: '700' },
  panicBtn: { borderWidth: 1, paddingVertical: 14, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  panicText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5 }
});
