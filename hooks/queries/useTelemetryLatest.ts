import { getLatestTelemetry } from '@/apis/telemetry.api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react'
import EventSource from 'react-native-sse'

export const useTelemetryLatest = (serialNumber?: string) => {
  const queryClient = useQueryClient()

  // 1. Always call API on load via React Query
  const query = useQuery({
    queryKey: ['telemetry-latest', serialNumber],
    queryFn: () => getLatestTelemetry(serialNumber as string),
    enabled: !!serialNumber
  })

  // 2. Fallback / Live sync via SSE for AFK users
  useEffect(() => {
    if (!serialNumber) return

    const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
    let es: EventSource | null = null

    const connectStream = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token')
        const url = `${BASE_URL}/telemetry/stream/${serialNumber}`

        es = new EventSource(url, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        })

        es.addEventListener('message', (event: any) => {
          if (event.data) {
            try {
              const parsed = JSON.parse(event.data)
              const rawData = parsed.data || parsed

              if (rawData) {
                // Update TanStack Query cache automatically so the UI reacts to the stream
                queryClient.setQueryData(['telemetry-latest', serialNumber], (oldData: any) => {
                  return {
                    ...(oldData || {}),
                    temperature: rawData.temp ?? rawData.temperature ?? oldData?.temperature ?? 0,
                    humidity: rawData.humid ?? rawData.humidity ?? oldData?.humidity ?? 0,
                    soil_moisture: rawData.soil ?? rawData.soil_moisture ?? oldData?.soil_moisture ?? 0,
                    light: rawData.light ?? oldData?.light ?? 0
                  }
                })
              }
            } catch (err) {
              console.error('Error parsing telemetry SSE data', err)
            }
          }
        })

        es.addEventListener('error', (event: any) => {
          if (event.type === 'error') {
            console.warn('SSE connection error.')
          }
        })
      } catch (err) {
        console.error('Failed to set up SSE Stream:', err)
      }
    }

    connectStream()

    return () => {
      if (es) {
        es.close()
      }
    }
  }, [serialNumber, queryClient])

  return query
}
