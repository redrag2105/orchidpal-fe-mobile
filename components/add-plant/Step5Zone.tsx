import { THEME } from '@/constants/theme'
import * as Haptics from 'expo-haptics'
import { CheckCircle2, MapPin } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import type { StepProps } from '@/types/add-plant.types'

interface Step5Props extends StepProps {
  isZonesLoading: boolean
  zonesList: any[]
}

export function Step5Zone({
  plantData,
  setPlantData,
  nextStep,
  isZonesLoading,
  zonesList,
  enteringAnim,
  exitingAnim
}: Step5Props) {
  const availableZones = (zonesList || []).filter((z) => !z.has_plant)

  return (
    <Animated.View
      key='step5'
      entering={enteringAnim}
      exiting={exitingAnim}
      className='flex-1 p-6'
      style={{ flex: 1, padding: 24 }}
    >
      <Text className='mb-8 mt-10 font-serif text-[32px] text-ink'>Where will it be placed?</Text>

      {isZonesLoading ? (
        <ActivityIndicator size='large' color={THEME.forest} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
          {availableZones.map((zone) => {
            const isActive = plantData.zone_id === zone.id
            return (
              <TouchableOpacity
                key={zone.id}
                onPress={() => {
                  Haptics.selectionAsync()
                  setPlantData({ ...plantData, zone_id: zone.id })
                  setTimeout(nextStep, 350)
                }}
                className={`mb-4 flex-row items-center rounded-[20px] p-5 ${isActive ? 'bg-forest' : 'bg-white/80'}`}
              >
                <View
                  className={`mr-4 h-[60px] w-[60px] items-center justify-center rounded-[30px] ${
                    isActive ? 'bg-white/20' : 'bg-forest/10'
                  }`}
                >
                  <MapPin size={24} color={isActive ? THEME.paper : THEME.forest} />
                </View>
                <View className='flex-1'>
                  <Text className={`mb-1 font-sans text-[18px] font-bold ${isActive ? 'text-paper' : 'text-ink'}`}>
                    {zone.name}
                  </Text>
                  <Text className={`font-sans text-[14px] ${isActive ? 'text-white/80' : 'text-ink-muted'}`}>
                    {zone.location_city || 'No Location'} {'\u2022'} {zone.exposure || 'Unknown Exposure'}
                  </Text>
                </View>
                {isActive && <CheckCircle2 size={24} color={THEME.paper} />}
              </TouchableOpacity>
            )
          })}

          {availableZones.length === 0 && (
            <Text className='my-5 text-center font-sans text-[16px] text-ink-muted'>
              No valid zones available at the moment.
            </Text>
          )}

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              setPlantData({ ...plantData, zone_id: null })
              nextStep()
            }}
            className='mt-4 items-center py-5'
          >
            <Text className='font-sans text-[16px] text-ink-muted underline'>I'll set up a Zone later</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </Animated.View>
  )
}
