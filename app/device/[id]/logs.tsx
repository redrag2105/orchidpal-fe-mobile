import { THEME } from '@/constants/theme'
import { useDeviceLogs } from '@/hooks/queries/useDeviceLogs'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AlertTriangle, ArrowLeft, CheckCircle, Router as RouterIcon } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function DeviceLogsScreen() {
  const router = useRouter()
  const { id, serial_number } = useLocalSearchParams()
  const [page, setPage] = useState(1)

  const { data: logsData, isLoading, isFetching } = useDeviceLogs(serial_number as string, page, 20)

  const renderItem = ({ item: log }: { item: any }) => {
    const actionStr = typeof log.action === 'string' ? log.action.toLowerCase() : ''
    const isAction = !actionStr.includes('error') && !actionStr.includes('fail')
    const isAlert = actionStr.includes('error') || actionStr.includes('fail')

    return (
      <View style={styles.logItemContainer}>
        <View style={styles.logItem}>
          <View
            style={[
              styles.logIcon,
              isAlert && { backgroundColor: 'rgba(235, 172, 86, 0.1)' },
              isAction && { backgroundColor: 'rgba(40, 60, 40, 0.05)' }
            ]}
          >
            {isAction ? (
              <CheckCircle size={16} color={THEME.forest} />
            ) : isAlert ? (
              <AlertTriangle size={16} color={THEME.gold} />
            ) : (
              <RouterIcon size={16} color={THEME.inkLight} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.logEvent}>{log.action}</Text>
            <Text style={styles.logTime}>{new Date(log.created_at).toLocaleString()}</Text>
          </View>
        </View>
      </View>
    )
  }

  const renderFooter = () => {
    if (isLoading || isFetching) {
      return (
        <View style={{ padding: 20 }}>
          <ActivityIndicator size='small' color={THEME.forest} />
        </View>
      )
    }

    if (logsData?.page === logsData?.last_page) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: THEME.inkLight, fontSize: 13 }}>No more logs</Text>
        </View>
      )
    }

    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      {(!logsData?.data || logsData.data.length === 0) && !isLoading && !isFetching && (
        <View style={{ position: 'absolute', top: '50%', width: '100%', alignItems: 'center' }}>
          <Text style={{ color: THEME.inkLight, fontSize: 16 }}>No logs available for this device.</Text>
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={THEME.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Device Logs</Text>
        <View style={{ width: 44, height: 44 }} />
      </View>

      <FlatList
        data={logsData?.data || []}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (logsData && logsData.page < logsData.last_page && !isFetching) {
            setPage((p) => p + 1)
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.paper
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.paper
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.ink
  },
  listContent: {
    padding: 20
  },
  logItemContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)'
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.paperDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logEvent: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME.ink,
    marginBottom: 4,
    lineHeight: 22
  },
  logTime: {
    fontSize: 13,
    color: THEME.inkLight
  }
})
