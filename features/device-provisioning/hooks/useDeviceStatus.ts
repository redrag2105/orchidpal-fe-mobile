/**
 * Device Status Hook
 * Polls the device status API and tracks online state
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { getDeviceStatusApi } from '../api'
import type { DeviceStatus } from '../types'

export interface UseDeviceStatusOptions {
  serialNumber: string
  /** Polling interval in ms (default: 5000) */
  pollInterval?: number
  /** Initial delay before first poll (default: 3000) */
  initialDelay?: number
  /** Whether polling is enabled (default: true) */
  enabled?: boolean
}

export interface UseDeviceStatusReturn {
  status: DeviceStatus | null
  isOnline: boolean
  isChecking: boolean
  lastCheckedAt: Date | null
  error: string | null
  refresh: () => Promise<void>
}

export function useDeviceStatus({
  serialNumber,
  pollInterval = 5000,
  initialDelay = 3000,
  enabled = true
}: UseDeviceStatusOptions): UseDeviceStatusReturn {
  const [status, setStatus] = useState<DeviceStatus | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Use refs to prevent stale closures and duplicate calls
  const isCheckingRef = useRef(false)
  const serialNumberRef = useRef(serialNumber)
  const isMountedRef = useRef(true)

  // Keep serialNumber ref updated
  useEffect(() => {
    serialNumberRef.current = serialNumber
  }, [serialNumber])

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const checkStatus = useCallback(async () => {
    const sn = serialNumberRef.current
    if (!sn || isCheckingRef.current) return

    isCheckingRef.current = true
    setIsChecking(true)

    try {
      const response = await getDeviceStatusApi(sn)

      // Only update state if still mounted
      if (!isMountedRef.current) return

      // Handle case-insensitive status comparison
      const normalizedStatus = (response.status?.toUpperCase?.() || response.status) as DeviceStatus
      setStatus(normalizedStatus)
      setLastCheckedAt(new Date())
      setError(null)
    } catch (err) {
      if (!isMountedRef.current) return
      // Silent fail - device may not be configured yet
      setError('Unable to check device status')
    } finally {
      isCheckingRef.current = false
      if (isMountedRef.current) {
        setIsChecking(false)
      }
    }
  }, []) // No dependencies - uses refs

  // Setup polling with stable interval
  useEffect(() => {
    if (!enabled || !serialNumber) return

    // Initial delay before first check
    const initialTimeout = setTimeout(() => {
      checkStatus()
    }, initialDelay)

    // Setup polling interval
    const interval = setInterval(() => {
      checkStatus()
    }, pollInterval)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [enabled, serialNumber, pollInterval, initialDelay]) // checkStatus is stable now

  return {
    status,
    isOnline: status === 'ONLINE',
    isChecking,
    lastCheckedAt,
    error,
    refresh: checkStatus
  }
}
