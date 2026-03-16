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
 * 8. SELECT_PLANT - User selects plant species to add (optional)
 * 9. COMPLETE - Device setup finished
 */

import {
  activateDevice,
  assignDeviceToZone,
  createPlant,
  createZone,
  getSpecies,
  getZones,
  waitForDeviceOnline
} from '@/apis/device.api'
import type {
  CreateZoneRequest,
  PlantingZone,
  PlantSpecies,
  ProvisioningState,
  ProvisioningStep,
  QRPayload
} from '@/types/device.types'
import { AxiosError } from 'axios'
import { useCallback, useRef, useState } from 'react'

const initialState: ProvisioningState = {
  step: 'SCAN_QR',
  qrData: null,
  device: null,
  selectedZone: null,
  selectedSpecies: null,
  plantNickname: null,
  error: null
}

// Demo mode flag - true when no API URL configured
const DEMO_MODE = !process.env.EXPO_PUBLIC_API_URL

// Demo zones for testing
const DEMO_ZONES: PlantingZone[] = [
  { id: 'demo-1', name: 'Living Room Garden', location_city: 'Ho Chi Minh City', exposure: 'PARTIAL_SHADE' },
  { id: 'demo-2', name: 'Balcony Orchids', location_city: 'Ho Chi Minh City', exposure: 'FULL_SUN' }
]

