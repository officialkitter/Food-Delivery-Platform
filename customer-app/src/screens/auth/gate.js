import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, StatusBar, Easing, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width, height } = Dimensions.get('window');
const COLORS = { 
  primary: '#FF7F50', 
  white: '#FFFFFF', 
  background: '#FFFFFF',
  textDark: '#052A30',      
  textMuted: '#1E6B7B'
};

export default function WelcomeGatewayScreen({ onNavigateToAuth, onNavigateToGuest, onNavigateToSupport }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || COLORS.primary;

  const logoFloat = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const rainAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (anim, toValue, duration) => 
      Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(anim, { toValue: toValue === -5 ? 0 : 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])).start();
    
    loop(logoFloat, -5, 2200);
    loop(logoPulse, 1.03, 1800);
    loop(flashAnim, 1, 3000);

    Animated.loop(
      Animated.timing(rainAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const rainY1 = rainAnim.interpolate({ inputRange: [0,1], outputRange: [-100, height + 50] });
  const rainY2 = rainAnim.interpolate({ inputRange: [0,1], outputRange: [-50, height + 100] });
  
  // Clean passing light glare simulation across the mirror fracture vertices
  const glareOpacity = flashAnim.interpolate({
    inputRange: [0, 0.4, 0.6, 1],
    outputRange: [0.05, 0.4, 0.4, 0.05]
  });

  const Button = ({ onPress, style, textStyle, label, border }) => (
    <TouchableOpacity style={[styles.btn, style, border && styles.btnBorder]} activeOpacity={0.8} onPress={onPress}>
      <Text style={[styles.btnText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* Background VFX Layer Canvas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Calibrated Contrast Ambient Elements */}
        <View style={styles.bubbleDarkTurquoise} />
        <View style={styles.bubbleSalmon} />

        {/* Static Jagged Crackled Mirror Fracture Matrix */}
        <View style={[styles.crackleLine, { top: '25%', left: '-5%', width: '65%', transform: [{ rotate: '22deg' }] }]} />
        <View style={[styles.crackleLine, { top: '50%', right: '-10%', width: '55%', transform: [{ rotate: '-35deg' }] }]} />
        <View style={[styles.crackleLine, { top: '15%', left: '35%', width: '45%', transform: [{ rotate: '110deg' }] }]} />

        {/* Dynamic Specular Shard Light Reflections */}
        <Animated.View style={[styles.mirrorReflection, { top: '22%', left: '40%', opacity: glareOpacity }]} />
        <Animated.View style={[styles.mirrorReflection, { top: '47%', right: '35%', opacity: glareOpacity, width: 22, height: 22 }]} />

        {/* Rain Cascade Engine Layer 1 */}
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: rainY1 }] }]}>
          <View style={[styles.rainDrop, { left: '15%', top: 40 }]} />
          <View style={[styles.rainDrop, { left: '45%', top: 180, height: 45 }]} />
          <View style={[styles.rainDrop, { left: '75%', top: 90 }]} />
        </Animated.View>

        {/* Rain Cascade Engine Layer 2 */}
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: rainY2 }] }]}>
          <View style={[styles.rainDrop, { left: '30%', top: 320, height: 40 }]} />
          <View style={[styles.rainDrop, { left: '60%', top: 460 }]} />
          <View style={[styles.rainDrop, { left: '85%', top: 290 }]} />
        </Animated.View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom, 16) }]} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.branding}>
          <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoFloat }, { scale: logoPulse }] }]}>
            <CustomIcon name="buza-branding" size={96} color={themePrimary} useBrandAsset />
          </Animated.View>
          <Text style={styles.title}>THANKS FOR CHOOSING BUZA</Text>
          <Text style={styles.subtitle}>For Best Food & Drink Delivery Experience</Text>
          <Text style={styles.desc}>No Doubt, We are the right choice Boss.</Text>
        </View>

        <View style={styles.controls}>
          <Button label="PROCEED NOW" onPress={onNavigateToAuth} style={{ backgroundColor: themePrimary }} textStyle={{ fontWeight: '700', color: COLORS.white }} />
          <Button label="Be Our Guest" onPress={onNavigateToGuest} textStyle={{ color: COLORS.textDark }} border />
          <TouchableOpacity style={styles.supportBtn} onPress={onNavigateToSupport}>
            <Text style={styles.supportText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 24, minHeight: height * 0.95 },
  
  // Explicitly updated background bubble configurations
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.05)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.07)' },
  
  // Rain and crackle elements
  rainDrop: { position: 'absolute', width: 1.5, height: 35, backgroundColor: '#1E6B7B', opacity: 0.2, borderRadius: 1 },
  crackleLine: { position: 'absolute', height: 1, backgroundColor: 'rgba(5, 42, 48, 0.07)' },
  
  // Specular high-gloss mirror reflections
  mirrorReflection: { position: 'absolute', width: 16, height: 16, backgroundColor: 'rgba(30, 107, 123, 0.25)', transform: [{ rotate: '45deg' }, { scaleX: 0.3 }], shadowColor: '#052A30', shadowRadius: 4, elevation: 1 },

  branding: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 10, marginBottom: 30 },
  logoContainer: { marginBottom: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: COLORS.textDark, letterSpacing: 1.5, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, fontWeight: '700', color: COLORS.textDark, letterSpacing: 0.5, textAlign: 'center', marginBottom: 8, opacity: 0.85 },
  desc: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18, paddingHorizontal: 10, fontStyle: 'italic' },
  controls: { width: '100%', alignItems: 'center' },
  btn: { width: '100%', height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 12, minHeight: 48 },
  btnBorder: { borderWidth: 1.5, borderColor: COLORS.textDark, backgroundColor: 'rgba(5, 42, 48, 0.02)' },
  btnText: { fontSize: 14, letterSpacing: 0.2 },
  supportBtn: { paddingVertical: 8, minHeight: 48, justifyContent: 'center' },
  supportText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, textDecorationLine: 'underline' }
});
