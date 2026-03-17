import { useRouter, useNavigation, useFocusEffect } from 'expo-router'
import { Leaf, Flower2 } from 'lucide-react-native'
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { ScrollView, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { Text } from '@/components/ui/text'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/components/dashboard/theme'
import { SearchBar } from '@/components/ui/SearchBar'
import { NotificationBell, FABMenu } from '@/components/dashboard'
import { Zone } from '@/apis/zone.api'
import { useZones } from '@/hooks/queries/useZones'
import { usePlants } from '@/hooks/queries/usePlants'
import { useSpecies } from '@/hooks/queries/useSpecies'

// Import extracted constants & components
import { Plant } from '@/types/garden.types'

import { gardenStyles as styles } from '@/components/dashboard/garden/styles'
import { ZoneCard } from '@/components/dashboard/garden/ZoneCard'
import { PlantCard } from '@/components/dashboard/garden/PlantCard'
import { StatusFilterSheet, SpeciesFilterSheet } from '@/components/dashboard/garden/FilterSheets'
import { TabSwitcher } from '@/components/dashboard/garden/TabSwitcher'
import { EmptyState } from '@/components/dashboard/garden/EmptyState'
import { FilterBar } from '@/components/dashboard/garden/FilterBar'


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

export default function GardenScreen() {
  const router = useRouter()
  const navigation = useNavigation()

  const [activeTab, setActiveTab] = useState<'zones' | 'plants'>('zones')       
  const [searchQuery, setSearchQuery] = useState('')

  const { data: zones = [], isLoading: loadingZones } = useZones();
  const { data: plantsResponse, isLoading: loadingPlants } = usePlants();
  const plants = plantsResponse?.plants || [];
  
  const { data: speciesResponse } = useSpecies();
  const speciesList = speciesResponse?.data.map(s => s.common_name) || [];

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

  const availableSpecies = speciesList;

  const filteredZones = zones.filter(z => {
    const matchesSearch = (z.name && z.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (z.location_city && z.location_city.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesFilter = false;
    if (zoneFilter === 'All') matchesFilter = true;
    else if (zoneFilter === 'Need plants') matchesFilter = !z.has_plant;
    else if (zoneFilter === 'Need device') matchesFilter = !z.has_device;
    else if (zoneFilter === 'Fully Linked') matchesFilter = z.has_plant && z.has_device;
    
    return matchesSearch && matchesFilter;
  });

  const filteredPlants = plants.filter(p => {
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
                {activeTab === 'zones' ? `${zones.length} zones` : `${plants.length} orchids`}
              </Text>
            </VStack>
            <NotificationBell />
          </HStack>
        </Animated.View>

        <TabSwitcher
          activeTab={activeTab}
          onTabChange={(tab: 'zones' | 'plants') => {
            setActiveTab(tab);
            setSearchQuery('');
            setZoneFilter('All');
            setPlantStatus('All');
            setPlantSpecies([]);
          }}
        />

        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={activeTab === 'zones' ? "Search zones..." : "Search plants..."}
          />
        </View>

        <FilterBar
          activeTab={activeTab}
          zoneFilter={zoneFilter}
          setZoneFilter={setZoneFilter}
          plantStatus={plantStatus}
          setPlantStatus={setPlantStatus}
          plantSpecies={plantSpecies}
          setPlantSpecies={setPlantSpecies}
          onOpenStatusSheet={openStatusSheet}
          onOpenSpeciesSheet={openSpeciesSheet}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {(loadingZones && zones.length === 0) || (loadingPlants && plants.length === 0) ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
              <ActivityIndicator size="large" color={THEME.orchidMain} />
            </View>
          ) : activeTab === 'zones' ? (
            <View style={styles.gridContainer}>
              {filteredZones.length === 0 ? (
                <EmptyState 
                  message="No zones found matching your criteria."
                />
              ) : (
                filteredZones.map((zone, idx) => (
                  <Animated.View key={zone.id} entering={FadeInUp.delay(200 + idx * 50).duration(400)} style={styles.gridItem}>
                    <ZoneCard 
                      zone={zone}
                      onPress={() => {
                        isNavigatingToDetail.current = true;
                        router.push(`/zone/${zone.id}`);
                      }}
                    />
                  </Animated.View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.listContainer}>
              {filteredPlants.length === 0 ? (
                <EmptyState
                  message="No plants found matching your criteria."
                />
              ) : (
                filteredPlants.map((plant, idx) => {
                  const zone = zones.find(z => z.id === plant.zone_id);
                  return (
                    <Animated.View key={plant.id} entering={FadeInUp.delay(200 + idx * 50).duration(400)}>
                      <PlantCard 
                        plant={plant}
                        zoneName={zone?.name}
                        onPress={() => {
                          isNavigatingToDetail.current = true;
                          router.push(`/plant/${plant.id}`);
                        }}
                      />
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
        <StatusFilterSheet 
          sheetRef={statusSheetRef}
          tempPlantStatus={tempPlantStatus}
          plantStatus={plantStatus}
          setTempPlantStatus={setTempPlantStatus}
          setPlantStatus={setPlantStatus}
        />
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
        <SpeciesFilterSheet 
          sheetRef={speciesSheetRef}
          availableSpecies={availableSpecies}
          tempPlantSpecies={tempPlantSpecies}
          plantSpecies={plantSpecies}
          setTempPlantSpecies={setTempPlantSpecies}
          setPlantSpecies={setPlantSpecies}
          toggleSpecies={toggleSpecies}
        />
      </BottomSheetModal>
      
      <FABMenu actions={[
        { key: 'zone', label: 'Add Zone', icon: Leaf, color: THEME.gold, route: '/(modals)/device-setup' },
        { key: 'plant', label: 'Add Plant', icon: Flower2, color: THEME.orchidMain, route: '/(modals)/add-plant' }
      ]} />
    </View>
  )
}

