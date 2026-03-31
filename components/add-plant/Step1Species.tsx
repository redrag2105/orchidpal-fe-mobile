import { THEME } from '@/constants/theme'
import * as Haptics from 'expo-haptics'
import { Leaf, Search } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import type { StepProps } from '@/types/add-plant.types'

interface Step1Props extends StepProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  isSpeciesLoading: boolean
  filteredSpecies: any[]
  currentSpecies: any
}

export function Step1Species({
  plantData,
  setPlantData,
  searchQuery,
  setSearchQuery,
  isSpeciesLoading,
  filteredSpecies,
  currentSpecies,
  nextStep,
  enteringAnim,
  exitingAnim
}: Step1Props) {
  return (
    <Animated.View
      key='step1'
      entering={enteringAnim}
      exiting={exitingAnim}
      className='flex-1 p-6'
      style={{ flex: 1, padding: 24 }}
    >
      <Text className='mb-6 font-serif text-[32px] text-ink'>Which green friend are you welcoming today?</Text>

      <View className='mb-6 flex-row items-center rounded-2xl bg-white/60 px-4 py-3'>
        <Search size={20} color={THEME.forest} />
        <TextInput
          placeholder='Search species...'
          placeholderTextColor={THEME.inkMuted}
          className='ml-3 flex-1 font-sans text-base text-ink'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isSpeciesLoading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color={THEME.forest} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          keyboardShouldPersistTaps='always'
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {filteredSpecies.map((species) => {
            const isActive = plantData.species_id === species.id
            return (
              <TouchableOpacity
                key={species.id}
                onPress={() => {
                  Haptics.selectionAsync()
                  setPlantData({ ...plantData, species_id: species.id! })
                }}
                className={`mb-4 flex-row items-center overflow-hidden rounded-2xl border-2 shadow-[0_4px_10px_rgba(0,0,0,0.05)] ${
                  isActive ? 'border-forest bg-forest-light' : 'border-transparent bg-white/80'
                }`}
              >
                {species.image_url ? (
                  <Image source={{ uri: species.image_url }} className='h-20 w-20 rounded-l-[14px]' />
                ) : (
                  <View className='h-20 w-20 items-center justify-center bg-forest/10'>
                    <Leaf size={32} color={THEME.forest} />
                  </View>
                )}
                <View className='flex-1 p-4'>
                  <Text className={`font-sans text-[18px] font-semibold ${isActive ? 'text-paper' : 'text-ink'}`}>
                    {species.common_name}
                  </Text>
                  <Text
                    className={`mt-1 font-sans text-[13px] italic ${isActive ? 'text-white/90' : 'text-ink-muted'}`}
                  >
                    {species.scientific_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )}

      {!!plantData.species_id && (
        <Animated.View entering={FadeIn} className='mt-3 pb-2'>
          <TouchableOpacity
            onPress={nextStep}
            className='items-center rounded-[30px] bg-forest py-[18px] shadow-[0_10px_10px_rgba(0,0,0,0.1)]'
          >
            <Text className='font-sans text-[16px] font-semibold text-paper'>
              Continue with {currentSpecies?.common_name}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  )
}
