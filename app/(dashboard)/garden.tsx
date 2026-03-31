import { FABMenu, NotificationBell } from '@/components/dashboard'
import { HStack } from '@/components/ui/hstack'
import { SearchBar } from '@/components/ui/SearchBar'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/constants/theme'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import { Flower2, Leaf } from 'lucide-react-native'
import React, { useCallback } from 'react'
import { ActivityIndicator, Keyboard, RefreshControl, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { EmptyState } from '@/components/dashboard/garden/EmptyState'
import { FilterBar } from '@/components/dashboard/garden/FilterBar'
import { SpeciesFilterSheet, StatusFilterSheet } from '@/components/dashboard/garden/FilterSheets'
import { PlantShelf } from '@/components/dashboard/garden/PlantShelf'
import { TabSwitcher } from '@/components/dashboard/garden/TabSwitcher'
import { useGardenLogic } from '@/components/dashboard/garden/useGardenLogic'
import { ZoneCard } from '@/components/dashboard/garden/ZoneCard'

export default function GardenScreen() {
  const logic = useGardenLogic()
  const {
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
  } = logic

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />,
    []
  )

  return (
    <View className='flex-1 bg-paper'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className='flex-1 bg-paper'>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <Animated.View entering={FadeIn.duration(400)}>
              <HStack className='items-center justify-between px-5 py-2'>
                <VStack>
                  <Text className='mt-0.5 pb-2 pt-2 font-serif text-[28px] font-semibold leading-9 text-ink'>
                    My <Text className='font-serif italic text-orchid-main'>Garden</Text>
                  </Text>
                  <Text className='font-sans text-xs uppercase tracking-wider text-ink-muted'>
                    {activeTab === 'zones' ? `${zones.length} zones` : `${plants.length} orchids`}
                  </Text>
                </VStack>
                <NotificationBell />
              </HStack>
            </Animated.View>

            <TabSwitcher
              activeTab={activeTab}
              onTabChange={(tab: 'zones' | 'plants') => {
                setActiveTab(tab)
                setSearchQuery('')
                setZoneFilter('All')
                setPlantStatus('All')
                setPlantSpecies([])
              }}
            />

            <View className='px-5 pb-1'>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={activeTab === 'zones' ? 'Search zones...' : 'Search plants...'}
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
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
              onScroll={handleScroll}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetchingZones || isRefetchingPlants}
                  onRefresh={onRefresh}
                  tintColor={THEME.orchidMain}
                />
              }
            >
              {(loadingZones && zones.length === 0) || (loadingPlants && plants.length === 0) ? (
                <View className='mt-[100px] flex-1 items-center justify-center'>
                  <ActivityIndicator size='large' color={THEME.orchidMain} />
                </View>
              ) : activeTab === 'zones' ? (
                <View className='flex-row flex-wrap justify-between gap-4'>
                  {filteredZones.length === 0 ? (
                    <EmptyState message='No zones found matching your criteria.' />
                  ) : (
                    filteredZones.map((zone, idx) => (
                      <Animated.View
                        key={zone.id}
                        entering={FadeInUp.delay(200 + idx * 50).duration(400)}
                        className='w-[47%]'
                      >
                        <ZoneCard
                          zone={zone}
                          index={idx}
                          onPress={() => {
                            isNavigatingToDetail.current = true
                            router.push(`/zone/${zone.id}`)
                          }}
                        />
                      </Animated.View>
                    ))
                  )}
                </View>
              ) : (
                <View className='gap-4'>
                  {filteredPlants.length === 0 ? (
                    <EmptyState message='No plants found matching your criteria.' />
                  ) : (
                    (() => {
                      const total = filteredPlants.length
                      const splitIndex = total <= 3 ? total : Math.ceil(total / 2)

                      const topShelfPlants = filteredPlants.slice(0, splitIndex)
                      const bottomShelfPlants = filteredPlants.slice(splitIndex)

                      return (
                        <>
                          <PlantShelf
                            plants={topShelfPlants}
                            zones={zones}
                            layout='right-aligned'
                            indexOffset={0}
                            onPressPlant={(plant) => {
                              isNavigatingToDetail.current = true
                              router.push(`/plant/${plant.id}`)
                            }}
                          />
                          <PlantShelf
                            plants={bottomShelfPlants}
                            zones={zones}
                            layout='full-width'
                            indexOffset={topShelfPlants.length}
                            onPressPlant={(plant) => {
                              isNavigatingToDetail.current = true
                              router.push(`/plant/${plant.id}`)
                            }}
                          />
                        </>
                      )
                    })()
                  )}
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>

      <BottomSheetModal
        ref={statusSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
        handleIndicatorStyle={{
          width: 48,
          height: 5,
          backgroundColor: THEME.paperDeep,
          borderRadius: 3,
          marginTop: 10
        }}
      >
        <StatusFilterSheet
          sheetRef={statusSheetRef as any}
          tempPlantStatus={tempPlantStatus}
          plantStatus={plantStatus}
          setTempPlantStatus={setTempPlantStatus}
          setPlantStatus={setPlantStatus}
        />
      </BottomSheetModal>

      <BottomSheetModal
        ref={speciesSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
        handleIndicatorStyle={{
          width: 48,
          height: 5,
          backgroundColor: THEME.paperDeep,
          borderRadius: 3,
          marginTop: 10
        }}
      >
        <SpeciesFilterSheet
          sheetRef={speciesSheetRef as any}
          availableSpecies={availableSpecies}
          tempPlantSpecies={tempPlantSpecies}
          plantSpecies={plantSpecies}
          setTempPlantSpecies={setTempPlantSpecies}
          setPlantSpecies={setPlantSpecies}
          toggleSpecies={toggleSpecies}
        />
      </BottomSheetModal>

      <FABMenu
        actions={[
          { key: 'zone', label: 'Add Zone', icon: Leaf, color: THEME.gold, route: '/(modals)/add-zone' },
          { key: 'plant', label: 'Add Plant', icon: Flower2, color: THEME.orchidMain, route: '/(modals)/add-plant' }
        ]}
      />
    </View>
  )
}
