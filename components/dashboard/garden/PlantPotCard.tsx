import { Text } from '@/components/ui/text'
import { FONTS } from '@/constants/theme'
import { Plant } from '@/types/garden.types'
import { MapPinOff } from 'lucide-react-native'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'

interface PlantPotCardProps {
  plant: Plant
  zoneName?: string
  onPress: () => void
}

export function PlantPotCard({ plant, zoneName, onPress }: PlantPotCardProps) {
  const isAssigned = !!plant.zone_id

  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9} onPress={onPress}>
      {/* Absolute Alert Icon for unassigned plants */}
      {!isAssigned && (
        <View style={styles.alertIcon}>
          <MapPinOff color='#C5A880' size={16} strokeWidth={2.5} />
        </View>
      )}

      {/* 3. Crown - Perfect Circle Image with shadow */}
      <View style={styles.crownShadow}>
        <View style={styles.crownImageWrapper}>
          <Image
            source={{ uri: plant.image_url || 'https://via.placeholder.com/200?text=No+Image' }}
            style={styles.crownImage}
            resizeMode='cover'
          />
        </View>
      </View>

      {/* 2. Stem - Green Line with small leaves */}
      <View style={styles.stemContainer}>
        <View style={styles.stem} />
        {/* Left Leaf */}
        <View style={[styles.leaf, styles.leafLeft]} />
        {/* Right Leaf */}
        <View style={[styles.leaf, styles.leafRight]} />
      </View>

      {/* 1. Base - Cylindrical Pot (3D style) */}
      <View style={styles.potWrapper}>
        <Svg width={80} height={62} viewBox='0 0 90 70'>
          <Defs>
            <LinearGradient id='slatMain' x1='0' y1='0' x2='1' y2='0'>
              <Stop offset='0' stopColor='#A0522D' />
              <Stop offset='0.5' stopColor='#CD853F' />
              <Stop offset='1' stopColor='#8B4513' />
            </LinearGradient>
            <LinearGradient id='gapShadow' x1='0' y1='0' x2='1' y2='0'>
              <Stop offset='0' stopColor='#4A250A' />
              <Stop offset='1' stopColor='#2E1705' />
            </LinearGradient>
            <LinearGradient id='potInner' x1='0' y1='0' x2='0' y2='1'>
              <Stop offset='0' stopColor='#2A1508' />
              <Stop offset='1' stopColor='#1A0D05' />
            </LinearGradient>
          </Defs>

          {/* Inner Pot Background (Dark) seen through gaps */}
          <Path d='M 5 5 L 85 5 L 85 62 Q 85 70 75 70 L 15 70 Q 5 70 5 62 Z' fill='url(#potInner)' />

          {/* Wooden Slats (Nan dọc) 
              Dividing the width (5 to 85) into segments 
              Let's create 6 visible slats. Each slat is wide, gap is thin.
          */}
          <Path d='M 5 5 L 16 5 L 14 68 Q 10 67 5 62 Z' fill='url(#slatMain)' />
          <Path d='M 16 5 L 18 5 L 16 69 L 14 68 Z' fill='url(#gapShadow)' />

          <Path d='M 18 5 L 30 5 L 28 70 L 16 69 Z' fill='url(#slatMain)' />
          <Path d='M 30 5 L 32 5 L 30 70 L 28 70 Z' fill='url(#gapShadow)' />

          <Path d='M 32 5 L 44 5 L 43 70 L 30 70 Z' fill='url(#slatMain)' />
          <Path d='M 44 5 L 46 5 L 45 70 L 43 70 Z' fill='url(#gapShadow)' />

          <Path d='M 46 5 L 58 5 L 59 70 L 45 70 Z' fill='url(#slatMain)' />
          <Path d='M 58 5 L 60 5 L 61 70 L 59 70 Z' fill='url(#gapShadow)' />

          <Path d='M 60 5 L 72 5 L 74 69 L 61 70 Z' fill='url(#slatMain)' />
          <Path d='M 72 5 L 74 5 L 76 68 L 74 69 Z' fill='url(#gapShadow)' />

          <Path d='M 74 5 L 85 5 L 85 62 Q 85 67 78 69 L 76 68 Z' fill='url(#slatMain)' />

          {/* Pot Rim */}
          <Path d='M 0 0 L 90 0 L 90 5 Q 90 8 87 8 L 3 8 Q 0 8 0 5 Z' fill='#8B4513' />
          <Path d='M 3 6 L 87 6 L 87 8 L 3 8 Z' fill='#5C2E0B' opacity={0.5} />
        </Svg>

        <View style={styles.signContainer}>
          <View style={styles.signStick} />
          <View style={styles.signBoard}>
            <Text style={styles.signText} numberOfLines={2}>
              {plant.nickname}
            </Text>
          </View>
        </View>
      </View>

      {/* Shelf and Support */}
      <View style={styles.shelfContainer}>
        <View style={styles.shelfTop} />
        <View style={styles.shelfFront} />
        <View style={styles.shelfSupport} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 120, // slightly tighter to allow more items to be seen
    height: 185, // Tall enough to fit crown + stem + base
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    paddingBottom: 0 // removed padding to make the pot sit flush
  },
  crownShadow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: 3,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8
  },
  crownImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFF'
  },
  crownImage: {
    width: '100%',
    height: '100%'
  },
  stemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8, // sink into crown
    marginBottom: -5, // sink into pot
    zIndex: 2,
    position: 'relative',
    height: 32,
    width: 30 // wide enough to hold leaves
  },
  stem: {
    width: 5,
    height: 32,
    backgroundColor: '#3A5A40', // darker stem to match realistic tones
    borderRadius: 3,
    borderLeftWidth: 1.5,
    borderLeftColor: '#2C442F' // deeper shadow
  },
  leaf: {
    position: 'absolute',
    width: 12,
    height: 8,
    backgroundColor: '#4A795F', // green color
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#3A5A40'
  },
  leafLeft: {
    left: -2,
    top: 6,
    transform: [{ scaleX: -1 }, { rotate: '-15deg' }] // growing upward to the left
  },
  leafRight: {
    right: -2,
    top: 14,
    transform: [{ rotate: '-15deg' }] // growing upward to the right
  },
  potWrapper: {
    width: 80,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8
  },
  signContainer: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 5
  },
  signStick: {
    width: 3,
    height: 12,
    backgroundColor: '#6b4423',
    borderRadius: 2,
    marginTop: -6 // make it look like it's sticking out of the pot top
  },
  signBoard: {
    backgroundColor: '#e6cda3', // light wood color
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#c4a47c',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    marginTop: -2
  },
  signText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: FONTS.serif,
    fontStyle: 'italic',
    color: '#4a2f1d', // dark text
    textAlign: 'center',
    lineHeight: 11
  },
  shelfContainer: {
    width: '100%',
    position: 'absolute',
    bottom: -14, // align exactly with the bottom of the pot (height 8+6=14)
    alignItems: 'center',
    zIndex: 1
  },
  shelfTop: {
    width: 140,
    height: 8,
    backgroundColor: '#F5F5F5', // lightly colored to appear white
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  shelfFront: {
    width: 140,
    height: 6,
    backgroundColor: '#E0E0E0', // slight shadow to give 3d effect for shelf edge
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  shelfSupport: {
    position: 'absolute',
    left: 25,
    top: 14,
    width: 12,
    height: 25,
    backgroundColor: '#D6D6D6', // matching the lighter shelf tones
    borderLeftWidth: 2,
    borderLeftColor: '#C2C2C2',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    transform: [{ skewX: '-15deg' }]
  },
  alertIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 10,
    backgroundColor: '#FFF',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  }
})
