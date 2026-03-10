import { CheckCircle2, Flower2, MapPin, QrCode, ShieldCheck, Wifi } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { THEME } from './theme'
import type { ProvisioningStep } from '@/types/device.types'

interface ProgressIndicatorProps {
  step: string
  onStepPress?: (stepKey: ProvisioningStep) => void
}

export function ProgressIndicator({ step, onStepPress }: ProgressIndicatorProps) {
  const steps = [
    { key: 'scan', targetStep: 'SCAN_QR' as ProvisioningStep, label: 'Scan', icon: QrCode, active: ['SCAN_QR', 'ACTIVATING'].includes(step), disabled: true },
    { key: 'activate', targetStep: 'ACTIVATION_SUCCESS' as ProvisioningStep, label: 'Activate', icon: ShieldCheck, active: ['ACTIVATION_SUCCESS'].includes(step), disabled: true },
    { key: 'wifi', targetStep: 'CONNECT_TO_ESP' as ProvisioningStep, label: 'Connect', icon: Wifi, active: ['CONNECT_TO_ESP', 'WAITING_ONLINE'].includes(step), disabled: true },
    { key: 'zone', targetStep: 'SELECT_ZONE' as ProvisioningStep, label: 'Zone', icon: MapPin, active: ['SELECT_ZONE', 'CREATE_ZONE'].includes(step), disabled: ['SCAN_QR', 'ACTIVATING', 'ACTIVATION_SUCCESS', 'CONNECT_TO_ESP', 'WAITING_ONLINE'].includes(step) },
    { key: 'plant', targetStep: 'SELECT_PLANT' as ProvisioningStep, label: 'Plant', icon: Flower2, active: ['SELECT_PLANT'].includes(step), disabled: true }
  ]

  const currentActiveIndex = steps.findIndex((s) => s.active)
  const completedIndex = ['COMPLETE'].includes(step) ? steps.length - 1 : currentActiveIndex !== -1 ? currentActiveIndex : 0
  const progressPercent = Math.min((completedIndex / (steps.length - 1)) * 100, 100)

  return (
    <View style={localStyles.stepperContainer}>
      {/* Progress line background */}
      <View style={localStyles.stepperLineContainer}>
        <View style={localStyles.stepperLineBg} />
        <View style={[localStyles.stepperLineProgress, { width: `${progressPercent}%` }]} />
      </View>

      {/* Steps */}
      <View style={localStyles.stepperRow}>
        {steps.map((s, i) => {
          const isCompleted = i < completedIndex || step === 'COMPLETE'
          const isActive = s.active
          const Icon = s.icon

          return (
            <TouchableOpacity 
              key={s.key} 
              style={[localStyles.stepperItem, s.disabled && !isActive && localStyles.stepperItemDisabled]}
              disabled={s.disabled || isActive}
              onPress={() => onStepPress?.(s.targetStep)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  localStyles.stepperDot,
                  isCompleted && localStyles.stepperDotCompleted,
                  isActive && localStyles.stepperDotActive
                ]}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} color='white' strokeWidth={2.5} />
                ) : (
                  <Icon size={14} color={isActive ? 'white' : THEME.inkLight} strokeWidth={isActive ? 2 : 1.5} />
                )}
              </View>
              <Text
                style={[
                  localStyles.stepperLabel,
                  isActive && localStyles.stepperLabelActive,
                  isCompleted && localStyles.stepperLabelCompleted
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const localStyles = StyleSheet.create({
  stepperContainer: {
    position: 'relative',
    marginBottom: 28,
    paddingHorizontal: 12
  },
  stepperLineContainer: {
    position: 'absolute',
    top: 22,
    left: 52,
    right: 52,
    height: 3
  },
  stepperLineBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(74,121,95,0.12)',
    borderRadius: 2
  },
  stepperLineProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: THEME.forest,
    borderRadius: 2
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  stepperItem: {
    alignItems: 'center',
    width: 56
  },
  stepperDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.paper,
    borderWidth: 2.5,
    borderColor: 'rgba(74,121,95,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  stepperDotActive: {
    backgroundColor: THEME.forest,
    borderColor: THEME.forest,
    shadowColor: THEME.forest,
    shadowOpacity: 0.25,
    shadowRadius: 10
  },
  stepperDotCompleted: {
    backgroundColor: THEME.forest,
    borderColor: THEME.forest
  },
  stepperLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.inkMuted,
    textAlign: 'center',
    letterSpacing: 0.3
  },
  stepperLabelActive: {
    color: THEME.forest,
    fontWeight: '700'
  },
  stepperLabelCompleted: {
    color: THEME.forest,
    fontWeight: '600'
  },
  stepperItemDisabled: {
    opacity: 0.5
  }
})
