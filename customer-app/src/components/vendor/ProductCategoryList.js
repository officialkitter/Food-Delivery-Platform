import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SkeletonLoader } from '../atoms/SkeletonLoader';

export const ProductCategoryList = ({
  categories = [],
  selectedCategoryId,
  onCategorySelect,
  loading = false,
  contentContainerStyle,
}) => {
  const { colors, spacing, radius } = useTheme();

  if (loading) {
    return (
      <View style={[styles.rowContainer, contentContainerStyle]}>
        {[1, 2, 3, 4].map((key) => (
          <SkeletonLoader 
            key={key} 
            width={85} 
            height={38} 
            style={{ borderRadius: radius.full, marginRight: spacing.sm }} 
          />
        ))}
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedCategoryId;
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onCategorySelect?.(item.id)}
        style={[
          styles.chip,
          {
            backgroundColor: isSelected ? colors.primary : colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
            borderRadius: radius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            marginRight: spacing.sm,
          }
        ]}
      >
        <Text 
          style={[
            styles.chipText, 
            { 
              color: isSelected ? '#FFFFFF' : colors.text,
              fontWeight: isSelected ? '700' : '500' 
            }
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.listContent, contentContainerStyle]}
    />
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  chip: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
