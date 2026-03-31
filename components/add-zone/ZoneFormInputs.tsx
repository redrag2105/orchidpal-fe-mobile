import { THEME } from '@/constants/theme'
import * as Haptics from 'expo-haptics'
import * as Location from 'expo-location'
import { ChevronDown, MapPin } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { EXPOSURE_OPTIONS, type ExposureType } from '@/types/add-zone.types'

interface ZoneFormInputsProps {
  name: string
  setName: (val: string) => void
  locationCity: string
  setLocationCity: (val: string) => void
  exposure: ExposureType
  setShowExposure: (show: boolean) => void
}

export function ZoneFormInputs({
  name,
  setName,
  locationCity,
  setLocationCity,
  exposure,
  setShowExposure
}: ZoneFormInputsProps) {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  const detectLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setIsDetectingLocation(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setIsDetectingLocation(false)
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low
      })

      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })

      if (address) {
        const cityParts = [address.city, address.region].filter(Boolean)
        const city = cityParts.join(', ') || address.country || ''
        if (city) {
          setLocationCity(city)
        }
      }
    } catch (error) {
      console.log('Location detection failed:', error)
    } finally {
      setIsDetectingLocation(false)
    }
  }

  return (
    <>
      <View className='mb-6'>
        <Text className='mb-2 font-sans text-[14px] font-semibold text-ink'>Zone Name</Text>
        <TextInput
          className='h-[54px] rounded-xl border border-ink/5 bg-paper px-4 font-sans text-[16px] text-ink'
          placeholder='e.g., Living Room Garden'
          placeholderTextColor={THEME.inkMuted}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View className='mb-6'>
        <Text className='mb-2 font-sans text-[14px] font-semibold text-ink'>Location / City</Text>
        <View className='flex-row items-center rounded-xl border border-ink/5 bg-paper pr-2'>
          <TextInput
            className='h-[54px] flex-1 px-4 font-sans text-[16px] text-ink'
            placeholder='e.g., Ho Chi Minh City'
            placeholderTextColor={THEME.inkMuted}
            value={locationCity}
            onChangeText={setLocationCity}
          />
          <TouchableOpacity onPress={detectLocation} className='p-2.5' disabled={isDetectingLocation}>
            {isDetectingLocation ? (
              <ActivityIndicator size='small' color={THEME.forest} />
            ) : (
              <MapPin size={22} color={THEME.forest} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View className='mb-6'>
        <Text className='mb-2 font-sans text-[14px] font-semibold text-ink'>Light Exposure</Text>
        <TouchableOpacity
          className='h-[54px] flex-row items-center justify-between rounded-xl border border-ink/5 bg-paper px-4'
          activeOpacity={0.7}
          onPress={() => setShowExposure(true)}
        >
          <View>
            <Text className='font-sans text-[16px] text-ink'>
              {EXPOSURE_OPTIONS.find((e) => e.value === exposure)?.label || 'Select...'}
            </Text>
          </View>
          <ChevronDown size={20} color={THEME.inkLight} />
        </TouchableOpacity>
      </View>
    </>
  )
}
