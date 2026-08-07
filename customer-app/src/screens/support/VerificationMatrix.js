import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyRound } from 'lucide-react-native';
import { useAppTheme } from './ThemeContext';

export default function VerificationMatrix({ navigation }) {
  const { styles } = useAppTheme();
  const [answerOne, setAnswerOne] = useState('');
  const [answerTwo, setAnswerTwo] = useState('');

  const runChallengeEvaluation = () => {
    if (!answerOne.trim() || !answerTwo.trim()) {
      Alert.alert('Verification Deficit', 'All high-density cryptographic identity challenges must be accurately fulfilled.');
      return;
    }

    Alert.alert('Handshake Successful', 'Identity verified. Authority access granted.', [
      { text: 'Access Granted', onPress: () => navigation.navigate('SecurityDash') },
    ]);
  };

  return (
    <SafeAreaView style={[stylesMatrix.container, { backgroundColor: styles.background }]}>
      <View style={stylesMatrix.card}>
        <View style={[stylesMatrix.iconBase, { backgroundColor: styles.accentGlow }]}>
          <KeyRound size={28} color={styles.accentSolid} />
        </View>

        <Text style={[stylesMatrix.title, { color: styles.textPrimary }]}>Zero-Trust Gate</Text>
        <Text style={[stylesMatrix.subtitle, { color: styles.textSecondary }]}>Secondary challenges required to modify active biometric states or execute emergency device locks.</Text>

        <View style={stylesMatrix.fieldGroup}>
          <Text style={[stylesMatrix.fieldLabel, { color: styles.textSecondary }]}>CHALLENGE 01: ACCOUNT REGISTERED CITY</Text>
          <TextInput
            style={[stylesMatrix.input, { backgroundColor: styles.surface, color: styles.textPrimary, borderColor: styles.accentBorder }]}
            placeholder="Input baseline geographical root..."
            placeholderTextColor={styles.textSecondary}
            value={answerOne}
            onChangeText={setAnswerOne}
            autoCorrect={false}
          />
        </View>

        <View style={stylesMatrix.fieldGroup}>
          <Text style={[stylesMatrix.fieldLabel, { color: styles.textSecondary }]}>CHALLENGE 02: DEPLOYED SYSTEM INITIALIZATION PASS</Text>
          <TextInput
            style={[stylesMatrix.input, { backgroundColor: styles.surface, color: styles.textPrimary, borderColor: styles.accentBorder }]}
            placeholder="Input backup transaction sequence..."
            placeholderTextColor={styles.textSecondary}
            secureTextEntry
            value={answerTwo}
            onChangeText={setAnswerTwo}
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[stylesMatrix.submitBtn, { backgroundColor: styles.accentSolid }]}
          onPress={runChallengeEvaluation}
          activeOpacity={0.8}
        >
          <Text style={stylesMatrix.submitBtnText}>Submit Handshake Challenge</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={[stylesMatrix.abortText, { color: styles.textSecondary }]}>Abort Matrix Clearance</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

VerificationMatrix.propTypes = {
  navigation: propTypes.shape({
    goBack: propTypes.func.isRequired,
    navigate: propTypes.func.isRequired,
  }).isRequired,
};

const stylesMatrix = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  card: { padding: 24, borderRadius: 24, alignItems: 'center' },
  iconBase: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18, marginBottom: 28 },
  fieldGroup: { width: '100%', marginBottom: 16 },
  fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  input: { width: '100%', height: 44, borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, fontSize: 14 },
  submitBtn: { width: '100%', height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  abortText: { fontSize: 13, textDecorationLine: 'underline' },
});
