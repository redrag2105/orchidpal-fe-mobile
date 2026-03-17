import { createPlant, CreatePlantRequest } from '@/apis/plant.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreatePlant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlantRequest) => createPlant(data),
    onSuccess: () => {
      // Invalidate the plants query and possibly zone details
      queryClient.invalidateQueries({ queryKey: ['plants'] })
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      // Could also invalidate specific zone if data.zone_id is provided,
      // but invalidating all zones/plants is fine for now to keep synced
    }
  })
}
