import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, StatusBar, Easing, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width, height } = Dimensions.get('window');
// Updated backdrop to premium Dark Turquoise theme colors
const COLORS = { primary: '#FF7F50', charcoal: '#052A30', white: '#FFFFFF', muted: '#A2C4C9', scrim: 'rgba(5, 42, 48, 0.4)' };

export default function WelcomeGatewayScreen({ onNavigateToAuth, onNavigateToGuest, onNavigateToSupport }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || COLORS.primary;

  const logoFloat = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const shineAnim = useRef(new Animated.Value(0)).current; // Cinema flare path engine

  useEffect(() => {
    const loop = (anim, toValue, duration) => 
      Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(anim, { toValue: toValue === -5 ? 0 : 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])).start();
    loop(logoFloat, -5, 2200);
    loop(logoPulse, 1.03, 1800);

    // Dynamic, premium shining flare curve path loop configuration
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Easing curve for cinematic speed adjustments
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Complex multi-property interpolation layers for the shine effect
  const shineTranslateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 1.8, width * 1.8],
  });

  const shineRotate = shineAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['15deg', '35deg', '55deg'], // Rotates dynamically as it sweeps the screen
  });

  const shineScaleX = shineAnim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [1, 1.6, 1.6, 1], // Expands in thickness as it passes the screen centerpiece
  });

  const Button = ({ onPress, style, textStyle, label, border }) => (
    <TouchableOpacity style={[styles.btn, style, border && styles.btnBorder]} activeOpacity={0.8} onPress={onPress}>
      <Text style={[styles.btnText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Ambient Canvas Backdrop Frame Layer */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />
        <View style={styles.grid} />
        
        {/* Multilayer Cinematic Shining Lens/Flare Matrix */}
        <Animated.View 
          style={[
            styles.shineGlowBackdropContainer, 
            { 
              transform: [
                { translateX: shineTranslateX }, 
                { rotate: shineRotate },
                { scaleX: shineScaleX }
              ] 
            }
          ]} 
        >
          {/* Inner high-intensity Core light beam */}
          <View style={styles.shineCoreBeamLine} />
          {/* Subordinate ambient wash layout ring wrapper */}
          <View style={styles.shineAuraWashLayer} />
        </Animated.View>
        
        <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.scrim }]} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom, 16) }]} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Branding Elements */}
        <View style={styles.branding}>
          <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoFloat }, { scale: logoPulse }] }]}>
            <CustomIcon name="buza-branding" size={96} color={themePrimary} useBrandAsset />
          </Animated.View>
          <Text style={styles.title}>THANKS FOR CHOOSING BUZA</Text>
          <Text style={styles.subtitle}>For Best Food & Drink Delivery Experience</Text>
          <Text style={styles.desc}>No Doubt, We are the right choice Boss.</Text>
        </View>

        {/* Action Controls */}
        <View style={styles.controls}>
          <Button label="PROCEED NOW" onPress={onNavigateToAuth} style={{ backgroundColor: themePrimary }} textStyle={{ fontWeight: '700' }} />
          <Button label="Be Our Guest" onPress={onNavigateToGuest} textStyle={{ color: COLORS.white }} border />
          <TouchableOpacity style={styles.supportBtn} onPress={onNavigateToSupport}>
            <Text style={styles.supportText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.charcoal },
  scroll: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 24, minHeight: height * 0.95 },
  orbOne: { position: 'absolute', top: -40, right: -50, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(72, 209, 204, 0.25)' },
  orbTwo: { position: 'absolute', bottom: -60, left: -40, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(255, 127, 80, 0.15)' },
  grid: { ...StyleSheet.absoluteFillObject, borderWidth: 1, borderColor: 'rgba(255,255,255,0.015)' },
  
  // Luxury composite light shine controller container layout
  shineGlowBackdropContainer: {
    position: 'absolute',
    top: -height * 0.3,
    width: width * 0.5,
    height: height * 1.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shineCoreBeamLine: {
    position: 'absolute',
    width: 14,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // Vivid crisp center line split accent
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
  },
  shineAuraWashLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Diffused wider soft sweep halo frame
    shadowColor: 'rgba(72, 209, 204, 0.6)',
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 5,
  },

  branding: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 10, marginBottom: 30 },
  logoContainer: { marginBottom: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: COLORS.white, letterSpacing: 1.5, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, fontWeight: '700', color: COLORS.white, letterSpacing: 0.5, textAlign: 'center', marginBottom: 8, opacity: 0.95 },
  desc: { fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 18, paddingHorizontal: 10, fontStyle: 'italic' },
  controls: { width: '100%', alignItems: 'center' },
  btn: { width: '100%', height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 12, minHeight: 48 },
  btnBorder: { borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.25)', backgroundColor: 'rgba(255, 255, 255, 0.03)' },
  btnText: { fontSize: 14, color: COLORS.white, letterSpacing: 0.2 },
  supportBtn: { paddingVertical: 8, minHeight: 48, justifyContent: 'center' },
  supportText: { fontSize: 13, fontWeight: '600', color: COLORS.muted, textDecorationLine: 'underline' }
});
