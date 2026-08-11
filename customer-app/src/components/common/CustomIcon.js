/**
 * Buza Food Delivery Mobile Application
 * Core Vector Icon Mapping Layer - High Density Matrix Edition
 * File: src/components/CustomIcon.js
 */

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as Icons from 'lucide-react-native';
import { Images } from '../../constants/theme';

const BRAND_ICON_SOURCES = {
  light: Images?.brand?.logoLight || require('../../assets/images/logo-light.png'),
  dark: Images?.brand?.logoDark || require('../../assets/images/logo-dark.png'),
  icon: Images?.brand?.logoLight || require('../../assets/images/logo-light.png'),
  fallback: require('../../assets/images/logo.png'),
};

const SOCIAL_ICON_SOURCES = {
  google: require('../../assets/images/google-logo.png'),
  apple: require('../../assets/images/apple-logo.png'),
};

export const CustomIcon = ({ name, size = 24, color = '#111210', style, useBrandAsset = false, brandVariant = 'icon' }) => {
  // --- 1. Brand Asset Interceptor Node ---
  const normName = String(name || '').toLowerCase();
  if (useBrandAsset || ['buza-branding', 'buza-logo', 'logo', 'brand', 'logo-dark'].includes(normName)) {
    const src = normName === 'logo-dark' || String(brandVariant).toLowerCase() === 'dark' ? BRAND_ICON_SOURCES.dark : (brandVariant === 'icon' ? BRAND_ICON_SOURCES.icon : BRAND_ICON_SOURCES.light);
    return <Image source={src || BRAND_ICON_SOURCES.fallback} style={[{ width: size * (brandVariant === 'icon' ? 1.0 : 0.8), height: size * (brandVariant === 'icon' ? 1.0 : 0.8), resizeMode: 'contain', borderRadius: size * 0.16 }, style]} />;
  }

  // --- 2. Social / Filled Icon Special Variants ---
  if (normName === 'google' || normName === 'google-logo') return <Image source={SOCIAL_ICON_SOURCES.google} style={[{ width: size, height: size, resizeMode: 'contain' }, style]} />;
  if (normName === 'apple' || normName === 'apple-logo') return <Image source={SOCIAL_ICON_SOURCES.apple} style={[{ width: size, height: size, resizeMode: 'contain' }, style]} />;
  if (normName === 'favorite-filled') return <Icons.Heart size={size} color={color} strokeWidth={2} fill={color} style={style} />;

  // 3D High-Gloss Emerald Checkmark Architecture
  if (normName === 'checkmark' || normName === 'check') return (
    <View style={[styles.icon3DContainer, style]}><Icons.Check size={size} color="#14532D" strokeWidth={4} style={styles.shadowLayer3D} /><Icons.Check size={size} color="#22C55E" strokeWidth={3.5} /></View>
  );

  // Star handling with conditional highlight fills for product/vendor badges
  if (normName === 'star') return <Icons.Star size={size} color={color} strokeWidth={2} fill={color !== 'transparent' ? color : 'transparent'} style={style} />;

  // --- 3. Complete High-Density Vector Direct Lookup Map ---
  const IconLookup = {
    'home': Icons.Home, 'fudcamp': Icons.Flame, 'cart': Icons.ShoppingBag,
    'delivery-scooter': Icons.Truck, 'service': Icons.Grid2X2, 'heart': Icons.Heart,
    'favorite': Icons.Heart, 'map-pin': Icons.MapPin, 'nearby': Icons.MapPin,
    'user-profile': Icons.User, 'profile': Icons.User, 'user': Icons.UserRound,
    'mail': Icons.Mail, 'calendar': Icons.CalendarDays, 'arrow-left': Icons.ArrowLeft,
    'lock': Icons.Lock, 'eye': Icons.Eye, 'eye-off': Icons.EyeOff,
    'fingerprint': Icons.Fingerprint, 'shield-check': Icons.ShieldCheck, 'check-circle': Icons.CircleCheckBig,
    'search': Icons.Search, 'list': Icons.List, 'grid': Icons.Grid,
    'menu': Icons.Menu, 'plus': Icons.Plus, 'bot': Icons.Cpu,
    'message': Icons.MessageSquare, 'clock': Icons.Clock, 'bell': Icons.Bell,
    'more-vertical': Icons.MoreVertical
  };

  const VectorComponent = IconLookup[normName] || Icons.HelpCircle;
  return <VectorComponent size={size} color={color} strokeWidth={2} style={style} />;
};

const styles = StyleSheet.create({
  icon3DContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  shadowLayer3D: { position: 'absolute', top: 2.5, left: 1, opacity: 0.85 },
});
