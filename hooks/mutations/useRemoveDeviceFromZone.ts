import { removeDeviceFromZone } from '@/apis/device.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRemoveDeviceFromZone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => removeDeviceFromZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] })
      queryClient.invalidateQueries({ queryKey: ['zone'] })
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      queryClient.invalidateQueries({ queryKey: ['device'] })
    }
  })
}
