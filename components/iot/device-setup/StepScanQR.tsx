import { CameraView, useCameraPermissions } from 'expo-camera'
import { AlertCircle, Eye, EyeOff, QrCode, X } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Linking, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from './styles'
import { THEME } from './theme'

interface StepScanQRProps {
  onScanned: (data: string) => void
  isLoading: boolean
}

export function StepScanQR({ onScanned, isLoading }: StepScanQRProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [showCamera, setShowCamera] = useState(false)
  const [serialNumberInput, setSerialNumberInput] = useState('')
  const [secretKeyInput, setSecretKeyInput] = useState('')
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const [scannedData, setScannedData] = useState<{ serial_number: string; secret_key: string } | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const isManualValid = serialNumberInput.trim().length > 0 && secretKeyInput.trim().length > 0

  const handleManualSubmit = () => {
    if (isManualValid) {
      const payload = {
        serial_number: serialNumberInput.trim(),
        secret_key: secretKeyInput.trim()
      }
      onScanned(JSON.stringify(payload))
    }
  }

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

        {/* Extra options row */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.secondaryButtonSmall, { flex: 1 }]} 
            onPress={() => setShowManual(!showManual)} 
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonTextSmall} numberOfLines={1}>
              {showManual ? 'Hide Manual' : 'Manual Entry'}
            </Text>
          </TouchableOpacity>
        </View>

        {showManual && (
          <View style={[styles.inputGroup, { marginTop: 16 }]}>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.fieldLabel}>Serial Number</Text>
              <View style={styles.fieldRow}>
                <TextInput
                  style={styles.input}
                  placeholder='ESP-XXXXXX'
                  placeholderTextColor='#9ca3af'
                  value={serialNumberInput}
                  onChangeText={setSerialNumberInput}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={styles.fieldLabel}>Secret Key</Text>
              <View style={styles.fieldRow}>
                <TextInput
                  style={styles.input}
                  placeholder='Enter secret key'
                  placeholderTextColor='#9ca3af'
                  value={secretKeyInput}
                  onChangeText={setSecretKeyInput}
                  secureTextEntry={!showSecretKey}
                />
                <TouchableOpacity 
                  onPress={() => setShowSecretKey(!showSecretKey)}
                  style={{ padding: 8 }}
                >
                  {showSecretKey ? (
                    <EyeOff size={20} color={THEME.inkMuted} />
                  ) : (
                    <Eye size={20} color={THEME.inkMuted} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.secondaryButton, 
                { marginTop: 8 },
                (!isManualValid || isLoading) && styles.buttonDisabled
              ]}
              onPress={handleManualSubmit}
              disabled={!isManualValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={THEME.forest} size='small' />
              ) : (
                <Text style={styles.secondaryButtonText}>Submit Credentials</Text>
              )}
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
              <SafeAreaView edges={['top']} style={styles.cameraHeader}>
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
