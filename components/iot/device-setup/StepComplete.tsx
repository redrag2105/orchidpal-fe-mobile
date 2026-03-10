import { CheckCircle2, ChevronRight } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'
import { THEME } from './theme'

interface StepCompleteProps {
  serialNumber: string
  zoneName?: string
  plantName?: string
  onFinish: () => void
}

export function StepComplete({ serialNumber, zoneName, plantName, onFinish }: StepCompleteProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, styles.iconSuccess, styles.completeIconContainer]}>
        <CheckCircle2 size={50} color={THEME.forest} strokeWidth={1.8} />
      </View>

      <Text style={styles.stepTitle}>Activation complete</Text>
      <Text style={styles.stepDescription}>
        {plantName
          ? `${plantName} is now connected and ready for smart monitoring.`
          : 'Your OrchidPal device is now online and ready to monitor your plants.'}
      </Text>

      <View style={styles.summaryBox}>
        {plantName && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plant</Text>
            <Text style={styles.summaryValue}>{plantName}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Device</Text>
          <Text style={styles.summaryValue}>{serialNumber}</Text>
        </View>
        {zoneName && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Zone</Text>
            <Text style={styles.summaryValue}>{zoneName}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onFinish}>
        <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
        <ChevronRight size={18} color='white' />
      </TouchableOpacity>
    </View>
  )
}
