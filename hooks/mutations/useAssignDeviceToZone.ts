import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignDeviceToZone } from '@/apis/device.api'
import type { AssignDeviceToZoneRequest } from '@/types/device.types'

interface AssignDeviceParams {
  serialNumber: string
  payload: AssignDeviceToZoneRequest
}

export function useAssignDeviceToZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serialNumber, payload }: AssignDeviceParams) => 
      assignDeviceToZone(serialNumber, payload),
    onSuccess: (_, variables) => {
      // Invalidate the specific zone we just updated
      queryClient.invalidateQueries({ queryKey: ['zone', variables.payload.zone_id] })
      // Optionally invalidate zones list
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
  })
}
