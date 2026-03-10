/**
 * Device Stats Row Component
 * Overview stats for online/offline/total devices
 */

import { Text } from '@/components/ui/text'
import { Cpu, Wifi, WifiOff } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import { THEME } from './theme'

interface DeviceStatsRowProps {
  onlineCount: number
  offlineCount: number
  totalCount: number
}

export function DeviceStatsRow({ onlineCount, offlineCount, totalCount }: DeviceStatsRowProps) {
  return (
    <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.row}>
      <View style={[styles.card, { backgroundColor: '#e8f5e9' }]}>
        <View style={[styles.icon, { backgroundColor: THEME.forest }]}>
          <Wifi size={18} color='white' strokeWidth={2} />
        </View>
        <Text style={styles.value}>{onlineCount}</Text>
        <Text style={styles.label}>Online</Text>
      </View>

      <View style={[styles.card, { backgroundColor: '#fff3e0' }]}>
        <View style={[styles.icon, { backgroundColor: THEME.gold }]}>
          <WifiOff size={18} color='white' strokeWidth={2} />
        </View>
        <Text style={styles.value}>{offlineCount}</Text>
        <Text style={styles.label}>Offline</Text>
      </View>

      <View style={[styles.card, { backgroundColor: '#f3e5f5' }]}>
        <View style={[styles.icon, { backgroundColor: THEME.orchidMain }]}>
          <Cpu size={18} color='white' strokeWidth={2} />
        </View>
        <Text style={styles.value}>{totalCount}</Text>
        <Text style={styles.label}>Total</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 8
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.ink
  },
  label: {
    fontSize: 12,
    color: THEME.inkMuted,
    fontWeight: '500'
  }
})
