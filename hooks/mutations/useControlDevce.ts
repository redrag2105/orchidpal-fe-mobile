import { controlDevice } from '@/apis/device.api'
import { useMutation } from '@tanstack/react-query'

export function useControlDevice() {
  return useMutation({
    mutationFn: (params: { serialNumber: string; role: string; action: 'ON' | 'OFF' }) =>
      controlDevice(params.serialNumber, { role: params.role, action: params.action })
  })
}
