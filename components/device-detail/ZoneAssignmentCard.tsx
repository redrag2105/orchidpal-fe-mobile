import { THEME } from '@/components/devices/theme'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useRouter } from 'expo-router'
import { Activity, ChevronRight, Plus } from 'lucide-react-native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { deviceStyles as styles } from './DeviceDetailStyles'

export function ZoneAssignmentCard({
  isAssigned,
  device,
  handleUnassignDevice,
  handleOpenAssign
}: {
  isAssigned: boolean
  device: any
  handleUnassignDevice: () => void
  handleOpenAssign: () => void
}) {
  const router = useRouter()

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.sectionTitle}>Zone Assignment</Text>
        {isAssigned && (
          <TouchableOpacity onPress={handleUnassignDevice} style={{ marginRight: 20, marginTop: 10 }}>
            <Text style={{ fontSize: 13, color: THEME.orchidMain, fontWeight: '600' }}>Unassign</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.card}>
        {isAssigned ? (
          <VStack style={{ gap: 12 }}>
            <Text style={styles.infoLabel}>Currently monitoring:</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push(('/zone/' + device.zoneId) as any)}>
              <View style={styles.activeZoneRow}>
                <Activity size={20} color={THEME.forest} />
                <Text style={styles.activeZoneText}>{device.zoneName}</Text>
                <ChevronRight size={20} color={THEME.forest} style={{ marginLeft: 'auto' }} />
              </View>
            </TouchableOpacity>
          </VStack>
        ) : (
          <VStack style={{ gap: 16, alignItems: 'center', paddingVertical: 8 }}>
            <Text style={styles.unassignedPrompt}>
              This device is not linked to any zone yet. Link it to start collecting data.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleOpenAssign}>
              <Plus size={20} color='white' />
              <Text style={styles.primaryButtonText}>Assign to a Zone</Text>
            </TouchableOpacity>
          </VStack>
        )}
      </View>
    </>
  )
}
