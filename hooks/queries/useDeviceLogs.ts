import { useQuery } from '@tanstack/react-query'
import { getDeviceLogs } from '@/apis/device.api'

export function useDeviceLogs(serialNumber: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['device-logs', serialNumber, page, limit],
    queryFn: () => getDeviceLogs(serialNumber, page, limit),
    enabled: !!serialNumber,
  })
}
