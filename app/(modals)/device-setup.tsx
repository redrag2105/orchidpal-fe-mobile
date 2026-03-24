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
  THEME,
  FONTS
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

  return (
    <GestureHandlerRootView style={localStyles.flex}>
      <GestureDetector gesture={swipeGesture}>
        <SafeAreaView style={localStyles.root}>
          <KeyboardAvoidingView style={localStyles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={localStyles.stickyHeader}>
              {/* Header */}
              <View style={localStyles.headerRow}>
                {provisioning.canGoBack ? (
                  <TouchableOpacity style={localStyles.iconButton} onPress={provisioning.goBack}>
                    <ChevronLeft size={22} color={THEME.ink} />
                  </TouchableOpacity>
                ) : (
                  <View style={localStyles.iconButtonPlaceholder} />
                )}
                <View style={localStyles.headerTitleContainer}>
                  <Text style={localStyles.headerTitle}>
                    Add <Text style={localStyles.headerTitleAccent}>Device</Text>
                  </Text>
                  <Text style={localStyles.headerSubtitle}>OrchidPal IoT Kit</Text>
                </View>
                <TouchableOpacity style={localStyles.rightActionButton} onPress={handleClose}>
                  <Text style={localStyles.closeText}>{provisioning.step === 'COMPLETE' ? 'Done' : 'Cancel'}</Text>
                </TouchableOpacity>
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
    marginBottom: 16,
    height: 56,
    position: 'relative'
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.03)',
    zIndex: 10
  },
  rightActionButton: {
    paddingHorizontal: 16,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.03)',
    zIndex: 10,
    minWidth: 44
  },
  iconButtonPlaceholder: {
    width: 44,
    height: 44
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.ink,
    letterSpacing: -0.5
  },
  headerTitleAccent: {
    color: THEME.forest,
    fontFamily: FONTS.serif,
    fontStyle: 'italic'
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.inkMuted,
    marginTop: -2,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  closeText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.inkLight
  },
  cardWrapper: {
    flex: 1
  }
})
