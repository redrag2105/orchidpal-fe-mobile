import { THEME } from '@/components/devices/theme'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useRouter } from 'expo-router'
import { AlertTriangle, CheckCircle, Router } from 'lucide-react-native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { deviceStyles as styles } from './DeviceDetailStyles'

export function DeviceLogs({ logsData, serialNumber, id }: { logsData: any; serialNumber: string; id: string }) {
  const router = useRouter()

  if (!logsData?.data || logsData.data.length === 0) {
    return (
      <View style={[styles.card, { paddingHorizontal: 0, paddingBottom: 8 }]}>
        <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: THEME.inkLight, fontSize: 14, marginTop: 8 }}>No recent logs for this device</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.card, { paddingHorizontal: 0, paddingBottom: 8 }]}>
      {(logsData.data || []).map((log: any, index: number) => {
        const isAction = log.action && !log.action.includes('error') && !log.action.includes('fail')
        const isAlert = log.action && (log.action.includes('error') || log.action.includes('fail'))

        return (
          <View key={log._id}>
            <HStack style={styles.logItem}>
              <View style={styles.logIcon}>
                {isAction && <CheckCircle size={16} color={THEME.forest} />}
                {isAlert && <AlertTriangle size={16} color={THEME.gold} />}
                {!isAction && !isAlert && <Router size={16} color={THEME.inkLight} />}
              </View>
              <VStack style={{ flex: 1 }}>
                <Text style={styles.logEvent}>{log.action}</Text>
                <Text style={styles.logTime}>{new Date(log.created_at).toLocaleString()}</Text>
              </VStack>
            </HStack>
            {index < logsData.data.length - 1 && <View style={styles.logDivider} />}
          </View>
        )
      })}
      {logsData.data.length > 0 && logsData.total > 4 && (
        <TouchableOpacity
          style={styles.viewMoreBtn}
          onPress={() =>
            router.push({ pathname: `/device/${id}/logs`, params: { serial_number: serialNumber } } as any)
          }
        >
          <Text style={styles.viewMoreText}>View Complete Logs</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
