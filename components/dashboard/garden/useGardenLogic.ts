import { usePlants } from '@/hooks/queries/usePlants'
import { useSpecies } from '@/hooks/queries/useSpecies'
import { useZones } from '@/hooks/queries/useZones'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTab'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useGardenLogic() {
  const router = useRouter()
  const navigation = useNavigation()
  const handleScroll = useDynamicBottomTab()

  const { tab } = useLocalSearchParams<{ tab?: 'zones' | 'plants' }>()
  const [activeTab, setActiveTab] = useState<'zones' | 'plants'>(tab || 'zones')

  useEffect(() => {
    if (tab && (tab === 'zones' || tab === 'plants')) {
      setActiveTab(tab)
    }
  }, [tab])
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: zones = [],
    isLoading: loadingZones,
    refetch: refetchZones,
    isRefetching: isRefetchingZones
  } = useZones()
  const {
    data: plantsResponse,
    isLoading: loadingPlants,
    refetch: refetchPlants,
    isRefetching: isRefetchingPlants
  } = usePlants()
  const plants = plantsResponse?.plants || []

  const { data: speciesResponse } = useSpecies()
  const speciesList = speciesResponse?.data.map((s) => s.common_name) || []

  const [zoneFilter, setZoneFilter] = useState<string>('All')
  const [plantStatus, setPlantStatus] = useState<string>('All')
  const [plantSpecies, setPlantSpecies] = useState<string[]>([])

  const [tempPlantStatus, setTempPlantStatus] = useState<string>('All')
  const [tempPlantSpecies, setTempPlantSpecies] = useState<string[]>([])

  const isNavigatingToDetail = useRef(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const onRefresh = useCallback(async () => {
    await Promise.all([refetchZones(), refetchPlants()])
  }, [refetchZones, refetchPlants])

  useFocusEffect(
    useCallback(() => {
      isNavigatingToDetail.current = false
      setRefreshKey((prev) => prev + 1)

      return () => {
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
    const unsubscribe = (navigation as any).addListener('tabPress', (e: any) => {
      setSearchQuery('')
      setZoneFilter('All')
      setPlantStatus('All')
      setPlantSpecies([])
    })
    return unsubscribe
  }, [navigation])

  const statusSheetRef = useRef<BottomSheetModal>(null)
  const speciesSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['50%', '75%'], [])

  const openStatusSheet = () => {
    setTempPlantStatus(plantStatus)
    statusSheetRef.current?.present()
  }

  const openSpeciesSheet = () => {
    setTempPlantSpecies([...plantSpecies])
    speciesSheetRef.current?.present()
  }

  const availableSpecies = speciesList

  const filteredZones = zones.filter((z) => {
    const matchesSearch =
      (z.name && z.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (z.location_city && z.location_city.toLowerCase().includes(searchQuery.toLowerCase()))

    let matchesFilter = false
    if (zoneFilter === 'All') matchesFilter = true
    else if (zoneFilter === 'Need plants') matchesFilter = !z.has_plant
    else if (zoneFilter === 'Need device') matchesFilter = !z.has_device
    else if (zoneFilter === 'Fully Linked') matchesFilter = z.has_plant && z.has_device

    return matchesSearch && matchesFilter
  })

  const filteredPlants = plants.filter((p) => {
    const matchesSearch =
      p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.species_wiki.common_name.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesStatus = true
    if (plantStatus === 'Unassigned') matchesStatus = !p.zone_id
    else if (plantStatus === 'Assigned') matchesStatus = !!p.zone_id

    let matchesSpecies = true
    if (plantSpecies.length > 0) {
      matchesSpecies = plantSpecies.includes(p.species_wiki.common_name)
    }

    return matchesSearch && matchesStatus && matchesSpecies
  })

  const toggleSpecies = (species: string) => {
    setTempPlantSpecies((prev) => (prev.includes(species) ? prev.filter((s) => s !== species) : [...prev, species]))
  }

  return {
    router,
    handleScroll,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    zoneFilter,
    setZoneFilter,
    plantStatus,
    setPlantStatus,
    plantSpecies,
    setPlantSpecies,
    tempPlantStatus,
    setTempPlantStatus,
    tempPlantSpecies,
    setTempPlantSpecies,
    statusSheetRef,
    speciesSheetRef,
    snapPoints,
    openStatusSheet,
    openSpeciesSheet,
    availableSpecies,
    filteredZones,
    filteredPlants,
    toggleSpecies,
    loadingZones,
    loadingPlants,
    isRefetchingZones,
    isRefetchingPlants,
    onRefresh,
    zones,
    plants,
    isNavigatingToDetail
  }
}
