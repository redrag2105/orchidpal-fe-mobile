import { getPlantById } from '@/apis/plant.api'
import { useQuery } from '@tanstack/react-query'

export function usePlantDetail(id: string) {
  return useQuery({
    queryKey: ['plant', id],
    queryFn: () => getPlantById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id
  })
}
