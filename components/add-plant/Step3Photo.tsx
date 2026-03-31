import { THEME } from '@/constants/theme'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'lucide-react-native'
import React from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import type { StepProps } from '@/types/add-plant.types'

export function Step3Photo({ plantData, setPlantData, nextStep, enteringAnim, exitingAnim }: StepProps) {
  const pickImage = () => {
    Alert.alert('Upload Photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: async () => {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
          })
          if (!result.canceled && result.assets && result.assets.length > 0) {
            setPlantData({ ...plantData, image_url: result.assets[0].uri })
          }
        }
      },
      {
        text: 'Library',
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
          })
          if (!result.canceled && result.assets && result.assets.length > 0) {
            setPlantData({ ...plantData, image_url: result.assets[0].uri })
          }
        }
      },
      { text: 'Cancel', style: 'cancel' }
    ])
  }

  return (
    <Animated.View
      key='step3'
      entering={enteringAnim}
      exiting={exitingAnim}
      className='flex-1 justify-center p-6'
      style={{ flex: 1, justifyContent: 'center', padding: 24 }}
    >
      <Text className='mb-10 text-center font-serif text-[32px] text-ink'>
        Add a photo of{'\n'}
        {plantData.nickname || 'your plant'}!
      </Text>

      <TouchableOpacity onPress={pickImage} className='mb-10 self-center'>
        {plantData.image_url && !plantData.image_url.includes('unsplash') ? (
          <Image
            source={{ uri: plantData.image_url }}
            className='h-[200px] w-[200px] rounded-[100px] border-4 border-white'
          />
        ) : (
          <View className='h-[200px] w-[200px] items-center justify-center rounded-[100px] border-2 border-dashed border-forest bg-white/60'>
            <Camera size={48} color={THEME.forest} className='mb-3' />
            <Text className='font-sans text-[16px] text-forest'>Tap to choose photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={nextStep} className='items-center rounded-[30px] bg-forest py-[18px]'>
        <Text className='font-sans text-[18px] font-semibold text-paper'>
          {plantData.image_url && !plantData.image_url.includes('unsplash') ? 'Looks great' : 'Skip for now'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}
