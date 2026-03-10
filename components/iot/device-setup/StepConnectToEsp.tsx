import { AlertCircle, ChevronRight, RefreshCw, Wifi } from 'lucide-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Linking, Platform, Text, TouchableOpacity, View } from 'react-native'
import { getDeviceStatus } from '../../../apis/device.api'
import { styles } from './styles'

interface StepConnectToEspProps {
  espWifiName: string
  serialNumber: string
  onConnected: () => void
}

export function StepConnectToEsp({ espWifiName, serialNumber, onConnected }: StepConnectToEspProps) {
  const [isOnline, setIsOnline] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkDeviceStatus = useCallback(async () => {
    if (!serialNumber || isChecking) return

    setIsChecking(true)
    try {
      const response = await getDeviceStatus(serialNumber)
      setIsOnline(response.status === 'ONLINE')
      setLastChecked(new Date())
    } catch {
      // Silent fail - device may not be configured yet
      setIsOnline(false)
    } finally {
      setIsChecking(false)
    }
  }, [serialNumber, isChecking])

  // Poll device status every 5 seconds - stop when online
  useEffect(() => {
    // Don't poll if already online
    if (isOnline) {
      return
    }

    // Initial check after a delay (give user time to configure)
    const initialTimeout = setTimeout(() => {
      checkDeviceStatus()
    }, 3000)

    const interval = setInterval(() => {
      if (!isOnline) {
        checkDeviceStatus()
      }
    }, 5000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [checkDeviceStatus, isOnline])

  const openWifiSettings = async () => {
    if (Platform.OS === 'ios') {
      // On iOS, 'prefs:root=WIFI' may not work on all versions
      // Fall back to general settings if it fails
      Linking.openSettings()
    } else {
      // Android - direct to WiFi settings
      Linking.sendIntent('android.settings.WIFI_SETTINGS')
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Wifi size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Connect to Device WiFi</Text>
      <Text style={styles.stepDescription}>Go to your phone's WiFi settings and connect to the device network:</Text>

      <View style={styles.wifiNameBox}>
        <Wifi size={20} color='#8c4a7a' />
        <Text style={styles.wifiName}>{espWifiName}</Text>
      </View>

      <View style={styles.infoBox}>
        <AlertCircle size={16} color='#3b82f6' />
        <Text style={styles.infoText}>
          A configuration page will appear automatically after connecting. Enter your home WiFi credentials there.
        </Text>
      </View>

      <TouchableOpacity style={styles.secondaryButton} onPress={openWifiSettings}>
        <Text style={styles.secondaryButtonText}>Open WiFi Settings</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.statusRow}>
        <View style={styles.statusInfo}>
          <Text style={styles.helperText}>
            {isOnline ? 'Device is online! You can proceed.' : 'Waiting for device to come online...'}
          </Text>
          {lastChecked && <Text style={styles.lastCheckedText}>Last checked: {lastChecked.toLocaleTimeString()}</Text>}
        </View>
        {!isOnline && (
          <TouchableOpacity style={styles.refreshButton} onPress={checkDeviceStatus} disabled={isChecking}>
            {isChecking ? <ActivityIndicator size={18} color='#4a795f' /> : <RefreshCw size={18} color='#4a795f' />}
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, !isOnline && styles.buttonDisabled]}
        onPress={onConnected}
        disabled={!isOnline}
      >
        <Text style={styles.primaryButtonText}>I've Configured WiFi</Text>
        <ChevronRight size={18} color='white' />
      </TouchableOpacity>
    </View>
  )
}
