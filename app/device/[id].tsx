import { CancelConfirmModal } from '@/components/iot/device-setup'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AlertTriangle, ArrowLeft } from 'lucide-react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AssignDeviceSheet } from '@/components/device-detail/AssignDeviceSheet'
import { DeviceLogs } from '@/components/device-detail/DeviceLogs'
import { DeviceOverviewCard } from '@/components/device-detail/DeviceOverviewCard'
import { NetworkInfoCard } from '@/components/device-detail/NetworkInfoCard'
import { ZoneAssignmentCard } from '@/components/device-detail/ZoneAssignmentCard'
import { THEME } from '@/constants/theme'

import { Text } from '@/components/ui/text'
import { useAssignDeviceToZone } from '@/hooks/mutations/useAssignDeviceToZone'
import { useRemoveDeviceFromZone } from '@/hooks/mutations/useRemoveDeviceFromZone'
import { useDeviceDetail } from '@/hooks/queries/useDeviceDetail'
import { useDeviceLogs } from '@/hooks/queries/useDeviceLogs'
import { useZones } from '@/hooks/queries/useZones'

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
        <Toast
          nativeID={id}
          action='success'
          variant='solid'
          className='elevation-6 mb-20 flex-row items-center gap-2 rounded-full bg-forest px-5 py-3 shadow-[0_6px_12px_rgba(74,121,95,0.3)]'
        >
          <View className='h-2 w-2 rounded-full bg-gold' />
          <ToastTitle className='font-sans text-[15px] font-semibold text-white'>{message}</ToastTitle>
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
      <SafeAreaView className='flex-1 items-center justify-center bg-paper' edges={['top']}>
        <ActivityIndicator size='large' color={THEME.forest} />
        <Text className='mt-4 font-sans text-ink-muted'>Loading device info...</Text>
      </SafeAreaView>
    )
  }

  if (error || !apiDevice) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center bg-paper' edges={['top']}>
        <AlertTriangle size={48} color={THEME.gold} />
        <Text className='mt-4 font-sans text-ink'>Failed to load device data.</Text>
        <TouchableOpacity
          className='mt-4 items-center rounded-2xl border border-paper-deep p-3.5'
          onPress={() => router.back()}
        >
          <Text className='font-sans text-[15px] font-semibold text-ink'>Go Back</Text>
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
    <SafeAreaView className='flex-1 bg-paper' edges={['top']}>
      <View className='flex-row items-center justify-between px-5 py-3'>
        <TouchableOpacity
          className='h-11 w-11 items-center justify-center rounded-full bg-paper-dark'
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={THEME.ink} />
        </TouchableOpacity>
        <Text className='font-serif text-[20px] font-semibold text-ink'>Device Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='gap-4 px-5 pb-[60px] pt-5'
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.forest} />}
      >
        <DeviceOverviewCard device={device} isOnline={isOnline} />

        <ZoneAssignmentCard
          isAssigned={isAssigned}
          device={device}
          handleUnassignDevice={handleUnassignDevice}
          handleOpenAssign={handleOpenAssign}
        />

        <NetworkInfoCard device={device} />

        <Text className='mb-1 mt-2 font-serif text-[18px] font-bold text-ink'>Recent Logs</Text>
        <DeviceLogs logsData={logsData} serialNumber={device.serial_number} id={device.id} />
      </ScrollView>

      <AssignDeviceSheet bottomSheetRef={assignSheetRef} availableZones={availableZones} onAssign={handleConfirmLink} />

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
