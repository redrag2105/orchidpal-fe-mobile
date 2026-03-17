import React from 'react'
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/text'
import { THEME, FONTS } from '@/components/dashboard/theme'
import { Plant } from '@/types/garden.types'

interface PlantCardProps {
  plant: Plant;
  zoneName?: string;
  onPress: () => void;
}

export function PlantCard({ plant, zoneName, onPress }: PlantCardProps) {
  const isAssigned = !!plant.zone_id;

  return (
    <TouchableOpacity 
      style={styles.plantCard} 
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image source={{ uri: plant.image_url || 'https://via.placeholder.com/150?text=No+Image' }} style={styles.plantThumb} />
      <View style={styles.plantInfo}>
        <Text style={styles.plantNickname}>{plant.nickname}</Text>
        <Text style={styles.plantSpecies}>{plant.species_wiki.common_name}</Text>
        <View style={[styles.statusTag, isAssigned ? styles.statusAssigned : styles.statusUnassigned]}>
          <Text style={[styles.statusTagText, isAssigned ? styles.statusAssignedText : styles.statusUnassignedText]}>
            {isAssigned ? `Assigned to ${zoneName || 'Unknown Zone'}` : 'Unassigned'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
})