import { THEME } from '@/constants/theme'
import { Droplets, Leaf, Thermometer } from 'lucide-react-native'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import type { StepProps } from '@/types/add-plant.types'

interface Step4Props extends StepProps {
  currentSpecies: any
}

export function Step4Care({ plantData, currentSpecies, nextStep, enteringAnim, exitingAnim }: Step4Props) {
  return (
    <Animated.View key='step4' entering={enteringAnim} exiting={exitingAnim} className='flex-1 justify-center p-6'>
      <View className='items-center rounded-3xl bg-white/80 p-8 shadow-[0_15px_15px_rgba(0,0,0,0.05)]'>
        {plantData.image_url && !plantData.image_url.includes('unsplash') ? (
          <Image source={{ uri: plantData.image_url }} className='mb-6 h-[100px] w-[100px] rounded-[50px]' />
        ) : currentSpecies?.image_url ? (
          <Image source={{ uri: currentSpecies?.image_url }} className='mb-6 h-[100px] w-[100px] rounded-[50px]' />
        ) : (
          <Leaf size={48} color={THEME.forest} className='mb-6' />
        )}

        <Text className='mb-2 text-center font-serif text-[24px] text-ink'>{plantData.nickname || 'New Friend'}</Text>

        <Text className='mb-8 text-center font-sans text-[16px] italic text-ink-muted'>
          {currentSpecies?.common_name}
        </Text>

        <View className='mb-6 min-h-[60px] w-full flex-row justify-center gap-6'>
          <View className='flex-1 items-center rounded-2xl bg-paper p-3'>
            <Thermometer size={24} color={THEME.orchidMain} className='mb-2' />
            <Text className='text-center font-sans text-[15px] font-bold text-ink'>
              {currentSpecies?.ideal_temp_min}-{currentSpecies?.ideal_temp_max}
              {'\u00B0'}C
            </Text>
            <Text className='mt-1 font-sans text-[12px] text-ink-muted'>Temp</Text>
          </View>
          <View className='flex-1 items-center rounded-2xl bg-paper p-3'>
            <Droplets size={24} color={'#4ba3e3'} className='mb-2' />
            <Text className='text-center font-sans text-[15px] font-bold text-ink'>
              {currentSpecies?.ideal_humid_min}-{currentSpecies?.ideal_humid_max}%
            </Text>
            <Text className='mt-1 font-sans text-[12px] text-ink-muted'>Humidity</Text>
          </View>
        </View>

        <Text className='mb-8text-center font-sans text-[14px] leading-5 text-ink-muted'>
          {currentSpecies?.care_instruction ||
            'No special care instructions. Make sure to occasionally check the soil!'}
        </Text>

        <TouchableOpacity onPress={nextStep} className='mt-8 w-full items-center rounded-[30px] bg-forest py-[18px]'>
          <Text className='font-sans text-[16px] font-semibold text-paper'>Use recommended settings</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}
