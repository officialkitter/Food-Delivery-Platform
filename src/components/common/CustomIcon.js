// src/components/CustomIcon.js
import React from 'react';
import { Image } from 'react-native';
import * as Icons from 'lucide-react-native';
import { Images } from '../../constants/theme';

const BRAND_ICON_SOURCES = {
  light: Images?.brand?.logoLight || require('../../assets/images/logo-light.png'),
  dark: Images?.brand?.logoDark || require('../../assets/images/logo-dark.png'),
  icon: Images?.brand?.logoLight || require('../../assets/images/logo-light.png'),
  fallback: require('../../assets/images/logo.png'),
};

const getBrandAssetSource = (variant, name) => {
  const normalizedVariant = String(variant || '').toLowerCase();
  const normalizedName = String(name || '').toLowerCase();

  if (normalizedName === 'buza-branding' || normalizedName === 'buza-logo' || normalizedName === 'logo') {
    return BRAND_ICON_SOURCES.icon;
  }

  if (normalizedName === 'logo-dark') {
    return BRAND_ICON_SOURCES.dark;
  }

  if (normalizedVariant === 'dark') {
    return BRAND_ICON_SOURCES.dark;
  }

  if (normalizedVariant === 'light' || normalizedVariant === 'icon') {
    return BRAND_ICON_SOURCES.light;
  }

  return BRAND_ICON_SOURCES.fallback;
};

// Safe scaling configuration to prevent architectural runtime compilation failures
const getBrandInsetScale = (variant) => {
  return variant === 'icon' ? 1.0 : 0.8;
};

const renderBrandIcon = (source, size, style, brandVariant) => (
  <Image
    source={source}
    style={[
      {
        width: size * getBrandInsetScale(brandVariant),
        height: size * getBrandInsetScale(brandVariant),
        resizeMode: 'contain',
        borderRadius: size * 0.16,
        tintColor: undefined, // Preserves your actual logo colors without forcing overrides
      },
      style,
    ]}
  />
);

export const CustomIcon = ({ name, size = 24, color = '#111210', style, useBrandAsset = false, brandVariant = 'icon' }) => {
  // Automatically force Image rendering if the splash screen calls the core branding asset
  if (useBrandAsset || name === 'buza-branding' || name === 'buza-logo' || name === 'logo' || name === 'brand') {
    const brandSource = getBrandAssetSource(brandVariant, name);
    return renderBrandIcon(brandSource, size, style, brandVariant);
  }

  switch (name) {
    // Horizon Dock Cutout Mappings
    case 'home':
      return <Icons.Home size={size} color={color} strokeWidth={2} style={style} />;
    case 'fudcamp':
      return <Icons.Flame size={size} color={color} strokeWidth={2} style={style} />;
    case 'cart':
      return <Icons.ShoppingBag size={size} color={color} strokeWidth={2} style={style} />;
    case 'delivery-scooter':
      return <Icons.Truck size={size} color={color} strokeWidth={2} style={style} />;
    case 'service':
      return <Icons.Grid2X2 size={size} color={color} strokeWidth={2} style={style} />;
    case 'heart':
    case 'favorite':
      return <Icons.Heart size={size} color={color} strokeWidth={2} style={style} />;
    case 'favorite-filled':
      return <Icons.Heart size={size} color={color} strokeWidth={2} fill={color} style={style} />;
    case 'map-pin':
    case 'nearby':
      return <Icons.MapPin size={size} color={color} strokeWidth={2} style={style} />;
    case 'user-profile':
    case 'profile':
      return <Icons.User size={size} color={color} strokeWidth={2} style={style} />;
    case 'user':
      return <Icons.UserRound size={size} color={color} strokeWidth={2} style={style} />;
    case 'mail':
      return <Icons.Mail size={size} color={color} strokeWidth={2} style={style} />;
    case 'calendar':
      return <Icons.CalendarDays size={size} color={color} strokeWidth={2} style={style} />;
    case 'arrow-left':
      return <Icons.ArrowLeft size={size} color={color} strokeWidth={2} style={style} />;
    case 'lock':
      return <Icons.Lock size={size} color={color} strokeWidth={2} style={style} />;
    case 'eye':
      return <Icons.Eye size={size} color={color} strokeWidth={2} style={style} />;
    case 'eye-off':
      return <Icons.EyeOff size={size} color={color} strokeWidth={2} style={style} />;
    case 'fingerprint':
      return <Icons.Fingerprint size={size} color={color} strokeWidth={2} style={style} />;
    case 'shield-check':
      return <Icons.ShieldCheck size={size} color={color} strokeWidth={2} style={style} />;
    case 'check-circle':
      return <Icons.CircleCheckBig size={size} color={color} strokeWidth={2} style={style} />;

    // Discovery UI Mappings
    case 'search':
      return <Icons.Search size={size} color={color} strokeWidth={2} style={style} />;
    case 'list':
      return <Icons.List size={size} color={color} strokeWidth={2} style={style} />;
    case 'grid':
      return <Icons.Grid size={size} color={color} strokeWidth={2} style={style} />;
    case 'menu':
      return <Icons.Menu size={size} color={color} strokeWidth={2} style={style} />;
    case 'star':
      return <Icons.Star size={size} color={color} strokeWidth={2} fill={color === '#C5A059' ? '#C5A059' : 'transparent'} style={style} />;
    case 'plus':
      // Clean integer stroke thickness to avoid zero fraction configurations
      return <Icons.Plus size={size} color={color} strokeWidth={3} style={style} />;
    
    // Cognitive Bot Layer Mappings
    case 'bot':
      return <Icons.Cpu size={size} color={color} strokeWidth={2} style={style} />;
    case 'message':
      return <Icons.MessageSquare size={size} color={color} strokeWidth={2} style={style} />;
    case 'clock':
      return <Icons.Clock size={size} color={color} strokeWidth={2} style={style} />;

    default:
      // Robust structural fallback layout prevents compiling failures
      return <Icons.HelpCircle size={size} color={color} strokeWidth={2} style={style} />;
  }
};
