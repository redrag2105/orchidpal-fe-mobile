import React from 'react'
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/text'
import { HStack } from '@/components/ui/hstack'
import { LinearGradient } from 'expo-linear-gradient'
import { Cpu, Leaf, Plus } from 'lucide-react-native'
import { THEME, FONTS } from '@/components/dashboard/theme'
import { Zone } from '@/apis/zone.api'

interface ZoneCardProps {
  zone: Zone;
  onPress: () => void;
}

export function ZoneCard({ zone, onPress }: ZoneCardProps) {
  const hasPlant = zone.has_plant;
  const hasDevice = zone.has_device;
  
  // Use a default image if image_url is null
  const imageUrl = zone.image_url || 'https://images.unsplash.com/photo-1588626572714-bd108c9dd20b?auto=format&fit=crop&q=80&w=600';

  return (
    <TouchableOpacity 
      style={styles.zoneCard} 
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image source={{ uri: imageUrl }} style={styles.zoneImage} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.zoneGradient} />
      
      {/* Indicators Top Corner */}
      <HStack style={styles.indicators}>
        <View style={[styles.indicatorIcon, hasPlant ? styles.indicatorActive : styles.indicatorDimmed]}>
          {hasPlant ? <Leaf size={12} color={THEME.forest} /> : <Plus size={12} color="rgba(255,255,255,0.7)" />}
        </View>
        <View style={[styles.indicatorIcon, hasDevice ? styles.indicatorActive : styles.indicatorDimmed]}>
          {hasDevice ? <Cpu size={12} color={THEME.ink} /> : <Plus size={12} color="rgba(255,255,255,0.7)" />}
        </View>
      </HStack>

      {/* Content */}
      <View style={styles.zoneContent}>
        <Text style={styles.zoneName} numberOfLines={1}>{zone.name}</Text>
        <Text style={styles.zoneCity}>{zone.location_city}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  zoneCard: { width: '100%', aspectRatio: 0.75, borderRadius: 24, overflow: 'hidden', backgroundColor: THEME.paperDark },
  zoneImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  zoneGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%' },
  indicators: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', gap: 6 },
  indicatorIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  indicatorActive: { backgroundColor: 'rgba(255, 255, 255, 0.95)', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  indicatorDimmed: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  zoneContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, gap: 4 },
  zoneName: { fontSize: 17, fontWeight: '600', fontFamily: FONTS.serif, color: 'white' },
  zoneCity: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
})