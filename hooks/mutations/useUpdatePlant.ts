import { updatePlant, UpdatePlantRequest } from '@/apis/plant.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdatePlant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlantRequest }) => updatePlant(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plant', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['plants'] })
    }
  })
}
