import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  iconLeft,
  iconRight,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  ...props
}) => {
  const { colors, spacing, radius } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(!secureTextEntry);

  let borderColor = colors.border;
  if (error) {
    borderColor = colors.error;
  } else if (isFocused) {
    borderColor = colors.primary;
  }

  let rightContent = null;

  if (secureTextEntry) {
    rightContent = (
      <TouchableOpacity 
        style={styles.rightIconWrapper} 
        onPress={() => setPasswordVisible(!passwordVisible)}
      >
        <Text style={{ fontSize: 11, color: colors.primary, fontWeight: '700' }}>
          {passwordVisible ? 'HIDE' : 'SHOW'}
        </Text>
      </TouchableOpacity>
    );
  } else if (iconRight) {
    rightContent = <View style={styles.rightIconWrapper}>{iconRight}</View>;
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderColor,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
          },
          !editable && { backgroundColor: colors.border }
        ]}
      >
        {iconLeft && <View style={styles.leftIconWrapper}>{iconLeft}</View>}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && !passwordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, { color: colors.text }]}
          {...props}
        />

        {rightContent}
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: colors.error, marginTop: spacing.xs }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    height: 52,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '500',
  },
  leftIconWrapper: {
    marginRight: 10,
  },
  rightIconWrapper: {
    marginLeft: 10,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
