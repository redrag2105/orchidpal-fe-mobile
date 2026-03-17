import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignPlantToZone, AssignPlantToZoneRequest } from '@/apis/plant.api'

export function useAssignPlantToZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssignPlantToZoneRequest) => assignPlantToZone(data),
    onSuccess: (_, variables) => {
      // Invalidate the related endpoints to refresh data
      queryClient.invalidateQueries({ queryKey: ['zone', variables.zone_id] })
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      queryClient.invalidateQueries({ queryKey: ['plants'] })
    },
  })
}
