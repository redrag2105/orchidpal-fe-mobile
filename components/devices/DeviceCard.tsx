/**
 * Device Card Component
 * Individual device display card with status and metadata
 */

import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { ChevronRight, Plus, Router, Signal } from 'lucide-react-native'
import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'

import { THEME } from '@/constants/theme'
import type { Device } from './types'

interface DeviceCardProps {
  device: Device
  index: number
  onPress?: () => void
  onAssign?: () => void
}

export function DeviceCard({ device, index, onPress, onAssign }: DeviceCardProps) {
  const isOnline = device.status === 'ONLINE'

  return (
    <Animated.View entering={FadeInRight.delay(300 + index * 100).duration(400)}>
      <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
        <HStack style={styles.content}>
          <View style={[styles.iconWrap, !isOnline && styles.iconOffline]}>
            <Router size={24} color={isOnline ? THEME.forest : THEME.inkMuted} strokeWidth={1.5} />
          </View>

          <VStack style={{ flex: 1, gap: 4 }}>
            <Text style={styles.name}>{device.serial_number}</Text>

            <HStack style={{ gap: 12, marginTop: 4 }}>
              <HStack style={styles.meta}>
                <View style={[styles.statusDot, isOnline ? styles.statusOnline : styles.statusOffline]} />
                <Text style={styles.metaText}>
                  {isOnline ? 'Online' : 'Offline'} · {device.last_online_at}
                </Text>
              </HStack>
              {isOnline && (
                <HStack style={styles.meta}>
                  <Signal size={12} color={THEME.inkMuted} strokeWidth={2} />
                  <Text style={styles.metaText}>{device.signalStrength}%</Text>
                </HStack>
              )}
            </HStack>
          </VStack>

          <ChevronRight size={18} color={THEME.inkMuted} strokeWidth={1.5} />
        </HStack>

        {device.zoneName ? (
          <View style={styles.zoneTag}>
            <Text style={styles.zoneTagText}>{device.zoneName}</Text>
          </View>
        ) : (
          <TouchableOpacity style={[styles.zoneTag, styles.unassignedTag]} onPress={onAssign} activeOpacity={0.7}>
            <Plus size={14} color={THEME.inkLight} />
            <Text style={[styles.zoneTagText, styles.unassignedTagText]}>Assign to Zone</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3
  },
  content: {
    alignItems: 'center',
    gap: 14
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconOffline: {
    backgroundColor: THEME.paperDark
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.ink
  },
  serial: {
    fontSize: 12,
    color: THEME.inkMuted,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' })
  },
  meta: {
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 12,
    color: THEME.inkMuted
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  statusOnline: {
    backgroundColor: '#4caf50'
  },
  statusOffline: {
    backgroundColor: '#9e9e9e'
  },
  zoneTag: {
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(74, 121, 95, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(74, 121, 95, 0.15)',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  zoneTagText: {
    fontSize: 12,
    color: THEME.forest,
    fontWeight: '600'
  },
  unassignedTag: {
    backgroundColor: THEME.paper,
    borderColor: THEME.paperDeep,
    borderStyle: 'dashed'
  },
  unassignedTagText: {
    color: THEME.inkLight
  }
})
