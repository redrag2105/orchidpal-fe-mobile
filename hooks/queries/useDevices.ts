import { useQuery } from '@tanstack/react-query'
import { getDevices } from '@/apis/device.api'

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => getDevices(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
