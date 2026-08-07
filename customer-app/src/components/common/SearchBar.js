/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core Shared Search Interface Element
 * src/components/common/SearchBar.js
 */

import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const SearchBar = ({
  value = '',
  onChangeText,
  onSubmit,
  onClear,
  onFilterPress,
  placeholder = 'Search dishes, restaurants or groceries...',
  editable = true,
  autoFocus = false,
  showFilterButton = true,
}) => {
  const { colors, spacing, radius } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Interaction animation scale and opacity controllers
  const clearButtonScale = useRef(new Animated.Value(value.length > 0 ? 1 : 0)).current;

  // Reactively animate the clear button visibility based on keystrokes
  React.useEffect(() => {
    Animated.timing(clearButtonScale, {
      toValue: value.length > 0 ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [value, clearButtonScale]);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText('');
    }
  };

  return (
    <View style={[styles.outerContainer, { gap: spacing.sm }]}>
      <View
        style={[
          styles.searchWrapper,
          {
            backgroundColor: colors.surface,
            borderColor: isFocused ? colors.primary : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
          },
          !editable && { backgroundColor: colors.border },
        ]}
      >
        {/* Visual Anchor Left Search Icon Icon Frame */}
        <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔍</Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          editable={editable}
          autoFocus={autoFocus}
          returnKeyType="search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.inputField, { color: colors.text }]}
        />

        {/* Clear Content Action Node with Scale Animation */}
        <Animated.View style={{ transform: [{ scale: clearButtonScale }], opacity: clearButtonScale }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClear}
            disabled={value.length === 0}
            style={[styles.clearButton, { backgroundColor: colors.border, borderRadius: radius.full }]}
          >
            <Text style={[styles.clearIconText, { color: colors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Optional Modular Segment Filter Quick-Trigger */}
      {showFilterButton && onFilterPress && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onFilterPress}
          style={[
            styles.filterButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
              width: 52,
              height: 52,
            },
          ]}
        >
          <Text style={[styles.filterIconText, { color: colors.primary }]}>Tune</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    height: 52,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearButton: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  clearIconText: {
    fontSize: 10,
    fontWeight: '800',
  },
  filterButton: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
