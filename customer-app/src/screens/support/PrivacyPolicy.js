import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ArrowLeft, EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import propTypes from 'prop-types';

PrivacyPolicy.propTypes = {
  navigation: propTypes.object.isRequired,
};

export default function PrivacyPolicy({ navigation }) {
  const { styles } = useAppTheme();

  return (
    <SafeAreaView style={[stylesPolicy.container, { backgroundColor: styles.background }]}>
      <View style={stylesPolicy.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={styles.textPrimary} />
        </TouchableOpacity>
        <EyeOff size={20} color={styles.accentSolid} style={{ marginLeft: 16 }} />
        <Text style={[stylesPolicy.headerTitle, { color: styles.textPrimary }]}>Data Privacy Framework</Text>
      </View>

      <ScrollView contentContainerStyle={stylesPolicy.scrollContext} showsVerticalScrollIndicator={false}>
        <Text style={[stylesPolicy.metaDate, { color: styles.accentSolid }]}>COMPLIANCE SPEC: GDPR-V2-MDB</Text>
        
        <Text style={[stylesPolicy.clauseHeader, { color: styles.textPrimary }]}>Data Stripping and Archival Rules</Text>
        <Text style={[stylesPolicy.clauseBody, { color: styles.textSecondary }]}>
          At precisely the 24-hour validity mark, automated backend execution workers remove personal identifiers, device telemetry records, and user associations from operational data entries. Raw numerical arrays outlining flavor profiles are detached and moved to the long-term historical trends database for cold analytics.
        </Text>

        <Text style={[stylesPolicy.clauseHeader, { color: styles.textPrimary }]}>Biometric Metadata Allocation</Text>
        <Text style={[stylesPolicy.clauseBody, { color: styles.textSecondary }]}>
          FaceID, TouchID, and associated passkey metrics are calculated entirely within isolated hardware subsystems. The application frontend receives only signed validation outputs from native bridges. It does not ingest, cache, or transmit raw biometric identifiers across the cloud network.
        </Text>

        <Text style={[stylesPolicy.clauseHeader, { color: styles.textPrimary }]}>Geographic Coordinate Streams</Text>
        <Text style={[stylesPolicy.clauseBody, { color: styles.textSecondary }]}>
          Active geolocation parameters captured during delivery pipelines stream via encrypted real-time sockets to maintain tracking views. These high-frequency updates overwrite previous data blocks automatically, preventing the retention of permanent customer location profiles.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesPolicy = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', marginLeft: 8 },
  scrollContext: { padding: 20, paddingBottom: 60 },
  metaDate: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 16 },
  clauseHeader: { fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  clauseBody: { fontSize: 13, lineHeight: 20, textAlign: 'justify' }
});
