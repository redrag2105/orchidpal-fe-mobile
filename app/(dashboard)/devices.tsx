import { NotificationBell } from '@/components/dashboard'
import { DeviceCard } from '@/components/devices/DeviceCard'
import { SearchBar } from '@/components/ui/SearchBar'
import { THEME } from '@/constants/theme'
import { useDevices } from '@/hooks/queries/useDevices'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTab'
import { useFocusEffect, useRouter } from 'expo-router'
import { Plus } from 'lucide-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DevicesScreen() {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Online' | 'Offline'>('All')
  const [assignmentFilter, setAssignmentFilter] = useState<'All' | 'Linked' | 'Unlinked'>('All')

  const { data: apiResponse, isLoading, error, refetch, isRefetching } = useDevices()
  const apiDevices = apiResponse?.data || []
  const handleScroll = useDynamicBottomTab()

  const [refreshKey, setRefreshKey] = useState(0)

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1)
    }, [])
  )

  const devices = useMemo(() => {
    return apiDevices.map(
      (apiDev: {
        id: any
        serial_number: any
        hw_address: any
        status: string
        last_online_at: string | number | Date
        planting_zones: { id: any; name: any }
        current_firmware: any
      }) => ({
        id: apiDev.id,
        serial_number: apiDev.serial_number,
        hw_address: apiDev.hw_address,
        status: apiDev.status ? apiDev.status.toUpperCase() : 'OFFLINE',
        last_online_at: apiDev.last_online_at ? new Date(apiDev.last_online_at).toLocaleString() : 'Unknown',
        signalStrength: 85,
        zoneId: apiDev.planting_zones?.id,
        zoneName: apiDev.planting_zones?.name,
        firmware: apiDev.current_firmware || 'v1.0.0'
      })
    )
  }, [apiDevices])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  const filteredDevices = useMemo(() => {
    return devices.filter((d: { serial_number: string; zoneName: string; status: string }) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        (d.serial_number && d.serial_number.toLowerCase().includes(q)) ||
        (d.zoneName && d.zoneName.toLowerCase().includes(q))

      let matchesStatus = true
      if (statusFilter === 'Online') matchesStatus = d.status === 'ONLINE'
      if (statusFilter === 'Offline') matchesStatus = d.status === 'OFFLINE'

      let matchesAssignment = true
      if (assignmentFilter === 'Linked') matchesAssignment = !!d.zoneName
      if (assignmentFilter === 'Unlinked') matchesAssignment = !d.zoneName

      return matchesSearch && matchesStatus && matchesAssignment
    })
  }, [devices, searchQuery, statusFilter, assignmentFilter])

  return (
    <View className='flex-1 bg-paper'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <Animated.View entering={FadeIn.duration(400)}>
          <View className='px-5 pb-2 pt-5'>
            <View className='mb-2 flex-row items-center justify-between'>
              <View className='flex-col items-start'>
                <Text className='py-2 font-serif text-[28px] font-semibold leading-9 text-ink'>Smart Devices</Text>
                <Text className='mt-0.5 font-sans text-sm text-ink-muted'>
                  {devices.length} Devices ({devices.filter((d: { status: string }) => d.status === 'ONLINE').length}{' '}
                  Online)
                </Text>
              </View>
              <NotificationBell />
            </View>
          </View>
        </Animated.View>

        <View className='px-5 pb-0 pt-2'>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder='Search by Serial or Zone...' />

          <View className='flex-row gap-2 pb-2 pt-3'>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {['All', 'Online', 'Offline'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  className={`rounded-full border px-3 py-1.5 ${
                    statusFilter === filter ? 'border-forest bg-forest' : 'border-[rgba(0,0,0,0.05)] bg-paper'
                  }`}
                  onPress={() => setStatusFilter(filter as any)}
                >
                  <Text
                    className={`font-sans text-xs font-semibold ${
                      statusFilter === filter ? 'text-white' : 'text-ink-muted'
                    }`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}

              <View className='w-px bg-[rgba(0,0,0,0.1)]' />

              {['All', 'Linked', 'Unlinked'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  className={`rounded-full border px-3 py-1.5 ${
                    assignmentFilter === filter ? 'border-forest bg-forest' : 'border-[rgba(0,0,0,0.05)] bg-paper'
                  }`}
                  onPress={() => setAssignmentFilter(filter as any)}
                >
                  <Text
                    className={`font-sans text-xs font-semibold ${
                      assignmentFilter === filter ? 'text-white' : 'text-ink-muted'
                    }`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing || isRefetching} onRefresh={onRefresh} tintColor={THEME.forest} />
          }
        >
          {isLoading && devices.length === 0 ? (
            <View className='mt-[100px] flex-1 items-center justify-center'>
              <Text className='font-sans text-ink-muted'>Loading devices...</Text>
            </View>
          ) : error ? (
            <View className='mt-[100px] flex-1 items-center justify-center'>
              <Text className='text-error font-sans'>Failed to load devices.</Text>
            </View>
          ) : filteredDevices.length === 0 ? (
            <View className='mt-[100px] flex-1 items-center justify-center'>
              <Text className='font-sans text-ink-muted'>No devices found.</Text>
            </View>
          ) : (
            <View className='gap-3'>
              {filteredDevices.map((device: any, index: number) => (
                <Animated.View key={device.id} entering={FadeInUp.delay(index * 100).duration(400)}>
                  <DeviceCard
                    device={device}
                    index={index}
                    onPress={() => router.push(`/device/${device.id}` as any)}
                  />
                </Animated.View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <TouchableOpacity
        className='elevation-10 absolute bottom-[130px] right-5 z-[100] h-[60px] w-[60px] items-center justify-center rounded-full bg-forest shadow-[0_6px_12px_rgba(74,121,95,0.4)]'
        onPress={() => router.push('/(modals)/device-setup')}
      >
        <Plus color='white' size={28} />
      </TouchableOpacity>
    </View>
  )
}
