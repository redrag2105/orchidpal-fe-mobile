/**
 * Scan QR Step Component
 * Botanical luxury styled QR scanning with manual input fallback
 */

import { Text } from '@/components/ui/text'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { AlertCircle, QrCode, Sparkles, X } from 'lucide-react-native'
import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, Linking, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'

// Theme constants
const THEME = {
  paper: '#fdfcf8',
  paperDark: '#f5f4ef',
  ink: '#14281d',
  inkLight: '#3a5a40',
  inkMuted: '#5a7a68',
  forest: '#4a795f',
  orchidMain: '#9f5f80',
  orchidDeep: '#582c4d',
  clay: '#e6b8a2',
  gold: '#d4a574',
  warning: '#d97706',
  warningBg: '#fef3c7'
}

const FONTS = {
  serif: Platform.select({ ios: 'Georgia', default: 'serif' })
}

interface ScanQRStepProps {
  onScanned: (qrContent: string) => void
  onDemoScan: () => void
  isLoading: boolean
}

export function ScanQRStep({ onScanned, onDemoScan, isLoading }: ScanQRStepProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [showCamera, setShowCamera] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [manualInput, setManualInput] = useState('')

  // Prevent duplicate scans
  const hasScannedRef = useRef(false)

  const handleOpenCamera = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission()
      if (!result.granted) {
        Linking.openSettings()
        return
      }
    }
    hasScannedRef.current = false
    setShowCamera(true)
  }, [permission, requestPermission])

  const handleBarcodeScanned = useCallback(
    ({ data }: { data: string }) => {
      // Prevent multiple scans
      if (hasScannedRef.current) return
      hasScannedRef.current = true
      setShowCamera(false)
      onScanned(data)
    },
    [onScanned]
  )

  const handleManualSubmit = useCallback(() => {
    if (manualInput.trim()) {
      onScanned(manualInput.trim())
    }
  }, [manualInput, onScanned])

  return (
    <>
      <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
        {/* Icon */}
        <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.iconContainer}>
          <QrCode size={44} color={THEME.forest} strokeWidth={1.5} />
        </Animated.View>

        {/* Title */}
        <Animated.Text entering={FadeInDown.delay(150).duration(300)} style={styles.title}>
          Scan your device QR
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(200).duration(300)} style={styles.subtitle}>
          Find the QR code on your OrchidPal IoT kit packaging and scan it to begin the setup process.
        </Animated.Text>

        {/* Permission warning */}
        {permission && !permission.granted && (
          <Animated.View entering={FadeIn.delay(250).duration(300)} style={styles.warningBanner}>
            <AlertCircle size={16} color={THEME.warning} />
            <Text style={styles.warningText}>
              {permission.canAskAgain
                ? 'Camera permission is required to scan QR codes'
                : 'Camera permission was denied. Please enable it in Settings.'}
            </Text>
          </Animated.View>
        )}

        {/* Actions */}
        <Animated.View entering={FadeInUp.delay(300).duration(300)} style={styles.actions}>
          <Pressable
            style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
            onPress={handleOpenCamera}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color='white' size='small' />
            ) : (
              <>
                <QrCode size={18} color='white' />
                <Text style={styles.primaryBtnText}>
                  {permission?.granted ? 'Open Camera' : 'Grant Permission & Scan'}
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={[styles.outlineBtn, isLoading && styles.btnDisabled]}
            onPress={onDemoScan}
            disabled={isLoading}
          >
            <Sparkles size={16} color={THEME.orchidMain} />
            <Text style={styles.outlineBtnText}>Use Demo Device (Testing)</Text>
          </Pressable>

          <Pressable style={styles.linkBtn} onPress={() => setShowManual(!showManual)}>
            <Text style={styles.linkBtnText}>{showManual ? 'Hide manual entry' : 'Enter code manually'}</Text>
          </Pressable>
        </Animated.View>

        {/* Manual input */}
        {showManual && (
          <Animated.View entering={FadeInDown.duration(250)} style={styles.manualSection}>
            <Text style={styles.manualLabel}>Device Code</Text>
            <TextInput
              style={styles.manualInput}
              placeholder='{"serial_number":"...", "secret_key":"..."}'
              placeholderTextColor={THEME.inkMuted}
              value={manualInput}
              onChangeText={setManualInput}
              multiline
            />
            <Pressable
              style={[styles.submitBtn, !manualInput.trim() && styles.btnDisabled]}
              onPress={handleManualSubmit}
              disabled={!manualInput.trim()}
            >
              <Text style={styles.submitBtnText}>Submit</Text>
            </Pressable>
          </Animated.View>
        )}
      </Animated.View>

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType='slide' onRequestClose={() => setShowCamera(false)}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFill}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleBarcodeScanned}
          />
          {/* Close button */}
          <Pressable style={styles.cameraCloseBtn} onPress={() => setShowCamera(false)}>
            <X size={22} color='white' />
          </Pressable>
          {/* Overlay hint */}
          <View style={styles.cameraHintWrap}>
            <View style={styles.cameraHint}>
              <Text style={styles.cameraHintText}>Point camera at QR code on device</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.paper,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: THEME.ink,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 4
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(74, 121, 95, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.serif,
    fontWeight: '500',
    color: THEME.ink,
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: THEME.inkMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
    marginBottom: 20
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: THEME.warningBg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: THEME.warning
  },
  actions: {
    width: '100%',
    gap: 12
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: THEME.forest,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: THEME.forest,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: THEME.clay,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: 'transparent'
  },
  outlineBtnText: {
    color: THEME.orchidMain,
    fontSize: 15,
    fontWeight: '500'
  },
  linkBtn: {
    alignSelf: 'center',
    paddingVertical: 8
  },
  linkBtnText: {
    color: THEME.orchidMain,
    fontSize: 14,
    textDecorationLine: 'underline'
  },
  btnDisabled: {
    opacity: 0.5
  },
  manualSection: {
    width: '100%',
    marginTop: 16,
    backgroundColor: THEME.paperDark,
    padding: 16,
    borderRadius: 20,
    gap: 12
  },
  manualLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.ink
  },
  manualInput: {
    minHeight: 80,
    backgroundColor: THEME.paper,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: THEME.ink,
    textAlignVertical: 'top'
  },
  submitBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.clay,
    paddingVertical: 12,
    borderRadius: 20
  },
  submitBtnText: {
    color: THEME.orchidDeep,
    fontSize: 15,
    fontWeight: '600'
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000'
  },
  cameraCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraHintWrap: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  cameraHint: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24
  },
  cameraHintText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
  }
})
