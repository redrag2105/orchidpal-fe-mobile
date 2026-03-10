import { AlertCircle } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'

interface StepErrorProps {
  error: string
  onRetry: () => void
}

export function StepError({ error, onRetry }: StepErrorProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, styles.iconError]}>
        <AlertCircle size={48} color='#dc2626' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Something went wrong</Text>
      <Text style={styles.stepDescription}>{error}</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onRetry}>
        <Text style={styles.primaryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  )
}
