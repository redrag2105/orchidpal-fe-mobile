import type { ProvisioningStep } from '@/types/device.types'
import { CheckCircle2, Flower2, MapPin, QrCode, ShieldCheck, Wifi } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { THEME } from './theme'

interface ProgressIndicatorProps {
  step: string
  onStepPress?: (stepKey: ProvisioningStep) => void
}

export function ProgressIndicator({ step, onStepPress }: ProgressIndicatorProps) {
  const steps = [
    {
      key: 'scan',
      targetStep: 'SCAN_QR' as ProvisioningStep,
      label: 'Scan',
      icon: QrCode,
      active: ['SCAN_QR', 'ACTIVATING'].includes(step),
      disabled: true
    },
    {
      key: 'activate',
      targetStep: 'ACTIVATION_SUCCESS' as ProvisioningStep,
      label: 'Activate',
      icon: ShieldCheck,
      active: ['ACTIVATION_SUCCESS'].includes(step),
      disabled: true
    },
    {
      key: 'wifi',
      targetStep: 'CONNECT_TO_ESP' as ProvisioningStep,
      label: 'Connect',
      icon: Wifi,
      active: ['CONNECT_TO_ESP', 'WAITING_ONLINE'].includes(step),
      disabled: true
    },
    {
      key: 'zone',
      targetStep: 'SELECT_ZONE' as ProvisioningStep,
      label: 'Zone',
      icon: MapPin,
      active: ['SELECT_ZONE', 'CREATE_ZONE'].includes(step),
      disabled: ['SCAN_QR', 'ACTIVATING', 'ACTIVATION_SUCCESS', 'CONNECT_TO_ESP', 'WAITING_ONLINE'].includes(step)
    },
    {
      key: 'plant',
      targetStep: 'SELECT_PLANT' as ProvisioningStep,
      label: 'Plant',
      icon: Flower2,
      active: ['SELECT_PLANT'].includes(step),
      disabled: true
    }
  ]

  const currentActiveIndex = steps.findIndex((s) => s.active)
  const completedIndex = ['COMPLETE'].includes(step)
    ? steps.length - 1
    : currentActiveIndex !== -1
      ? currentActiveIndex
      : 0

  return (
    <View style={localStyles.stepperContainer}>
      <View style={localStyles.pillContainer}>
        {steps.map((s, i) => {
          const isCompleted = i < completedIndex || step === 'COMPLETE'
          const isActive = s.active
          const Icon = s.icon

          return (
            <TouchableOpacity
              key={s.key}
              style={[
                localStyles.stepperItem,
                isActive && localStyles.activePill,
                s.disabled && !isActive && localStyles.stepperItemDisabled
              ]}
              disabled={s.disabled || isActive}
              onPress={() => onStepPress?.(s.targetStep)}
              activeOpacity={0.7}
            >
              {isCompleted && !isActive ? (
                <CheckCircle2 size={16} color={THEME.forest} strokeWidth={2.5} />
              ) : (
                <Icon
                  size={isActive ? 14 : 16}
                  color={isActive ? THEME.forest : THEME.inkMuted}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              )}
              {isActive && <Text style={localStyles.activePillText}>{s.label}</Text>}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const localStyles = StyleSheet.create({
  stepperContainer: {
    marginBottom: 24,
    marginTop: 8,
    paddingHorizontal: 4
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 100,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)'
  },
  stepperItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 100
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 6
  },
  stepperItemDisabled: {
    opacity: 0.6
  },
  activePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.forest,
    letterSpacing: 0.2
  }
})
