import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SkeletonLoader } from '../atoms/SkeletonLoader';

export const ProductItemRow = ({
  title,
  description,
  price,
  imageUrl,
  onPress,
  onAddPress,
  loading = false,
  isAvailable = true,
}) => {
  const { colors, spacing, radius } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  if (loading) {
    return (
      <View style={[styles.row, { paddingVertical: spacing.md, borderBottomWidth: 1, borderColor: colors.border }]}>
        <View style={styles.textContainer}>
          <SkeletonLoader width="60%" height={16} style={{ marginBottom: 6 }} />
          <SkeletonLoader width="85%" height={12} style={{ marginBottom: 12 }} />
          <SkeletonLoader width="30%" height={14} />
        </View>
        <SkeletonLoader width={72} height={72} style={{ borderRadius: radius.sm }} />
      </View>
    );
  }

  const handlePressIn = () => {
    Animated.timing(scaleValue, { toValue: 0.98, duration: 100, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: isAvailable ? 1 : 0.6 }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={isAvailable ? onPress : null}
        style={[styles.row, { paddingVertical: spacing.md, borderBottomWidth: 1, borderColor: colors.border }]}
      >
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>{title}</Text>
          {description && (
            <Text numberOfLines={2} style={[styles.description, { color: colors.textSecondary, marginTop: spacing.xs }]}>
              {description}
            </Text>
          )}
          <Text style={[styles.price, { color: colors.primary, marginTop: spacing.sm }]}>{price}</Text>
        </View>

        <View style={styles.imageWrapper}>
          <Image 
            source={{ uri: imageUrl || 'https://placeholder.com' }} 
            style={[styles.image, { borderRadius: radius.sm }]} 
          />
          {onAddPress && isAvailable && (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={onAddPress}
              style={[styles.addButton, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.full }]}
            >
              <Text style={[styles.addButtonText, { color: colors.primary }]}>+</Text>
            </TouchableOpacity>
          )}
          {!isAvailable && (
            <View style={[styles.soldOutOverlay, { backgroundColor: colors.overlay, borderRadius: radius.sm }]}>
              <Text style={styles.soldOutText}>SOLD OUT</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  imageWrapper: {
    position: 'relative',
    width: 72,
    height: 72,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addButton: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 26,
    height: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
