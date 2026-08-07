import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from './ThemeContext';
import { AlertCircle, Clock, CreditCard, ChevronRight, MessageSquare, ShieldCheck, ShieldAlert } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpCenter() {
  const navigation = useNavigation();
  const theme = useAppTheme();
  const styles = theme.styles || theme.activeTheme;
  const activeTheme = theme.activeTheme || theme.styles || { tier_level: 'BASIC' };

  const triageCategories = [
    { id: 'missing_toppings', title: 'Missing Ingredients & Toppings', sub: 'Incomplete merchant assemblies or order variances.', icon: AlertCircle },
    { id: 'late_riders', title: 'Late Riders & Fulfillment Delays', sub: 'Active tracking problems, delivery stalls, or routing issues.', icon: Clock },
    { id: 'payment_issues', title: 'Payment Gateways & Discrepancies', sub: 'M-Pesa validation errors, card drops, double charges.', icon: CreditCard },
  ];

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: styles.background }]}>
      <View style={globalStyles.headerContainer}>
        <Text style={[globalStyles.metaTitle, { color: styles.accentSolid }]}>DIAGNOSTIC SYSTEM CENTRAL</Text>
        <Text style={[globalStyles.mainTitle, { color: styles.textPrimary }]}>Help & Resolution Triage</Text>
        <Text style={[globalStyles.subtitle, { color: styles.textSecondary }]}>
          Active Tier Workspace: {activeTheme.tier_level}
        </Text>
      </View>

      <ScrollView contentContainerStyle={globalStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[stylesInternal.sectionHeading, { color: styles.textPrimary }]}>Immediate Issue Inquiries</Text>
        {triageCategories.map((item) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={[stylesInternal.triageCard, { backgroundColor: styles.surface, borderColor: styles.accentBorder }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DisputeTerminal', { CategoryId: item.id })}
            >
              <View style={[stylesInternal.iconContainer, { backgroundColor: styles.accentGlow }]}>
                <IconComponent size={22} color={styles.accentSolid} />
              </View>
              <View style={stylesInternal.textFrame}>
                <Text style={[stylesInternal.cardTitle, { color: styles.textPrimary }]}>{item.title}</Text>
                <Text style={[stylesInternal.cardSub, { color: styles.textSecondary }]}>{item.sub}</Text>
              </View>
              <ChevronRight size={18} color={styles.textSecondary} />
            </TouchableOpacity>
          );
        })}

        <Text style={[stylesInternal.sectionHeading, { color: styles.textPrimary, marginTop: 24 }]}>Operational Shortcuts</Text>
        <View style={stylesInternal.gridContainer}>
          <TouchableOpacity 
            style={[stylesInternal.gridButton, { backgroundColor: styles.surface }]}
            onPress={() => navigation.navigate('LiveSupport')}
          >
            <MessageSquare size={20} color={styles.accentSolid} />
            <Text style={[stylesInternal.gridLabel, { color: styles.textPrimary }]}>Live Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[stylesInternal.gridButton, { backgroundColor: styles.surface }]}
            onPress={() => navigation.navigate('TicketMonitor')}
          >
            <Clock size={20} color={styles.accentSolid} />
            <Text style={[stylesInternal.gridLabel, { color: styles.textPrimary }]}>Claims Monitor</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[stylesInternal.gridButton, { backgroundColor: styles.surface }]}
            onPress={() => navigation.navigate('SecurityDash')}
          >
            <ShieldCheck size={20} color={styles.accentSolid} />
            <Text style={[stylesInternal.gridLabel, { color: styles.textPrimary }]}>Security</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[stylesInternal.gridButton, { backgroundColor: styles.surface }]}
            onPress={() => navigation.navigate('CacheCleaner')}
          >
            <ShieldAlert size={20} color={styles.accentSolid} />
            <Text style={[stylesInternal.gridLabel, { color: styles.textPrimary }]}>Storage Engine</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const globalStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  headerContainer: { paddingHorizontal: 20, marginBottom: 16 },
  metaTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  mainTitle: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 }
});

const stylesInternal = StyleSheet.create({
  sectionHeading: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5, marginBottom: 12 },
  triageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12
  },
  iconContainer: { padding: 10, borderRadius: 12, marginRight: 14 },
  textFrame: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardSub: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridButton: { width: '48%', paddingVertical: 16, alignItems: 'center', borderRadius: 16, marginBottom: 12 },
  gridLabel: { fontSize: 13, fontWeight: '600', marginTop: 8 }
});
