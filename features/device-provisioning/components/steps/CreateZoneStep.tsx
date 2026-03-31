/**
 * Create Zone Step Component
 * Botanical luxury styled zone creation form
 */

import { FONTS, THEME } from '@/constants/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Location from 'expo-location'
import { ArrowRight, ChevronLeft, Flower2, MapPin, Sun } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { z } from 'zod'
import type { CreateZoneRequest } from '../../types'

const createZoneSchema = z.object({
  name: z.string().min(1, 'Zone name is required').max(50, 'Name too long'),
  location_city: z.string().optional(),
  exposure: z.string().optional()
})

type CreateZoneFormData = z.infer<typeof createZoneSchema>

interface CreateZoneStepProps {
  onSubmit: (data: CreateZoneRequest) => void
  onBack: () => void
  isLoading: boolean
}

const EXPOSURE_OPTIONS = [
  { value: 'FULL_SUN', label: 'Full Sun', icon: '☀️' },
  { value: 'PARTIAL_SHADE', label: 'Partial', icon: '⛅' },
  { value: 'FULL_SHADE', label: 'Shade', icon: '🌑' }
]

export function CreateZoneStep({ onSubmit, onBack, isLoading }: CreateZoneStepProps) {
  const [selectedExposure, setSelectedExposure] = useState<string>('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<CreateZoneFormData>({
    resolver: zodResolver(createZoneSchema),
    defaultValues: {
      name: '',
      location_city: '',
      exposure: ''
    }
  })

  // Auto-detect location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') return

        setIsLoadingLocation(true)
        const location = await Location.getCurrentPositionAsync()
        const [address] = await Location.reverseGeocodeAsync(location.coords)

        if (address?.city) {
          setValue('location_city', address.city)
        }
      } catch {
        // Ignore location errors
      } finally {
        setIsLoadingLocation(false)
      }
    }

    detectLocation()
  }, [setValue])

  const onFormSubmit = (data: CreateZoneFormData) => {
    onSubmit({
      name: data.name,
      location_city: data.location_city,
      exposure: selectedExposure || undefined
    })
  }

  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
      {/* Header */}
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={22} color={THEME.ink} />
        </Pressable>
        <View style={styles.headerText}>
          <Animated.Text style={styles.title}>Create New Zone</Animated.Text>
          <Animated.Text style={styles.subtitle}>Define where your orchids will grow</Animated.Text>
        </View>
      </Animated.View>

      {/* Zone name input */}
      <Animated.View entering={FadeInDown.delay(150).duration(300)} style={styles.fieldGroup}>
        <View style={styles.fieldLabel}>
          <Flower2 size={16} color={THEME.forest} />
          <Animated.Text style={styles.labelText}>Zone Name *</Animated.Text>
        </View>
        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              placeholder='e.g., Balcony Garden, Living Room...'
              placeholderTextColor={THEME.inkMuted}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.name && <Animated.Text style={styles.errorText}>{errors.name.message}</Animated.Text>}
      </Animated.View>

      {/* Location input */}
      <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.fieldGroup}>
        <View style={styles.fieldLabel}>
          <MapPin size={16} color={THEME.forest} />
          <Animated.Text style={styles.labelText}>Location (City)</Animated.Text>
          {isLoadingLocation && <ActivityIndicator size='small' color={THEME.forest} />}
        </View>
        <Controller
          control={control}
          name='location_city'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              placeholder='Auto-detected or enter manually'
              placeholderTextColor={THEME.inkMuted}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
      </Animated.View>

      {/* Sun exposure */}
      <Animated.View entering={FadeInDown.delay(250).duration(300)} style={styles.fieldGroup}>
        <View style={styles.fieldLabel}>
          <Sun size={16} color={THEME.forest} />
          <Animated.Text style={styles.labelText}>Sun Exposure</Animated.Text>
        </View>
        <View style={styles.exposureRow}>
          {EXPOSURE_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[styles.exposureBtn, selectedExposure === option.value && styles.exposureBtnActive]}
              onPress={() => setSelectedExposure(option.value)}
            >
              <Animated.Text style={styles.exposureIcon}>{option.icon}</Animated.Text>
              <Animated.Text
                style={[styles.exposureLabel, selectedExposure === option.value && styles.exposureLabelActive]}
              >
                {option.label}
              </Animated.Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Submit button */}
      <Animated.View entering={FadeInUp.delay(300).duration(300)} style={styles.buttonWrap}>
        <Pressable
          style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
          onPress={handleSubmit(onFormSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <>
              <Animated.Text style={styles.primaryBtnText}>Create Zone & Continue</Animated.Text>
              <ArrowRight size={18} color='white' />
            </>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.paper,
    borderRadius: 28,
    padding: 24,
    shadowColor: THEME.ink,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 4
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.paper
  },
  headerText: {
    flex: 1
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.serif,
    fontWeight: '500',
    color: THEME.ink,
    marginBottom: 2
  },
  subtitle: {
    fontSize: 13,
    color: THEME.inkMuted
  },
  fieldGroup: {
    marginBottom: 20
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.ink
  },
  textInput: {
    backgroundColor: THEME.paperDark,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: THEME.ink
  },
  inputError: {
    borderColor: THEME.error
  },
  errorText: {
    fontSize: 12,
    color: THEME.error,
    marginTop: 6
  },
  exposureRow: {
    flexDirection: 'row',
    gap: 10
  },
  exposureBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: THEME.paper
  },
  exposureBtnActive: {
    borderColor: THEME.forest,
    backgroundColor: THEME.forestLight
  },
  exposureIcon: {
    fontSize: 22,
    marginBottom: 4
  },
  exposureLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.inkMuted
  },
  exposureLabelActive: {
    color: THEME.forest
  },
  buttonWrap: {
    marginTop: 8
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: THEME.forest,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: THEME.forest,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  btnDisabled: {
    opacity: 0.5
  }
})
