import { ChevronRight, Flower2 } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import type { PlantingZone } from '../../../types/device.types'
import { styles } from './styles'

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
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Flower2 size={48} color='#4a795f' strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Choose a Zone</Text>
      <Text style={styles.stepDescription}>
        Select where you want to place your device, then we'll help you add plants.
      </Text>

      {zones.length > 0 ? (
        <View style={styles.zoneList}>
          {zones.map((zone) => (
            <TouchableOpacity
              key={zone.id}
              style={[styles.zoneItem, selected?.id === zone.id && styles.zoneItemSelected]}
              onPress={() => setSelected(zone)}
            >
              <View style={styles.zoneRadio}>{selected?.id === zone.id && <View style={styles.zoneRadioInner} />}</View>
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zoneDesc}>{zone.location_city}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyZones}>
          <Text style={styles.emptyZonesText}>No zones created yet</Text>
        </View>
      )}

      {/* Create new zone button */}
      <TouchableOpacity style={styles.secondaryButton} onPress={onCreateNew}>
        <Text style={styles.secondaryButtonText}>+ Create New Zone</Text>
      </TouchableOpacity>

      {zones.length > 0 && (
        <TouchableOpacity
          style={[styles.primaryButton, styles.buttonSpacing, (!selected || isLoading) && styles.buttonDisabled]}
          onPress={() => selected && onSelect(selected)}
          disabled={!selected || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Continue to Plant Selection</Text>
              <ChevronRight size={18} color='white' />
            </>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.linkButton} onPress={onSkip}>
        <Text style={styles.linkButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  )
}
