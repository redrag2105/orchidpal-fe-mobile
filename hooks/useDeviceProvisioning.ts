/**
 * Device Provisioning Hook
 * Manages the entire IoT device setup flow state and actions
 *
 * Flow:
 * 1. SCAN_QR - User scans QR code or enters manually
 * 2. ACTIVATING - Backend activates device for user
 * 3. ACTIVATION_SUCCESS - Shows success, user proceeds
 * 4. CONNECT_TO_ESP - User connects to ESP WiFi, captive portal handles config
 * 5. WAITING_ONLINE - Polling until device comes online
 * 6. SELECT_ZONE - User selects existing zone or creates new one
 * 7. CREATE_ZONE - User creates a new zone (optional sub-step)
 * 8. COMPLETE - Device setup finished
 */

import { activateDevice, assignDeviceToZone, createZone, getZones, waitForDeviceOnline } from '@/apis/device.api'
import type {
  CreateZoneRequest,
  PlantingZone,
  ProvisioningState,
  ProvisioningStep,
  QRPayload
} from '@/types/device.types'
import { AxiosError } from 'axios'
import { useCallback, useState } from 'react'

const initialState: ProvisioningState = {
  step: 'SCAN_QR',
  qrData: null,
  device: null,
  selectedZone: null,
  error: null
}

// Demo mode flag - true when no API URL configured
const DEMO_MODE = !process.env.EXPO_PUBLIC_API_URL

// Demo zones for testing
const DEMO_ZONES: PlantingZone[] = [
  { id: 'demo-1', name: 'Living Room Garden', location_city: 'Ho Chi Minh City', exposure: 'PARTIAL_SHADE' },
  { id: 'demo-2', name: 'Balcony Orchids', location_city: 'Ho Chi Minh City', exposure: 'FULL_SUN' }
]

