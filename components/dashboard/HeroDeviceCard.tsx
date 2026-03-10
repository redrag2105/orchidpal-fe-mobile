import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { LinearGradient } from 'expo-linear-gradient'
import { Cpu, Droplets, Leaf, Sun, Thermometer, Wifi } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { CircularStat } from './CircularStat'
import { FONTS, THEME } from './theme'

// Mock data - in production this would come from props or context
const DEVICE_DATA = {
  name: 'Living Room Sensor',
  serialNumber: 'ESP-ORCHID-001',
  status: 'online',
  temperature: 23.4,
  humidity: 68,
  light: 72,
  moisture: 45,
  lastSync: '2 min ago'
}

export function HeroDeviceCard() {
  return (
    <Animated.View entering={FadeInDown.delay(100).duration(500)}>
      <LinearGradient
        colors={['#f0f6f2', '#e8f4eb', '#f0f6f2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        {/* Section Label */}
        <View style={styles.heroSectionLabel}>
          <Cpu size={12} color={THEME.forest} strokeWidth={2} />
          <Text style={styles.heroSectionLabelText}>ACTIVE SENSOR</Text>
        </View>

        {/* Header */}
        <HStack style={styles.heroHeader}>
          <HStack style={{ gap: 12, alignItems: 'center' }}>
            <View style={styles.heroIconWrap}>
              <Leaf size={22} color={THEME.forest} strokeWidth={1.5} />
            </View>
            <VStack>
              <Text style={styles.heroDeviceName}>{DEVICE_DATA.name}</Text>
              <HStack style={{ gap: 6, alignItems: 'center' }}>
                <View style={styles.onlineDot} />
                <Text style={styles.heroSyncText}>Online · Last sync {DEVICE_DATA.lastSync}</Text>
              </HStack>
            </VStack>
          </HStack>
          <View style={styles.wifiPulse}>
            <Wifi size={16} color={THEME.forest} strokeWidth={2} />
          </View>
        </HStack>

        {/* Stats Grid */}
        <HStack style={styles.statsGrid}>
          <CircularStat
            value={DEVICE_DATA.temperature}
            maxValue={40}
            label='Temp °C'
            color={THEME.orchidMain}
            icon={Thermometer}
            delay={150}
          />
          <CircularStat
            value={DEVICE_DATA.humidity}
            maxValue={100}
            label='Humidity %'
            color='#3b82f6'
            icon={Droplets}
            delay={200}
          />
          <CircularStat
            value={DEVICE_DATA.light}
            maxValue={100}
            label='Light %'
            color={THEME.gold}
            icon={Sun}
            delay={250}
          />
          <CircularStat
            value={DEVICE_DATA.moisture}
            maxValue={100}
            label='Moisture %'
            color={THEME.forest}
            icon={Droplets}
            delay={300}
          />
        </HStack>
      </LinearGradient>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 28,
    padding: 20,
    shadowColor: THEME.forest,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 6
  },
  heroSectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(74,121,95,0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  heroSectionLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.forest,
    letterSpacing: 1
  },
  heroHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.forest,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2
  },
  heroDeviceName: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FONTS.serif,
    color: THEME.ink
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.forest
  },
  heroSyncText: {
    fontSize: 12,
    color: THEME.inkMuted
  },
  wifiPulse: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(74,121,95,0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statsGrid: {
    justifyContent: 'space-between',
    gap: 8
  }
})
