import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import React from 'react'
import { View } from 'react-native'
import { deviceStyles as styles } from './DeviceDetailStyles'

export function NetworkInfoCard({ device }: { device: any }) {
  return (
    <>
      <Text style={styles.sectionTitle}>Network & Info</Text>
      <View style={styles.card}>
        <VStack style={{ gap: 16 }}>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text style={styles.infoLabel}>IP Address</Text>
            <Text style={styles.infoValue}>{device.ip}</Text>
          </HStack>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text style={styles.infoLabel}>MAC Address</Text>
            <Text style={styles.infoValue}>{device.hw_address}</Text>
          </HStack>
          <HStack style={{ justifyContent: 'space-between' }}>
            <Text style={styles.infoLabel}>Update Method</Text>
            <Text style={styles.infoValue}>OTA Enabled</Text>
          </HStack>
        </VStack>
      </View>
    </>
  )
}
