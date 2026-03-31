import { THEME } from '@/constants/theme'
import { CheckCircle2, ChevronRight, Map, MapPin, Plus } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { PlantingZone } from '../../../types/device.types'
import { styles as defaultStyles } from './styles'

interface StepSelectZoneProps {
  zones: PlantingZone[]
  onSelect: (zone: PlantingZone) => void
  onCreateNew: () => void
  onSkip: () => void
  isLoading: boolean
}

export function StepSelectZone({ zones, onSelect, onCreateNew, onSkip, isLoading }: StepSelectZoneProps) {
  const [selected, setSelected] = useState<PlantingZone | null>(null)

  return (
    <View style={defaultStyles.card}>
      <View style={[defaultStyles.iconContainer, { backgroundColor: 'rgba(159, 95, 128, 0.08)' }]}>
        <Map size={42} color={THEME.orchidMain} strokeWidth={1.5} />
      </View>

      <Text style={defaultStyles.stepTitle}>Choose a Zone</Text>
      <Text style={defaultStyles.stepDescription}>
        Select a dedicated space where your device will monitor your plants.
      </Text>

      <View style={styles.listContainer}>
        {zones.length > 0 ? (
          <ScrollView
            style={styles.scrollList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {zones.map((zone) => {
              const isSelected = selected?.id === zone.id
              return (
                <TouchableOpacity
                  key={zone.id}
                  style={[styles.zoneItem, isSelected && styles.zoneItemSelected]}
                  activeOpacity={0.7}
                  onPress={() => setSelected(zone)}
                >
                  <View style={[styles.zoneIcon, isSelected && styles.zoneIconSelected]}>
                    <MapPin size={22} color={isSelected ? THEME.orchidMain : '#9ca3af'} />
                  </View>
                  <View style={styles.zoneInfo}>
                    <Text style={[styles.zoneName, isSelected && styles.zoneNameSelected]}>{zone.name}</Text>
                    <Text style={[styles.zoneDesc, isSelected && styles.zoneDescSelected]}>
                      {zone.location_city || 'No location set'}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <CheckCircle2 size={24} color={THEME.orchidMain} />
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyZones}>
            <Map size={36} color='#cbd5e1' style={{ marginBottom: 12 }} />
            <Text style={styles.emptyZonesText}>No zones created yet.</Text>
            <Text style={styles.emptyZonesSubtext}>Create your first zone to place your device.</Text>
          </View>
        )}
      </View>

      {/* Create new zone button */}
      <TouchableOpacity style={styles.createNewButton} onPress={onCreateNew} activeOpacity={0.7}>
        <View style={styles.createNewIcon}>
          <Plus size={18} color={THEME.forest} />
        </View>
        <Text style={styles.createNewText}>Create New Zone</Text>
      </TouchableOpacity>

      {zones.length > 0 && (
        <TouchableOpacity
          style={[defaultStyles.primaryButton, (!selected || isLoading) && defaultStyles.buttonDisabled]}
          onPress={() => selected && onSelect(selected)}
          disabled={!selected || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <>
              <Text style={defaultStyles.primaryButtonText}>Continue</Text>
              <ChevronRight size={18} color='white' />
            </>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={defaultStyles.linkButton} onPress={onSkip}>
        <Text style={defaultStyles.linkButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    maxHeight: 240,
    marginBottom: 8
  },
  scrollList: {
    paddingHorizontal: 2
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1
  },
  zoneItemSelected: {
    borderColor: THEME.orchidMain,
    backgroundColor: 'rgba(159, 95, 128, 0.04)',
    shadowOpacity: 0.04,
    shadowRadius: 4
  },
  zoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  zoneIconSelected: {
    backgroundColor: 'rgba(159, 95, 128, 0.12)'
  },
  zoneInfo: {
    flex: 1
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4
  },
  zoneNameSelected: {
    color: THEME.orchidDeep
  },
  zoneDesc: {
    fontSize: 13,
    color: '#6b7280'
  },
  zoneDescSelected: {
    color: THEME.orchidMain
  },
  checkIcon: {
    marginLeft: 10
  },
  emptyZones: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#d1d5db'
  },
  emptyZonesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 6
  },
  emptyZonesSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center'
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 121, 95, 0.06)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(74, 121, 95, 0.3)',
    marginBottom: 20
  },
  createNewIcon: {
    marginRight: 8
  },
  createNewText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.forest
  }
})
