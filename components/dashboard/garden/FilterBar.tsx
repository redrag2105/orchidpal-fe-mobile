import { Text } from '@/components/ui/text'
import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { gardenStyles as styles } from './styles'

interface FilterBarProps {
  activeTab: 'zones' | 'plants'
  zoneFilter: string
  setZoneFilter: (filter: string) => void
  plantStatus: string
  setPlantStatus: (status: string) => void
  plantSpecies: string[]
  setPlantSpecies: (species: string[]) => void
  onOpenStatusSheet: () => void
  onOpenSpeciesSheet: () => void
}

const ZONE_FILTERS = ['All', 'Fully Linked', 'Need plants', 'Need device']

export function FilterBar({
  activeTab,
  zoneFilter,
  setZoneFilter,
  plantStatus,
  setPlantStatus,
  plantSpecies,
  setPlantSpecies,
  onOpenStatusSheet,
  onOpenSpeciesSheet
}: FilterBarProps) {
  return (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {activeTab === 'zones' ? (
          ZONE_FILTERS.map((filter) => {
            const isActive = zoneFilter === filter
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setZoneFilter(filter)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{filter}</Text>
              </TouchableOpacity>
            )
          })
        ) : (
          <>
            <TouchableOpacity
              style={[styles.filterChip, plantStatus === 'All' && plantSpecies.length === 0 && styles.filterChipActive]}
              onPress={() => {
                setPlantStatus('All')
                setPlantSpecies([])
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  plantStatus === 'All' && plantSpecies.length === 0 && styles.filterChipTextActive
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, plantStatus !== 'All' && styles.filterChipActive]}
              onPress={onOpenStatusSheet}
            >
              <Text style={[styles.filterChipText, plantStatus !== 'All' && styles.filterChipTextActive]}>
                Status{plantStatus !== 'All' ? `: ${plantStatus}` : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, plantSpecies.length > 0 && styles.filterChipActive]}
              onPress={onOpenSpeciesSheet}
            >
              <Text style={[styles.filterChipText, plantSpecies.length > 0 && styles.filterChipTextActive]}>
                Species{plantSpecies.length > 0 ? ` (${plantSpecies.length})` : ''}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  )
}
