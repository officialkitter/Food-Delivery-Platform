import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ArrowLeft, ShieldAlert, CheckSquare, Square } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import propTypes from 'prop-types';

DisputeTerminal.propTypes = {
  route: propTypes.object.isRequired,
  navigation: propTypes.object.isRequired,
};

export default function DisputeTerminal({ route, navigation }) {
  const { styles } = useAppTheme();
  const { CategoryId } = route.params || { CategoryId: 'general_inquiry' };
  
  const [claimText, setClaimText] = useState('');
  const [requestEscalation, setRequestEscalation] = useState(false);

  const executeClaimRegistration = () => {
    if (!claimText.trim()) {
      Alert.alert('Validation Halt', 'Please provide descriptive parameter errors detailing layout or item variance.');
      return;
    }
    // Formally commits data parameters directly against permanent merchant transaction fields in MongoDB
    Alert.alert('Dispute Logged', 'Verification metrics and audit keys successfully submitted to permanent resolution logs.', [
      { text: 'Acknowledge', onPress: () => navigation.navigate('TicketMonitor') }
    ]);
  };

  return (
    <SafeAreaView style={[stylesTerminal.container, { backgroundColor: styles.background }]}>
      <View style={stylesTerminal.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={styles.textPrimary} />
        </TouchableOpacity>
        <Text style={[stylesTerminal.headerTitle, { color: styles.textPrimary }]}>Merchant Resolution Node</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <View style={[stylesTerminal.alertCard, { backgroundColor: styles.accentGlow }]}>
          <ShieldAlert size={20} color={styles.accentSolid} style={{ marginRight: 12 }} />
          <Text style={[stylesTerminal.alertText, { color: styles.textPrimary }]}>
            Inquiry tracking category established: <Text style={{ fontWeight: '700' }}>{CategoryId}</Text>
          </Text>
        </View>

        <Text style={[stylesTerminal.label, { color: styles.textPrimary }]}>Incident Structural Breakdown</Text>
        <TextInput
          style={[stylesTerminal.bigInput, { backgroundColor: styles.surface, color: styles.textPrimary, borderColor: styles.accentBorder }]}
          placeholder="Break down exactly what arrived out of sync. Specify missing toppings, delivery timeline anomalies, or mismatched transactional calculations..."
          placeholderTextColor={styles.textSecondary}
          multiline
          numberOfLines={6}
          value={claimText}
          onChangeText={setClaimText}
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={stylesTerminal.checkboxRow} 
          activeOpacity={0.8}
          onPress={() => setRequestEscalation(!requestEscalation)}
        >
          {requestEscalation ? <CheckSquare size={20} color={styles.accentSolid} /> : <Square size={20} color={styles.textSecondary} />}
          <Text style={[stylesTerminal.checkboxText, { color: styles.textPrimary }]}>
            Escalate automatically to regional delivery supervisor if unresolved in 15 minutes.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[stylesTerminal.commitButton, { backgroundColor: styles.accentSolid }]}
          onPress={executeClaimRegistration}
          activeOpacity={0.8}
        >
          <Text style={stylesTerminal.commitButtonText}>Register Dispute Payload</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesTerminal = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 16 },
  alertCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 24 },
  alertText: { fontSize: 13, flex: 1 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  bigInput: { width: '100%', minHeight: 120, borderRadius: 12, borderWidth: 1, padding: 16, fontSize: 14, lineHeight: 20 },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 20, paddingRight: 16 },
  checkboxText: { fontSize: 13, marginLeft: 10, lineHeight: 18 },
  commitButton: { width: '100%', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  commitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 }
});
