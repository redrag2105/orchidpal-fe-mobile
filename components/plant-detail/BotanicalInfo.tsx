import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { THEME } from '@/constants/theme'
import { Droplets, ShieldCheck, Sun, Thermometer } from 'lucide-react-native'
import React from 'react'
import { ScrollView, View } from 'react-native'

export function BotanicalInfo({ wikiInfo }: { wikiInfo: any }) {
  if (!wikiInfo) {
    return (
      <View className='-mr-6 mb-8'>
        <Text className='mb-2 font-serif text-[22px] font-bold text-ink'>Botanical Guidelines</Text>
        <Text className='font-sans text-ink-light'>No botanical info available for this species.</Text>
      </View>
    )
  }

  return (
    <View className='-mr-6 mb-8'>
      <Text className='mb-4 font-serif text-[22px] font-bold text-ink'>Botanical Guidelines</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='pr-6 gap-3 pb-4'>
        <View className='shadow-pill overflow-hidden rounded-full border border-[#f0efea]/80 bg-[#faf9f4]/70'>
          <View className='w-[90px] items-center px-2 py-6'>
            <View className='shadow-icon mb-4 h-11 w-11 items-center justify-center rounded-full bg-white'>
              <Thermometer size={20} color='#FF6B6B' />
            </View>
            <View className='items-center'>
              <Text className='mb-1.5 font-sans text-[11px] font-semibold text-ink-muted'>Ideal Temp</Text>
              <Text className='font-sans text-base font-bold text-ink'>
                {wikiInfo.ideal_temp_min}-{wikiInfo.ideal_temp_max}°C
              </Text>
            </View>
          </View>
        </View>

        <View className='shadow-pill overflow-hidden rounded-full border border-[#f0efea]/80 bg-[#faf9f4]/70'>
          <View className='w-[90px] items-center px-2 py-6'>
            <View className='shadow-icon mb-4 h-11 w-11 items-center justify-center rounded-full bg-white'>
              <Droplets size={20} color='#4BA3E3' />
            </View>
            <View className='items-center'>
              <Text className='mb-1.5 font-sans text-[11px] font-semibold text-ink-muted'>Humidity</Text>
              <Text className='font-sans text-base font-bold text-ink'>
                {wikiInfo.ideal_humid_min}-{wikiInfo.ideal_humid_max}%
              </Text>
            </View>
          </View>
        </View>

        <View className='shadow-pill overflow-hidden rounded-full border border-[#f0efea]/80 bg-[#faf9f4]/70'>
          <View className='w-[90px] items-center px-2 py-6'>
            <View className='shadow-icon mb-4 h-11 w-11 items-center justify-center rounded-full bg-white'>
              <Sun size={20} color='#FFA502' />
            </View>
            <View className='items-center'>
              <Text className='mb-1.5 font-sans text-[11px] font-semibold text-ink-muted'>Light Role</Text>
              <Text className='font-sans text-base font-bold text-ink'>Indirect</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className='shadow-soft mr-6 mt-2 rounded-[24px] bg-white p-6'>
        <Text className='font-sans text-base font-bold uppercase tracking-[0.5px] text-ink-light'>Scientific Name</Text>
        <Text className='mt-1 font-serif text-xl font-semibold italic text-ink'>
          {wikiInfo.scientific_name || wikiInfo.common_name}
        </Text>

        <View className='h-4' />

        <HStack className='mb-2 items-center gap-2'>
          <ShieldCheck size={20} color={THEME.forest} />
          <Text className='font-sans text-base font-bold uppercase tracking-[0.5px] text-ink-light'>
            Care Instructions
          </Text>
        </HStack>

        <View className='mt-1'>
          {wikiInfo.care_instruction ? (
            wikiInfo.care_instruction
              .split('.')
              .filter((s: string) => s.trim().length > 0)
              .map((sentence: string, index: number) => (
                <Text key={index} className='mb-3 font-sans text-lg leading-6 text-ink'>
                  • {sentence.trim()}.
                </Text>
              ))
          ) : (
            <Text className='font-sans text-[15px] leading-6 text-ink'>
              No specific care instructions found. Keep an eye on moisture and light levels.
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}
