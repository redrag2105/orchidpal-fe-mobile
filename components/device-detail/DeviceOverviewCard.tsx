import { FONTS, THEME } from '@/components/devices/theme'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { Clock, Router, Signal } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import { deviceStyles as styles } from './DeviceDetailStyles'

export function DeviceOverviewCard({ device, isOnline }: { device: any; isOnline: boolean }) {
  return (
    <View style={styles.card}>
      <HStack style={{ alignItems: 'center', gap: 16 }}>
        <View style={[styles.iconWrap, !isOnline && styles.iconOffline]}>
          <Router size={32} color={isOnline ? THEME.forest : THEME.inkMuted} />
        </View>
        <VStack style={{ flex: 1, gap: 4 }}>
          <Text style={styles.deviceSerial}>{device.serial_number}</Text>
          <Text style={{ fontSize: 12, color: THEME.inkMuted, fontFamily: FONTS.mono }}>ID: {device.id}</Text>
          <HStack style={{ alignItems: 'center', gap: 6 }}>
            <View style={[styles.statusDot, isOnline ? styles.statusOnline : styles.statusOffline]} />
            <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </HStack>
        </VStack>
      </HStack>

      <View style={styles.divider} />

      <HStack style={styles.statsRow}>
        <VStack style={styles.statBox}>
          <Text style={styles.statLabel}>Signal</Text>
          <HStack style={{ alignItems: 'center', gap: 4 }}>
            <Signal size={16} color={isOnline ? THEME.forest : THEME.inkMuted} />
            <Text style={styles.statValue}>{isOnline ? `${device.signalStrength}%` : '--'}</Text>
          </HStack>
        </VStack>
        <VStack style={styles.statBox}>
          <Text style={styles.statLabel}>Last Seen</Text>
          <HStack style={{ alignItems: 'center', gap: 4 }}>
            <Clock size={16} color={THEME.inkMuted} />
            <Text style={styles.statValue}>{device.last_online_at}</Text>
          </HStack>
        </VStack>
        <VStack style={styles.statBox}>
          <Text style={styles.statLabel}>Firmware</Text>
          <Text style={styles.statValue}>{device.firmware}</Text>
        </VStack>
      </HStack>
    </View>
  )
}
