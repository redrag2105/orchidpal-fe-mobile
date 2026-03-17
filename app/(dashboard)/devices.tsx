/**
 * Devices Screen
 * IoT device management with botanical luxury design
 */

import { Device, DeviceCard, DeviceStatsRow, FONTS, THEME } from '@/components/devices'
import { NotificationBell } from '@/components/dashboard'
import { SearchBar } from '@/components/ui/SearchBar'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router'
import { RefreshCw, Plus } from 'lucide-react-native'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View, FlatList, Keyboard, TouchableWithoutFeedback, Dimensions } from 'react-native'
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
  },
  {
    id: '4',
    serial_number: 'ESP-ORCHID-004',
    status: 'ONLINE',
    last_online_at: 'Just now',
    signalStrength: 95
  },
  {
    id: '5',
    serial_number: 'ESP-ORCHID-005',
    status: 'ONLINE',
    last_online_at: '10 min ago',
    signalStrength: 60,
    zoneName: 'Office Desk'
  },
  {
    id: '6',
    serial_number: 'ESP-ORCHID-006',
    status: 'OFFLINE',
    last_online_at: '1 day ago',
    signalStrength: 0
  },
  {
    id: '7',
    serial_number: 'ESP-ORCHID-007',
    status: 'ONLINE',
    last_online_at: '1 min ago',
    signalStrength: 88,
    zoneName: 'Patio'
  },
  {
    id: '8',
    serial_number: 'ESP-ORCHID-008',
    status: 'ONLINE',
    last_online_at: '20 min ago',
    signalStrength: 45
  }
]

export default function DevicesScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState('')
  const [deviceFilter, setDeviceFilter] = useState<'All' | 'Assigned' | 'Unassigned'>('All')

  const handleAddDevice = () => {
    router.push('/(modals)/device-setup')
  }

  const onlineCount = DEVICES.filter((d) => d.status === 'ONLINE').length
  const offlineCount = DEVICES.filter((d) => d.status === 'OFFLINE').length

  const filteredDevices = DEVICES.filter(
    (d) => 
      (d.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.zoneName && d.zoneName.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (deviceFilter === 'All' || 
      (deviceFilter === 'Assigned' && d.zoneName) || 
      (deviceFilter === 'Unassigned' && !d.zoneName))
  )

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: Colors.light.background, borderBottomEndRadius: 30, borderBottomStartRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 8, zIndex: 10 }}>
        <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.light.background }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.fixedHeader}>
              <View style={{ paddingHorizontal: 20 }}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Animated.View entering={FadeInDown.duration(400)} style={styles.headerText}> 
                <Text style={styles.headerTitle}>My Devices</Text>
                <Text style={styles.headerSubtitle}>Manage your IoT sensors</Text>
              </Animated.View>
              <NotificationBell />
            </View>

            {/* Stats Overview */}
            <DeviceStatsRow onlineCount={onlineCount} offlineCount={offlineCount} totalCount={DEVICES.length} />                                                      
            
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search devices by serial or zone..."
            />
          </View>

          {/* Filter Chips */}
          <View style={{ paddingHorizontal: 20 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
              {['All', 'Assigned', 'Unassigned'].map((filter) => {
                const isActive = deviceFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                    onPress={() => setDeviceFilter(filter as any)}
                  >
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{filter}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
        </TouchableWithoutFeedback>
        </SafeAreaView>
      </View>

      <FlatList
        data={filteredDevices}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={() => (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: THEME.inkMuted, fontSize: 16 }}>No devices found matching your search.</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <DeviceCard 
            device={item} 
            index={index} 
            onPress={() => router.push(`/device/${item.id}`)}
            onAssign={() => router.push(`/device/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddDevice}
        activeOpacity={0.9}
      >
        <Plus size={28} color='white' strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.paper
  },
  fixedHeader: { 
    backgroundColor: Colors.light.background, 
    paddingTop: 8, 
    paddingBottom: 8, 
    borderBottomEndRadius: 30, 
    borderBottomStartRadius: 30, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 12, 
    elevation: 8, 
    zIndex: 10 
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  headerText: { 
    flexDirection: 'column', 
    alignItems: 'flex-start' 
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
  },
  searchContainer: {
    paddingHorizontal: 0,
    marginBottom: 0,
    marginTop: 8
  },
  filterContainer: {
    paddingTop: 0,
    gap: 10,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: THEME.paper,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  filterChipActive: {
    backgroundColor: THEME.forest,
    borderColor: THEME.forest,
  },
  filterChipText: {
    fontSize: 13,
    color: THEME.inkMuted,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 130,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.forest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 100
  }
})
