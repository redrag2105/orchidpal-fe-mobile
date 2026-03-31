import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { LinearGradient } from 'expo-linear-gradient'
import { Cpu, Droplets, Leaf, Plus, Thermometer } from 'lucide-react-native'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'
import { FONTS, THEME } from '../../constants/theme'

export interface Zone {
  id: string
  name: string
  image_url?: string | null
  location_city?: string
  temperature?: number | null
  humidity?: number | null
  status?: string
  has_plant?: boolean
  has_device?: boolean
}

interface ZoneCardProps {
  zone: Zone
  index: number
  onPress?: () => void
}

export function ZoneCard({ zone, index, onPress }: ZoneCardProps) {
  const isHealthy = zone.status !== 'needs-attention'
  const imgUri = zone.image_url || 'https://images.unsplash.com/photo-1566836610593-62a64888a216?w=400'
  const hasPlant = zone.has_plant
  const hasDevice = zone.has_device

  return (
    <Animated.View entering={FadeInRight.delay(200 + index * 100).duration(400)}>
      <TouchableOpacity style={styles.zoneCard} activeOpacity={0.85} onPress={onPress}>
        <Image source={{ uri: imgUri }} style={styles.zoneImage} />

        {/* Status indicator
        <View style={[styles.zoneStatus, { backgroundColor: isHealthy ? THEME.forest : THEME.gold }]}>
          <View style={styles.zoneStatusInner} />
        </View> */}

        {/* Indicators Top Corner */}
        <HStack style={styles.indicators}>
          <View style={[styles.indicatorIcon, hasPlant ? styles.indicatorActive : styles.indicatorDimmed]}>
            {hasPlant ? <Leaf size={12} color={THEME.forest} /> : <Plus size={12} color='rgba(255,255,255,0.7)' />}
          </View>
          <View style={[styles.indicatorIcon, hasDevice ? styles.indicatorActive : styles.indicatorDimmed]}>
            {hasDevice ? <Cpu size={12} color={THEME.ink} /> : <Plus size={12} color='rgba(255,255,255,0.7)' />}
          </View>
        </HStack>

        {/* Gradient overlay to ensure text contrast while keeping image visible */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']}
          locations={[0, 0.4, 1]}
          style={styles.zoneGradient}
        />

        {/* Content (No Blur, relies on gradient and text shadows) */}
        <View style={styles.zoneContent}>
          <Text style={styles.zoneName}>{zone.name}</Text>
          {zone.location_city ? <Text style={styles.zoneLocation}>{zone.location_city}</Text> : null}
          <HStack style={styles.zoneStats}>
            {zone.temperature !== null && zone.temperature !== undefined ? (
              <HStack style={{ gap: 4, alignItems: 'center' }}>
                <Thermometer size={12} color='white' strokeWidth={1.5} />
                <Text style={styles.zoneStatText}>{zone.temperature}C</Text>
              </HStack>
            ) : null}
            {zone.humidity !== null && zone.humidity !== undefined ? (
              <HStack style={{ gap: 4, alignItems: 'center' }}>
                <Droplets size={12} color='white' strokeWidth={1.5} />
                <Text style={styles.zoneStatText}>{zone.humidity}%</Text>
              </HStack>
            ) : null}
          </HStack>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  zoneCard: {
    width: 150,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: THEME.paperDark
  },
  zoneImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  indicators: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6
  },
  indicatorIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  indicatorActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  indicatorDimmed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  zoneGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%'
  },
  zoneContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    gap: 4
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.serif,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  zoneLocation: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  zoneStats: {
    gap: 12,
    marginTop: 6
  },
  zoneStatText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  }
})
