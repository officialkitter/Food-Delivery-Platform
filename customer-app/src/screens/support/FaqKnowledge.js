import React, { useState } from 'react';
import propTypes from 'prop-types';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, LayoutAnimation } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FaqKnowledge({ navigation }) {
  const { styles } = useAppTheme();
  const [expandedId, setExpandedId] = useState(null);

  const faqData = [
    { id: 1, q: 'How do SubHub periodic subscription orders execute drops?', a: 'Subscription packages configured inside SubHub orchestrate future deliveries automatically based on target timestamp cron sequences on the backend cluster, bypassing real-time manually validated client checkouts.' },
    { id: 2, q: 'What happens to data when a bulk event headcount parameters change?', a: 'Modifying internal parameters inside BulkWelcome triggers instantaneous volume pricing recalculated dynamically by our live Python scaling engine, transforming layout profiles instantly.' },
    { id: 3, q: 'Can I stop active scheduled meals inside the ScheduleWheel wheel interface?', a: 'Yes. Modifying properties on the physical ScheduleWheel selector canvas rewrites immediate target records stored in Supabase up to exactly 120 minutes prior to courier dispatch pipelines.' }
  ];

  const toggleAccordion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={[stylesInternalGlobal.container, { backgroundColor: styles.background }]}>
      <View style={stylesInternalGlobal.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={styles.textPrimary} />
        </TouchableOpacity>
        <Text style={[stylesInternalGlobal.headerTitle, { color: styles.textPrimary }]}>Knowledge Directory</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Text style={[stylesInternalGlobal.sectionDesc, { color: styles.textSecondary }]}>
          Detailed execution paradigms governing subscription tracks, real-time bulk changes, and event planning operations.
        </Text>

        {faqData.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <View key={faq.id} style={[stylesInternalGlobal.faqBox, { backgroundColor: styles.surface, borderColor: styles.accentBorder }]}>
              <TouchableOpacity 
                style={stylesInternalGlobal.faqTrigger} 
                activeOpacity={0.8}
                onPress={() => toggleAccordion(faq.id)}
              >
                <Text style={[stylesInternalGlobal.faqQuestion, { color: styles.textPrimary }]}>{faq.q}</Text>
                {isExpanded ? <ChevronUp size={18} color={styles.accentSolid} /> : <ChevronDown size={18} color={styles.textSecondary} />}
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={[stylesInternalGlobal.answerFrame, { borderTopColor: styles.accentGlow }]}>
                  <Text style={[stylesInternalGlobal.faqAnswer, { color: styles.textSecondary }]}>{faq.a}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

FaqKnowledge.propTypes = {
  navigation: propTypes.shape({
    goBack: propTypes.func.isRequired,
  }).isRequired,
};

const stylesInternalGlobal = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 16 },
  sectionDesc: { fontSize: 13, lineHeight: 18, marginBottom: 24 },
  faqBox: { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  faqTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  faqQuestion: { fontSize: 14, fontWeight: '600', flex: 1, paddingRight: 12, lineHeight: 18 },
  answerFrame: { padding: 16, borderTopWidth: 1 },
  faqAnswer: { fontSize: 13, lineHeight: 20 }
});
