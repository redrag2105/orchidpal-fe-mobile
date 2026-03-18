import { getDeviceById } from '@/apis/device.api'
import { useQuery } from '@tanstack/react-query'

export function useDeviceDetail(id: string) {
  return useQuery({
    queryKey: ['device', id],
    queryFn: () => getDeviceById(id),
    staleTime: 1000 * 60, // 1 minute
    enabled: !!id
  })
}
