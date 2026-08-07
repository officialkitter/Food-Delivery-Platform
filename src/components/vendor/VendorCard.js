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

export const RestaurantCard = ({
  name,
  imageUrl,
  rating,
  deliveryTime,
  deliveryFee,
  tags,
  onPress,
  loading = false,
}) => {
  const { colors, spacing, radius, shadows } = useTheme();
  const scaleValue = new Animated.Value(1);

  if (loading) {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.md, marginBottom: spacing.lg }]}>
        <SkeletonLoader width="100%" height={160} style={{ borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md }} />
        <View style={{ padding: spacing.md }}>
          <SkeletonLoader width="60%" height={20} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="40%" height={14} />
        </View>
      </View>
    );
  }

  const animatePressIn = () => {
    Animated.timing(scaleValue, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  };

  const animatePressOut = () => {
    Animated.timing(scaleValue, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.card, shadows, { transform: [{ scale: scaleValue }], backgroundColor: colors.surface, borderRadius: radius.md }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={animatePressIn}
        onPressOut={animatePressOut}
        onPress={onPress}
      >
        <Image source={{ uri: imageUrl }} style={[styles.heroImage, { borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md }]} />
        
        <View style={[styles.contentBlock, { padding: spacing.md }]}>
          <View style={styles.headlineRow}>
            <Text style={[styles.nameText, { color: colors.text }]}>{name}</Text>
            <View style={[styles.ratingBadge, { backgroundColor: colors.secondary + '20', borderRadius: radius.sm }]}>
              <Text style={[styles.ratingText, { color: colors.secondary }]}>★ {rating}</Text>
            </View>
          </View>

          <Text numberOfLines={1} style={[styles.tags, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            {tags?.join(' • ')}
          </Text>

          <View style={[styles.metaRow, { marginTop: spacing.sm, borderTopWidth: 1, borderColor: colors.border, paddingTop: spacing.sm }]}>
            <Text style={[styles.metaItem, { color: colors.text }]}>⏱ {deliveryTime}</Text>
            <Text style={[styles.metaItem, { color: colors.text, marginLeft: spacing.md }]}>🛵 {deliveryFee}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 165,
    resizeMode: 'cover',
  },
  headlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tags: {
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    fontSize: 13,
    fontWeight: '600',
  },
});
