import { ChevronRight, CheckCircle2, Info } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'

interface StepActivationSuccessProps {
  serialNumber: string
  onContinue: () => void
}

export function StepActivationSuccess({ serialNumber, onContinue }: StepActivationSuccessProps) {
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
        <Info size={20} color='#4a795f' style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Next: Connect to Device WiFi</Text>
          <Text style={styles.infoText}>
            Power on your IoT kit. It will broadcast a WiFi network for initial configuration.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>Continue Setup</Text>
        <ChevronRight size={18} color='white' />
      </TouchableOpacity>
    </View>
  )
}
