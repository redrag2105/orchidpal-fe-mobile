/**
 * Select Zone Step Component
 * Botanical luxury styled zone selection
 */

import { FONTS, THEME } from '@/constants/theme'
import { ArrowRight, Flower2, MapPin, Plus } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated'
import type { PlantingZone } from '../../types'

interface SelectZoneStepProps {
  zones: PlantingZone[]
  onSelect: (zone: PlantingZone) => void
  onCreateNew: () => void
  onSkip: () => void
  isLoading: boolean
}

export function SelectZoneStep({ zones, onSelect, onCreateNew, onSkip, isLoading }: SelectZoneStepProps) {
  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
      {/* Icon */}
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.iconContainer}>
        <Flower2 size={44} color={THEME.forest} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text entering={FadeInDown.delay(150).duration(300)} style={styles.title}>
        Assign to Zone
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(200).duration(300)} style={styles.subtitle}>
        Select an existing planting zone or create a new one for your device.
      </Animated.Text>

      {/* Zone list */}
      {zones.length > 0 && (
        <ScrollView
          style={styles.zoneList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.zoneListContent}
        >
          {zones.map((zone, index) => (
            <Animated.View key={zone.id} entering={FadeInRight.delay(250 + index * 50).duration(300)}>
              <Pressable
                style={[styles.zoneItem, isLoading && styles.zoneItemDisabled]}
                onPress={() => onSelect(zone)}
                disabled={isLoading}
              >
                <View style={styles.zoneIcon}>
                  <Flower2 size={20} color={THEME.forest} />
                </View>
                <View style={styles.zoneInfo}>
                  <Animated.Text style={styles.zoneName}>{zone.name}</Animated.Text>
                  {zone.location_city && (
                    <View style={styles.locationRow}>
                      <MapPin size={12} color={THEME.inkMuted} />
                      <Animated.Text style={styles.locationText}>{zone.location_city}</Animated.Text>
                    </View>
                  )}
                </View>
                <ArrowRight size={18} color={THEME.inkMuted} />
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      )}

      {/* Create new zone button */}
      <Animated.View entering={FadeInUp.delay(350).duration(300)} style={styles.fullWidth}>
        <Pressable
          style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
          onPress={onCreateNew}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <>
              <Plus size={18} color='white' />
              <Animated.Text style={styles.primaryBtnText}>Create New Zone</Animated.Text>
            </>
          )}
        </Pressable>
      </Animated.View>

      {/* Skip button */}
      <Animated.View entering={FadeIn.delay(400).duration(300)}>
        <Pressable style={styles.linkBtn} onPress={onSkip} disabled={isLoading}>
          <Animated.Text style={[styles.linkBtnText, isLoading && styles.linkBtnDisabled]}>Skip for now</Animated.Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.paper,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: THEME.ink,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 4
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: THEME.forestLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.serif,
    fontWeight: '500',
    color: THEME.ink,
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: THEME.inkMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  zoneList: {
    width: '100%',
    maxHeight: 200
  },
  zoneListContent: {
    gap: 10,
    paddingBottom: 8
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: THEME.paperDark,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)'
  },
  zoneItemDisabled: {
    opacity: 0.5
  },
  zoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.forestLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  zoneInfo: {
    flex: 1,
    gap: 2
  },
  zoneName: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  locationText: {
    fontSize: 12,
    color: THEME.inkMuted
  },
  fullWidth: {
    width: '100%',
    marginTop: 16
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: THEME.forest,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: THEME.forest,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  btnDisabled: {
    opacity: 0.5
  },
  linkBtn: {
    paddingVertical: 12,
    marginTop: 8
  },
  linkBtnText: {
    fontSize: 14,
    color: THEME.inkMuted,
    textDecorationLine: 'underline'
  },
  linkBtnDisabled: {
    opacity: 0.5
  }
})
