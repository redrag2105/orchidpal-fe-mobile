import { ChevronRight, Router, Wifi, WifiOff } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'

interface StepEnterWifiProps {
  onSubmit: (creds: { ssid: string; password: string }) => void
  isLoading: boolean
}

export function StepEnterWifi({ onSubmit, isLoading }: StepEnterWifiProps) {
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (ssid.trim()) {
      onSubmit({ ssid: ssid.trim(), password })
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Router size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Enter Home WiFi</Text>
      <Text style={styles.stepDescription}>
        Provide your home WiFi credentials so your OrchidPal device can connect to the internet.
      </Text>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>WiFi Name (SSID)</Text>
        <View style={styles.fieldRow}>
          <Wifi size={18} color='#9ca3af' />
          <TextInput
            style={styles.input}
            placeholder='Your home WiFi name'
            placeholderTextColor='#9ca3af'
            value={ssid}
            onChangeText={setSsid}
            autoCapitalize='none'
          />
        </View>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Password</Text>
        <View style={styles.fieldRow}>
          <WifiOff size={18} color='#9ca3af' />
          <TextInput
            style={styles.input}
            placeholder='WiFi password'
            placeholderTextColor='#9ca3af'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, (!ssid.trim() || isLoading) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!ssid.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color='white' size='small' />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Configure Device</Text>
            <ChevronRight size={18} color='white' />
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}
