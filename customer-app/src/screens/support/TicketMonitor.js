import React from 'react';
import propTypes from 'prop-types';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ArrowLeft, GitCommit, ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TicketMonitor({ navigation }) {
  const { styles } = useAppTheme();

  const milestones = [
    { id: 1, title: 'Dispute Record Initiated', desc: 'Metadata captured and synced into secure operational tables.', time: 'Today, 14:02', done: true },
    { id: 2, title: 'Merchant Evaluation', desc: 'Payload checked against original ItemCustomize.js basket matrix configurations.', time: 'Today, 14:15', done: true },
    { id: 3, title: 'Compensation Allocation', desc: 'Resolving credit distribution bounds through Python computational logic loops.', time: 'Processing...', done: false }
  ];

  return (
    <SafeAreaView style={[stylesMonitor.container, { backgroundColor: styles.background }]}>
      <View style={stylesMonitor.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={styles.textPrimary} />
        </TouchableOpacity>
        <Text style={[stylesMonitor.headerTitle, { color: styles.textPrimary }]}>Claim Status Pipeline</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={[stylesMonitor.statusSummary, { backgroundColor: styles.surface, borderColor: styles.accentBorder }]}>
          <Text style={[stylesMonitor.summaryLabel, { color: styles.textSecondary }]}>ACTIVE CLAIM ID</Text>
          <Text style={[stylesMonitor.summaryId, { color: styles.textPrimary }]}>#BUZA-7401-MDB</Text>
          <View style={[stylesMonitor.badge, { backgroundColor: styles.accentGlow }]}>
            <Text style={[stylesMonitor.badgeText, { color: styles.accentSolid }]}>UNDER MEDIATION REVIEW</Text>
          </View>
        </View>

        <Text style={[stylesMonitor.timelineTitle, { color: styles.textPrimary }]}>System Resolution Path</Text>

        <View style={stylesMonitor.timelineContainer}>
          {milestones.map((step, index) => (
            <View key={step.id} style={stylesMonitor.timelineRow}>
              <View style={stylesMonitor.nodeCol}>
                <View style={[stylesMonitor.circleNode, { backgroundColor: step.done ? styles.accentSolid : styles.surface, borderColor: styles.accentBorder }]}>
                  {step.done ? <ShieldCheck size={12} color="#FFFFFF" /> : <GitCommit size={12} color={styles.textSecondary} />}
                </View>
                {index < milestones.length - 1 && <View style={[stylesMonitor.verticalLine, { backgroundColor: step.done ? styles.accentSolid : styles.accentGlow }]} />}
              </View>
              <View style={stylesMonitor.contentCol}>
                <Text style={[stylesMonitor.stepTitle, { color: styles.textPrimary, fontWeight: step.done ? '700' : '500' }]}>{step.title}</Text>
                <Text style={[stylesMonitor.stepDesc, { color: styles.textSecondary }]}>{step.desc}</Text>
                <Text style={[stylesMonitor.stepTime, { color: styles.accentSolid }]}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

TicketMonitor.propTypes = {
  navigation: propTypes.shape({
    goBack: propTypes.func.isRequired,
  }).isRequired,
};

const stylesMonitor = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 16 },
  statusSummary: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 28 },
  summaryLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  summaryId: { fontSize: 22, fontWeight: '800', marginTop: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 12 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  timelineTitle: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5, marginBottom: 16 },
  timelineContainer: { paddingLeft: 8 },
  timelineRow: { flexDirection: 'row', minHeight: 80 },
  nodeCol: { alignItems: 'center', marginRight: 16 },
  circleNode: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  verticalLine: { flex: 1, width: 2, marginVertical: 4 },
  contentCol: { flex: 1, paddingBottom: 24 },
  stepTitle: { fontSize: 15 },
  stepDesc: { fontSize: 12, marginTop: 3, lineHeight: 16 },
  stepTime: { fontSize: 11, marginTop: 4, fontWeight: '600' }
});
