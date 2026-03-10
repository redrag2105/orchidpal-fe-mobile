/**
 * Welcome/Onboarding Screen
 * Beautiful carousel walkthrough for first-time users
 */

import { OnboardingCarousel } from '@/components/onboarding'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ONBOARDING_COMPLETE_KEY = '@orchidpal:onboarding_complete'

export default function WelcomeScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = useCallback(async () => {
    try {
      setIsLoading(true)
      // Mark onboarding as complete
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true')
      // Navigate to login
      router.replace('/(auth)/login')
    } catch (error) {
      // Still navigate even if storage fails
      router.replace('/(auth)/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleSkip = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true')
      router.replace('/(auth)/login')
    } catch {
      router.replace('/(auth)/login')
    }
  }, [router])

  return (
    <View className='flex-1' style={{ backgroundColor: '#fdfcf8' }}>
      <StatusBar style='dark' />
      <SafeAreaView className='flex-1'>
        <OnboardingCarousel onComplete={handleComplete} onSkip={handleSkip} />
      </SafeAreaView>
    </View>
  )
}
