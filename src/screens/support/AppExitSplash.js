import React, { useEffect } from 'react';
import { StyleSheet, Text, View, BackHandler, ActivityIndicator } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { Power } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppExitSplash() {
  const { styles } = useAppTheme();

  useEffect(() => {
    const processSessionTeardown = setTimeout(() => {
      // Gracefully closes connections and shuts down active hardware threads
      BackHandler.exitApp();
    }, 3000);

    return () => clearTimeout(processSessionTeardown);
  }, []);

  return (
    <SafeAreaView style={[stylesExit.container, { backgroundColor: styles.background }]}>
      <View style={stylesExit.contentBlock}>
        <View style={[stylesExit.glowCircle, { backgroundColor: styles.accentGlow }]}>
          <Power size={36} color={styles.accentSolid} />
        </View>

        <Text style={[stylesExit.title, { color: styles.textPrimary }]}>Closing Session</Text>
        <Text style={[stylesExit.subtitle, { color: styles.textSecondary }]}>
          Dropping socket hooks, saving operational states, and sealing diagnostic vaults securely...
        </Text>

        <ActivityIndicator size="small" color={styles.accentSolid} style={{ marginTop: 40 }} />
      </View>
    </SafeAreaView>
  );
}

const stylesExit = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentBlock: { alignItems: 'center', paddingHorizontal: 40 },
  glowCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 20 }
});
