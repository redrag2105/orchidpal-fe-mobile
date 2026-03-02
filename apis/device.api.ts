/**
 * Device API functions
 * Handles all device-related HTTP requests
 */

import { apiClient } from '@/core/api/axios'
import type {
  ActivateDeviceRequest,
  ActivateDeviceResponse,
  AssignDeviceToZoneRequest,
  AssignDeviceToZoneResponse,
  CreateZoneRequest,
  CreateZoneResponse,
  DeviceStatusResponse,
  EspConfigResponse,
  PlantingZone,
  WifiCredentials
} from '@/types/device.types'

const ESP_CONFIG_URL = 'http://192.168.4.1/config'
const ESP_CONFIG_TIMEOUT = 10000

/**
 * Activate a device by linking it to the current user's account
 * Called after scanning QR code
 */
export async function activateDevice(payload: ActivateDeviceRequest): Promise<ActivateDeviceResponse> {
  const response = await apiClient.post<ActivateDeviceResponse>('/devices/activate', payload)
  return response.data
}

/**
 * Check device online/offline status
 * Used to poll until device comes online after WiFi configuration
 */
export async function getDeviceStatus(serialNumber: string): Promise<DeviceStatusResponse> {
  const response = await apiClient.get<DeviceStatusResponse>(`/devices/${serialNumber}/status`)
  return response.data
}

/**
 * Assign device to a planting zone
 * Final step of provisioning flow
 */
export async function assignDeviceToZone(
  serialNumber: string,
  payload: AssignDeviceToZoneRequest
): Promise<AssignDeviceToZoneResponse> {
  const response = await apiClient.post<AssignDeviceToZoneResponse>(`/devices/${serialNumber}/assign-zone`, payload)
  return response.data
}

/**
 * Send WiFi credentials directly to ESP device via SoftAP
 * This call goes to the ESP's local HTTP server, not the backend
 */
export async function configureEspWifi(credentials: WifiCredentials): Promise<EspConfigResponse> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), ESP_CONFIG_TIMEOUT)

    const response = await fetch(ESP_CONFIG_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return {
        success: false,
        message: `ESP returned status ${response.status}`
      }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Connection to ESP timed out. Make sure you are connected to the device WiFi.'
        }
      }
      return {
        success: false,
        message: error.message
      }
    }
    return {
      success: false,
      message: 'Failed to connect to ESP device'
    }
  }
}

/**
 * Poll device status until it comes online
 * Returns true when online, throws error on timeout
 */
export async function waitForDeviceOnline(
  serialNumber: string,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const status = await getDeviceStatus(serialNumber)
      if (status.status === 'ONLINE') {
        return true
      }
    } catch {
      // Ignore errors during polling
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }
  throw new Error('Device did not come online within the expected time')
}

/**
 * Get all zones for the current user
 */
export async function getZones(): Promise<PlantingZone[]> {
  const response = await apiClient.get<PlantingZone[]>('/zones')
  return response.data
}

/**
 * Create a new planting zone
 */
export async function createZone(payload: CreateZoneRequest): Promise<CreateZoneResponse> {
  const response = await apiClient.post<CreateZoneResponse>('/zones', payload)
  return response.data
}
