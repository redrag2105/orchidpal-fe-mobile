/**
 * useGoogleAuth - Hook for handling Google OAuth authentication with deeplink
 */
import * as Linking from 'expo-linking'
import * as SecureStore from 'expo-secure-store'
import * as WebBrowser from 'expo-web-browser'
import { useCallback, useEffect, useState } from 'react'

// Warm up the browser for faster auth opening
WebBrowser.maybeCompleteAuthSession()

const API_URL = process.env.EXPO_PUBLIC_API_URL || ''

interface UseGoogleAuthReturn {
  signInWithGoogle: () => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useGoogleAuth(onSuccess?: (token: string) => void): UseGoogleAuthReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Extract token from URL and handle authentication
   */
  const handleAuthUrl = useCallback(
    async (url: string) => {
      const parsed = Linking.parse(url)
      console.log('Parsed auth URL:', parsed)

      // Check for tokens in query params
      const accessToken = parsed.queryParams?.accessToken as string | undefined
      const refreshToken = parsed.queryParams?.refreshToken as string | undefined

      // Also check for legacy 'token' param
      const legacyToken = parsed.queryParams?.token as string | undefined
      const finalAccessToken = accessToken || legacyToken

      if (finalAccessToken) {
        try {
          // Store the tokens securely
          await SecureStore.setItemAsync('access_token', finalAccessToken)
          console.log('Access token stored successfully')

          if (refreshToken) {
            await SecureStore.setItemAsync('refresh_token', refreshToken)
            console.log('Refresh token stored successfully')
          }

          setError(null)
          setIsLoading(false)
          onSuccess?.(finalAccessToken)
          return true
        } catch (err) {
          console.error('Failed to store tokens:', err)
          setError('Failed to save authentication. Please try again.')
          setIsLoading(false)
          return false
        }
      }

      return false
    },
    [onSuccess]
  )

  /**
   * Handle deeplink callback (for cases where browser doesn't return result directly)
   */
  const handleDeepLink = useCallback(
    async (event: { url: string }) => {
      const { url } = event
      console.log('Received deeplink:', url)

      // Check if this is our auth callback
      if (url.includes('auth') && url.includes('token=')) {
        await handleAuthUrl(url)
      }
    },
    [handleAuthUrl]
  )

  useEffect(() => {
    // Listen for deeplink events
    const subscription = Linking.addEventListener('url', handleDeepLink)

    // Check if app was opened via deeplink (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url })
      }
    })

    return () => {
      subscription.remove()
    }
  }, [handleDeepLink])

  /**
   * Open Google OAuth in a browser
   * After successful authentication, the user will be redirected back via deeplink
   */
  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create the redirect URL using Linking.createURL for proper scheme handling
      // This handles Expo Go vs standalone app differences
      const redirectUrl = Linking.createURL('auth')
      console.log('Redirect URL:', redirectUrl)

      // Build auth URL with app_redirect parameter (not redirect_uri to avoid OAuth conflict)
      const authUrl = `${API_URL}/auth/google?platform=mobile&app_redirect=${encodeURIComponent(redirectUrl)}`
      console.log('Auth URL:', authUrl)

      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl)
      console.log('WebBrowser result:', result)

      if (result.type === 'success' && result.url) {
        // Handle the returned URL directly
        const handled = await handleAuthUrl(result.url)
        if (!handled) {
          setError('Authentication could not be completed. Please try again.')
          setIsLoading(false)
        }
      } else if (result.type === 'cancel' || result.type === 'dismiss') {
        setIsLoading(false)
        setError('Sign-in was cancelled. Tap the button to try again.')
      } else {
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Google sign-in error:', err)
      setError('Failed to open sign-in. Please try again.')
      setIsLoading(false)
    }
  }, [])

  return {
    signInWithGoogle,
    isLoading,
    error
  }
}
