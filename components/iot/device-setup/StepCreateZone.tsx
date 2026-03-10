import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText
} from '@/components/ui/actionsheet'
import * as Location from 'expo-location'
import { ChevronLeft, ChevronRight, Flower2, MapPin } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'

const EXPOSURE_OPTIONS = [
  { value: 'FULL_SUN', label: 'Full Sun', description: 'Direct sunlight most of the day' },
  { value: 'PARTIAL_SHADE', label: 'Partial Shade', description: 'Some direct sunlight' },
  { value: 'FULL_SHADE', label: 'Full Shade', description: 'Little to no direct sun' }
] as const

interface StepCreateZoneProps {
  onSubmit: (data: {
    name: string
    location_city: string
    exposure?: 'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE'
  }) => void
  onBack: () => void
  isLoading: boolean
}

export function StepCreateZone({ onSubmit, onBack, isLoading }: StepCreateZoneProps) {
  const [name, setName] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [exposure, setExposure] = useState<'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE'>('PARTIAL_SHADE')
  const [showExposure, setShowExposure] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  const isValid = name.trim().length > 0 && locationCity.trim().length > 0

  // Auto-detect location
  const detectLocation = async () => {
    setIsDetectingLocation(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        // Permission denied - user can still enter manually
        setIsDetectingLocation(false)
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low // Low accuracy is faster and sufficient for city
      })

      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })

      if (address) {
        // Build city string from available address components
        const cityParts = [address.city, address.region].filter(Boolean)
        const city = cityParts.join(', ') || address.country || ''
        if (city) {
          setLocationCity(city)
        }
      }
    } catch (error) {
      // Silently fail - user can enter manually
      console.log('Location detection failed:', error)
    } finally {
      setIsDetectingLocation(false)
    }
  }

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({
        name: name.trim(),
        location_city: locationCity.trim(),
        exposure
      })
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Flower2 size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Create New Zone</Text>
      <Text style={styles.stepDescription}>Set up a new garden zone for your plants.</Text>

      {/* Zone Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.fieldLabel}>Zone Name *</Text>
        <TextInput
          style={styles.textInput}
          placeholder='e.g., Living Room Garden'
          placeholderTextColor='#9ca3af'
          value={name}
          onChangeText={setName}
          autoCapitalize='words'
        />
      </View>

      {/* City/Location */}
      <View style={styles.inputGroup}>
        <Text style={styles.fieldLabel}>City / Location *</Text>
        <View style={styles.locationInputRow}>
          <TextInput
            style={[styles.textInput, styles.locationInput]}
            placeholder='e.g., Ho Chi Minh City'
            placeholderTextColor='#9ca3af'
            value={locationCity}
            onChangeText={setLocationCity}
            autoCapitalize='words'
          />
          <TouchableOpacity style={styles.locationButton} onPress={detectLocation} disabled={isDetectingLocation}>
            {isDetectingLocation ? (
              <ActivityIndicator size='small' color='#4a795f' />
            ) : (
              <MapPin size={20} color='#4a795f' />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.fieldHint}>Used for local weather data and recommendations</Text>
      </View>

      {/* Light Exposure */}
      <TouchableOpacity style={styles.exposureSelector} onPress={() => setShowExposure(true)}>
        <View>
          <Text style={styles.fieldLabel}>Light Exposure</Text>
          <Text style={styles.exposureValue}>
            {EXPOSURE_OPTIONS.find((e) => e.value === exposure)?.label || 'Select...'}
          </Text>
        </View>
        <ChevronLeft size={20} color='#6b7280' style={{ transform: [{ rotate: showExposure ? '90deg' : '-90deg' }] }} />
      </TouchableOpacity>

      <Actionsheet isOpen={showExposure} onClose={() => setShowExposure(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View style={{ width: '100%', paddingVertical: 10, paddingHorizontal: 20 }}>
            {EXPOSURE_OPTIONS.map((opt) => (
              <ActionsheetItem
                key={opt.value}
                onPress={() => {
                  setExposure(opt.value)
                  setShowExposure(false)
                }}
                style={[
                  { paddingVertical: 12, borderRadius: 8, marginBottom: 8 },
                  exposure === opt.value && { backgroundColor: 'rgba(74, 121, 95, 0.1)' }
                ]}
              >
                <View style={{ flex: 1 }}>
                  <ActionsheetItemText
                    style={[
                      { fontSize: 16, fontWeight: '500', color: '#1f2937' },
                      exposure === opt.value && { color: '#4a795f', fontWeight: '700' }
                    ]}
                  >
                    {opt.label}
                  </ActionsheetItemText>
                  <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{opt.description}</Text>
                </View>
              </ActionsheetItem>
            ))}
          </View>
        </ActionsheetContent>
      </Actionsheet>

      {/* Actions */}
      <TouchableOpacity
        style={[styles.primaryButton, (!isValid || isLoading) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color='white' size='small' />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Create & Assign</Text>
            <ChevronRight size={18} color='white' />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={onBack}>
        <Text style={styles.linkButtonText}>Back to zone selection</Text>
      </TouchableOpacity>
    </View>
  )
}
