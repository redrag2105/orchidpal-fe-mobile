/**
 * Enhanced Login Screen
 * Beautiful authentication experience with botanical luxury theme
 * Theme synced with OrchidPal web app
 */

import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { FONTS, THEME } from '@/constants/theme'
import { useGoogleAuth } from '@/hooks'
import { useRouter } from 'expo-router'
import { Flower2, Shield, Sparkles, Thermometer } from 'lucide-react-native'
import React from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'

// Google SVG icon component
function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <View style={{ marginRight: 12 }}>
      <Svg width={size} height={size} viewBox='0 0 24 24'>
        <Path
          d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
          fill='#4285F4'
        />
        <Path
          d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
          fill='#34A853'
        />
        <Path
          d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
          fill='#FBBC05'
        />
        <Path
          d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
          fill='#EA4335'
        />
      </Svg>
    </View>
  )
}

// Feature item for benefits section
function FeatureItem({
  icon: IconComponent,
  title,
  iconColor,
  delay
}: {
  icon: typeof Thermometer
  title: string
  iconColor: string
  delay: number
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)}>
      <HStack className='items-center gap-3 rounded-2xl px-4 py-3' style={{ backgroundColor: THEME.paperDark }}>
        <View
          className='h-10 w-10 items-center justify-center rounded-full'
          style={{ backgroundColor: 'rgba(74, 121, 95, 0.15)' }}
        >
          <IconComponent size={20} color={iconColor} strokeWidth={1.5} />
        </View>
        <Text className='flex-1 text-sm' style={{ color: THEME.ink }}>
          {title}
        </Text>
      </HStack>
    </Animated.View>
  )
}

export default function LoginScreen() {
  const router = useRouter()

  const handleAuthSuccess = (token: string) => {
    console.log('Authentication successful!')
    router.replace('/(dashboard)')
  }

  const { signInWithGoogle, isLoading, error } = useGoogleAuth(handleAuthSuccess)

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      Alert.alert('Sign-in failed', 'Unable to sign in with Google. Please try again.')
    }
  }

  // Show error alert when error changes
  React.useEffect(() => {
    if (error) {
      Alert.alert('Sign-in Error', error)
    }
  }, [error])

  return (
    <View className='flex-1' style={{ backgroundColor: THEME.paper }}>
      {/* Subtle decorative circle */}
      <View
        className='absolute bottom-0 left-0 h-48 w-48 rounded-full opacity-20'
        style={{
          backgroundColor: '#f0f6f2',
          transform: [{ translateX: -64 }, { translateY: 64 }]
        }}
      />

      <SafeAreaView className='flex-1'>
        <KeyboardAvoidingView
          className='flex-1'
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo & Brand */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <VStack className='mb-8 items-center'>
                <View
                  className='mb-4 h-16 w-16 items-center justify-center rounded-2xl shadow-md'
                  style={{ backgroundColor: 'white' }}
                >
                  <Flower2 size={36} color={THEME.orchidMain} strokeWidth={1.5} />
                </View>
                <Text
                  className='text-3xl italic'
                  style={{ color: THEME.forest, fontFamily: FONTS.serif, fontWeight: '600' }}
                >
                  OrchidPal
                </Text>
                <Text className='mt-1 text-xs uppercase tracking-widest' style={{ color: THEME.inkLight }}>
                  Expert IoT Sanctuary
                </Text>
              </VStack>
            </Animated.View>

            {/* Main Card */}
            <Animated.View entering={FadeInUp.delay(200).duration(500)}>
              <View className='rounded-[2rem] p-6 shadow-lg' style={{ backgroundColor: 'rgba(255,255,255,0.94)' }}>
                <VStack className='gap-5'>
                  {/* Welcome text */}
                  <VStack className='items-center gap-2'>
                    <Text className='text-2xl' style={{ color: THEME.ink, fontFamily: FONTS.serif, fontWeight: '600' }}>
                      Welcome back
                    </Text>
                    <Text className='text-center text-sm leading-5' style={{ color: THEME.inkLight }}>
                      Sign in to review live telemetry, care modes, and expert recommendations across your orchids.
                    </Text>
                  </VStack>

                  {/* Google Sign-In button */}
                  <TouchableOpacity
                    className='flex-row items-center justify-center rounded-full px-6 py-4 shadow-sm'
                    style={{
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: 'rgba(0,0,0,0.08)'
                    }}
                    onPress={handleGoogleSignIn}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator size='small' color={THEME.ink} />
                    ) : (
                      <>
                        <GoogleLogo size={20} />
                        <Text className='font-semibold' style={{ color: THEME.ink }}>
                          Continue with Google
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Divider */}
                  <HStack className='items-center gap-4'>
                    <View className='h-px flex-1' style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
                    <Text className='text-xs' style={{ color: THEME.inkLight }}>
                      Why OrchidPal?
                    </Text>
                    <View className='h-px flex-1' style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
                  </HStack>

                  {/* Features */}
                  <VStack className='gap-3'>
                    <FeatureItem
                      icon={Thermometer}
                      title='Real-time temperature & humidity monitoring'
                      iconColor={THEME.forest}
                      delay={300}
                    />
                    <FeatureItem
                      icon={Sparkles}
                      title='AI-powered care recommendations'
                      iconColor={THEME.orchidMain}
                      delay={400}
                    />
                    <FeatureItem
                      icon={Shield}
                      title='Secure, private cloud sync'
                      iconColor={THEME.orchidDeep}
                      delay={500}
                    />
                  </VStack>
                </VStack>
              </View>
            </Animated.View>

            {/* Terms */}
            <Animated.View entering={FadeInUp.delay(600).duration(400)}>
              <Text className='mt-6 text-center text-xs leading-4' style={{ color: THEME.inkLight }}>
                By signing in, you agree to our{' '}
                <Text className='text-xs underline' style={{ color: THEME.forest }}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text className='text-xs underline' style={{ color: THEME.forest }}>
                  Privacy Policy
                </Text>
              </Text>
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInUp.delay(700).duration(400)}>
              <HStack className='mt-6 items-center justify-center gap-1'>
                <Text className='text-sm' style={{ color: THEME.inkLight }}>
                  First time here?
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert('New Account', 'Signing in with Google will automatically create your account.')
                  }
                >
                  <Text className='text-sm font-semibold underline' style={{ color: THEME.forest }}>
                    Learn more
                  </Text>
                </TouchableOpacity>
              </HStack>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}
