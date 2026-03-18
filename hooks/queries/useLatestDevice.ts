import { getLatestDevice } from '@/apis/device.api'
import { useQuery } from '@tanstack/react-query'

export function useLatestDevice() {
  return useQuery({
    queryKey: ['latest-device'],
    queryFn: getLatestDevice,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  })
}
