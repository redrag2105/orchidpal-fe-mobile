/**
 * Add Device Button Component
 * CTA button for adding a new IoT device
 */

import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronRight, Plus } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import { THEME } from './theme'

interface AddDeviceButtonProps {
  onPress: () => void
}

export function AddDeviceButton({ onPress }: AddDeviceButtonProps) {
  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)}>
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={[THEME.forest, THEME.forestLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.icon}>
            <Plus size={24} color='white' strokeWidth={2} />
          </View>
          <VStack style={{ flex: 1 }}>
            <Text style={styles.title}>Add New Device</Text>
            <Text style={styles.subtitle}>Connect an OrchidPal IoT kit</Text>
          </VStack>
          <ChevronRight size={20} color='white' strokeWidth={1.5} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: THEME.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2
  }
})
