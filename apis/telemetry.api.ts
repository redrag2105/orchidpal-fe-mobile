import { apiClient } from '@/core/api/axios'

export const getLatestTelemetry = async (serialNumber: string) => {
  const response = await apiClient.get(`/telemetry/${serialNumber}/latest`)
  return response?.data?.data || response?.data || response
}
