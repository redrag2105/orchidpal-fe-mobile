/**
 * Progress Indicator Component
 * Botanical luxury styled progress indicator for provisioning flow
 */

import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { CheckCircle2 } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import type { ProvisioningStep } from '../types'

// Theme constants
const THEME = {
  paper: '#fdfcf8',
  paperDark: '#f0efea',
  ink: '#14281d',
  inkMuted: '#5a7a68',
  orchidMain: '#9f5f80',
  forest: '#4a795f'
}

interface ProgressIndicatorProps {
  currentStep: ProvisioningStep
}

const STEPS = [
  { key: 'scan', label: 'Scan', steps: ['SCAN_QR', 'ACTIVATING'] },
  { key: 'activate', label: 'Activate', steps: ['ACTIVATION_SUCCESS'] },
  { key: 'wifi', label: 'WiFi', steps: ['CONNECT_TO_ESP', 'WAITING_ONLINE'] },
  { key: 'zone', label: 'Zone', steps: ['SELECT_ZONE', 'CREATE_ZONE'] }
] as const

function StepDot({ isCompleted, isActive, index }: { isCompleted: boolean; isActive: boolean; index: number }) {
  const bgColor = isCompleted ? THEME.forest : isActive ? THEME.orchidMain : THEME.paperDark
  const borderColor = isCompleted ? THEME.forest : isActive ? THEME.orchidMain : 'rgba(0,0,0,0.08)'

  return (
    <Animated.View
      entering={FadeIn.delay(index * 50).duration(300)}
      style={[
        styles.stepDot,
        {
          backgroundColor: bgColor,
          borderColor: borderColor
        }
      ]}
    >
      {isCompleted ? (
        <CheckCircle2 size={14} color='white' strokeWidth={2.5} />
      ) : (
        <Text style={[styles.stepNumber, { color: isActive ? 'white' : THEME.inkMuted }]}>{index + 1}</Text>
      )}
    </Animated.View>
  )
}

function StepConnector({ isCompleted }: { isCompleted: boolean }) {
  return <View style={[styles.connector, { backgroundColor: isCompleted ? THEME.forest : 'rgba(0,0,0,0.08)' }]} />
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.steps.includes(currentStep as never))
  const isComplete = currentStep === 'COMPLETE'

  return (
    <View style={styles.container}>
      <HStack style={styles.stepsRow}>
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex || isComplete
          const isActive = step.steps.includes(currentStep as never)

          return (
            <React.Fragment key={step.key}>
              <VStack style={styles.stepItem}>
                <StepDot isCompleted={isCompleted} isActive={isActive} index={index} />
                <Text style={[styles.stepLabel, { color: isActive || isCompleted ? THEME.ink : THEME.inkMuted }]}>
                  {step.label}
                </Text>
              </VStack>
              {index < STEPS.length - 1 && <StepConnector isCompleted={index < currentIndex || isComplete} />}
            </React.Fragment>
          )
        })}
      </HStack>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  stepsRow: {
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  stepItem: {
    alignItems: 'center',
    gap: 8
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '600'
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  connector: {
    flex: 1,
    height: 3,
    marginTop: 14,
    marginHorizontal: 4,
    borderRadius: 1.5
  }
})
