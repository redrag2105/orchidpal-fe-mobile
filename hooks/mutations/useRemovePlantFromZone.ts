import { removePlantFromZone } from '@/apis/plant.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRemovePlantFromZone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => removePlantFromZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      queryClient.invalidateQueries({ queryKey: ['zone'] })
      queryClient.invalidateQueries({ queryKey: ['plants'] })
      queryClient.invalidateQueries({ queryKey: ['plant'] })
    }
  })
}
