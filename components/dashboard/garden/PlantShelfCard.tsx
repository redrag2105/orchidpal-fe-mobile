import { Text } from '@/components/ui/text'
import { THEME } from '@/constants/theme'
import { Plant } from '@/types/garden.types'
import { AlertCircle, Leaf } from 'lucide-react-native'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

interface PlantShelfCardProps {
  plant: Plant
  zoneName?: string
  onPress: () => void
}

export function PlantShelfCard({ plant, zoneName, onPress }: PlantShelfCardProps) {
  const isAssigned = !!plant.zone_id

  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9} onPress={onPress}>
      {/* Visual top half */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: plant.image_url || 'https://via.placeholder.com/200?text=No+Image' }}
          style={styles.plantImage}
          resizeMode='cover'
        />

        {/* Dummy notification/status icon inside the image (like the red dot in design) */}
        {!isAssigned && (
          <View style={styles.alertIcon}>
            <AlertCircle color='#FF4D4F' fill='white' size={24} />
          </View>
        )}
      </View>

      {/* Info bottom half */}
      <View style={styles.infoWrapper}>
        <View style={styles.titleRow}>
          <Text style={styles.plantNickname} numberOfLines={1}>
            {plant.nickname}
          </Text>
          {isAssigned && <Leaf size={14} color={THEME.forest} />}
        </View>
        <Text style={styles.plantLocation} numberOfLines={1}>
          {zoneName ? zoneName : 'Unassigned'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 140, // Slightly narrower to match 2-2.5 cards per screen width typical of shelves
    height: 180, // Aspect ratio looks more vertical
    backgroundColor: 'white',
    borderRadius: 20,
    // Drop shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 6,
    marginBottom: 0,
    overflow: 'visible'
  },
  imageWrapper: {
    height: 115,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: THEME.paper
  },
  plantImage: {
    width: '100%',
    height: '100%'
  },
  alertIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 2
  },
  infoWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flex: 1,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'white'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2
  },
  plantNickname: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748', // Darker text for readability
    flexShrink: 1
  },
  plantLocation: {
    fontSize: 12,
    color: '#A0AEC0', // Light Gray
    fontWeight: '500'
  }
})
