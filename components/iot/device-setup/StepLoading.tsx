import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { styles } from './styles'

interface StepLoadingProps {
  message: string
}

export function StepLoading({ message }: StepLoadingProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <ActivityIndicator size='large' color='#4a795f' />
      </View>
      <Text style={styles.stepTitle}>{message}</Text>
      <Text style={styles.stepDescription}>Please wait while we connect to your device...</Text>
    </View>
  )
}
