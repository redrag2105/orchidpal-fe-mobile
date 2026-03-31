import { ExposureBottomSheet, type ExposureType, ZoneFormInputs, ZoneImagePicker } from '@/components/add-zone'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { THEME } from '@/constants/theme'
import { useCreateZone } from '@/hooks/mutations/useCreateZone'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AddZoneScreen() {
  const [name, setName] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [exposure, setExposure] = useState<ExposureType>('PARTIAL_SHADE')
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const [showExposure, setShowExposure] = useState(false)

  const { mutateAsync: createZoneMutate, isPending: isSubmitting } = useCreateZone()
  const toast = useToast()
  const insets = useSafeAreaInsets()

  const showToast = (message: string, isError = false) => {
    toast.show({
      placement: 'top',
      duration: 2500,
      render: ({ id }) => (
        <Toast
          nativeID={id}
          action={isError ? 'error' : 'success'}
          variant='solid'
          className='flex-row items-center gap-3 rounded-2xl border border-black/5 bg-paper p-4 shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
        >
          <View className={`h-2 w-2 rounded-full ${isError ? 'bg-gold' : 'bg-forest'}`} />
          <ToastTitle className='font-sans text-[15px] font-semibold text-ink'>{message}</ToastTitle>
        </Toast>
      )
    })
  }

  const isValid = name.trim().length > 0 && locationCity.trim().length > 0

  const handleFinish = async () => {
    if (!isValid) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    try {
      const payload = {
        name: name.trim(),
        location_city: locationCity.trim(),
        exposure,
        ...(imageUrl ? { image_url: imageUrl } : {})
      }

      await createZoneMutate(payload)

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      showToast('Zone created successfully!')
      setTimeout(() => {
        router.back()
      }, 1000)
    } catch (err) {
      console.error(err)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      showToast('Failed to create zone.', true)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: THEME.paper }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View
        className='flex-row items-center justify-between bg-paper px-4 pb-4'
        style={{ paddingTop: Math.max(insets.top, 60) }}
      >
        <TouchableOpacity onPress={() => router.back()} className='p-2'>
          <ChevronLeft size={28} color={THEME.ink} />
        </TouchableOpacity>
        <Text className='font-sans text-[18px] font-semibold text-ink'>Add New Zone</Text>
        <View className='w-11' />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <ZoneImagePicker imageUrl={imageUrl} setImageUrl={setImageUrl} />

        <ZoneFormInputs
          name={name}
          setName={setName}
          locationCity={locationCity}
          setLocationCity={setLocationCity}
          exposure={exposure}
          setShowExposure={setShowExposure}
        />

        <View className='h-[100px]' />
      </ScrollView>

      {/* Footer */}
      <View
        className='border-t border-black/5 bg-paper px-6 pt-6'
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        <TouchableOpacity
          disabled={!isValid || isSubmitting}
          className={`h-14 items-center justify-center rounded-full bg-forest shadow-[0_4px_8px_rgba(74,121,95,0.3)] ${
            !isValid || isSubmitting ? 'opacity-60' : ''
          }`}
          onPress={handleFinish}
        >
          {isSubmitting ? (
            <ActivityIndicator color={THEME.paper} />
          ) : (
            <Text className='font-sans text-[18px] font-semibold text-paper'>Create Zone</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Actionsheet */}
      <ExposureBottomSheet
        showExposure={showExposure}
        setShowExposure={setShowExposure}
        exposure={exposure}
        setExposure={setExposure}
      />
    </KeyboardAvoidingView>
  )
}
