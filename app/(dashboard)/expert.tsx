/**
 * Care Tips Screen
 * Expert recommendations and orchid care guides
 */

import { BookOpen, Lightbulb, Sparkles } from 'lucide-react-native'
import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'

const THEME = {
  paper: '#fdfcf8',
  ink: '#14281d',
  inkLight: '#3a5a40',
  orchidMain: '#9f5f80',
  orchidDeep: '#582c4d',
  forest: '#4a795f',
}

const TIPS = [
  {
    id: '1',
    title: 'Watering Phalaenopsis',
    excerpt: 'Water when roots turn silver-gray...',
    category: 'Watering',
    readTime: '3 min',
  },
  {
    id: '2',
    title: 'Optimal Light Levels',
    excerpt: 'Most orchids prefer bright, indirect light...',
    category: 'Lighting',
    readTime: '4 min',
  },
  {
    id: '3',
    title: 'Repotting Guide',
    excerpt: 'Repot every 1-2 years in fresh bark...',
    category: 'Care',
    readTime: '5 min',
  },
]

function TipCard({ tip }: { tip: typeof TIPS[0] }) {
  return (
    <TouchableOpacity style={styles.tipCard} activeOpacity={0.8}>
      <View style={styles.tipIcon}>
        <BookOpen size={20} color={THEME.forest} strokeWidth={1.5} />
      </View>
      <VStack style={{ flex: 1 }}>
        <Text style={styles.tipCategory}>{tip.category}</Text>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipExcerpt} numberOfLines={1}>{tip.excerpt}</Text>
      </VStack>
      <Text style={styles.tipTime}>{tip.readTime}</Text>
    </TouchableOpacity>
  )
}

export default function ExpertScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <HStack style={styles.header}>
          <VStack>
            <Text style={styles.headerTitle}>Care Tips</Text>
            <Text style={styles.headerSubtitle}>Expert orchid guidance</Text>
          </VStack>
          <View style={styles.aiIcon}>
            <Sparkles size={18} color={THEME.orchidMain} strokeWidth={2} />
          </View>
        </HStack>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* AI Insight */}
          <TouchableOpacity style={styles.aiCard} activeOpacity={0.9}>
            <HStack style={{ gap: 12, alignItems: 'center' }}>
              <View style={styles.aiCardIcon}>
                <Lightbulb size={20} color="white" strokeWidth={1.5} />
              </View>
              <VStack style={{ flex: 1 }}>
                <Text style={styles.aiCardLabel}>Personalized Tip</Text>
                <Text style={styles.aiCardText}>
                  Based on your environment, increase humidity to 65% for optimal blooming.
                </Text>
              </VStack>

            </HStack>
          </TouchableOpacity>

          {/* Tips List */}
          <Text style={styles.sectionTitle}>Popular Guides</Text>
          <VStack style={{ gap: 12 }}>
            {TIPS.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.paper,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.ink,
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.inkLight,
    marginTop: 2,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(159,95,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 20,
  },
  aiCard: {
    backgroundColor: THEME.orchidDeep,
    borderRadius: 18,
    padding: 18,
  },
  aiCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiCardText: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: THEME.ink,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(74,121,95,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink,
    marginTop: 2,
  },
  tipExcerpt: {
    fontSize: 12,
    color: THEME.inkLight,
    marginTop: 2,
  },
  tipTime: {
    fontSize: 11,
    color: THEME.inkLight,
  },
})
