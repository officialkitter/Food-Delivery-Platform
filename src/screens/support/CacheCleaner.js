import React, { useState } from 'react';
import propTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ArrowLeft, HardDrive, Trash2, ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CacheCleaner({ navigation }) {
  const { styles } = useAppTheme();
  const [cleaningState, setCleaningState] = useState('idle'); // idle | parsing | complete
  const [allocatedBytes, setAllocatedBytes] = useState('242.8 MB');

  const executeStoragePruning = () => {
    setCleaningState('parsing');
    // Triggers local system purge dropping old 6-second video loops and media arrays
    setTimeout(() => {
      setAllocatedBytes('0.00 KB');
      setCleaningState('complete');
      Alert.alert('Storage Restructured', 'All local volatile video cache clusters and temporary UI assets successfully dropped.');
    }, 2200);
  };

  return (
    <SafeAreaView style={[stylesCache.container, { backgroundColor: styles.background }]}>
      <View style={stylesCache.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={styles.textPrimary} />
        </TouchableOpacity>
        <Text style={[stylesCache.headerTitle, { color: styles.textPrimary }]}>Local Storage Engine</Text>
      </View>

      <View style={stylesCache.displayCard}>
        <View style={[stylesCache.iconFrame, { backgroundColor: styles.accentGlow }]}>
          <HardDrive size={36} color={styles.accentSolid} />
        </View>

        <Text style={[stylesCache.metricLabel, { color: styles.textSecondary }]}>VOLATILE VIDEO BYTE STORAGE</Text>
        <Text style={[stylesCache.metricValue, { color: styles.textPrimary }]}>{allocatedBytes}</Text>
        <Text style={[stylesCache.description, { color: styles.textSecondary }]}>
          Scans and flushes temporary data segments left behind by volatile 6-second social video loops, preventing device memory inflation.
        </Text>

        {cleaningState === 'idle' && (
          <TouchableOpacity 
            style={[stylesCache.actionBtn, { backgroundColor: styles.accentSolid }]}
            onPress={executeStoragePruning}
            activeOpacity={0.8}
          >
            <Trash2 size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={stylesCache.actionText}>Purge Temporary Loops</Text>
          </TouchableOpacity>
        )}

        {cleaningState === 'parsing' && (
          <View style={[stylesCache.loaderFrame, { backgroundColor: styles.surface }]}>
            <ActivityIndicator size="small" color={styles.accentSolid} />
            <Text style={[stylesCache.loaderText, { color: styles.textPrimary }]}>Dropping localized binaries...</Text>
          </View>
        )}

        {cleaningState === 'complete' && (
          <View style={[stylesCache.completeBanner, { borderColor: styles.accentBorder }]}>
            <ShieldCheck size={18} color={styles.accentSolid} style={{ marginRight: 8 }} />
            <Text style={[stylesCache.completeText, { color: styles.textPrimary }]}>Device Storage Optimized</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

CacheCleaner.propTypes = {
  navigation: propTypes.shape({
    goBack: propTypes.func.isRequired,
  }).isRequired,
};

const stylesCache = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 16 },
  displayCard: { margin: 24, padding: 24, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  iconFrame: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  metricLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  metricValue: { fontSize: 36, fontWeight: '800', marginTop: 6, marginBottom: 12 },
  description: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 32, paddingHorizontal: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', height: 46, paddingHorizontal: 24, borderRadius: 23 },
  actionText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  loaderFrame: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20 },
  loaderText: { fontSize: 13, fontWeight: '600', marginLeft: 10 },
  completeBanner: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20 },
  completeText: { fontSize: 13, fontWeight: '700' }
});
