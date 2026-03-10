import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { ChevronRight, Sparkles } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { THEME } from './theme'

export interface Insight {
  id: string
  text: string
  type: 'warning' | 'success'
}

interface InsightCardProps {
  insight: Insight
  index: number
  onPress?: () => void
}

export function InsightCard({ insight, index, onPress }: InsightCardProps) {
  const isWarning = insight.type === 'warning'

  return (
    <Animated.View entering={FadeInUp.delay(400 + index * 100).duration(400)}>
      <TouchableOpacity
        style={[styles.insightCard, { backgroundColor: isWarning ? '#fef3e8' : '#f0f9f4' }]}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <View style={[styles.insightIcon, { backgroundColor: isWarning ? THEME.gold : THEME.forest }]}>
          <Sparkles size={16} color='white' strokeWidth={1.5} />
        </View>
        <VStack style={{ flex: 1 }}>
          <Text style={styles.insightLabel}>AI Insight</Text>
          <Text style={styles.insightText}>{insight.text}</Text>
        </VStack>
        <ChevronRight size={18} color={THEME.inkMuted} />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    padding: 16
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: THEME.inkMuted
  },
  insightText: {
    fontSize: 14,
    color: THEME.ink,
    marginTop: 2
  }
})
