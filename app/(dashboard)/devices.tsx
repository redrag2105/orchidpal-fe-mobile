/**
 * Devices Screen
 * IoT device management with botanical luxury design
 */

import { AddDeviceButton, Device, DeviceCard, DeviceStatsRow, FONTS, THEME } from '@/components/devices'
import { NotificationBell } from '@/components/dashboard'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useRouter } from 'expo-router'
import { RefreshCw } from 'lucide-react-native'
import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

// Mock device data
const DEVICES: Device[] = [
  {
    id: '1',
    serial_number: 'ESP-ORCHID-001',
    status: 'ONLINE',
    last_online_at: '2 min ago',
    signalStrength: 85,
    zoneName: 'Living Room'
  },
  {
    id: '2',
    serial_number: 'ESP-ORCHID-002',
    status: 'ONLINE',
    last_online_at: '5 min ago',
    signalStrength: 72,
    zoneName: 'Balcony Garden'
  },
  {
    id: '3',
    serial_number: 'ESP-ORCHID-003',
    status: 'OFFLINE',
    last_online_at: '2 hours ago',
    signalStrength: 0,
    zoneName: 'Bedroom'
  }
]

export default function DevicesScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const handleAddDevice = () => {
    router.push('/(modals)/device-setup')
  }

  const onlineCount = DEVICES.filter((d) => d.status === 'ONLINE').length
  const offlineCount = DEVICES.filter((d) => d.status === 'OFFLINE').length

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <VStack>
            <Text style={styles.headerTitle}>My Devices</Text>
            <Text style={styles.headerSubtitle}>Manage your IoT sensors</Text>
          </VStack>
          <NotificationBell />
        </Animated.View>

        {/* Stats Overview */}
        <DeviceStatsRow onlineCount={onlineCount} offlineCount={offlineCount} totalCount={DEVICES.length} />

        {/* Add Device Button */}
        <AddDeviceButton onPress={handleAddDevice} />

        {/* Device List */}
        <VStack style={styles.deviceList}>
          <Text style={styles.sectionTitle}>Your Devices</Text>
          {DEVICES.map((device, index) => (
            <DeviceCard key={device.id} device={device} index={index} />
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.paper
  },
  scrollContent: {
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    fontFamily: FONTS.serif,
    color: THEME.ink
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.inkMuted,
    marginTop: 2
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.paperDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deviceList: {
    gap: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONTS.serif,
    color: THEME.ink,
    marginBottom: 8
  }
})
