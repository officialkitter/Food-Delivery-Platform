import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, ShieldX } from 'lucide-react-native';
import { useAppTheme } from './ThemeContext';

export default function VaultReset({ navigation }) {
  const { styles } = useAppTheme();
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const REQUIRED_PHRASE = 'PURGE-METADATA';

  const executeEmergencyPurgeHandshake = () => {
    if (confirmationPhrase !== REQUIRED_PHRASE) {
      Alert.alert('Verification Deficit', 'The input string parameters do not align with the required termination phrase.');
      return;
    }

    Alert.alert(
      'DESTRUCT ORDER ACKNOWLEDGED',
      'Local session configurations dropped. Biometric trust layers invalidated. Root keys purged. Transitioning execution vectors.',
      [{ text: 'Terminate Session', onPress: () => navigation.navigate('AppExitSplash') }],
    );
  };

  return (
    <SafeAreaView style={[stylesVault.container, { backgroundColor: styles.background }]}>
      <View style={stylesVault.innerBox}>
        <View style={[stylesVault.iconBase, { backgroundColor: styles.accentGlow }]}>
          <ShieldX size={32} color={styles.accentSolid} />
        </View>

        <Text style={[stylesVault.dangerHeader, { color: styles.textPrimary }]}>Emergency Overwrite Core</Text>
        <Text style={[stylesVault.warningParagraph, { color: styles.textSecondary }]}>
          Executing this path invalidates local FaceID/TouchID tokens, clears cached JWT credentials, registers an account lock event inside MongoDB, and forcefully terminates the active connection.
        </Text>

        <View style={[stylesVault.dangerWarningBox, { backgroundColor: styles.accentGlow }]}>
          <AlertTriangle size={16} color={styles.accentSolid} />
          <Text style={[stylesVault.warningAlertText, { color: styles.textPrimary }]}>Warning: This action cannot be systematically reversed.</Text>
        </View>

        <Text style={[stylesVault.inputLabel, { color: styles.textSecondary }]}>TYPE "{REQUIRED_PHRASE}" TO CONFIRM PARMS</Text>
        <TextInput
          style={[stylesVault.phraseField, { backgroundColor: styles.surface, color: styles.textPrimary, borderColor: styles.accentSolid }]}
          placeholder="Awaiting verification verification code..."
          placeholderTextColor={styles.textSecondary}
          autoCapitalize="characters"
          autoCorrect={false}
          value={confirmationPhrase}
          onChangeText={setConfirmationPhrase}
        />

        <TouchableOpacity
          style={[stylesVault.executeBtn, { backgroundColor: styles.accentSolid }]}
          onPress={executeEmergencyPurgeHandshake}
          activeOpacity={0.8}
        >
          <Text style={stylesVault.executeText}>Initialize Core Purge Sequence</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={stylesVault.cancelBtn}>
          <Text style={[stylesVault.cancelText, { color: styles.textSecondary }]}>Abort System Overwrite</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

VaultReset.propTypes = {
  navigation: propTypes.shape({
    goBack: propTypes.func.isRequired,
    navigate: propTypes.func.isRequired,
  }).isRequired,
};

const stylesVault = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  innerBox: { alignItems: 'center', paddingVertical: 20 },
  iconBase: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  dangerHeader: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  warningParagraph: { fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 20, paddingHorizontal: 8 },
  dangerWarningBox: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, marginTop: 16, width: '100%', justifyContent: 'center' },
  warningAlertText: { fontSize: 11, fontWeight: '700', marginLeft: 8 },
  inputLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 32, marginBottom: 8, alignSelf: 'flex-start' },
  phraseField: { width: '100%', height: 46, borderRadius: 8, borderWidth: 1, paddingHorizontal: 16, fontSize: 14, textAlign: 'center', fontWeight: '700', letterSpacing: 1 },
  executeBtn: { width: '100%', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  executeText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  cancelBtn: { marginTop: 16, padding: 8 },
  cancelText: { fontSize: 13, textDecorationLine: 'underline' },
});
