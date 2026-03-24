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
import { useZones } from '@/hooks/queries/useZones'
import { useAssignDeviceToZone } from '@/hooks/mutations/useAssignDeviceToZone'

import { FONTS, THEME } from '@/components/devices/theme'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useRemoveDeviceFromZone } from '@/hooks/mutations/useRemoveDeviceFromZone'
import { useDeviceDetail } from '@/hooks/queries/useDeviceDetail'
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



import { useDeviceLogs } from '@/hooks/queries/useDeviceLogs'
export default function DeviceDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const { data: apiDevice, isLoading, error, refetch } = useDeviceDetail(id as string)

  const { data: logsData } = useDeviceLogs(apiDevice?.serial_number as string, 1, 4)
  const { mutateAsync: removeDeviceFromZone } = useRemoveDeviceFromZone()
  const { mutateAsync: assignDeviceMutate } = useAssignDeviceToZone()

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  const [isAssigned, setIsAssigned] = useState(false)
  useEffect(() => {
    if (apiDevice) {
      setIsAssigned(!!apiDevice.planting_zones?.name)
    }
  }, [apiDevice])

  const toast = useToast()

  // Available zones: has plant but NO device
  const { data: zones } = useZones()
  const availableZones = (zones || []).filter((z: any) => !z.has_device)

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
      duration: 1500,
      render: ({ id }) => (
        <Toast nativeID={id} action='success' variant='solid' style={styles.toast}>
          <View style={styles.toastDot} />
          <ToastTitle style={styles.toastTitle}>{message}</ToastTitle>
        </Toast>
      )
    })
  }

  const handleOpenAssign = () => assignSheetRef.current?.present()

  const handleConfirmLink = (zone: any) => {
    showConfirm(
      'Confirm Assignment',
      `Are you sure you want to assign this device to ${zone.name}?`,
      () => {
        assignDeviceMutate({ serialNumber: apiDevice?.serial_number as string, payload: { zone_id: zone.id } })
          .then(() => {
            setIsAssigned(true)
            if (device) {
              device.zoneName = zone.name
            }
            assignSheetRef.current?.dismiss()
            showToast('Device has been successfully assigned to the zone.')
          })
          .catch(() => showToast('Failed to assign device.'))
      },
      'Assign'
    )
  }

  const handleUnassignDevice = () => {
    showConfirm(
      'Unassign Device',
      'Are you sure you want to remove this device from the zone?',
      () => {
        removeDeviceFromZone(device?.id as string)
          .then(() => {
            setIsAssigned(false)
            if (device) {
              device.zoneName = undefined
            }
            showToast('Device has been successfully unassigned.')
          })
          .catch(() => showToast('Failed to unassign device.'))
      },
      'Unassign'
    )
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
    id: apiDevice.id,
    serial_number: apiDevice.serial_number,
    hw_address: apiDevice.hw_address,
    status: apiDevice.status ? apiDevice.status.toUpperCase() : 'OFFLINE',
    last_online_at: apiDevice.last_online_at ? new Date(apiDevice.last_online_at).toLocaleString() : 'Unknown',
    signalStrength: 85,
    zoneId: apiDevice.planting_zones?.id,
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.forest} />}
      >
        {/* Device Overview Card */}
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

        {/* Zone Assignment Section */}
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
              <Text style={styles.infoValue}>{device.hw_address}</Text>
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
          {(!logsData?.data || logsData.data.length === 0) ? (
            <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: THEME.inkLight, fontSize: 14, marginTop: 8 }}>No recent logs for this device</Text>
            </View>
          ) : (
          (logsData?.data || []).map((log, index) => {
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
                {index < (logsData?.data?.length || 0) - 1 && <View style={styles.logDivider} />}
              </View>
            )
          })
          )}
            {logsData && logsData.data && logsData.data.length > 0 && logsData.total > 4 && (
              <TouchableOpacity style={styles.viewMoreBtn} onPress={() => router.push({ pathname: `/device/${id}/logs`, params: { serial_number: apiDevice?.serial_number } } as any)}>
                <Text style={styles.viewMoreText}>View Complete Logs</Text>
              </TouchableOpacity>
            )}
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
  viewMoreBtn: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)'
  },
  viewMoreText: {
    fontSize: 14,
    color: THEME.forest,
    fontWeight: '600'
  },
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 6
  },
  toastDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.gold },
  toastTitle: { color: 'white', fontWeight: '600', fontSize: 15 },
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

