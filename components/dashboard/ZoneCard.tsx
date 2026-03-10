import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { LinearGradient } from 'expo-linear-gradient'
import { Droplets, Edit3, Thermometer } from 'lucide-react-native'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'
import { FONTS, THEME } from './theme'

export interface Zone {
  id: string
  name: string
  plantCount: number
  image: string
  status: 'healthy' | 'needs-attention'
  temp: number
  humidity: number
}

interface ZoneCardProps {
  zone: Zone
  index: number
  onPress?: () => void
}

export function ZoneCard({ zone, index, onPress }: ZoneCardProps) {
  const isHealthy = zone.status === 'healthy'

  return (
    <Animated.View entering={FadeInRight.delay(200 + index * 100).duration(400)}>
      <TouchableOpacity style={styles.zoneCard} activeOpacity={0.85} onPress={onPress}>
        <Image source={{ uri: zone.image }} style={styles.zoneImage} />

        {/* Gradient overlay */}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.zoneGradient} />

        {/* Status indicator */}
        <View style={[styles.zoneStatus, { backgroundColor: isHealthy ? THEME.forest : THEME.gold }]}>
          <View style={styles.zoneStatusInner} />
        </View>

        {/* Edit button */}
        <TouchableOpacity style={styles.zoneEditBtn}>
          <Edit3 size={12} color={THEME.ink} strokeWidth={2} />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.zoneContent}>
          <Text style={styles.zoneName}>{zone.name}</Text>
          <Text style={styles.zoneLocation}>{zone.plantCount} plants</Text>
          <HStack style={styles.zoneStats}>
            <HStack style={{ gap: 4, alignItems: 'center' }}>
              <Thermometer size={12} color='white' strokeWidth={1.5} />
              <Text style={styles.zoneStatText}>{zone.temp}°C</Text>
            </HStack>
            <HStack style={{ gap: 4, alignItems: 'center' }}>
              <Droplets size={12} color='white' strokeWidth={1.5} />
              <Text style={styles.zoneStatText}>{zone.humidity}%</Text>
            </HStack>
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
  zoneGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%'
  },
  zoneStatus: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  },
  zoneStatusInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white'
  },
  zoneEditBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
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
    color: 'white'
  },
  zoneLocation: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)'
  },
  zoneStats: {
    gap: 12,
    marginTop: 6
  },
  zoneStatText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500'
  }
})
