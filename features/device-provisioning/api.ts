/**
 * Device Provisioning API Module
 * Isolated API calls for the provisioning flow
 */

import { apiClient } from '@/core/api/axios'
import type { CreateZoneRequest, Device, DeviceStatus, PlantingZone, QRPayload } from './types'

export interface ActivateDeviceResponse {
  device: Device
}

export interface DeviceStatusResponse {
  serial_number: string
  status: DeviceStatus
  last_online_at: string | null
}

export interface CreateZoneResponse {
  id: string
  zone_id?: string
  name: string
  location_city?: string
  exposure?: string
}

/**
 * Activate a device by linking it to the current user's account
 */
export async function activateDeviceApi(payload: QRPayload): Promise<ActivateDeviceResponse> {
  const response = await apiClient.post<ActivateDeviceResponse>('/devices/activate', {
    serial_number: payload.serial_number,
    secret_key: payload.secret_key
  })
  return response.data
}

/**
 * Check device online/offline status
 */
export async function getDeviceStatusApi(serialNumber: string): Promise<DeviceStatusResponse> {
  const response = await apiClient.get<DeviceStatusResponse>(`/devices/${serialNumber}/status`)
  return response.data
}

/**
 * Assign device to a planting zone
 */
export async function assignDeviceToZoneApi(serialNumber: string, zoneId: string): Promise<{ success: boolean }> {
  const response = await apiClient.post<{ success: boolean }>(`/devices/${serialNumber}/assign-zone`, {
    zone_id: zoneId
  })
  return response.data
}

/**
 * Get user's planting zones
 */
export async function getZonesApi(): Promise<PlantingZone[]> {
  const response = await apiClient.get<PlantingZone[]>('/zones')
  return response.data
}

/**
 * Create a new planting zone
 */
export async function createZoneApi(data: CreateZoneRequest): Promise<CreateZoneResponse> {
  const response = await apiClient.post<CreateZoneResponse>('/zones', data)
  return response.data
}
