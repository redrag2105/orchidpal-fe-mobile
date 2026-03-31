import React from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'
import Animated from 'react-native-reanimated'
import type { StepProps } from '@/types/add-plant.types'

interface Step2Props extends StepProps {
  savedNickname: string
}

export function Step2Name({ plantData, setPlantData, nextStep, savedNickname, enteringAnim, exitingAnim }: Step2Props) {
  const hasValidName = !!plantData.nickname
  const isUnchanged = hasValidName && plantData.nickname === savedNickname && savedNickname !== ''

  return (
    <Animated.View
      key='step2'
      entering={enteringAnim}
      exiting={exitingAnim}
      className='flex-1 justify-center p-6'
      style={{ flex: 1, justifyContent: 'center', padding: 24 }}
    >
      <Text className='mb-10 text-center font-serif text-[32px] text-ink'>
        What's the name of{'\n'}your new friend?
      </Text>

      <TextInput
        placeholder='Enter name...'
        placeholderTextColor='rgba(20, 40, 29, 0.3)'
        className='mb-10 border-b border-ink-muted pb-4 text-center font-serif text-[30px] text-ink'
        value={plantData.nickname}
        onChangeText={(text) => setPlantData({ ...plantData, nickname: text })}
        autoFocus
      />

      <TouchableOpacity
        onPress={nextStep}
        disabled={!hasValidName}
        className={`items-center rounded-[30px] py-[18px] ${hasValidName ? 'bg-forest' : 'bg-white/30'}`}
      >
        <Text className={`font-sans text-[18px] font-semibold ${hasValidName ? 'text-paper' : 'text-ink-muted'}`}>
          {isUnchanged ? 'Keep existing name' : 'Next'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}
