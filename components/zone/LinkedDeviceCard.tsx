import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ChevronRight, Cpu, Droplets, Power, Sun, Thermometer } from 'lucide-react-native'
import { Text } from '@/components/ui/text'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/components/dashboard/theme'
import { CircularStat } from '@/components/dashboard/CircularStat'
import { MiniLineChart } from './MiniLineChart'
import { RelayToggle } from './RelayToggle'
import { AddDeviceButton } from '@/components/devices/AddDeviceButton'

type LinkedDeviceCardProps = {
  linkedDevice?: any // TODO: strictly type this
  activeSensors: number
  activeRelays: string[]
  relayState: Record<string, boolean>
  hasRelayChanged: boolean
  onToggleRelay: (relay: string) => void
  onSaveRelayState: () => void
  onLinkDevice: () => void
}

const TRENDS = {
  temp: [22, 23, 24, 23.5, 23.8, 24.2, 25],
  humidity: [60, 62, 58, 59, 61, 65, 63],
  light: [30, 40, 50, 70, 80, 90, 85],
  moisture: [45, 43, 40, 38, 35, 45, 50]
}

export function LinkedDeviceCard({
  linkedDevice,
  activeSensors,
  activeRelays,
  relayState,
  hasRelayChanged,
  onToggleRelay,
  onSaveRelayState,
  onLinkDevice
}: LinkedDeviceCardProps) {
  const router = useRouter()

  if (!linkedDevice) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>No device linked to this zone.</Text>
        <AddDeviceButton title="Link Device" onPress={onLinkDevice} />
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(dashboard)/devices')}>
        <HStack style={styles.deviceHeader}>
          <HStack style={{ gap: 16, alignItems: 'center' }}>
            <View style={styles.deviceIcon}>
              <Cpu size={24} color={THEME.forest} />
            </View>
            <VStack>
              <Text style={styles.deviceSerial}>{linkedDevice.serial_number}</Text>
              <Text style={styles.deviceStatus}>
                <Text style={{ color: THEME.inkLight }}>Status: </Text>
                <Text style={{ color: linkedDevice.status === 'ONLINE' ? THEME.forest : THEME.orchidMain }}>
                  {linkedDevice.status.toUpperCase()}
                </Text>
              </Text>
            </VStack>
          </HStack>
          <ChevronRight size={20} color={THEME.inkLight} />
        </HStack>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        <View style={styles.statColumn}>
          <CircularStat value={24} maxValue={40} label="Temp °C" color={THEME.orchidMain} icon={Thermometer} delay={150} />
          <MiniLineChart values={TRENDS.temp} color={THEME.orchidMain} />
        </View>
        <View style={styles.statColumn}>
          <CircularStat value={60} maxValue={100} label="Humidity %" color="#3b82f6" icon={Droplets} delay={200} />
          <MiniLineChart values={TRENDS.humidity} color="#3b82f6" />
        </View>
        <View style={styles.statColumn}>
          <CircularStat value={72} maxValue={100} label="Light %" color={THEME.gold} icon={Sun} delay={250} />
          <MiniLineChart values={TRENDS.light} color={THEME.gold} />
        </View>
        <View style={styles.statColumn}>
          <CircularStat value={45} maxValue={100} label="Moisture %" color={THEME.forest} icon={Droplets} delay={300} />
          <MiniLineChart values={TRENDS.moisture} color={THEME.forest} />
        </View>
      </View>

      <View style={styles.divider} />
      
      <Text style={styles.hardwareInfoText}>
        Hardware: {activeSensors} sensors, {activeRelays.length} relays
      </Text>

      <View style={styles.quickControl}>
        {activeRelays.map((relay: any) => (
          <View key={relay} style={styles.relayRow}>
            <HStack style={{ gap: 12, alignItems: 'center' }}>
              <View style={styles.relayIconContainer}>
                <Power size={20} color={relayState[relay] ? THEME.forest : THEME.inkLight} />
              </View>
              <VStack>
                <Text style={styles.relayTitle}>{relay.charAt(0).toUpperCase() + relay.slice(1)}</Text>
                <Text style={styles.relaySubtitle}>{relayState[relay] ? 'Currently Active' : 'Currently Inactive'}</Text>
              </VStack>
            </HStack>
            <RelayToggle isActive={!!relayState[relay]} onToggle={() => onToggleRelay(relay)} />
          </View>
        ))}
      </View>

      {hasRelayChanged && (
        <View style={{ marginTop: 24 }}>
          <AddDeviceButton title="Save Changes" onPress={onSaveRelayState} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3
  },
  emptyText: {
    fontSize: 15,
    color: THEME.inkLight,
    marginBottom: 20,
    textAlign: 'center'
  },
  deviceHeader: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74, 121, 95, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deviceSerial: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.ink
  },
  deviceStatus: {
    fontSize: 14,
    marginTop: 2
  },
  statsGrid: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 4,
    marginTop: 16
  },
  statColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: THEME.paper,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24
  },
  divider: {
    height: 1,
    backgroundColor: THEME.paper,
    marginVertical: 20
  },
  hardwareInfoText: {
    fontSize: 14,
    color: THEME.inkLight,
    marginBottom: 16
  },
  quickControl: {
    flexDirection: 'column',
    gap: 12
  },
  relayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.paper,
    padding: 16,
    borderRadius: 20,
    width: '100%'
  },
  relayIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  relayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.ink
  },
  relaySubtitle: {
    fontSize: 13,
    color: THEME.inkLight,
    marginTop: 2
  }
})
