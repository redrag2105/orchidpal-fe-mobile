import { useRouter, useNavigation, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { Cpu, Leaf, Plus, Inbox, Check, Flower2 } from 'lucide-react-native'
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn, FadeInRight, FadeInUp } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Text } from '@/components/ui/text'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { THEME, FONTS } from '@/components/dashboard/theme'
import { SearchBar } from '@/components/ui/SearchBar'
import { NotificationBell, FABMenu } from '@/components/dashboard'

export const MOCK_ZONES = [
  { id: 'z1', name: 'Balcony South', location_city: 'Hanoi', image_url: 'https://images.unsplash.com/photo-1588626572714-bd108c9dd20b?auto=format&fit=crop&q=80&w=600', plant_id: 'p1' as string | null, device_id: 'd1' as string | null, has_plant: true, has_device: true, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: 26.5 as number | null, humidity: 65 as number | null, automation_rules: ['r1', 'r2'] },
  { id: 'z2', name: 'Living Room', location_city: 'Hanoi', image_url: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=600', plant_id: null as string | null, device_id: null as string | null, has_plant: false, has_device: false, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: null as number | null, humidity: null as number | null, automation_rules: [] as string[] },
  { id: 'z3', name: 'Front Porch', location_city: 'Hanoi', image_url: 'https://images.unsplash.com/photo-1416879572624-9b2ee37f1911?auto=format&fit=crop&q=80&w=600', plant_id: 'p2' as string | null, device_id: 'd2' as string | null, has_plant: true, has_device: true, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: 28 as number | null, humidity: 70 as number | null, automation_rules: ['r3'] },
  { id: 'z4', name: 'Office Window', location_city: 'Da Nang', image_url: 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3?auto=format&fit=crop&q=80&w=600', plant_id: 'p4' as string | null, device_id: null as string | null, has_plant: true, has_device: false, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: null as number | null, humidity: null as number | null, automation_rules: [] },
  { id: 'z5', name: 'Kitchen Shelf', location_city: 'Ho Chi Minh', image_url: 'https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&q=80&w=600', plant_id: 'p8' as string | null, device_id: 'd4' as string | null, has_plant: true, has_device: true, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: 24 as number | null, humidity: 55 as number | null, automation_rules: [] },
  { id: 'z6', name: 'Bedroom Corner', location_city: 'Hanoi', image_url: 'https://images.unsplash.com/photo-1621460309191-53697ebbb5c2?auto=format&fit=crop&q=80&w=600', plant_id: 'p5' as string | null, device_id: 'd5' as string | null, has_plant: true, has_device: true, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: 22 as number | null, humidity: 60 as number | null, automation_rules: [] },
  { id: 'z7', name: 'Rooftop Garden', location_city: 'Hanoi', image_url: 'https://images.unsplash.com/photo-1416879572624-9b2ee37f1911?auto=format&fit=crop&q=80&w=600', plant_id: 'p6' as string | null, device_id: 'd6' as string | null, has_plant: true, has_device: true, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: 32 as number | null, humidity: 50 as number | null, automation_rules: [] },
  { id: 'z8', name: 'Hallway', location_city: 'Hanoi', image_url: 'https://images.unsplash.com/photo-1588626572714-bd108c9dd20b?auto=format&fit=crop&q=80&w=600', plant_id: null as string | null, device_id: null as string | null, has_plant: false, has_device: false, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: null as number | null, humidity: null as number | null, automation_rules: [] },
  { id: 'z9', name: 'Bathroom', location_city: 'Hanoi', image_url: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=600', plant_id: 'p7' as string | null, device_id: null as string | null, has_plant: true, has_device: false, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: null as number | null, humidity: null as number | null, automation_rules: [] },
  { id: 'z10', name: 'Patio', location_city: 'Da Nang', image_url: 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3?auto=format&fit=crop&q=80&w=600', plant_id: 'p9' as string | null, device_id: 'd7' as string | null, has_plant: true, has_device: true, exposure: "PARTIAL_SHADE", created_at: "2026-03-15T15:47:10.560Z", temperature: 29 as number | null, humidity: 75 as number | null, automation_rules: [] },
]

export const MOCK_PLANTS = [
  { id: 'p1', nickname: 'Luna', species_wiki: { common_name: 'Phalaenopsis amabilis', scientific_name: 'Sci Phalaenopsis amabilis', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&q=80&w=300', zone_id: 'z1' as string | null, planted_at: '2025-01-15', health_status: 'GOOD' },
  { id: 'p2', nickname: 'Sunny', species_wiki: { common_name: 'Dendrobium nobile', scientific_name: 'Sci Dendrobium nobile', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3?auto=format&fit=crop&q=80&w=300', zone_id: 'z3' as string | null, planted_at: '2025-02-20', health_status: 'WARNING' },
  { id: 'p3', nickname: 'Ghost', species_wiki: { common_name: 'Vanda coerulea', scientific_name: 'Sci Vanda coerulea', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1621460309191-53697ebbb5c2?auto=format&fit=crop&q=80&w=300', zone_id: null as string | null, planted_at: '2026-03-01', health_status: 'GOOD' },
  { id: 'p4', nickname: 'Spikey', species_wiki: { common_name: 'Phalaenopsis amabilis', scientific_name: 'Sci Phalaenopsis amabilis', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1588626572714-bd108c9dd20b?auto=format&fit=crop&q=80&w=300', zone_id: 'z4' as string | null, planted_at: '2025-05-10', health_status: 'GOOD' },
  { id: 'p5', nickname: 'Pinky', species_wiki: { common_name: 'Dendrobium nobile', scientific_name: 'Sci Dendrobium nobile', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=300', zone_id: 'z6' as string | null, planted_at: '2025-08-12', health_status: 'GOOD' },
  { id: 'p6', nickname: 'Sky', species_wiki: { common_name: 'Vanda coerulea', scientific_name: 'Sci Vanda coerulea', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1416879572624-9b2ee37f1911?auto=format&fit=crop&q=80&w=300', zone_id: 'z7' as string | null, planted_at: '2025-09-01', health_status: 'WARNING' },
  { id: 'p7', nickname: 'Ruby', species_wiki: { common_name: 'Phalaenopsis amabilis', scientific_name: 'Sci Phalaenopsis amabilis', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&q=80&w=300', zone_id: 'z9' as string | null, planted_at: '2025-10-15', health_status: 'GOOD' },
  { id: 'p8', nickname: 'Jade', species_wiki: { common_name: 'Dendrobium nobile', scientific_name: 'Sci Dendrobium nobile', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3?auto=format&fit=crop&q=80&w=300', zone_id: 'z5' as string | null, planted_at: '2025-11-20', health_status: 'GOOD' },
  { id: 'p9', nickname: 'Pearl', species_wiki: { common_name: 'Vanda coerulea', scientific_name: 'Sci Vanda coerulea', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1621460309191-53697ebbb5c2?auto=format&fit=crop&q=80&w=300', zone_id: 'z10' as string | null, planted_at: '2026-01-05', health_status: 'WARNING' },
  { id: 'p10', nickname: 'Onyx', species_wiki: { common_name: 'Phalaenopsis amabilis', scientific_name: 'Sci Phalaenopsis amabilis', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1588626572714-bd108c9dd20b?auto=format&fit=crop&q=80&w=300', zone_id: null as string | null, planted_at: '2026-02-14', health_status: 'GOOD' },
]

export const MOCK_DEVICES = [
  { id: 'd1', serial_number: 'ESP-1001', status: 'ONLINE', hardware_config: {
      relays: { relay_1: 'pump', relay_2: 'fan', relay_3: 'null', relay_4: 'null' },
      sensors: { light: true, humidity: true, temperature: true, soil_moisture: true }
    }, zone_id: 'z1' as string | null },
  { id: 'd2', serial_number: 'ESP-1002', status: 'OFFLINE', hardware_config: {
      relays: { relay_1: 'pump', relay_2: 'fan', relay_3: 'null', relay_4: 'null' },
      sensors: { light: true, humidity: true, temperature: true, soil_moisture: true }
    }, zone_id: 'z3' as string | null },
  { id: 'd3', serial_number: 'ESP-1003', status: 'ONLINE', hardware_config: {
      relays: { relay_1: 'pump', relay_2: 'fan', relay_3: 'null', relay_4: 'null' },
      sensors: { light: true, humidity: true, temperature: true, soil_moisture: true }
    }, zone_id: null as string | null },
]

export const WIKI_DATA = {
  'Phalaenopsis amabilis': { sci_name: 'Phalaenopsis amabilis', min_temp: 18, max_temp: 28, min_hum: 50, max_hum: 70, care: 'Thrives in indirect light. Keep moderately moist but not soggy.' },
  'Dendrobium nobile': { sci_name: 'Dendrobium nobile', min_temp: 15, max_temp: 30, min_hum: 40, max_hum: 60, care: 'Requires distinct dry winter rest period to induce blooming.' },
  'Vanda coerulea': { sci_name: 'Vanda coerulea', min_temp: 20, max_temp: 35, min_hum: 60, max_hum: 80, care: 'Needs bright light and high humidity. Roots must dry quickly.' }
}

export const MOCK_RULES = [
    { id: 'r1', name: 'Auto rule - Phalaenopsis (Spring)', is_active: true, logic_config: [{ if: { op: '<', value: 60, metric: 'humidity' }, then: { action: 'pump', duration_ms: 10000 } }] },
    { id: 'r2', name: 'Heat protection', is_active: true, logic_config: [{ if: { op: '>', value: 35, metric: 'temperature' }, then: { action: 'fan', duration_ms: 20000 } }] },
    { id: 'r3', name: 'Night light', is_active: true, logic_config: [{ if: { op: '<', value: 20, metric: 'light' }, then: { action: 'light', duration_ms: 3600000 } }] }
  ]

const ZONE_FILTERS = ['All', 'Need plants', 'Need device', 'Fully Linked'];

export default function GardenScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const params = useLocalSearchParams<{ tab?: string }>()

  const [activeTab, setActiveTab] = useState<'zones' | 'plants'>('zones')

  useEffect(() => {
    if (params?.tab === 'plants') setActiveTab('plants');
    if (params?.tab === 'zones') setActiveTab('zones');
  }, [params?.tab])

  const [searchQuery, setSearchQuery] = useState('')

  const [zoneFilter, setZoneFilter] = useState<string>('All')
  const [plantStatus, setPlantStatus] = useState<string>('All')
  const [plantSpecies, setPlantSpecies] = useState<string[]>([])

  const [tempPlantStatus, setTempPlantStatus] = useState<string>('All')
  const [tempPlantSpecies, setTempPlantSpecies] = useState<string[]>([])

  const isNavigatingToDetail = useRef(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useFocusEffect(
    useCallback(() => {
      // Whenever we gain focus back, we reset this flag just in case.
      isNavigatingToDetail.current = false
      setRefreshKey(prev => prev + 1)

      return () => {
        // When screen blurs, if we didn't explicitly navigate to detail, reset filters
        if (!isNavigatingToDetail.current) {
          setSearchQuery('')
          setZoneFilter('All')
          setPlantStatus('All')
          setPlantSpecies([])
        }
      }
    }, [])
  )

  useEffect(() => {
    // Add explicitly any type for navigation to suppress TS error about custom event "tabPress"
    const unsubscribe = (navigation as any).addListener('tabPress', (e: any) => {
      // Also clear filters when switching bottom tab explicitly to this screen
      setSearchQuery('')
      setZoneFilter('All')
      setPlantStatus('All')
      setPlantSpecies([])
    })
    return unsubscribe
  }, [navigation])


  const statusSheetRef = useRef<BottomSheetModal>(null);
  const speciesSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);
  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
  ), []);

  const openStatusSheet = () => {
    setTempPlantStatus(plantStatus);
    statusSheetRef.current?.present();
  };

  const openSpeciesSheet = () => {
    setTempPlantSpecies([...plantSpecies]);
    speciesSheetRef.current?.present();
  };

  const availableSpecies = useMemo(() => Array.from(new Set(MOCK_PLANTS.map(p => p.species_wiki.common_name))), [MOCK_PLANTS.length, refreshKey]);

  const filteredZones = MOCK_ZONES.filter(z => {
    const matchesSearch = z.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          z.location_city.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = false;
    if (zoneFilter === 'All') matchesFilter = true;
    else if (zoneFilter === 'Need plants') matchesFilter = !z.plant_id;
    else if (zoneFilter === 'Need device') matchesFilter = !z.device_id;
    else if (zoneFilter === 'Fully Linked') matchesFilter = !!z.plant_id && !!z.device_id;
    
    return matchesSearch && matchesFilter;
  });

  const filteredPlants = MOCK_PLANTS.filter(p => {
    const matchesSearch = p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.species_wiki.common_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (plantStatus === 'Unassigned') matchesStatus = !p.zone_id;
    else if (plantStatus === 'Assigned') matchesStatus = !!p.zone_id;

    let matchesSpecies = true;
    if (plantSpecies.length > 0) {
      matchesSpecies = plantSpecies.includes(p.species_wiki.common_name);
    }

    return matchesSearch && matchesStatus && matchesSpecies;
  });

  const toggleSpecies = (species: string) => {
    setTempPlantSpecies(prev => 
      prev.includes(species) ? prev.filter(s => s !== species) : [...prev, species]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.paper }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.root}>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)}>
          <HStack style={styles.header}>
            <VStack>
              
              <Text style={styles.headerTitle}>
                My <Text style={styles.headerTitleAccent}>Garden</Text>
              </Text>
              <Text style={styles.greeting}>
                {activeTab === 'zones' ? `${MOCK_ZONES.length} zones` : `${MOCK_PLANTS.length} orchids`}
              </Text>
            </VStack>
            <NotificationBell />
          </HStack>
        </Animated.View>

        {/* Tab Switcher */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.tabContainer}>
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'zones' && styles.tabButtonActive]}
              onPress={() => { setActiveTab('zones'); setSearchQuery(''); setZoneFilter('All'); setPlantStatus('All'); setPlantSpecies([]); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabButtonText, activeTab === 'zones' && styles.tabButtonTextActive]}>My Zones</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'plants' && styles.tabButtonActive]}
              onPress={() => { setActiveTab('plants'); setSearchQuery(''); setZoneFilter('All'); setPlantStatus('All'); setPlantSpecies([]); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabButtonText, activeTab === 'plants' && styles.tabButtonTextActive]}>My Plants</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          placeholder={activeTab === 'zones' ? 'Search zones by name or city...' : 'Search plants by nickname or species...'} 
        />

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {activeTab === 'zones' ? (
              ZONE_FILTERS.map((filter) => {
                const isActive = zoneFilter === filter;
                return (
                  <TouchableOpacity 
                    key={filter}
                    style={[styles.filterChip, isActive && styles.filterChipActive]} 
                    onPress={() => setZoneFilter(filter)}
                  >
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.filterChip, plantStatus === 'All' && plantSpecies.length === 0 && styles.filterChipActive]} 
                  onPress={() => { setPlantStatus('All'); setPlantSpecies([]); }}
                >
                  <Text style={[styles.filterChipText, plantStatus === 'All' && plantSpecies.length === 0 && styles.filterChipTextActive]}>
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterChip, plantStatus !== 'All' && styles.filterChipActive]} 
                  onPress={openStatusSheet}
                >
                  <Text style={[styles.filterChipText, plantStatus !== 'All' && styles.filterChipTextActive]}>
                    Status{plantStatus !== 'All' ? `: ${plantStatus}` : ''}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterChip, plantSpecies.length > 0 && styles.filterChipActive]} 
                  onPress={openSpeciesSheet}
                >
                  <Text style={[styles.filterChipText, plantSpecies.length > 0 && styles.filterChipTextActive]}>
                    Species{plantSpecies.length > 0 ? ` (${plantSpecies.length})` : ''}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === 'zones' ? (
            <View style={styles.gridContainer}>
              {filteredZones.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Inbox size={48} color={THEME.inkLight} strokeWidth={1} />
                  <Text style={styles.emptyStateText}>No zones found matching your criteria.</Text>
                </View>
              ) : (
                filteredZones.map((zone, idx) => {
                const hasPlant = !!zone.plant_id;
                const hasDevice = !!zone.device_id;

                return (
                  <Animated.View key={zone.id} entering={FadeInUp.delay(300 + idx * 50).duration(400)} style={styles.gridItem}>
                    <TouchableOpacity 
                      style={styles.zoneCard} 
                      activeOpacity={0.85}
                      onPress={() => {
                        isNavigatingToDetail.current = true;
                        router.push(`/zone/${zone.id}`);
                      }}
                    >
                      <Image source={{ uri: zone.image_url }} style={styles.zoneImage} />
                      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.zoneGradient} />
                      
                      {/* Indicators Top Corner */}
                      <HStack style={styles.indicators}>
                        <View style={[styles.indicatorIcon, hasPlant ? styles.indicatorActive : styles.indicatorDimmed]}>
                          {hasPlant ? <Leaf size={12} color={THEME.forest} /> : <Plus size={12} color="rgba(255,255,255,0.7)" />}
                        </View>
                        <View style={[styles.indicatorIcon, hasDevice ? styles.indicatorActive : styles.indicatorDimmed]}>
                          {hasDevice ? <Cpu size={12} color={THEME.ink} /> : <Plus size={12} color="rgba(255,255,255,0.7)" />}
                        </View>
                      </HStack>

                      {/* Content */}
                      <View style={styles.zoneContent}>
                        <Text style={styles.zoneName} numberOfLines={1}>{zone.name}</Text>
                        <Text style={styles.zoneCity}>{zone.location_city}</Text>
                        
                        {/* Quick Data */}
                        {hasDevice && zone.temperature != null && zone.humidity != null && (
                          <HStack style={styles.quickData}>
                            <Text style={styles.quickDataText}>{zone.temperature}°C</Text>
                            <Text style={styles.quickDataText}> • </Text>
                            <Text style={styles.quickDataText}>{zone.humidity}%</Text>
                          </HStack>
                        )}
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                )
              })
              )}
            </View>
          ) : (
            <View style={styles.listContainer}>
              {filteredPlants.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Inbox size={48} color={THEME.inkLight} strokeWidth={1} />
                  <Text style={styles.emptyStateText}>No plants found matching your criteria.</Text>
                </View>
              ) : (
                filteredPlants.map((plant, idx) => {
                const zone = MOCK_ZONES.find(z => z.id === plant.zone_id);
                const isAssigned = !!plant.zone_id;

                return (
                  <Animated.View key={plant.id} entering={FadeInUp.delay(300 + idx * 50).duration(400)}>
                    <TouchableOpacity 
                      style={styles.plantCard} 
                      activeOpacity={0.85}
                      onPress={() => {
                        isNavigatingToDetail.current = true;
                        router.push(`/plant/${plant.id}`);
                      }}
                    >
                      <Image source={{ uri: plant.image_url }} style={styles.plantThumb} />
                      <View style={styles.plantInfo}>
                        <Text style={styles.plantNickname}>{plant.nickname}</Text>
                        <Text style={styles.plantSpecies}>{plant.species_wiki.common_name}</Text>
                        <View style={[styles.statusTag, isAssigned ? styles.statusAssigned : styles.statusUnassigned]}>
                          <Text style={[styles.statusTagText, isAssigned ? styles.statusAssignedText : styles.statusUnassignedText]}>
                            {isAssigned ? `Assigned to ${zone?.name}` : 'Unassigned'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                )
              })
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      </View>
      </TouchableWithoutFeedback>

      {/* Status Bottom Sheet */}
      <BottomSheetModal
        ref={statusSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Filter by Status</Text>
          <View style={{ marginTop: 16, gap: 12 }}>
            {['All', 'Unassigned', 'Assigned'].map(status => {
              const isSelected = tempPlantStatus === status;
              return (
                <TouchableOpacity 
                  key={status} 
                  style={[styles.sheetListItem, isSelected && styles.sheetListItemActive]}
                  onPress={() => setTempPlantStatus(status)}
                >
                  <Text style={[styles.sheetItemTitle, isSelected && { color: THEME.forest }]}>{status}</Text>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
          <HStack style={styles.sheetActions}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => statusSheetRef.current?.dismiss()}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.btnApply, tempPlantStatus === plantStatus && styles.btnApplyDisabled]} 
              disabled={tempPlantStatus === plantStatus}
              onPress={() => { setPlantStatus(tempPlantStatus); statusSheetRef.current?.dismiss(); }}
            >
              <Text style={styles.btnApplyText}>Apply</Text>
            </TouchableOpacity>
          </HStack>
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* Species Bottom Sheet */}
      <BottomSheetModal
        ref={speciesSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.sheetTitle}>Filter by Species</Text>
            <TouchableOpacity disabled={tempPlantSpecies.length === 0} onPress={() => setTempPlantSpecies([])}>
              <Text style={[styles.clearBtnText, tempPlantSpecies.length === 0 && styles.clearBtnTextDisabled]}>Clear</Text>
            </TouchableOpacity>
          </HStack>
          <View style={{ marginTop: 16, gap: 12 }}>
            {availableSpecies.map(species => {
              const isSelected = tempPlantSpecies.includes(species);
              return (
                <TouchableOpacity 
                  key={species} 
                  style={[styles.sheetListItem, isSelected && styles.sheetListItemActive]}
                  onPress={() => toggleSpecies(species)}
                >
                  <Text style={[styles.sheetItemTitle, isSelected && { color: THEME.forest }]}>{species}</Text>
                  <View style={[styles.checkboxOuter, isSelected && styles.checkboxOuterSelected]}>
                    {isSelected && <Check size={14} color="white" />}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
          <HStack style={styles.sheetActions}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => speciesSheetRef.current?.dismiss()}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.btnApply, 
                JSON.stringify([...tempPlantSpecies].sort()) === JSON.stringify([...plantSpecies].sort()) && styles.btnApplyDisabled
              ]} 
              disabled={JSON.stringify([...tempPlantSpecies].sort()) === JSON.stringify([...plantSpecies].sort())}
              onPress={() => { setPlantSpecies(tempPlantSpecies); speciesSheetRef.current?.dismiss(); }}
            >
              <Text style={styles.btnApplyText}>Apply</Text>
            </TouchableOpacity>
          </HStack>
        </BottomSheetScrollView>
      </BottomSheetModal>
      
      <FABMenu actions={[
        { key: 'zone', label: 'Add Zone', icon: Leaf, color: THEME.gold, route: '/(modals)/device-setup' },
        { key: 'plant', label: 'Add Plant', icon: Flower2, color: THEME.orchidMain, route: '/(modals)/add-plant' }
      ]} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.paper },
  header: { paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 13, color: THEME.inkMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
  headerTitle: { fontSize: 28, fontWeight: '600', fontFamily: FONTS.serif, color: THEME.ink, marginTop: 4 },
  headerTitleAccent: { fontStyle: 'italic', color: THEME.orchidMain },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  tabContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tabSwitcher: { flexDirection: 'row', backgroundColor: THEME.paperDark, borderRadius: 999, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 999 },
  tabButtonActive: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  tabButtonText: { fontSize: 14, fontWeight: '600', color: THEME.inkMuted },
  tabButtonTextActive: { color: THEME.ink },
  filterContainer: { paddingHorizontal: 20, marginBottom: 16, flexDirection: 'row', gap: 10 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: THEME.paper, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  filterChipActive: { backgroundColor: THEME.forest, borderColor: THEME.forest },
  filterChipText: { fontSize: 13, color: THEME.inkMuted, fontWeight: '600' },
  filterChipTextActive: { color: 'white' },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  gridItem: { width: '47%' },
  zoneCard: { width: '100%', aspectRatio: 0.75, borderRadius: 24, overflow: 'hidden', backgroundColor: THEME.paperDark },
  zoneImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  zoneGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%' },
  indicators: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', gap: 6 },
  indicatorIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  indicatorActive: { backgroundColor: 'rgba(255, 255, 255, 0.95)', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  indicatorDimmed: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  zoneContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, gap: 4 },
  zoneName: { fontSize: 17, fontWeight: '600', fontFamily: FONTS.serif, color: 'white' },
  zoneCity: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  quickData: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  quickDataText: { fontSize: 12, color: 'rgba(255,255,255,0.95)', fontWeight: '600' },
  listContainer: { gap: 16 },
  plantCard: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 24, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2, alignItems: 'center' },
  plantThumb: { width: 84, height: 84, borderRadius: 20, backgroundColor: THEME.paperDeep },
  plantInfo: { flex: 1, marginLeft: 16, justifyContent: 'center', gap: 4 },
  plantNickname: { fontSize: 18, fontWeight: '600', fontFamily: FONTS.serif, color: THEME.ink },
  plantSpecies: { fontSize: 13, color: THEME.inkMuted, fontStyle: 'italic' },
  statusTag: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginTop: 4 },
  statusAssigned: { backgroundColor: 'rgba(74, 121, 95, 0.1)' },
  statusUnassigned: { backgroundColor: 'rgba(159, 95, 128, 0.1)' },
  statusTagText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  statusAssignedText: { color: THEME.forest },
  statusUnassignedText: { color: THEME.orchidMain },
  emptyStateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 16 },
  emptyStateText: { fontSize: 15, color: THEME.inkMuted, textAlign: 'center' },
  sheetBg: { backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetIndicator: { width: 48, height: 5, backgroundColor: THEME.paperDeep, borderRadius: 3, marginTop: 10 },
  sheetContent: { padding: 24, paddingBottom: 40 },
  sheetTitle: { fontSize: 20, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  sheetListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: THEME.paper, borderRadius: 16 },
  sheetListItemActive: { backgroundColor: 'rgba(74, 121, 95, 0.1)' },
  sheetItemTitle: { fontSize: 16, fontWeight: '600', color: THEME.ink },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: THEME.inkMuted, alignItems: 'center', justifyContent: 'center' },
  radioOuterSelected: { borderColor: THEME.forest },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: THEME.forest },
  checkboxOuter: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: THEME.inkMuted, alignItems: 'center', justifyContent: 'center' },
  checkboxOuterSelected: { borderColor: THEME.forest, backgroundColor: THEME.forest },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: THEME.paperDeep },
  btnCancel: { flex: 1, paddingVertical: 14, borderRadius: 999, borderWidth: 1, borderColor: THEME.inkMuted, alignItems: 'center' },
  btnCancelText: { fontSize: 16, fontWeight: '600', color: THEME.ink },
  btnApply: { flex: 1, paddingVertical: 14, borderRadius: 999, backgroundColor: THEME.forest, alignItems: 'center' },
  btnApplyDisabled: { opacity: 0.5 },
  btnApplyText: { fontSize: 16, fontWeight: '600', color: 'white' },
  clearBtnText: { fontSize: 14, fontWeight: '600', color: THEME.orchidMain },
  clearBtnTextDisabled: { color: THEME.inkMuted },
})