/**
 * Extract user-friendly error message from various error types
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return 'Cannot connect to server. Please check your internet connection.'
    }
    const data = error.response?.data
    if (typeof data === 'object' && data !== null) {
      if ('message' in data && typeof data.message === 'string') {
        return data.message
      }
      if ('error' in data && typeof data.error === 'string') {
        return data.error
      }
    }
    return `Server error: ${error.response?.status || 'Unknown'}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred. Please try again.'
}

export function useDeviceProvisioning(initialDemoMode: boolean = DEMO_MODE) {
  const [state, setState] = useState<ProvisioningState>(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(initialDemoMode)
  const [zones, setZones] = useState<PlantingZone[]>([])

  // Helper to update state
  const updateState = useCallback((updates: Partial<ProvisioningState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  // Helper to set step
  const setStep = useCallback(
    (step: ProvisioningStep) => {
      updateState({ step, error: null })
    },
    [updateState]
  )

  // Helper to set error
  const setError = useCallback(
    (error: string) => {
      updateState({ step: 'ERROR', error })
    },
    [updateState]
  )

  /**
   * Step 1: Handle QR code scan result
   */
  const handleQRScanned = useCallback(
    async (qrContent: string, forceDemo?: boolean) => {
      const useDemo = forceDemo ?? isDemoMode
      if (forceDemo) setIsDemoMode(true)

      setIsLoading(true)
      try {
        // Parse QR code JSON
        let qrData: QRPayload
        try {
          qrData = JSON.parse(qrContent)
          if (!qrData.serial_number || !qrData.secret_key) {
            throw new Error('Invalid QR format')
          }
        } catch {
          setError('Invalid QR code. Please scan the code on your OrchidPal device.')
          setIsLoading(false)
          return
        }

        updateState({ qrData, step: 'ACTIVATING' })

        // Demo mode
        if (useDemo) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          updateState({
            device: {
              id: 'demo-device-id',
              serial_number: qrData.serial_number,
              owner_id: 'demo-user',
              status: 'OFFLINE'
            },
            step: 'ACTIVATION_SUCCESS'
          })
          setZones(DEMO_ZONES)
          return
        }

        // Real API call
        const response = await activateDevice({
          serial_number: qrData.serial_number,
          secret_key: qrData.secret_key
        })

        updateState({
          device: response.device,
          step: 'ACTIVATION_SUCCESS'
        })

        // Fetch user's zones
        try {
          const userZones = await getZones()
          setZones(userZones)
        } catch {
          // Non-critical - user can still create zone
        }
      } catch (error) {
        setError(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    },
    [updateState, setError, isDemoMode]
  )

  /**
   * Move to ESP connection step
   */
  const proceedToEspConnection = useCallback(() => {
    setStep('CONNECT_TO_ESP')
  }, [setStep])

  /**
   * User confirms they've configured WiFi via ESP captive portal
   * Start polling for device online status
   */
  const confirmWifiConfigured = useCallback(async () => {
    if (!state.qrData) {
      setError('Device information missing. Please restart the setup.')
      return
    }

    setStep('WAITING_ONLINE')
    setIsLoading(true)

    try {
      // Demo mode
      if (isDemoMode) {
        await new Promise((resolve) => setTimeout(resolve, 2500))
        setStep('SELECT_ZONE')
        return
      }

      // Poll for device online
      await waitForDeviceOnline(state.qrData.serial_number, 30, 2000)
      setStep('SELECT_ZONE')
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [state.qrData, setStep, setError, isDemoMode])

  /**
   * Navigate to zone creation step
   */
  const goToCreateZone = useCallback(() => {
    setStep('CREATE_ZONE')
  }, [setStep])

  /**
   * Create a new zone and assign device to it
   */
  const createAndAssignZone = useCallback(
    async (zoneData: CreateZoneRequest) => {
      if (!state.qrData) {
        setError('Device information missing. Please restart the setup.')
        return
      }

      setIsLoading(true)

      try {
        // Demo mode
        if (isDemoMode) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const newZone: PlantingZone = {
            id: `demo-new-${Date.now()}`,
            name: zoneData.name,
            location_city: zoneData.location_city,
            exposure: zoneData.exposure
          }
          setZones((prev) => [...prev, newZone])
          updateState({ selectedZone: newZone, step: 'COMPLETE' })
          return
        }

        // Create zone
        const created = await createZone(zoneData)
        const newZone: PlantingZone = {
          id: created.zone_id || created.id,
          name: created.name,
          location_city: created.location_city,
          exposure: created.exposure
        }
        setZones((prev) => [...prev, newZone])

        // Assign device to zone
        await assignDeviceToZone(state.qrData.serial_number, {
          zone_id: newZone.id
        })

        updateState({ selectedZone: newZone, step: 'COMPLETE' })
      } catch (error) {
        setError(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    },
    [state.qrData, updateState, setError, isDemoMode]
  )

  /**
   * Assign device to an existing zone
   */
  const assignToZone = useCallback(
    async (zone: PlantingZone) => {
      if (!state.qrData) {
        setError('Device information missing. Please restart the setup.')
        return
      }

      setIsLoading(true)
      updateState({ selectedZone: zone })

      try {
        // Demo mode
        if (isDemoMode) {
          await new Promise((resolve) => setTimeout(resolve, 800))
          updateState({ step: 'COMPLETE' })
          return
        }

        await assignDeviceToZone(state.qrData.serial_number, {
          zone_id: zone.id
        })

        updateState({ step: 'COMPLETE' })
      } catch (error) {
        setError(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    },
    [state.qrData, updateState, setError, isDemoMode]
  )

  /**
   * Skip zone assignment
   */
  const skipZoneAssignment = useCallback(() => {
    updateState({ step: 'COMPLETE' })
  }, [updateState])

  /**
   * Reset the flow
   */
  const reset = useCallback(() => {
    setState(initialState)
    setIsLoading(false)
    setZones([])
  }, [])

  /**
   * Go back one step
   */
  const goBack = useCallback(() => {
    const backMap: Partial<Record<ProvisioningStep, ProvisioningStep>> = {
      ACTIVATION_SUCCESS: 'SCAN_QR',
      CONNECT_TO_ESP: 'ACTIVATION_SUCCESS',
      SELECT_ZONE: 'CONNECT_TO_ESP',
      CREATE_ZONE: 'SELECT_ZONE',
      ERROR: 'SCAN_QR'
    }

    const previousStep = backMap[state.step]
    if (previousStep) {
      setStep(previousStep)
    }
  }, [state.step, setStep])

  /**
   * Retry from error state
   */
  const retry = useCallback(() => {
    updateState({ error: null, step: 'SCAN_QR' })
  }, [updateState])

  return {
    // State
    ...state,
    isLoading,
    zones,

    // Computed
    espWifiName: state.qrData ? `OrchidPal-${state.qrData.serial_number}` : null,
    canGoBack: ['ACTIVATION_SUCCESS', 'CONNECT_TO_ESP', 'SELECT_ZONE', 'CREATE_ZONE', 'ERROR'].includes(state.step),

    // Actions
    handleQRScanned,
    proceedToEspConnection,
    confirmWifiConfigured,
    goToCreateZone,
    createAndAssignZone,
    assignToZone,
    skipZoneAssignment,
    goBack,
    reset,
    retry
  }
}

export type UseDeviceProvisioningReturn = ReturnType<typeof useDeviceProvisioning>
