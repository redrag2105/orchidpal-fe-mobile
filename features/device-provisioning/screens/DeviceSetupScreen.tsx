/**
 * Device Setup Screen
 * Premium botanical luxury design for device provisioning flow
 * Theme synced with OrchidPal web
 */

import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useRouter } from 'expo-router'
import { ChevronLeft, Flower2, X } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
// Direct imports to avoid require cycle
import { FONTS, THEME } from '@/constants/theme'
import {
  ActivatingStep,
  ActivationSuccessStep,
  CompleteStep,
  ConnectToEspStep,
  CreateZoneStep,
  ErrorStep,
  ProgressIndicator,
  ScanQRStep,
  SelectZoneStep
} from '../components'
import { useProvisioningStore } from '../store'

export default function DeviceSetupScreen() {
  const router = useRouter()

  // Use Zustand store
  const {
    step,
    qrData,
    selectedZone,
    zones,
    isLoading,
    error,
    isDemoMode,
    // Actions
    activateDevice,
    proceedToEspConnection,
    confirmWifiConfigured,
    assignToZone,
    createAndAssignZone,
    skipZoneAssignment,
    goBack,
    goToCreateZone,
    retry,
    reset,
    // Computed
    canGoBack,
    espWifiName,
    setDemoMode
  } = useProvisioningStore()

  // Reset store when unmounting
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const handleClose = () => {
    if (step === 'COMPLETE') {
      router.replace('/(dashboard)')
    } else {
      router.back()
    }
  }

  const handleDemoScan = () => {
    setDemoMode(true)
    const mockQR = JSON.stringify({
      serial_number: 'ESP-ORCHID-DEMO',
      secret_key: 'demo_secret_key'
    })
    activateDevice(mockQR, true)
  }

  const renderStep = () => {
    switch (step) {
      case 'SCAN_QR':
        return <ScanQRStep onScanned={activateDevice} onDemoScan={handleDemoScan} isLoading={isLoading} />

      case 'ACTIVATING':
        return <ActivatingStep message='Activating device...' />

      case 'ACTIVATION_SUCCESS':
        return <ActivationSuccessStep serialNumber={qrData?.serial_number || ''} onContinue={proceedToEspConnection} />

      case 'CONNECT_TO_ESP':
        return (
          <ConnectToEspStep
            espWifiName={espWifiName() || ''}
            serialNumber={qrData?.serial_number || ''}
            onConnected={confirmWifiConfigured}
          />
        )

      case 'SELECT_ZONE':
        return (
          <SelectZoneStep
            zones={zones}
            onSelect={assignToZone}
            onCreateNew={goToCreateZone}
            onSkip={skipZoneAssignment}
            isLoading={isLoading}
          />
        )

      case 'CREATE_ZONE':
        return <CreateZoneStep onSubmit={createAndAssignZone} onBack={goBack} isLoading={isLoading} />

      case 'COMPLETE':
        return (
          <CompleteStep
            serialNumber={qrData?.serial_number || ''}
            zoneName={selectedZone?.name}
            onFinish={handleClose}
          />
        )

      case 'ERROR':
        return <ErrorStep error={error || 'An error occurred'} onRetry={retry} />

      default:
        return null
    }
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Header */}
          <Animated.View entering={FadeIn.duration(300)}>
            <HStack style={styles.header}>
              {canGoBack() ? (
                <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                  <ChevronLeft size={22} color={THEME.ink} strokeWidth={1.5} />
                </TouchableOpacity>
              ) : (
                <View style={styles.brandIcon}>
                  <Flower2 size={20} color={THEME.orchidMain} strokeWidth={1.5} />
                </View>
              )}

              <VStack style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.headerTitle}>Device Setup</Text>
                <Text style={styles.headerSubtitle}>Connect your OrchidPal kit</Text>
              </VStack>

              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <X size={20} color={THEME.inkMuted} strokeWidth={1.5} />
              </TouchableOpacity>
            </HStack>
          </Animated.View>

          {/* Progress Indicator */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <ProgressIndicator currentStep={step} />
          </Animated.View>

          {/* Content */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
          >
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>{renderStep()}</Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.paper
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(159,95,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: FONTS.serif,
    color: THEME.ink
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.inkMuted,
    marginTop: 2
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.paperDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 8
  }
})
