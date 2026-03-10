/**
 * Device Provisioning Store (Zustand)
 * Centralized state management for the provisioning flow
 * Separates state logic from UI components
 */

import { create } from 'zustand'
import { activateDeviceApi, assignDeviceToZoneApi, createZoneApi, getZonesApi } from './api'
import {
  BACK_ENABLED_STEPS,
  CreateZoneRequest,
  PlantingZone,
  ProvisioningState,
  ProvisioningStep,
  QRPayload,
  STEP_BACK_MAP
} from './types'

// Demo mode flag - true when no API URL configured
const IS_DEMO_MODE_DEFAULT = !process.env.EXPO_PUBLIC_API_URL

// Demo data for testing
const DEMO_ZONES: PlantingZone[] = [
  { id: 'demo-1', name: 'Living Room Garden', location_city: 'Ho Chi Minh City', exposure: 'PARTIAL_SHADE' },
  { id: 'demo-2', name: 'Balcony Orchids', location_city: 'Ho Chi Minh City', exposure: 'FULL_SUN' }
]

// Track active activation to prevent duplicate API calls
let activeActivationId: string | null = null

const INITIAL_STATE: ProvisioningState = {
  step: 'SCAN_QR',
  qrData: null,
  device: null,
  selectedZone: null,
  zones: [],
  isLoading: false,
  error: null,
  isDemoMode: IS_DEMO_MODE_DEFAULT
}

interface ProvisioningActions {
  // State setters
  setStep: (step: ProvisioningStep) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setDemoMode: (demo: boolean) => void

  // Flow actions
  activateDevice: (qrContent: string, forceDemo?: boolean) => Promise<void>
  proceedToEspConnection: () => void
  confirmWifiConfigured: () => void
  assignToZone: (zone: PlantingZone) => Promise<void>
  createAndAssignZone: (data: CreateZoneRequest) => Promise<void>
  skipZoneAssignment: () => void

  // Navigation
  goBack: () => void
  goToCreateZone: () => void
  retry: () => void
  reset: () => void

  // Computed
  canGoBack: () => boolean
  espWifiName: () => string | null
}

export type ProvisioningStore = ProvisioningState & ProvisioningActions

/**
 * Extract user-friendly error message from API errors
 */
function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    // Axios error
    if ('response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string }; status?: number }
        code?: string
      }
      if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
        return 'Cannot connect to server. Please check your internet connection.'
      }
      const data = axiosError.response?.data
      if (data?.message) return data.message
      if (data?.error) return data.error
      return `Server error: ${axiosError.response?.status || 'Unknown'}`
    }
    // Standard Error
    if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
      return (error as { message: string }).message
    }
  }
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Parse and validate QR code content
 */
function parseQRCode(content: string): QRPayload | null {
  try {
    // Clean the data
    let cleanData = content.trim()
    if (cleanData.charCodeAt(0) === 0xfeff) {
      cleanData = cleanData.slice(1)
    }
    if (cleanData.includes('%')) {
      try {
        cleanData = decodeURIComponent(cleanData)
      } catch {
        // Ignore decoding errors
      }
    }

    const parsed = JSON.parse(cleanData)
    if (parsed.serial_number && parsed.secret_key) {
      return {
        serial_number: parsed.serial_number,
        secret_key: parsed.secret_key
      }
    }
    return null
  } catch {
    return null
  }
}

