import React from 'react'
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native'
import { PlantPotCard } from './PlantPotCard'
import { Plant, PlantingZone } from '@/types/garden.types'
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface ShelfProps {
  plants: Plant[]
  zones: PlantingZone[]
  onPressPlant: (plant: Plant) => void
  layout?: 'default' | 'right-aligned' | 'full-width'
  indexOffset?: number
}

export function PlantShelf({ plants, zones, onPressPlant, layout = 'default', indexOffset = 0 }: ShelfProps) {
  const isRight = layout === 'right-aligned';
  const isFull = layout === 'full-width';

  const wrapperStyle = [
    styles.shelfWrapper,
    isRight && { marginRight: -20 },
    isFull && { marginHorizontal: -20 },
  ];

  const scrollPadding = isFull
    ? { paddingHorizontal: 20 }
    : isRight
    ? { paddingLeft: 0, paddingRight: 40 }
    : { paddingHorizontal: 20 };

  const baseStyle = [
    styles.shelfBase,
    isRight && { right: 0, borderTopRightRadius: 0 },
    isFull && { left: 0, right: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  ];

  return (
    <View style={wrapperStyle}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.shelfContent, scrollPadding]}
        snapToInterval={136} // approx card width + gap
        decelerationRate="fast"
      >
        {plants.map((plant, idx) => (
          <Animated.View 
            key={plant.id} 
            entering={FadeInRight.delay(200 + (idx + indexOffset) * 100).duration(500)}
          >
            <PlantPotCard
              plant={plant}
              zoneName={zones.find((z) => z.id === plant.zone_id)?.name}
              onPress={() => onPressPlant(plant)}
            />
          </Animated.View>
        ))}
        {/* Helper view to pad the end of scroll slightly if needed, though paddingRight covers it */}
      </ScrollView>

      {/* The Shelf Layer */}
      <View style={baseStyle}>
        <View style={[styles.shelfTop, isRight && { borderTopRightRadius: 0 }, isFull && { borderTopLeftRadius: 0, borderTopRightRadius: 0 }]} />
        <View style={[styles.shelfFront, isRight && { borderBottomRightRadius: 0 }, isFull && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]} />
        <View style={[styles.shelfBottom, isRight && { borderBottomRightRadius: 0 }, isFull && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  shelfWrapper: {
    marginBottom: 50,
    position: 'relative',
  },
  shelfContent: {
    minHeight: 185, // Height of PlantPotCard to prevent layout collapse when empty
    paddingBottom: 4, 
    gap: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  shelfBase: {
    position: 'absolute',
    bottom: -22,
    left: '1%',
    right: '1%',
    height: 22,
    zIndex: 1,
    // Realistic multi-layered drop shadow - DARKER & MORE REALISTIC
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.35,
    shadowRadius: 35,
    elevation: 20,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  shelfTop: {
    height: 6,
    backgroundColor: '#FAFAFA', // Bright Top
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  shelfFront: {
    height: 12, // Thicker front edge
    backgroundColor: '#EAEAEA', // Gray Front
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  shelfBottom: {
    height: 4,
    backgroundColor: '#CDCDCD', // Darker bottom edge to give 3D depth
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  }
})
