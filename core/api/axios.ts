import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Interceptor: Tự động gắn Token vào mỗi request
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: Unwrap API response and handle errors
apiClient.interceptors.response.use(
  (response) => {
    // API returns wrapped response: { statusCode, message, data, meta? }
    // For paginated responses (with meta), preserve the structure
    // For simple responses, extract the nested data
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      // If meta exists, keep the data+meta structure for pagination
      if ('meta' in response.data) {
        const { data, meta } = response.data
        response.data = { data, meta }
      } else {
        // Simple response - just extract data
        response.data = response.data.data
      }
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout logic here or emit event
    }
    return Promise.reject(error)
  }
)
