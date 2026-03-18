import { CancelConfirmModal } from '@/components/iot/device-setup'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  Plus,
  Router,
  Signal
} from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Image } from 'react-native'
import { MOCK_ZONES } from '../(dashboard)/garden'

import { FONTS, THEME } from '@/components/devices/theme'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useDeviceDetail } from '@/hooks/queries/useDeviceDetail'
import { ScrollView, StyleSheet, TouchableOpacity, View, RefreshControl } from 'react-native'

const MOCK_LOGS = [
  { id: '1', time: '10:45 AM', event: 'Pump activated automatically (Rule: Low Humidity)', type: 'action' },
  { id: '2', time: '09:00 AM', event: 'Device connected to WiFi', type: 'system' },
  { id: '3', time: 'Yest, 2:30 PM', event: 'Sensor reading anomaly detected', type: 'alert' },
  { id: '4', time: 'Yest, 1:00 PM', event: 'Firmware updated to v1.2.4', type: 'system' }
]

export default function DeviceDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const { data: apiDevice, isLoading, error, refetch } = useDeviceDetail(id as string)

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])
    if (apiDevice) {
      setIsAssigned(!!apiDevice.planting_zones?.name)
    }
  }, [apiDevice])

  const toast = useToast()

  // Available zones: has plant but NO device
  const availableZones = MOCK_ZONES.filter((z) => z.plant_id !== null && z.device_id === null)

  const assignSheetRef = useRef<BottomSheetModal>(null)
  const assignSnapPoints = useMemo(() => ['50%', '67%'], [])
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />,
    []
  )

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    onConfirm: () => {}
  })

  const showConfirm = (title: string, message: string, onConfirm: () => void, confirmText = 'Assign') => {
    setConfirmModal({ visible: true, title, message, onConfirm, confirmText, cancelText: 'Cancel' })
  }

  const showToast = (message: string) => {
    toast.show({
      placement: 'bottom',
      duration: 2000,
      render: ({ id }) => (
        <Toast nativeID={id} action='success' variant='solid' style={styles.toast}>
          <CheckCircle size={20} color='white' />
          <ToastTitle style={styles.toastTitle}>{message}</ToastTitle>
        </Toast>
      )
    })
  }

  const handleOpenAssign = () => assignSheetRef.current?.present()

  const handleConfirmLink = (zone: any) => {
    showConfirm('Confirm Assignment', `Are you sure you want to assign this device to ${zone.name}?`, () => {
      setIsAssigned(true)
      if (device) {
        device.zoneName = zone.name
      }
      assignSheetRef.current?.dismiss()
      showToast('Device has been successfully assigned to the zone.')
    })
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size='large' color={THEME.forest} />
        <Text style={{ marginTop: 16, color: THEME.inkMuted }}>Loading device info...</Text>
      </SafeAreaView>
    )
  }

  if (error || !apiDevice) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <AlertTriangle size={48} color={THEME.gold} />
        <Text style={{ marginTop: 16, color: THEME.ink }}>Failed to load device data.</Text>
        <TouchableOpacity style={[styles.outlineButton, { marginTop: 16 }]} onPress={() => router.back()}>
          <Text style={styles.outlineButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const device = {
    serial_number: apiDevice.hw_address,
    status: apiDevice.status ? apiDevice.status.toUpperCase() : 'OFFLINE',
    last_online_at: apiDevice.last_online_at ? new Date(apiDevice.last_online_at).toLocaleString() : 'Unknown',
    signalStrength: 85,
    zoneName: apiDevice.planting_zones?.name,
    firmware: apiDevice.current_firmware || 'v1.0.0',
    ip: 'Unknown'
  }

  const isOnline = device.status === 'ONLINE'

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={THEME.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Device Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Device Overview Card */}
        <View style={styles.card}>
          <HStack style={{ alignItems: 'center', gap: 16 }}>
            <View style={[styles.iconWrap, !isOnline && styles.iconOffline]}>
              <Router size={32} color={isOnline ? THEME.forest : THEME.inkMuted} />
            </View>
            <VStack style={{ flex: 1, gap: 4 }}>
              <Text style={styles.deviceSerial}>{device.serial_number}</Text>
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

        {/* Zone Assignment Section */}
        <Text style={styles.sectionTitle}>Zone Assignment</Text>
        <View style={styles.card}>
          {isAssigned ? (
            <VStack style={{ gap: 12 }}>
              <Text style={styles.infoLabel}>Currently monitoring:</Text>
              <View style={styles.activeZoneRow}>
                <Activity size={20} color={THEME.forest} />
                <Text style={styles.activeZoneText}>{device.zoneName}</Text>
              </View>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() =>
                  showConfirm(
                    'Unassign Device',
                    'Are you sure you want to unassign this device from its current zone?',
                    () => {
                      setIsAssigned(false)
                      showToast('Device unassigned successfully.')
                    },
                    'Unassign'
                  )
                }
              >
                <Text style={styles.outlineButtonText}>Unassign or Move</Text>
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

        {/* Detailed Info */}
        <Text style={styles.sectionTitle}>Network & Info</Text>
        <View style={styles.card}>
          <VStack style={{ gap: 16 }}>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text style={styles.infoLabel}>IP Address</Text>
              <Text style={styles.infoValue}>{device.ip}</Text>
            </HStack>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text style={styles.infoLabel}>MAC Address</Text>
              <Text style={styles.infoValue}>{device.serial_number}</Text>
            </HStack>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Text style={styles.infoLabel}>Update Method</Text>
              <Text style={styles.infoValue}>OTA Enabled</Text>
            </HStack>
          </VStack>
        </View>

        {/* Device Logs */}
        <Text style={styles.sectionTitle}>Recent Logs</Text>
        <View style={[styles.card, { paddingHorizontal: 0, paddingBottom: 8 }]}>
          {MOCK_LOGS.map((log, index) => (
            <View key={log.id}>
              <HStack style={styles.logItem}>
                <View style={styles.logIcon}>
                  {log.type === 'action' && <CheckCircle size={16} color={THEME.forest} />}
                  {log.type === 'system' && <Router size={16} color={THEME.inkLight} />}
                  {log.type === 'alert' && <AlertTriangle size={16} color={THEME.gold} />}
                </View>
                <VStack style={{ flex: 1 }}>
                  <Text style={styles.logEvent}>{log.event}</Text>
                  <Text style={styles.logTime}>{log.time}</Text>
                </VStack>
              </HStack>
              {index < MOCK_LOGS.length - 1 && <View style={styles.logDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Assignment Bottom Sheet */}
      <BottomSheetModal
        ref={assignSheetRef}
        index={0}
        snapPoints={assignSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Assign Zone</Text>
          <Text style={styles.sheetDesc}>Select an available zone to assign this device to.</Text>
          <VStack style={{ gap: 12, marginTop: 16 }}>
            {availableZones.length > 0 ? (
              availableZones.map((z: any) => (
                <TouchableOpacity key={z.id} style={styles.sheetListItem} onPress={() => handleConfirmLink(z)}>
                  <Image source={{ uri: z.image_url }} style={styles.sheetThumb} />
                  <VStack style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.sheetItemTitle}>{z.name}</Text>
                    <Text style={styles.sheetItemSub}>{z.location_city}</Text>
                  </VStack>
                  <ChevronRight size={20} color={THEME.inkLight} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20, color: THEME.inkLight }}>
                No available zones matching criteria.
              </Text>
            )}
          </VStack>
        </BottomSheetScrollView>
      </BottomSheetModal>

      <CancelConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        cancelText={confirmModal.cancelText}
        confirmText={confirmModal.confirmText}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, visible: false }))}
        onConfirm={() => {
          confirmModal.onConfirm()
          setConfirmModal((prev) => ({ ...prev, visible: false }))
        }}
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
    paddingVertical: 12
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.paperDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: FONTS.serif,
    color: THEME.ink
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
    gap: 16
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconOffline: {
    backgroundColor: THEME.paperDark
  },
  deviceSerial: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: FONTS.sans,
    color: THEME.ink
  },
  statusText: {
    fontSize: 14,
    color: THEME.inkMuted,
    fontWeight: '500'
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  statusOnline: {
    backgroundColor: '#4caf50'
  },
  statusOffline: {
    backgroundColor: '#9e9e9e'
  },
  divider: {
    height: 1,
    backgroundColor: THEME.paperDeep,
    marginVertical: 20
  },
  statsRow: {
    justifyContent: 'space-between'
  },
  statBox: {
    gap: 4
  },
  statLabel: {
    fontSize: 13,
    color: THEME.inkLight,
    fontWeight: '500'
  },
  statValue: {
    fontSize: 15,
    color: THEME.ink,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONTS.serif,
    color: THEME.ink,
    marginTop: 8,
    marginBottom: 4
  },
  activeZoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 121, 95, 0.08)',
    padding: 16,
    borderRadius: 16,
    gap: 12
  },
  activeZoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.forest
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: THEME.paperDeep,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center'
  },
  outlineButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink
  },
  unassignedPrompt: {
    textAlign: 'center',
    color: THEME.inkLight,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20
  },
  primaryButton: {
    backgroundColor: THEME.forest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    gap: 8,
    width: '100%'
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  infoLabel: {
    fontSize: 15,
    color: THEME.inkLight
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink
  },
  logItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'flex-start',
    gap: 16
  },
  logIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.paperDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  logEvent: {
    fontSize: 15,
    color: THEME.ink,
    lineHeight: 22
  },
  logTime: {
    fontSize: 13,
    color: THEME.inkMuted,
    marginTop: 4
  },
  logDivider: {
    height: 1,
    backgroundColor: THEME.paperDeep,
    marginLeft: 68,
    marginRight: 20
  },
  toast: {
    backgroundColor: THEME.forest,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: 340,
    maxWidth: '90%'
  },
  toastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.forest
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    flexWrap: 'wrap'
  },
  sheetBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  },
  sheetIndicator: {
    backgroundColor: THEME.paperDeep,
    width: 48,
    height: 5,
    borderRadius: 3,
    marginTop: 10
  },
  sheetContent: {
    padding: 24,
    paddingBottom: 40
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.ink,
    fontFamily: FONTS.serif,
    marginBottom: 8
  },
  sheetDesc: {
    fontSize: 15,
    lineHeight: 22,
    color: THEME.inkMuted,
    marginBottom: 24
  },
  sheetListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.paperDeep,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1
  },
  sheetThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: THEME.paperDeep
  },
  sheetItemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.ink,
    marginBottom: 4
  },
  sheetItemSub: {
    fontSize: 14,
    color: THEME.inkMuted
  }
})

