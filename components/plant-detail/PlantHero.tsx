import { Text } from '@/components/ui/text'
import { THEME } from '@/constants/theme'
import { Calendar, HeartPulse } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

export function PlantHero({ plant, wikiInfo }: { plant: any; wikiInfo: any }) {
  const isHealthy = plant.health_status === 'GOOD'

  return (
    <>
      <View className='mb-6'>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(500)}
          className='font-serif text-[36px] font-extrabold leading-[42px] tracking-[-0.5px] text-ink'
        >
          {plant.nickname || 'Unknown Plant'}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(300).duration(500)}
          className='mt-1 font-sans text-base text-ink-muted'
        >
          {wikiInfo?.common_name || 'Mysterious Species'}
        </Animated.Text>
      </View>

      {/* Status & Actions Floating Bar */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(500)}
        className='mb-8 flex-row items-center justify-between rounded-[24px] border border-[#14281d]/5 bg-white px-4 py-[18px]'
        style={{
          shadowColor: THEME.ink,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.04,
          shadowRadius: 20,
          elevation: 4
        }}
      >
        <View className='shrink flex-row items-center gap-2'>
          <View
            className={`h-9 w-9 items-center justify-center rounded-xl ${isHealthy ? 'bg-forest/10' : 'bg-gold/10'}`}
          >
            <HeartPulse size={22} color={isHealthy ? THEME.forest : THEME.gold} strokeWidth={2.5} />
          </View>
          <View className='shrink justify-center'>
            <Text className='mb-0.5 font-sans text-[10px] uppercase tracking-[0.5px] text-ink-light'>
              Health Status
            </Text>
            <Text
              className={`font-sans text-[14px] font-bold tracking-[0.3px] ${isHealthy ? 'text-forest' : 'text-gold'}`}
            >
              {plant.health_status ? plant.health_status.toUpperCase() : 'UNKNOWN'}
            </Text>
          </View>
        </View>

        <View className='bg-paper-deep mx-2 h-8 w-[1px]' />

        <View className='shrink flex-row items-center gap-2'>
          <View className='h-9 w-9 items-center justify-center rounded-xl bg-[#14281d]/5'>
            <Calendar size={22} color={THEME.ink} strokeWidth={2} />
          </View>
          <View className='shrink justify-center'>
            <Text className='mb-0.5 font-sans text-[10px] uppercase tracking-[0.5px] text-ink-light'>Planted On</Text>
            <Text className='font-sans text-[13px] font-semibold tracking-[0.3px] text-ink'>
              {plant.planted_at
                ? new Date(plant.planted_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })
                : 'Unknown'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </>
  )
}
