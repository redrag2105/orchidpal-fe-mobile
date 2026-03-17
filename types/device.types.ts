/**
 * Device-related TypeScript interfaces
 * Used for IoT provisioning and device management
 */

// QR code payload structure
export interface QRPayload {
  serial_number: string
  secret_key: string
}

// Device activation request
export interface ActivateDeviceRequest {
  serial_number: string
  secret_key: string
}

// Device activation response
export interface ActivateDeviceResponse {
  message: string
  device: {
    id: string
    serial_number: string
    owner_id: string
    status: DeviceStatus
  }
}

// Device status enum
export type DeviceStatus = 'NEW' | 'OFFLINE' | 'ONLINE' | 'BANNED'

// Device status check response
export interface DeviceStatusResponse {
  serial_number: string
  status: DeviceStatus
  last_online_at: string | null
}

// WiFi credentials for ESP configuration
export interface WifiCredentials {
  ssid: string
  password: string
}

// ESP WiFi config response
export interface EspConfigResponse {
  success: boolean
  message?: string
}

// Zone assignment request
export interface AssignDeviceToZoneRequest {
  zone_id: string
}

// Zone assignment response
export interface AssignDeviceToZoneResponse {
  message: string
  device: {
    id: string
    serial_number: string
    owner_id: string
    zone_id: string
    status: DeviceStatus
  }
}

// Create zone request
export interface CreateZoneRequest {
  name: string
  location_city: string
  exposure?: 'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE'
  image_url?: string
}

// Create zone response
export interface CreateZoneResponse {
  zone_id: string
  id: string
  name: string
  location_city: string
  user_id: string
  exposure?: string
  image_url?: string
}

// Planting zone (for selection/display)
export interface PlantingZone {
  id: string
  name: string
  location_city: string
  description?: string
  exposure?: string
  has_plant?: boolean
}

// Provisioning flow steps
// Note: ENTER_WIFI and SENDING_WIFI removed since ESP captive portal handles WiFi config
export type ProvisioningStep =
  | 'SCAN_QR'
  | 'ACTIVATING'
  | 'ACTIVATION_SUCCESS'
  | 'CONNECT_TO_ESP'
  | 'WAITING_ONLINE'
  | 'SELECT_ZONE'
  | 'CREATE_ZONE'
  | 'SELECT_PLANT'
  | 'COMPLETE'
  | 'ERROR'

// Plant species (from species_wiki)
export interface PlantSpecies {
  id: string
  common_name: string
  scientific_name?: string
  image_url?: string
  ideal_temp_min?: number
  ideal_temp_max?: number
  ideal_humid_min?: number
  ideal_humid_max?: number
}

// Create plant request
export interface CreatePlantRequest {
  zone_id: string
  species_id: string
  nickname?: string
  image_url?: string
  planted_at?: string
}

// Provisioning state
export interface ProvisioningState {
  step: ProvisioningStep
  qrData: QRPayload | null
  device: ActivateDeviceResponse['device'] | null
  selectedZone: PlantingZone | null
  selectedSpecies: PlantSpecies | null
  plantNickname: string | null
  error: string | null
}
