import '@/global.css'
import * as Linking from 'expo-linking'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export { ErrorBoundary } from 'expo-router'

/**
 * Hook to handle authentication deeplinks at the app level
 * This ensures tokens are captured even when the app is not on the login screen
 */
function useAuthDeepLinkHandler() {
  const router = useRouter()
  const segments = useSegments()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event
      const parsed = Linking.parse(url)

      // Check if this is our auth callback with tokens
      const accessToken = (parsed.queryParams?.accessToken || parsed.queryParams?.token) as string | undefined
      const refreshToken = parsed.queryParams?.refreshToken as string | undefined

      if ((parsed.path === 'auth' || parsed.hostname === 'auth') && accessToken) {
        try {
          // Store the tokens securely
          await SecureStore.setItemAsync('access_token', accessToken)
          console.log('Access token stored successfully via deeplink')

          if (refreshToken) {
            await SecureStore.setItemAsync('refresh_token', refreshToken)
            console.log('Refresh token stored successfully via deeplink')
          }

          // Navigate to dashboard
          router.replace('/(dashboard)')
        } catch (err) {
          console.error('Failed to store tokens from deeplink:', err)
        }
      }
    }

    // Listen for deeplink events while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink)

    // Check if app was opened via deeplink (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url })
      }
      setIsReady(true)
    })

    return () => {
      subscription.remove()
    }
  }, [router])

  return isReady
}

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

export default function RootLayout() {
  useAuthDeepLinkHandler()

  return (
    <GluestackUIProvider mode="light">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
            <StatusBar style='dark' backgroundColor="transparent" translucent={true} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='(auth)' />
            <Stack.Screen name='(dashboard)' />
            <Stack.Screen name='zone/[id]' />
          </Stack>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  )
}
