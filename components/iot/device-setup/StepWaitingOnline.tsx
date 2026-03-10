import { Loader2 } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { styles } from './styles'

interface StepWaitingOnlineProps {
  serialNumber: string
}

export function StepWaitingOnline({ serialNumber }: StepWaitingOnlineProps) {
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