export const useProvisioningStore = create<ProvisioningStore>((set, get) => ({
  // Initial state
  ...INITIAL_STATE,

  // State setters
  setStep: (step) => set({ step, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, step: error ? 'ERROR' : get().step }),
  setDemoMode: (isDemoMode) => set({ isDemoMode }),

  // Flow actions
  activateDevice: async (qrContent, forceDemo) => {
    const state = get()

    // Prevent multiple concurrent activation calls with both state and module-level lock
    if (state.isLoading) return

    // Generate unique activation ID
    const activationId = `${Date.now()}-${Math.random()}`
    if (activeActivationId !== null) {
      console.log('[Provisioning] Skipping duplicate activation call')
      return
    }
    activeActivationId = activationId

    const useDemo = forceDemo ?? state.isDemoMode
    if (forceDemo) set({ isDemoMode: true })

    // Parse QR code
    const qrData = parseQRCode(qrContent)
    if (!qrData) {
      activeActivationId = null
      set({ error: 'Invalid QR code. Please scan the code on your OrchidPal device.', step: 'ERROR' })
      return
    }

    set({ isLoading: true, qrData, step: 'ACTIVATING', error: null })

    try {
      if (useDemo) {
        // Demo mode - simulate activation
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if this activation is still active
        if (activeActivationId !== activationId) return

        set({
          device: {
            id: 'demo-device-id',
            serial_number: qrData.serial_number,
            owner_id: 'demo-user',
            status: 'OFFLINE'
          },
          zones: DEMO_ZONES,
          step: 'ACTIVATION_SUCCESS',
          isLoading: false
        })
        activeActivationId = null
        return
      }

      // Real API call
      const response = await activateDeviceApi(qrData)

      // Check if this activation is still active
      if (activeActivationId !== activationId) return

      // Fetch user's zones
      let zones: PlantingZone[] = []
      try {
        zones = await getZonesApi()
      } catch {
        // Non-critical - user can still create zone
      }

      // Check again after zones fetch
      if (activeActivationId !== activationId) return

      set({
        device: response.device,
        zones,
        step: 'ACTIVATION_SUCCESS',
        isLoading: false
      })
      activeActivationId = null
    } catch (error) {
      if (activeActivationId !== activationId) return
      activeActivationId = null

      set({
        error: extractErrorMessage(error),
        step: 'ERROR',
        isLoading: false
      })
    }
  },

  proceedToEspConnection: () => {
    set({ step: 'CONNECT_TO_ESP' })
  },

  confirmWifiConfigured: () => {
    set({ step: 'SELECT_ZONE' })
  },

  assignToZone: async (zone) => {
    const state = get()
    if (state.isLoading || !state.qrData) return

    set({ isLoading: true, selectedZone: zone })

    try {
      if (state.isDemoMode) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        set({ step: 'COMPLETE', isLoading: false })
        return
      }

      await assignDeviceToZoneApi(state.qrData.serial_number, zone.id)
      set({ step: 'COMPLETE', isLoading: false })
    } catch (error) {
      set({
        error: extractErrorMessage(error),
        step: 'ERROR',
        isLoading: false
      })
    }
  },

  createAndAssignZone: async (data) => {
    const state = get()
    if (state.isLoading || !state.qrData) return

    set({ isLoading: true })

    try {
      if (state.isDemoMode) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const newZone: PlantingZone = {
          id: `demo-new-${Date.now()}`,
          name: data.name,
          location_city: data.location_city,
          exposure: data.exposure
        }
        set({
          zones: [...state.zones, newZone],
          selectedZone: newZone,
          step: 'COMPLETE',
          isLoading: false
        })
        return
      }

      // Create zone
      const created = await createZoneApi(data)
      const newZone: PlantingZone = {
        id: created.zone_id || created.id,
        name: created.name,
        location_city: created.location_city,
        exposure: created.exposure
      }

      // Assign device to zone
      await assignDeviceToZoneApi(state.qrData.serial_number, newZone.id)

      set({
        zones: [...state.zones, newZone],
        selectedZone: newZone,
        step: 'COMPLETE',
        isLoading: false
      })
    } catch (error) {
      set({
        error: extractErrorMessage(error),
        step: 'ERROR',
        isLoading: false
      })
    }
  },

  skipZoneAssignment: () => {
    set({ step: 'COMPLETE' })
  },

  // Navigation
  goBack: () => {
    const { step } = get()
    const previousStep = STEP_BACK_MAP[step]
    if (previousStep) {
      // Reset demo mode when going back to SCAN_QR
      if (previousStep === 'SCAN_QR') {
        set({ isDemoMode: IS_DEMO_MODE_DEFAULT })
      }
      set({ step: previousStep, error: null })
    }
  },

  goToCreateZone: () => {
    set({ step: 'CREATE_ZONE' })
  },

  retry: () => {
    activeActivationId = null
    set({
      ...INITIAL_STATE,
      isDemoMode: IS_DEMO_MODE_DEFAULT
    })
  },

  reset: () => {
    activeActivationId = null
    set(INITIAL_STATE)
  },

  // Computed
  canGoBack: () => BACK_ENABLED_STEPS.includes(get().step),
  espWifiName: () => {
    const { qrData } = get()
    return qrData ? `OrchidPal-${qrData.serial_number}` : null
  }
}))
