import { THEME } from '@/constants/theme'
import * as Haptics from 'expo-haptics'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'lucide-react-native'
import React from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'

interface ZoneImagePickerProps {
  imageUrl: string | null
  setImageUrl: (url: string) => void
}

export function ZoneImagePicker({ imageUrl, setImageUrl }: ZoneImagePickerProps) {
  const pickImage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    Alert.alert('Upload Photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
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
          const result = await ImagePicker.launchImageLibraryAsync({
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

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={pickImage}
      className='mb-8 h-[200px] w-full overflow-hidden rounded-2xl border-2 border-dashed border-ink/5 bg-paper'
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className='h-full w-full' />
      ) : (
        <View className='flex-1 items-center justify-center'>
          <View className='mb-3 h-16 w-16 items-center justify-center rounded-full bg-black/5'>
            <Camera size={32} color={THEME.inkLight} />
          </View>
          <Text className='font-sans text-[16px] font-medium text-ink-light'>Add Zone Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
