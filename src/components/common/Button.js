import React from 'react';
import { 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  Animated 
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Button = ({
  label,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size = 'md',         // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  style,
  labelStyle,
}) => {
  const { colors, spacing, radius } = useTheme();
  
  // Interaction Animation Scale Vector
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.timing(scaleValue, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // Compute styles dynamically based on props and runtime design context
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'accent':
        return { backgroundColor: colors.accent };
      case 'outline':
        return { 
          backgroundColor: 'transparent', 
          borderWidth: 1.5, 
          borderColor: colors.primary 
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getLabelColor = () => {
    if (disabled) return colors.textSecondary;
    if (variant === 'outline' || variant === 'ghost') return colors.primary;
    return '#FFFFFF'; // Contrast on filled configurations
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case 'md':
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
      case 'lg':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  const getLabelSize = () => {
    switch (size) {
      case 'sm': return 13;
      case 'md': return 15;
      case 'lg': return 17;
      default: return 15;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }], width: style?.width || '100%' }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.baseButton,
          { borderRadius: radius.full },
          getVariantStyles(),
          getSizeStyles(),
          disabled && { backgroundColor: colors.border, borderColor: 'transparent' },
          style
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={getLabelColor()} />
        ) : (
          <>
            {iconLeft && <Animated.View style={styles.iconLeft}>{iconLeft}</Animated.View>}
            <Text
              style={[
                styles.baseLabel,
                { color: getLabelColor(), fontSize: getLabelSize() },
                labelStyle
              ]}
            >
              {label}
            </Text>
            {iconRight && <Animated.View style={styles.iconRight}>{iconRight}</Animated.View>}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  baseLabel: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
