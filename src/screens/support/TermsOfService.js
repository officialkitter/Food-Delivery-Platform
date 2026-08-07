import React from 'react';
import propTypes from 'prop-types';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ArrowLeft, Scale } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsOfService({ navigation }) {
  const { styles } = useAppTheme();

  return (
    <SafeAreaView style={[stylesPolicy.container, { backgroundColor: styles.background }]}>
      <View style={stylesPolicy.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={styles.textPrimary} />
        </TouchableOpacity>
        <Scale size={20} color={styles.accentSolid} style={{ marginLeft: 16 }} />
        <Text style={[stylesPolicy.headerTitle, { color: styles.textPrimary }]}>Terms of Service Framework</Text>
      </View>

      <ScrollView contentContainerStyle={stylesPolicy.scrollContext} showsVerticalScrollIndicator={false}>
        <Text style={[stylesPolicy.metaDate, { color: styles.accentSolid }]}>SYSTEM REVISION REF: 2026.12.01</Text>
        
        <Text style={[stylesPolicy.clauseHeader, { color: styles.textPrimary }]}>1. Ephemeral Infrastructure Constraints</Text>
        <Text style={[stylesPolicy.clauseBody, { color: styles.textSecondary }]}>
          The FudCamp engine maintains an isolated 24-hour retention threshold cycle. Content entries, media binary fragments, and chat parameters map directly onto automated cron purge pipelines. Upon timestamp expiration, information cascades out of all frontend interfaces and transactional Supabase rows.
        </Text>

        <Text style={[stylesPolicy.clauseHeader, { color: styles.textPrimary }]}>2. Volume Headcount Scaling</Text>
        <Text style={[stylesPolicy.clauseBody, { color: styles.textSecondary }]}>
          Bulk party catering dashboards utilize high-speed structural calculations linked directly to headcount array parameters. Any user modification updates merchant storefront distribution profiles automatically. Real-time pricing is bound to the platform's multi-vendor bracket system logic.
        </Text>

        <Text style={[stylesPolicy.clauseHeader, { color: styles.textPrimary }]}>3. Automated Tier Modulation</Text>
        <Text style={[stylesPolicy.clauseBody, { color: styles.textSecondary }]}>
          Visual layouts alter density formulas, opacities, and display components based on account allocation values. Basic profiles, Premium tracks, and Presidential setups deploy explicitly isolated rendering envelopes that cannot be circumvented locally.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

TermsOfService.propTypes = {
  navigation: propTypes.shape({
    goBack: propTypes.func.isRequired,
  }).isRequired,
};

const stylesPolicy = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', marginLeft: 8 },
  scrollContext: { padding: 20, paddingBottom: 60 },
  metaDate: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 16 },
  clauseHeader: { fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  clauseBody: { fontSize: 13, lineHeight: 20, textAlign: 'justify' }
});
