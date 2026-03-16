/**
 * Device Setup Screen
 * Multi-step IoT provisioning flow with elegant UI
 */

import {
  CancelConfirmModal,
  ProgressIndicator,
  StepActivationSuccess,
  StepComplete,
  StepConnectToEsp,
  StepCreateZone,
  StepError,
  StepLoading,
  StepScanQR,
  StepSelectPlant,
  StepSelectZone,
  StepWaitingOnline,
  styles,
  THEME
} from '@/components/iot/device-setup'
import { useDeviceProvisioning } from '@/hooks/useDeviceProvisioning'
import { useRouter } from 'expo-router'
import { ChevronLeft, Router } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DeviceSetupScreen() {
  const router = useRouter()
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const provisioning = useDeviceProvisioning(isDemoMode)

  const handleClose = () => {
    if (provisioning.step === 'COMPLETE') {
      router.replace('/(dashboard)')
    } else {
      // Show confirmation before cancelling
      setShowCancelConfirm(true)
    }
  }

  const confirmCancel = () => {
    setShowCancelConfirm(false)
    router.back()
  }

  const handleSwipeBack = () => {
    return true // Prevent default back action entirely
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleSwipeBack)
    return () => backHandler.remove()
  }, [handleSwipeBack])

  // Swipe gesture for back navigation
  const swipeGesture = Gesture.Pan()
    .activeOffsetX(50)
    .onEnd((event) => {
      // Only trigger on swipe from left edge to right
      // Disable swipe to back, only use hardware back button or top left button
      // if (event.translationX > 100 && event.velocityX > 0) {
      //   handleSwipeBack()
      // }
    })
    .runOnJS(true)

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
    <GestureHandlerRootView style={localStyles.flex}>
      <GestureDetector gesture={swipeGesture}>
        <SafeAreaView style={localStyles.root}>
          <KeyboardAvoidingView style={localStyles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={localStyles.stickyHeader}>
              {/* Header */}
              <View style={localStyles.headerRow}>
                {provisioning.canGoBack ? (
                  <TouchableOpacity style={localStyles.backButton} onPress={provisioning.goBack}>
                    <ChevronLeft size={20} color='#1f2937' />
                  </TouchableOpacity>
                ) : (
                  <View style={localStyles.backButton}>
                    <Router size={18} color='#8c4a7a' />
                  </View>
                )}
                <TouchableOpacity onPress={handleClose}>
                  <Text style={localStyles.closeText}>{provisioning.step === 'COMPLETE' ? 'Done' : 'Cancel'}</Text>
                </TouchableOpacity>
              </View>

              {/* Brand */}
              <View style={localStyles.brandBlock}>
                <View style={localStyles.brandRow}>
                  <View style={localStyles.logoCircle}>
                    <Text style={localStyles.logoMark}>*</Text>
                  </View>
                  <View>
                    <Text style={localStyles.brandName}>Device Setup</Text>
                    <Text style={localStyles.brandTagline}>Connect your OrchidPal IoT kit</Text>
                  </View>
                </View>
              </View>

              {/* Progress */}
              <ProgressIndicator step={provisioning.step} onStepPress={provisioning.goToStep} />
            </View>

            <ScrollView contentContainerStyle={localStyles.scrollContent} showsVerticalScrollIndicator={false}>
              {/* Step Content */}
              <View style={localStyles.cardWrapper}>
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
                    serialNumber={provisioning.qrData?.serial_number || ''}
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

                {provisioning.step === 'SELECT_PLANT' && (
                  <StepSelectPlant
                    species={provisioning.species}
                    onSelect={provisioning.selectPlant}
                    onSkip={provisioning.skipPlantSelection}
                    isLoading={provisioning.isLoading}
                  />
                )}

                {provisioning.step === 'COMPLETE' && (
                  <StepComplete
                    serialNumber={provisioning.qrData?.serial_number || ''}
                    zoneName={provisioning.selectedZone?.name}
                    plantName={provisioning.plantNickname || provisioning.selectedSpecies?.common_name}
                    onFinish={handleClose}
                  />
                )}

                {provisioning.step === 'ERROR' && (
                  <StepError error={provisioning.error || 'An error occurred'} onRetry={provisioning.retry} />
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Cancel Confirmation Modal */}
          <CancelConfirmModal
            visible={showCancelConfirm}
            onCancel={() => setShowCancelConfirm(false)}
            onConfirm={confirmCancel}
          />
        </SafeAreaView>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Local Styles (screen-specific only)
// ─────────────────────────────────────────────────────────────────────────────

const localStyles = StyleSheet.create({
  flex: { flex: 1 },
  root: {
    flex: 1,
    backgroundColor: THEME.paper
  },
  stickyHeader: {
    paddingHorizontal: 24,
    paddingTop: 18,
    backgroundColor: THEME.paper,
    zIndex: 10
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.forest
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
    fontWeight: '700',
    color: THEME.ink
  },
  brandTagline: {
    fontSize: 12,
    color: THEME.inkLight
  },
  cardWrapper: {
    flex: 1
  }
})
