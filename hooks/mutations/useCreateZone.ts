import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createZone } from '@/apis/device.api'
import type { CreateZoneRequest } from '@/types/device.types'

export function useCreateZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateZoneRequest) => createZone(data),
    onSuccess: () => {
      // Invalidate the zones query so it refetches the list
      queryClient.invalidateQueries({ queryKey: ['zones'] })
    },
  })
}
