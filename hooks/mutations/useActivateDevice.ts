import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateDevice } from '@/apis/device.api'
import type { ActivateDeviceRequest } from '@/types/device.types'

export function useActivateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ActivateDeviceRequest) => activateDevice(data),
    onSuccess: () => {
      // Refresh devices or user info if necessary
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
  })
}
