/**
 * Device Provisioning Feature - Type Definitions
 * Centralized types for the entire provisioning flow
 */

export type ProvisioningStep =
  | 'SCAN_QR'
  | 'ACTIVATING'
  | 'ACTIVATION_SUCCESS'
  | 'CONNECT_TO_ESP'
  | 'WAITING_ONLINE'
  | 'SELECT_ZONE'
  | 'CREATE_ZONE'
  | 'COMPLETE'
  | 'ERROR'

export interface QRPayload {
  serial_number: string
  secret_key: string
}

export interface Device {
  id: string
  serial_number: string
  owner_id: string
  status: DeviceStatus
}

export type DeviceStatus = 'NEW' | 'OFFLINE' | 'ONLINE' | 'BANNED'

export interface PlantingZone {
  id: string
  name: string
  location_city?: string
  exposure?: string
}

export interface ProvisioningState {
  // Current step
  step: ProvisioningStep

  // Data
  qrData: QRPayload | null
  device: Device | null
  selectedZone: PlantingZone | null
  zones: PlantingZone[]

  // UI state
  isLoading: boolean
  error: string | null
  isDemoMode: boolean
}

export interface CreateZoneRequest {
  name: string
  location_city?: string
  exposure?: string
}

// Step navigation map for back button
export const STEP_BACK_MAP: Partial<Record<ProvisioningStep, ProvisioningStep>> = {
  ACTIVATION_SUCCESS: 'SCAN_QR',
  CONNECT_TO_ESP: 'ACTIVATION_SUCCESS',
  SELECT_ZONE: 'CONNECT_TO_ESP',
  CREATE_ZONE: 'SELECT_ZONE',
  ERROR: 'SCAN_QR'
}

// Steps that allow back navigation
export const BACK_ENABLED_STEPS: ProvisioningStep[] = [
  'ACTIVATION_SUCCESS',
  'CONNECT_TO_ESP',
  'SELECT_ZONE',
  'CREATE_ZONE',
  'ERROR'
]
