/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Secure Account Access Recovery & Credentials Restoration View
 * src/screens/accrecover.js
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { CustomIcon } from '../../components/common/CustomIcon';

export default function AccountRecoveryScreen() {
  const { colors, isDarkMode } = useTheme();
  
  // Safely extract language configurations with a fallback pattern
  const appCtx = useApp() || {};
  const language = appCtx.language || 'en';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Localization matrix to handle professional messaging
  const textStrings = {
    en: {
      title: 'Account Recovery',
      subtitle: 'Enter your registered email address to receive password restoration instructions.',
      label: 'Email Address',
      placeholder: 'name@example.com',
      button: 'Send Recovery Link',
      successTitle: 'Link Transmitted',
      successMessage: 'If an account matches this email address, password configuration instructions will arrive shortly.',
      errorTitle: 'Invalid Entry',
      errorMessage: 'Please supply a correctly formatted email address.',
      backButton: 'Return to Login'
    },
    sw: {
      title: 'Urejesho wa Akaunti',
      subtitle: 'Ingiza barua pepe yako iliyosajiliwa ili kupokea maelekezo ya kurejesha nenosiri.',
      label: 'Anwani ya Barua Pepe',
      placeholder: 'jina@mfano.com',
      button: 'Tuma Kiungo cha Urejesho',
      successTitle: 'Kiungo Kimetumwa',
      successMessage: 'Ikiwa akaunti inalingana na barua pepe hii, maelekezo ya kurejesha nenosiri yatawasili hivi karibuni.',
      errorTitle: 'Ingizo Batili',
      errorMessage: 'Tafadhali weka anwani ya barua pepe iliyo katika mfumo sahihi.',
      backButton: 'Rudi Kwenye Kuingia'
    }
  };

  const localized = textStrings[language] || textStrings.en;

  const validateEmail = (targetEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(targetEmail.trim());
  };

  const handleRecoverySubmission = () => {
    if (!validateEmail(email)) {
      Alert.alert(localized.errorTitle, localized.errorMessage);
      return;
    }

    setLoading(true);

    // Simulated secure API communication layer request timeout
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Decorative Top Asset Frame */}
        <View style={styles.headerIconWrapper}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <CustomIcon 
              name={isSubmitted ? 'mail' : 'lock'} 
              size={32} 
              color={colors.primary} 
            />
          </View>
        </View>

        {!isSubmitted ? (
          /* Initial Input Interactive Interface State */
          <View style={styles.formContainer}>
            <Text style={[styles.mainTitle, { color: colors.text }]}>
              {localized.title}
            </Text>
            <Text style={[styles.subTitle, { color: colors.textMuted }]}>
              {localized.subtitle}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {localized.label}
              </Text>
              <TextInput
                style={[
                  styles.inputField, 
                  { 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border, 
                    color: colors.text 
                  }
                ]}
                placeholder={localized.placeholder}
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
              onPress={handleRecoverySubmission}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} size="small" />
              ) : (
                <Text style={[styles.primaryActionText, { color: colors.background }]}>
                  {localized.button}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* Post-Transmission Confirmation State Interface */
          <View style={styles.formContainer}>
            <Text style={[styles.mainTitle, { color: colors.text }]}>
              {localized.successTitle}
            </Text>
            <Text style={[styles.subTitle, { color: colors.textMuted }]}>
              {localized.successMessage}
            </Text>

            <TouchableOpacity 
              style={[styles.secondaryActionBtn, { borderColor: colors.border }]}
              onPress={() => setIsSubmitted(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.secondaryActionText, { color: colors.text }]}>
                {localized.backButton}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  headerIconWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  formContainer: {
    width: '100%',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputField: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  primaryActionBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryActionBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
