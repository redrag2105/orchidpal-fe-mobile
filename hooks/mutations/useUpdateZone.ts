import { updateZone, UpdateZoneRequest } from '@/apis/zone.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateZoneRequest }) => updateZone(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['zone', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      queryClient.invalidateQueries({ queryKey: ['plants'] })
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    }
  })
}
