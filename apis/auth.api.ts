/**
 * Authentication API
 */
import { apiClient } from '@/core/api/axios'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || ''

/**
 * Get the Google OAuth URL for mobile authentication
 * This URL opens in a browser and redirects back via deeplink
 */
export const getGoogleAuthUrl = (): string => {
  return `${BASE_URL}/auth/google?platform=mobile`
}

/**
 * Refresh access token using refresh token (if needed)
 */
export const refreshAccessToken = async (): Promise<{ accessToken: string }> => {
  const response = await apiClient.post('/auth/refresh')
  return response.data
}

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}
