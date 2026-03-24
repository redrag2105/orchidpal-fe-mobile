/**
 * Dashboard Home Screen
 * Botanical luxury design with clean, impressive visual hierarchy
 * Theme synced with OrchidPal web
 */

import {
  FABMenu,
  FONTS,
  HeroDeviceCard,
  InsightCard,
  NotificationBell,
  THEME,
  ZoneCard,
  type Insight
} from '@/components/dashboard'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useRouter } from 'expo-router'
import { Leaf, Sparkles } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const AI_INSIGHTS: Insight[] = [
  { id: '1', text: 'Early heatwave detected — consider +1 mist cycle', type: 'warning' },
  { id: '2', text: 'VPD optimal for blooming phase', type: 'success' }
]

import { useZones } from '@/hooks/queries/useZones'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTab'
import { useQueryClient } from '@tanstack/react-query'

export default function Dashboard() {
  const router = useRouter()
  const handleScroll = useDynamicBottomTab()
  const queryClient = useQueryClient()
  const { data: zones = [], isLoading: isLoadingZones } = useZones()

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries()
    setRefreshing(false)
  }, [queryClient])

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)}>
          <HStack style={styles.header}>
            <VStack>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.headerTitle}>
                Your <Text style={styles.headerTitleAccent}>Sanctuary</Text>
              </Text>
            </VStack>
            <NotificationBell />
          </HStack>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.forest} />}
        >
          {/* Hero Device Card */}
          <HeroDeviceCard />

          {/* My Zones Section */}
          <Animated.View entering={FadeInUp.delay(300).duration(400)}>
            <HStack style={styles.sectionHeader}>
              <HStack style={{ gap: 8, alignItems: 'center' }}>
                <Leaf size={18} color={THEME.forest} strokeWidth={1.5} />
                <Text style={styles.sectionTitle}>My Zones</Text>
              </HStack>
              <TouchableOpacity onPress={() => router.push('/(dashboard)/garden?tab=zones')}>
                <Text style={styles.seeAll}>Manage</Text>
              </TouchableOpacity>
            </HStack>
          </Animated.View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zonesScroll}>
            {zones.map((zone: any, index: number) => (
              <ZoneCard key={zone.id} zone={zone} index={index} onPress={() => router.push(`/zone/${zone.id}`)} />
            ))}
          </ScrollView>

          {/* AI Insights Section */}
          <Animated.View entering={FadeInUp.delay(350).duration(400)}>
            <HStack style={styles.sectionHeader}>
              <HStack style={{ gap: 8, alignItems: 'center' }}>
                <Sparkles size={18} color={THEME.gold} strokeWidth={1.5} />
                <Text style={styles.sectionTitle}>Smart Insights</Text>
              </HStack>
            </HStack>
          </Animated.View>

          <VStack style={{ gap: 10 }}>
            {AI_INSIGHTS.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </VStack>

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Floating Action Button */}
      <FABMenu />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.paper
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  greeting: {
    fontSize: 13,
    color: THEME.inkMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  headerTitle: {
    paddingTop: 8,
    paddingBottom: 8,
    lineHeight: 36,
    fontSize: 28,
    fontWeight: '600',
    fontFamily: FONTS.serif,
    color: THEME.ink,
    marginTop: 4
  },
  headerTitleAccent: {
    fontStyle: 'italic',
    color: THEME.orchidMain
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.orchidMain
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 20
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONTS.serif,
    color: THEME.ink
  },
  seeAll: {
    fontSize: 13,
    color: THEME.forest,
    fontWeight: '500'
  },
  zonesScroll: {
    gap: 14,
    paddingRight: 20
  }
})
