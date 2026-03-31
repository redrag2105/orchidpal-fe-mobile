import { THEME } from '@/constants/theme'
import { CheckCircle2, Edit3, Leaf } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import type { StepProps } from '@/types/add-plant.types'

interface Step6Props extends StepProps {
  currentSpecies: any
  currentZone: any
  goToStep: (step: number) => void
  isSubmitting: boolean
  handleFinish: () => void
}

export function Step6Review({
  plantData,
  currentSpecies,
  currentZone,
  goToStep,
  isSubmitting,
  handleFinish,
  enteringAnim,
  exitingAnim
}: Step6Props) {
  return (
    <Animated.View key='step6' entering={enteringAnim} exiting={exitingAnim} className='flex-1 justify-between p-6'>
      <View>
        <Text className='mb-10 mt-5 font-serif text-[32px] text-ink'>Awesome!{'\n'}Let's double check</Text>

        <View className='gap-6 rounded-[20px] bg-white/60 p-5'>
          <View className='-mb-2.5 items-center'>
            {plantData.image_url && !plantData.image_url.includes('unsplash') ? (
              <Image
                source={{ uri: plantData.image_url }}
                className='h-20 w-20 rounded-[40px] border-2 border-forest'
              />
            ) : currentSpecies?.image_url ? (
              <Image
                source={{ uri: currentSpecies.image_url }}
                className='h-20 w-20 rounded-[40px] border-2 border-forest'
              />
            ) : (
              <View className='h-20 w-20 items-center justify-center rounded-[40px] bg-forest/10'>
                <Leaf size={40} color={THEME.forest} />
              </View>
            )}
          </View>

          <View className='flex-row items-center justify-between'>
            <View>
              <Text className='mb-1 font-sans text-[14px] text-ink-muted'>Nickname</Text>
              <Text className='font-sans text-[20px] font-semibold text-ink'>{plantData.nickname}</Text>
            </View>
            <TouchableOpacity onPress={() => goToStep(2)} className='p-2'>
              <Edit3 size={20} color={THEME.forest} />
            </TouchableOpacity>
          </View>

          <View className='h-px bg-ink/10' />

          <View className='flex-row items-center justify-between'>
            <View>
              <Text className='mb-1 font-sans text-[14px] text-ink-muted'>Species</Text>
              <Text className='font-sans text-[18px] text-ink'>{currentSpecies?.common_name}</Text>
            </View>
            <TouchableOpacity onPress={() => goToStep(1)} className='p-2'>
              <Edit3 size={20} color={THEME.forest} />
            </TouchableOpacity>
          </View>

          <View className='h-px bg-ink/10' />

          <View className='flex-row items-center justify-between'>
            <View>
              <Text className='mb-1 font-sans text-[14px] text-ink-muted'>Zone</Text>
              <Text className='font-sans text-[18px] text-ink'>{currentZone?.name || 'Not assigned'}</Text>
            </View>
            <TouchableOpacity onPress={() => goToStep(5)} className='p-2'>
              <Edit3 size={20} color={THEME.forest} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleFinish}
        disabled={isSubmitting}
        className={`mb-5 flex-row items-center justify-center gap-3 space-x-3 rounded-[30px] py-5 shadow-[0_8px_15px_rgba(74,121,95,0.3)] ${
          isSubmitting ? 'bg-ink-muted' : 'bg-forest'
        }`}
      >
        {isSubmitting ? (
          <ActivityIndicator color={THEME.paper} />
        ) : (
          <>
            <CheckCircle2 color={THEME.paper} size={24} />
            <Text className='font-sans text-[18px] font-semibold text-paper'>Confirm & Start Growing</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}
