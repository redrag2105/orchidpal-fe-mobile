/**
 * Device Setup Screen
 * Multi-step IoT provisioning flow with elegant UI
 */

import { useDeviceProvisioning } from '@/hooks/useDeviceProvisioning'
import type { PlantingZone } from '@/types/device.types'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Flower2,
  Loader2,
  MapPin,
  QrCode,
  Router,
  Sparkles,
  Wifi,
  WifiOff,
  X
} from 'lucide-react-native'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DeviceSetupScreen() {
  const router = useRouter()
  const [isDemoMode, setIsDemoMode] = useState(false)
  const provisioning = useDeviceProvisioning(isDemoMode)

  const handleClose = () => {
    if (provisioning.step === 'COMPLETE') {
      router.replace('/(dashboard)')
    } else {
      router.back()
    }
  }

  // Handler for demo mode - triggers demo flow immediately
  const handleDemoScan = () => {
    setIsDemoMode(true)
    const mockQR = JSON.stringify({
      serial_number: 'ESP-ORCHID-DEMO',
      secret_key: 'demo_secret_key'
    })
    // Pass forceDemo=true to bypass waiting for state update
    provisioning.handleQRScanned(mockQR, true)
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            {provisioning.canGoBack ? (
              <TouchableOpacity style={styles.backButton} onPress={provisioning.goBack}>
                <ChevronLeft size={20} color='#1f2937' />
              </TouchableOpacity>
            ) : (
              <View style={styles.backButton}>
                <Router size={18} color='#8c4a7a' />
              </View>
            )}
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeText}>{provisioning.step === 'COMPLETE' ? 'Done' : 'Cancel'}</Text>
            </TouchableOpacity>
          </View>

          {/* Brand */}
          <View style={styles.brandBlock}>
            <View style={styles.brandRow}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoMark}>*</Text>
              </View>
              <View>
                <Text style={styles.brandName}>Device Setup</Text>
                <Text style={styles.brandTagline}>Connect your OrchidPal IoT kit</Text>
              </View>
            </View>
          </View>

          {/* Progress */}
          <ProgressIndicator step={provisioning.step} />

          {/* Step Content */}
          <View style={styles.cardWrapper}>
            {provisioning.step === 'SCAN_QR' && (
              <StepScanQR
                onScanned={provisioning.handleQRScanned}
                onDemoScan={handleDemoScan}
                isLoading={provisioning.isLoading}
              />
            )}

            {provisioning.step === 'ACTIVATING' && <StepLoading message='Activating device...' />}

            {provisioning.step === 'ACTIVATION_SUCCESS' && (
              <StepActivationSuccess
                serialNumber={provisioning.qrData?.serial_number || ''}
                onContinue={provisioning.proceedToEspConnection}
              />
            )}

            {provisioning.step === 'CONNECT_TO_ESP' && (
              <StepConnectToEsp
                espWifiName={provisioning.espWifiName || ''}
                onConnected={provisioning.confirmWifiConfigured}
              />
            )}

            {provisioning.step === 'WAITING_ONLINE' && (
              <StepWaitingOnline serialNumber={provisioning.qrData?.serial_number || ''} />
            )}

            {provisioning.step === 'SELECT_ZONE' && (
              <StepSelectZone
                zones={provisioning.zones}
                onSelect={provisioning.assignToZone}
                onCreateNew={provisioning.goToCreateZone}
                onSkip={provisioning.skipZoneAssignment}
                isLoading={provisioning.isLoading}
              />
            )}

            {provisioning.step === 'CREATE_ZONE' && (
              <StepCreateZone
                onSubmit={provisioning.createAndAssignZone}
                onBack={provisioning.goBack}
                isLoading={provisioning.isLoading}
              />
            )}

            {provisioning.step === 'COMPLETE' && (
              <StepComplete
                serialNumber={provisioning.qrData?.serial_number || ''}
                zoneName={provisioning.selectedZone?.name}
                onFinish={handleClose}
              />
            )}

            {provisioning.step === 'ERROR' && (
              <StepError error={provisioning.error || 'An error occurred'} onRetry={provisioning.retry} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress Indicator
// ─────────────────────────────────────────────────────────────────────────────

function ProgressIndicator({ step }: { step: string }) {
  const steps = [
    { key: 'scan', label: 'Scan', active: ['SCAN_QR', 'ACTIVATING'].includes(step) },
    { key: 'activate', label: 'Activate', active: ['ACTIVATION_SUCCESS'].includes(step) },
    { key: 'wifi', label: 'WiFi', active: ['CONNECT_TO_ESP', 'WAITING_ONLINE'].includes(step) },
    { key: 'zone', label: 'Zone', active: ['SELECT_ZONE', 'CREATE_ZONE'].includes(step) }
  ]

  const completedIndex = ['COMPLETE'].includes(step) ? 4 : steps.findIndex((s) => s.active)

  return (
    <View style={styles.progressRow}>
      {steps.map((s, i) => {
        const isCompleted = i < completedIndex || step === 'COMPLETE'
        const isActive = s.active
        return (
          <View key={s.key} style={styles.progressItem}>
            <View
              style={[
                styles.progressDot,
                isCompleted && styles.progressDotCompleted,
                isActive && styles.progressDotActive
              ]}
            >
              {isCompleted && <CheckCircle2 size={12} color='white' />}
            </View>
            <Text style={[styles.progressLabel, (isActive || isCompleted) && styles.progressLabelActive]}>
              {s.label}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Scan QR
// ─────────────────────────────────────────────────────────────────────────────

function StepScanQR({
  onScanned,
  onDemoScan,
  isLoading
}: {
  onScanned: (data: string) => void
  onDemoScan: () => void
  isLoading: boolean
}) {
  const [permission, requestPermission] = useCameraPermissions()
  const [showCamera, setShowCamera] = useState(false)
  const [manualInput, setManualInput] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const [scannedData, setScannedData] = useState<{ serial_number: string; secret_key: string } | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission()
      if (!result.granted) {
        // Permission denied - open settings
        Linking.openSettings()
        return
      }
    }
    setHasScanned(false)
    setScannedData(null)
    setParseError(null)
    setShowCamera(true)
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (hasScanned) return // Prevent multiple scans
    setHasScanned(true)
    setShowCamera(false)

    // Try to parse the QR data with cleanup
    try {
      // Clean the data: trim whitespace, remove BOM, handle URL encoding
      let cleanData = data.trim()

      // Remove BOM if present
      if (cleanData.charCodeAt(0) === 0xfeff) {
        cleanData = cleanData.slice(1)
      }

      // Try URL decoding if it looks URL-encoded
      if (cleanData.includes('%')) {
        try {
          cleanData = decodeURIComponent(cleanData)
        } catch {
          // Ignore decoding errors
        }
      }

      const parsed = JSON.parse(cleanData)
      if (parsed.serial_number && parsed.secret_key) {
        // Immediately proceed to activation without preview
        onScanned(JSON.stringify(parsed))
      } else {
        setParseError('Invalid QR code')
        setScannedData(null)
      }
    } catch {
      setParseError('Invalid QR code')
      setScannedData(null)
    }
  }

  const handleCloseCamera = () => {
    setShowCamera(false)
    setHasScanned(false)
  }

  const handleResetScan = () => {
    setScannedData(null)
    setParseError(null)
    setHasScanned(false)
  }

  // Show parse error if we have one
  if (parseError) {
    return (
      <View style={styles.card}>
        <View style={[styles.iconContainer, styles.iconError]}>
          <AlertCircle size={48} color='#dc2626' strokeWidth={1.5} />
        </View>

        <Text style={styles.stepTitle}>Invalid QR Code</Text>
        <Text style={styles.stepDescription}>Please scan a valid OrchidPal device QR code.</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={handleResetScan}>
          <QrCode size={18} color='white' />
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <QrCode size={48} color='#4a795f' strokeWidth={1.5} />
        </View>

        <Text style={styles.stepTitle}>Scan your device QR</Text>
        <Text style={styles.stepDescription}>
          Find the QR code on your OrchidPal IoT kit packaging and scan it to begin the setup process.
        </Text>

        {/* Permission status info */}
        {permission && !permission.granted && (
          <View style={styles.permissionBox}>
            <AlertCircle size={16} color='#d97706' />
            <Text style={styles.permissionText}>
              {permission.canAskAgain
                ? 'Camera permission is required to scan QR codes'
                : 'Camera permission was denied. Please enable it in Settings.'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleOpenCamera}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <>
              <QrCode size={18} color='white' />
              <Text style={styles.primaryButtonText}>
                {permission?.granted ? 'Open Camera' : 'Grant Permission & Scan'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Demo button for testing without camera */}
        <TouchableOpacity style={[styles.secondaryButton, { marginTop: 12 }]} onPress={onDemoScan} disabled={isLoading}>
          <Text style={styles.secondaryButtonText}>Use Demo Device (Testing)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => setShowManual(!showManual)}>
          <Text style={styles.linkButtonText}>{showManual ? 'Hide manual entry' : 'Enter code manually'}</Text>
        </TouchableOpacity>

        {showManual && (
          <View style={styles.manualBlock}>
            <Text style={styles.fieldLabel}>Device Code</Text>
            <View style={styles.fieldRow}>
              <TextInput
                style={styles.input}
                placeholder='{"serial_number":"...", "secret_key":"..."}'
                placeholderTextColor='#9ca3af'
                value={manualInput}
                onChangeText={setManualInput}
                multiline
              />
            </View>
            <TouchableOpacity
              style={[styles.secondaryButton, { marginTop: 12 }]}
              onPress={() => onScanned(manualInput)}
              disabled={!manualInput.trim()}
            >
              <Text style={styles.secondaryButtonText}>Submit Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType='slide'
        presentationStyle='fullScreen'
        onRequestClose={handleCloseCamera}
      >
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing='back'
            barcodeScannerSettings={{
              barcodeTypes: ['qr']
            }}
            onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
          />

          {/* Camera overlay */}
          <View style={styles.cameraOverlay}>
            {/* Top bar */}
            <SafeAreaView style={styles.cameraHeader}>
              <TouchableOpacity style={styles.cameraCloseButton} onPress={handleCloseCamera}>
                <X size={24} color='white' />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan QR Code</Text>
              <View style={{ width: 40 }} />
            </SafeAreaView>

            {/* Scan frame */}
            <View style={styles.scanFrameContainer}>
              <View style={styles.scanFrame}>
                <View style={[styles.scanCorner, styles.scanCornerTL]} />
                <View style={[styles.scanCorner, styles.scanCornerTR]} />
                <View style={[styles.scanCorner, styles.scanCornerBL]} />
                <View style={[styles.scanCorner, styles.scanCornerBR]} />
              </View>
            </View>

            {/* Bottom info */}
            <View style={styles.cameraFooter}>
              <Text style={styles.cameraHint}>Position the QR code within the frame</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Loading
// ─────────────────────────────────────────────────────────────────────────────

function StepLoading({ message }: { message: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <ActivityIndicator size='large' color='#4a795f' />
      </View>
      <Text style={styles.stepTitle}>{message}</Text>
      <Text style={styles.stepDescription}>Please wait while we connect to your device...</Text>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Activation Success
// ─────────────────────────────────────────────────────────────────────────────

function StepActivationSuccess({ serialNumber, onContinue }: { serialNumber: string; onContinue: () => void }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, styles.iconSuccess]}>
        <CheckCircle2 size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Device Activated!</Text>
      <Text style={styles.stepDescription}>
        Your device <Text style={styles.highlight}>{serialNumber}</Text> has been successfully linked to your account.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Next: Connect to Device WiFi</Text>
        <Text style={styles.infoText}>
          Power on your IoT kit. It will broadcast a WiFi network for initial configuration.
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>Continue Setup</Text>
        <ArrowRight size={16} color='white' />
      </TouchableOpacity>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Connect to ESP WiFi
// ─────────────────────────────────────────────────────────────────────────────

function StepConnectToEsp({ espWifiName, onConnected }: { espWifiName: string; onConnected: () => void }) {
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

      <Text style={styles.helperText}>After configuring WiFi on the device, tap below to complete setup.</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onConnected}>
        <Text style={styles.primaryButtonText}>I've Configured WiFi</Text>
        <ArrowRight size={16} color='white' />
      </TouchableOpacity>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Enter WiFi Credentials
// ─────────────────────────────────────────────────────────────────────────────

function StepEnterWifi({
  onSubmit,
  isLoading
}: {
  onSubmit: (creds: { ssid: string; password: string }) => void
  isLoading: boolean
}) {
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (ssid.trim()) {
      onSubmit({ ssid: ssid.trim(), password })
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Router size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Enter Home WiFi</Text>
      <Text style={styles.stepDescription}>
        Provide your home WiFi credentials so your OrchidPal device can connect to the internet.
      </Text>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>WiFi Name (SSID)</Text>
        <View style={styles.fieldRow}>
          <Wifi size={18} color='#9ca3af' />
          <TextInput
            style={styles.input}
            placeholder='Your home WiFi name'
            placeholderTextColor='#9ca3af'
            value={ssid}
            onChangeText={setSsid}
            autoCapitalize='none'
          />
        </View>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Password</Text>
        <View style={styles.fieldRow}>
          <WifiOff size={18} color='#9ca3af' />
          <TextInput
            style={styles.input}
            placeholder='WiFi password'
            placeholderTextColor='#9ca3af'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, (!ssid.trim() || isLoading) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!ssid.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color='white' size='small' />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Configure Device</Text>
            <ArrowRight size={16} color='white' />
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Waiting for Device Online
// ─────────────────────────────────────────────────────────────────────────────

function StepWaitingOnline({ serialNumber }: { serialNumber: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Loader2 size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Connecting to Internet</Text>
      <Text style={styles.stepDescription}>
        Waiting for <Text style={styles.highlight}>{serialNumber}</Text> to come online...
      </Text>

      <View style={styles.pulseContainer}>
        <ActivityIndicator size='large' color='#4a795f' />
      </View>

      <Text style={styles.helperText}>This may take up to 60 seconds. The device is connecting to your home WiFi.</Text>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Select Zone
// ─────────────────────────────────────────────────────────────────────────────

function StepSelectZone({
  zones,
  onSelect,
  onCreateNew,
  onSkip,
  isLoading
}: {
  zones: PlantingZone[]
  onSelect: (zone: PlantingZone) => void
  onCreateNew: () => void
  onSkip: () => void
  isLoading: boolean
}) {
  const [selected, setSelected] = useState<PlantingZone | null>(null)

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Flower2 size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Assign to Garden Zone</Text>
      <Text style={styles.stepDescription}>Select an existing zone or create a new one for your device.</Text>

      {zones.length > 0 ? (
        <View style={styles.zoneList}>
          {zones.map((zone) => (
            <TouchableOpacity
              key={zone.id}
              style={[styles.zoneItem, selected?.id === zone.id && styles.zoneItemSelected]}
              onPress={() => setSelected(zone)}
            >
              <View style={styles.zoneRadio}>{selected?.id === zone.id && <View style={styles.zoneRadioInner} />}</View>
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zoneDesc}>{zone.location_city}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyZones}>
          <Text style={styles.emptyZonesText}>No zones created yet</Text>
        </View>
      )}

      {/* Create new zone button */}
      <TouchableOpacity style={styles.secondaryButton} onPress={onCreateNew}>
        <Text style={styles.secondaryButtonText}>+ Create New Zone</Text>
      </TouchableOpacity>

      {zones.length > 0 && (
        <TouchableOpacity
          style={[styles.primaryButton, (!selected || isLoading) && styles.buttonDisabled]}
          onPress={() => selected && onSelect(selected)}
          disabled={!selected || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Assign Device</Text>
              <ArrowRight size={16} color='white' />
            </>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.linkButton} onPress={onSkip}>
        <Text style={styles.linkButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Create Zone
// ─────────────────────────────────────────────────────────────────────────────

const EXPOSURE_OPTIONS = [
  { value: 'FULL_SUN', label: 'Full Sun', description: 'Direct sunlight most of the day' },
  { value: 'PARTIAL_SHADE', label: 'Partial Shade', description: 'Some direct sunlight' },
  { value: 'FULL_SHADE', label: 'Full Shade', description: 'Little to no direct sun' }
] as const

function StepCreateZone({
  onSubmit,
  onBack,
  isLoading
}: {
  onSubmit: (data: {
    name: string
    location_city: string
    exposure?: 'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE'
  }) => void
  onBack: () => void
  isLoading: boolean
}) {
  const [name, setName] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [exposure, setExposure] = useState<'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE'>('PARTIAL_SHADE')
  const [showExposure, setShowExposure] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  const isValid = name.trim().length > 0 && locationCity.trim().length > 0

  // Auto-detect location
  const detectLocation = async () => {
    setIsDetectingLocation(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        // Permission denied - user can still enter manually
        setIsDetectingLocation(false)
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low // Low accuracy is faster and sufficient for city
      })

      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })

      if (address) {
        // Build city string from available address components
        const cityParts = [address.city, address.region].filter(Boolean)
        const city = cityParts.join(', ') || address.country || ''
        if (city) {
          setLocationCity(city)
        }
      }
    } catch (error) {
      // Silently fail - user can enter manually
      console.log('Location detection failed:', error)
    } finally {
      setIsDetectingLocation(false)
    }
  }

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({
        name: name.trim(),
        location_city: locationCity.trim(),
        exposure
      })
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Flower2 size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Create New Zone</Text>
      <Text style={styles.stepDescription}>Set up a new garden zone for your plants.</Text>

      {/* Zone Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.fieldLabel}>Zone Name *</Text>
        <TextInput
          style={styles.textInput}
          placeholder='e.g., Living Room Garden'
          placeholderTextColor='#9ca3af'
          value={name}
          onChangeText={setName}
          autoCapitalize='words'
        />
      </View>

      {/* City/Location */}
      <View style={styles.inputGroup}>
        <Text style={styles.fieldLabel}>City / Location *</Text>
        <View style={styles.locationInputRow}>
          <TextInput
            style={[styles.textInput, styles.locationInput]}
            placeholder='e.g., Ho Chi Minh City'
            placeholderTextColor='#9ca3af'
            value={locationCity}
            onChangeText={setLocationCity}
            autoCapitalize='words'
          />
          <TouchableOpacity style={styles.locationButton} onPress={detectLocation} disabled={isDetectingLocation}>
            {isDetectingLocation ? (
              <ActivityIndicator size='small' color='#4a795f' />
            ) : (
              <MapPin size={20} color='#4a795f' />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.fieldHint}>Used for local weather data and recommendations</Text>
      </View>

      {/* Light Exposure */}
      <TouchableOpacity style={styles.exposureSelector} onPress={() => setShowExposure(!showExposure)}>
        <View>
          <Text style={styles.fieldLabel}>Light Exposure</Text>
          <Text style={styles.exposureValue}>
            {EXPOSURE_OPTIONS.find((e) => e.value === exposure)?.label || 'Select...'}
          </Text>
        </View>
        <ChevronLeft size={20} color='#6b7280' style={{ transform: [{ rotate: showExposure ? '90deg' : '-90deg' }] }} />
      </TouchableOpacity>

      {showExposure && (
        <View style={styles.exposureOptions}>
          {EXPOSURE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.exposureOption, exposure === opt.value && styles.exposureOptionSelected]}
              onPress={() => {
                setExposure(opt.value)
                setShowExposure(false)
              }}
            >
              <Text style={[styles.exposureOptionLabel, exposure === opt.value && styles.exposureOptionLabelSelected]}>
                {opt.label}
              </Text>
              <Text style={styles.exposureOptionDesc}>{opt.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Actions */}
      <TouchableOpacity
        style={[styles.primaryButton, (!isValid || isLoading) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color='white' size='small' />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Create & Assign</Text>
            <ArrowRight size={16} color='white' />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={onBack}>
        <Text style={styles.linkButtonText}>Back to zone selection</Text>
      </TouchableOpacity>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Complete
// ─────────────────────────────────────────────────────────────────────────────

function StepComplete({
  serialNumber,
  zoneName,
  onFinish
}: {
  serialNumber: string
  zoneName?: string
  onFinish: () => void
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, styles.iconSuccess]}>
        <Sparkles size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Setup Complete!</Text>
      <Text style={styles.stepDescription}>Your OrchidPal device is now online and ready to monitor your plants.</Text>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Device</Text>
          <Text style={styles.summaryValue}>{serialNumber}</Text>
        </View>
        {zoneName && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Zone</Text>
            <Text style={styles.summaryValue}>{zoneName}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onFinish}>
        <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
        <ArrowRight size={16} color='white' />
      </TouchableOpacity>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Error
// ─────────────────────────────────────────────────────────────────────────────

function StepError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, styles.iconError]}>
        <AlertCircle size={48} color='#dc2626' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Something went wrong</Text>
      <Text style={styles.stepDescription}>{error}</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onRetry}>
        <Text style={styles.primaryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: {
    flex: 1,
    backgroundColor: '#f5f3f0'
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 32
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#368358'
  },
  brandBlock: {
    marginBottom: 16
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  logoMark: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8c4a7a',
    fontStyle: 'italic'
  },
  brandName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#368358'
  },
  brandTagline: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)'
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 20
  },
  progressItem: {
    alignItems: 'center'
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  progressDotActive: {
    backgroundColor: '#4a795f'
  },
  progressDotCompleted: {
    backgroundColor: '#4a795f'
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  progressLabelActive: {
    color: '#4a795f',
    fontWeight: '600'
  },
  cardWrapper: {
    flex: 1
  },
  card: {
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 22,
    backgroundColor: 'rgba(255,255,255,0.96)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f6f2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20
  },
  iconSuccess: {
    backgroundColor: '#e6f4ea'
  },
  iconError: {
    backgroundColor: '#fef2f2'
  },
  scannedDataBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0'
  },
  scannedDataRow: {
    marginBottom: 12
  },
  scannedDataLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  scannedDataValue: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#15803d',
    backgroundColor: '#dcfce7',
    padding: 10,
    borderRadius: 8,
    overflow: 'hidden'
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  highlight: {
    fontWeight: '600',
    color: '#4a795f'
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#1f2933',
    gap: 8
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600'
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center'
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.75)'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center'
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#368358',
    textDecorationLine: 'underline'
  },
  manualBlock: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)'
  },
  fieldBlock: {
    marginBottom: 14
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: 'rgba(0,0,0,0.55)',
    marginBottom: 6
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(248,248,248,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827'
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  locationInput: {
    flex: 1
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f6f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1e8d9'
  },
  infoBox: {
    backgroundColor: '#f0f6f2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a795f',
    marginBottom: 4
  },
  infoText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 18
  },
  wifiNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf5fb',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
    gap: 10
  },
  wifiName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8c4a7a',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 20
  },
  helperText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    marginBottom: 16
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  zoneList: {
    marginBottom: 20
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(248,248,248,0.6)',
    marginBottom: 10
  },
  zoneItemSelected: {
    borderColor: '#4a795f',
    backgroundColor: '#f0f6f2'
  },
  zoneRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  zoneRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4a795f'
  },
  zoneInfo: {
    flex: 1
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937'
  },
  zoneDesc: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2
  },
  summaryBox: {
    backgroundColor: '#f0f6f2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.55)'
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e'
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22c55e'
  },
  // Camera styles
  permissionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8
  },
  permissionText: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
  camera: {
    flex: 1
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between'
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  cameraCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white'
  },
  scanFrameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative'
  },
  scanCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#4a795f'
  },
  scanCornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12
  },
  scanCornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12
  },
  scanCornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12
  },
  scanCornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12
  },
  cameraFooter: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center'
  },
  cameraHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center'
  },
  // Empty zones placeholder
  emptyZones: {
    paddingVertical: 24,
    alignItems: 'center'
  },
  emptyZonesText: {
    fontSize: 14,
    color: '#6b7280'
  },
  // Input group for forms
  inputGroup: {
    marginBottom: 16
  },
  fieldHint: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4
  },
  // Exposure selector
  exposureSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8
  },
  exposureValue: {
    fontSize: 15,
    color: '#1f2937',
    marginTop: 2
  },
  exposureOptions: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    overflow: 'hidden'
  },
  exposureOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  exposureOptionSelected: {
    backgroundColor: '#ecfdf5'
  },
  exposureOptionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937'
  },
  exposureOptionLabelSelected: {
    color: '#4a795f'
  },
  exposureOptionDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2
  }
})