// Demo plant species for testing
const DEMO_SPECIES: PlantSpecies[] = [
  {
    id: 'demo-sp-1',
    common_name: 'Phalaenopsis',
    scientific_name: 'Phalaenopsis spp.',
    image_url: 'https://images.unsplash.com/photo-1566836610593-62a64888a216?w=200'
  },
  {
    id: 'demo-sp-2',
    common_name: 'Cattleya',
    scientific_name: 'Cattleya spp.',
    image_url: 'https://images.unsplash.com/photo-1612831819518-a91e6edc315e?w=200'
  },
  {
    id: 'demo-sp-3',
    common_name: 'Dendrobium',
    scientific_name: 'Dendrobium spp.',
    image_url: 'https://images.unsplash.com/photo-1567273128256-e2e4e21c80d6?w=200'
  }
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
  const [species, setSpecies] = useState<PlantSpecies[]>([])

  // Ref to prevent duplicate API calls (e.g., from React StrictMode)
  const activationInProgress = useRef(false)

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
      // Prevent duplicate API calls (StrictMode double-invoke protection)
      if (activationInProgress.current) {
        console.log('[useDeviceProvisioning] Skipping duplicate activation call')
        return
      }
      activationInProgress.current = true

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
          activationInProgress.current = false
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
        // Reset the flag after a short delay to allow retry if needed
        setTimeout(() => {
          activationInProgress.current = false
        }, 1000)
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
          setSpecies(DEMO_SPECIES)
          updateState({ selectedZone: newZone, step: 'SELECT_PLANT' })
          return
        }

        // Create zone (don't assign device yet - that happens after plant selection)
        const created = await createZone(zoneData)
        const newZone: PlantingZone = {
          id: created.zone_id || created.id,
          name: created.name,
          location_city: created.location_city,
          exposure: created.exposure
        }
        setZones((prev) => [...prev, newZone])
        updateState({ selectedZone: newZone, step: 'SELECT_PLANT' })

        // Fetch species for plant selection
        try {
          const speciesResponse = await getSpecies()
          setSpecies(speciesResponse.data)
        } catch {
          // Non-critical - user can skip plant selection
          setSpecies([])
        }
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
        // Demo mode - just fetch species and move to plant selection
        if (isDemoMode) {
          await new Promise((resolve) => setTimeout(resolve, 800))
          setSpecies(DEMO_SPECIES)
          updateState({ step: 'SELECT_PLANT' })
          return
        }

        // Don't assign device to zone yet - that happens after plant selection
        // Just fetch species for plant selection
        try {
          const speciesResponse = await getSpecies()
          setSpecies(speciesResponse.data)
        } catch {
          // Non-critical
          setSpecies([])
        }

        updateState({ step: 'SELECT_PLANT' })
      } catch (error) {
        setError(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    },
    [state.qrData, updateState, setError, isDemoMode]
  )

  /**
   * Select a plant species and create the plant
   */
  const selectPlant = useCallback(
    async (selectedSpecies: PlantSpecies, nickname?: string) => {
      if (!state.selectedZone || !state.qrData) {
        setError('Zone or device information missing. Please restart the setup.')
        return
      }

      const trimmedNickname = nickname?.trim() || null
      setIsLoading(true)
      updateState({ selectedSpecies, plantNickname: trimmedNickname })

      try {
        // Demo mode
        if (isDemoMode) {
          await new Promise((resolve) => setTimeout(resolve, 800))
          updateState({ step: 'COMPLETE' })
          return
        }

        // First create the plant
        await createPlant({
          zone_id: state.selectedZone.id,
          species_id: selectedSpecies.id,
          nickname: trimmedNickname || undefined
        })

        // Then assign device to zone
        await assignDeviceToZone(state.qrData.serial_number, {
          zone_id: state.selectedZone.id
        })

        updateState({ step: 'COMPLETE' })
      } catch (error) {
        setError(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    },
    [state.selectedZone, state.qrData, updateState, setError, isDemoMode]
  )

  /**
   * Skip plant selection and complete setup
   */
  const skipPlantSelection = useCallback(async () => {
    if (!state.selectedZone || !state.qrData) {
      updateState({ step: 'COMPLETE' })
      return
    }

    setIsLoading(true)

    try {
      // Demo mode
      if (isDemoMode) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        updateState({ step: 'COMPLETE' })
        return
      }

      // Assign device to zone when skipping plant selection
      await assignDeviceToZone(state.qrData.serial_number, {
        zone_id: state.selectedZone.id
      })

      updateState({ step: 'COMPLETE' })
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [state.selectedZone, state.qrData, updateState, setError, isDemoMode])

  /**
   * Skip zone assignment - go directly to plant selection
   */
  const skipZoneAssignment = useCallback(async () => {
    setIsLoading(true)
    try {
      if (isDemoMode) {
        setSpecies(DEMO_SPECIES)
      } else {
        const speciesResponse = await getSpecies()
        setSpecies(speciesResponse.data)
      }
    } catch {
      setSpecies([])
    }
    setIsLoading(false)
    updateState({ step: 'SELECT_PLANT' })
  }, [updateState, isDemoMode])

  /**
   * Reset the flow
   */
  const reset = useCallback(() => {
    setState(initialState)
    setIsLoading(false)
    setZones([])
    setSpecies([])
  }, [])

  /**
   * Go back one step
   */
  const goBack = useCallback(() => {
    const backMap: Partial<Record<ProvisioningStep, ProvisioningStep>> = {
      ACTIVATION_SUCCESS: 'SCAN_QR',
      CREATE_ZONE: 'SELECT_ZONE',
      SELECT_PLANT: 'SELECT_ZONE',
      ERROR: 'SCAN_QR'
    }

    const previousStep = backMap[state.step]
    if (previousStep) {
      // Reset demo mode when going back to SCAN_QR
      if (previousStep === 'SCAN_QR') {
        setIsDemoMode(DEMO_MODE)
      }
      setStep(previousStep)
    }
  }, [state.step, setStep])

  /**
   * Jump to a specific step
   */
  const goToStep = useCallback(
    (targetStep: ProvisioningStep) => {
      // Only allow jumping back to SELECT_ZONE from CREATE_ZONE or SELECT_PLANT
      if (targetStep === 'SELECT_ZONE' && (state.step === 'CREATE_ZONE' || state.step === 'SELECT_PLANT')) {
        setStep(targetStep)
      }
    },
    [state.step, setStep]
  )

  /**
   * Retry from error state
   */
  const retry = useCallback(() => {
    setIsDemoMode(DEMO_MODE) // Reset demo mode on retry
    updateState({ error: null, step: 'SCAN_QR' })
  }, [updateState])

  return {
    // State
    ...state,
    isLoading,
    zones,
    species,

    // Computed
    espWifiName: state.qrData ? `OrchidPal-${state.qrData.serial_number}` : null,
    canGoBack: ['ACTIVATION_SUCCESS', 'CREATE_ZONE', 'SELECT_PLANT', 'ERROR'].includes(state.step),

    // Actions
    handleQRScanned,
    proceedToEspConnection,
    confirmWifiConfigured,
    goToCreateZone,
    createAndAssignZone,
    assignToZone,
    skipZoneAssignment,
    selectPlant,
    skipPlantSelection,
    goBack,
    goToStep,
    reset,
    retry
  }
}

export type UseDeviceProvisioningReturn = ReturnType<typeof useDeviceProvisioning>
