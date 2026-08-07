import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SkeletonLoader } from '../atoms/SkeletonLoader';

export const ProductCard = ({
  title,
  price,
  description,
  imageUrl,
  onPress,
  loading = false,
  badgeText,
}) => {
  const { colors, spacing, radius, shadows } = useTheme();
  const scaleValue = new Animated.Value(1);

  if (loading) {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <View style={styles.horizontalRow}>
          <View style={styles.textFlex}>
            <SkeletonLoader width="70%" height={18} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="90%" height={14} style={{ marginBottom: 4 }} />
            <SkeletonLoader width="40%" height={14} />
          </View>
          <SkeletonLoader width={84} height={84} style={{ borderRadius: radius.sm }} />
        </View>
      </View>
    );
  }

  const animatePressIn = () => {
    Animated.timing(scaleValue, { toValue: 0.98, duration: 100, useNativeDriver: true }).start();
  };

  const animatePressOut = () => {
    Animated.timing(scaleValue, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={animatePressIn}
        onPressOut={animatePressOut}
        onPress={onPress}
        style={[
          styles.card,
          shadows,
          { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }
        ]}
      >
        <View style={styles.horizontalRow}>
          <View style={styles.textFlex}>
            {badgeText && (
              <View style={[styles.badge, { backgroundColor: colors.primary + '15', borderRadius: radius.sm }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{badgeText}</Text>
              </View>
            )}
            <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text numberOfLines={2} style={[styles.description, { color: colors.textSecondary, marginTop: spacing.xs }]}>
              {description}
            </Text>
            <Text style={[styles.price, { color: colors.accent, marginTop: spacing.sm }]}>
              {price}
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl || 'https://placeholder.com' }} 
              style={[styles.image, { borderRadius: radius.sm }]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 12,
  },
  horizontalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textFlex: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 86,
    height: 86,
    resizeMode: 'cover',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
