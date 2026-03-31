/**
 * Dashboard Home Screen
 * Botanical luxury design with clean, impressive visual hierarchy
 * Theme synced with OrchidPal web
 */

import { FABMenu, HeroDeviceCard, InsightCard, NotificationBell, ZoneCard, type Insight } from '@/components/dashboard'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useRouter } from 'expo-router'
import { Leaf, Sparkles } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const AI_INSIGHTS: Insight[] = [
  { id: '1', text: 'Early heatwave detected — consider +1 mist cycle', type: 'warning' },
  { id: '2', text: 'VPD optimal for blooming phase', type: 'success' }
]

import { THEME } from '@/constants/theme'
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
    <View className='flex-1 bg-paper'>
      <SafeAreaView className='flex-1' edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)}>
          <HStack className='items-center justify-between px-5 py-4'>
            <VStack>
              <Text className='font-sans text-[13px] uppercase tracking-wider text-ink-muted'> Good morning</Text>
              <Text className='mt-1 py-2 font-serif text-[28px] font-semibold leading-9 text-ink'>
                Your <Text className='font-serif italic text-orchid-main'>Sanctuary</Text>
              </Text>
            </VStack>
            <NotificationBell />
          </HStack>
        </Animated.View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 20 }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.forest} />}
        >
          {/* Hero Device Card */}
          <HeroDeviceCard />

          {/* My Zones Section */}
          <Animated.View entering={FadeInUp.delay(300).duration(400)}>
            <HStack className='mt-1 items-center justify-between'>
              <HStack className='items-center gap-2'>
                <Leaf size={18} color={THEME.forest} strokeWidth={1.5} />
                <Text className='font-serif text-[18px] font-semibold text-ink'>My Zones</Text>
              </HStack>
              <TouchableOpacity onPress={() => router.push('/(dashboard)/garden?tab=zones')}>
                <Text className='font-sans text-[13px] font-medium text-forest'>Manage</Text>
              </TouchableOpacity>
            </HStack>
          </Animated.View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingRight: 20 }}
          >
            {zones.map((zone: any, index: number) => (
              <ZoneCard key={zone.id} zone={zone} index={index} onPress={() => router.push(`/zone/${zone.id}`)} />
            ))}
          </ScrollView>

          {/* AI Insights Section */}
          <Animated.View entering={FadeInUp.delay(350).duration(400)}>
            <HStack className='mt-1 items-center justify-between'>
              <HStack className='items-center gap-2'>
                <Sparkles size={18} color={THEME.gold} strokeWidth={1.5} />
                <Text className='font-serif text-[18px] font-semibold text-ink'>Smart Insights</Text>
              </HStack>
            </HStack>
          </Animated.View>

          <VStack className='gap-2.5'>
            {AI_INSIGHTS.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </VStack>

          {/* Bottom spacing for tab bar */}
          <View className='h-[100px]' />
        </ScrollView>
      </SafeAreaView>

      {/* Floating Action Button */}
      <FABMenu />
    </View>
  )
}
