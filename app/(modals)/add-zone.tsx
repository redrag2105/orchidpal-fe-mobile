import { FONTS, THEME } from '@/components/dashboard/theme'
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText
} from '@/components/ui/actionsheet'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { useCreateZone } from '@/hooks/mutations/useCreateZone'
import * as Haptics from 'expo-haptics'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { Camera, ChevronDown, ChevronLeft, MapPin } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

const { width } = Dimensions.get('window')

const EXPOSURE_OPTIONS = [
  { value: 'FULL_SUN', label: 'Full Sun', description: 'Direct sunlight most of the day' },
  { value: 'PARTIAL_SHADE', label: 'Partial Shade', description: 'Some direct sunlight' },
  { value: 'FULL_SHADE', label: 'Full Shade', description: 'Little to no direct sun' }
] as const

export default function AddZoneScreen() {
  const [name, setName] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [exposure, setExposure] = useState<'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE'>('PARTIAL_SHADE')
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const [showExposure, setShowExposure] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  const { mutateAsync: createZoneMutate, isPending: isSubmitting } = useCreateZone()
  const toast = useToast()

  const showToast = (message: string, isError = false) => {
    toast.show({
      placement: 'top',
      duration: 2500,
      render: ({ id }) => (
        <Toast nativeID={id} action={isError ? 'error' : 'success'} variant='solid' style={styles.toast}>
          <View style={[styles.toastDot, isError && { backgroundColor: THEME.gold }]} />
          <ToastTitle style={styles.toastTitle}>{message}</ToastTitle>
        </Toast>
      )
    })
  }

  const isValid = name.trim().length > 0 && locationCity.trim().length > 0

  const pickImage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    Alert.alert('Upload Photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: async () => {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8
          })
          if (!result.canceled) {
            setImageUrl(result.assets[0].uri)
          }
        }
      },
      {
        text: 'Library',
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8
          })
          if (!result.canceled) {
            setImageUrl(result.assets[0].uri)
          }
        }
      },
      { text: 'Cancel', style: 'cancel' }
    ])
  }

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
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ChevronLeft size={28} color={THEME.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Zone</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <TouchableOpacity activeOpacity={0.8} onPress={pickImage} style={styles.imagePicker}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <View style={styles.cameraIconContainer}>
                <Camera size={32} color={THEME.inkLight} />
              </View>
              <Text style={styles.imagePlaceholderText}>Add Zone Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Zone Name</Text>
          <TextInput
            style={styles.input}
            placeholder='e.g., Living Room Garden'
            placeholderTextColor={THEME.inkMuted}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location / City</Text>
          <View style={styles.locationInputWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              placeholder='e.g., Ho Chi Minh City'
              placeholderTextColor={THEME.inkMuted}
              value={locationCity}
              onChangeText={setLocationCity}
            />
            <TouchableOpacity onPress={detectLocation} style={styles.locationButton} disabled={isDetectingLocation}>
              {isDetectingLocation ? (
                <ActivityIndicator size='small' color={THEME.forest} />
              ) : (
                <MapPin size={22} color={THEME.forest} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Light Exposure</Text>
          <TouchableOpacity style={styles.exposureSelector} activeOpacity={0.7} onPress={() => setShowExposure(true)}>
            <View>
              <Text style={styles.exposureValue}>
                {EXPOSURE_OPTIONS.find((e) => e.value === exposure)?.label || 'Select...'}
              </Text>
            </View>
            <ChevronDown size={20} color={THEME.inkLight} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!isValid || isSubmitting}
          style={[styles.submitButton, (!isValid || isSubmitting) && { opacity: 0.6 }]}
          onPress={handleFinish}
        >
          {isSubmitting ? (
            <ActivityIndicator color={THEME.paper} />
          ) : (
            <Text style={styles.submitButtonText}>Create Zone</Text>
          )}
        </TouchableOpacity>
      </View>

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
                      { fontSize: 16, fontWeight: '500', color: THEME.ink },
                      exposure === opt.value && { color: THEME.forest, fontWeight: '700' }
                    ]}
                  >
                    {opt.label}
                  </ActionsheetItemText>
                  <Text style={{ fontSize: 13, color: THEME.inkLight, marginTop: 4 }}>{opt.description}</Text>
                </View>
              </ActionsheetItem>
            ))}
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f3f0' // match modal layout background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#f5f3f0'
  },
  iconButton: {
    padding: 8
  },
  headerTitle: {
    fontFamily: FONTS.sans,
    fontSize: 18,
    fontWeight: '600',
    color: THEME.ink
  },
  toast: {
    backgroundColor: THEME.paper,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 12
  },
  toastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.forest
  },
  toastTitle: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink
  },
  scrollContent: {
    padding: 24
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: THEME.paper,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
    borderStyle: 'dashed'
  },
  imagePreview: {
    width: '100%',
    height: '100%'
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  imagePlaceholderText: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    color: THEME.inkLight,
    fontWeight: '500'
  },
  formGroup: {
    marginBottom: 24
  },
  label: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: THEME.ink,
    marginBottom: 8
  },
  input: {
    backgroundColor: THEME.paper,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
    fontFamily: FONTS.sans,
    fontSize: 16,
    color: THEME.ink
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.paper,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingRight: 8
  },
  locationButton: {
    padding: 10
  },
  exposureSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.paper,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54
  },
  exposureValue: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    color: THEME.ink
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#f5f3f0',
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  submitButton: {
    backgroundColor: THEME.forest,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  submitButtonText: {
    fontFamily: FONTS.sans,
    fontSize: 18,
    fontWeight: '600',
    color: THEME.paper
  }
})
