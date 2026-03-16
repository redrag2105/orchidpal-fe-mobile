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
        <View style={styles.cardHeader}>
          <View style={[styles.icon, { backgroundColor: THEME.forest }]}>
            <Wifi size={14} color='white' strokeWidth={2} />
          </View>
          <Text style={styles.label}>Online</Text>
        </View>
        <Text style={styles.value}>{onlineCount}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: '#fff3e0' }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.icon, { backgroundColor: THEME.gold }]}>
            <WifiOff size={14} color='white' strokeWidth={2} />
          </View>
          <Text style={styles.label}>Offline</Text>
        </View>
        <Text style={styles.value}>{offlineCount}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: '#f3e5f5' }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.icon, { backgroundColor: THEME.orchidMain }]}>     
            <Cpu size={14} color='white' strokeWidth={2} />
          </View>
          <Text style={styles.label}>Total</Text>
        </View>
        <Text style={styles.value}>{totalCount}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.ink
  },
  label: {
    fontSize: 13,
  }
})
