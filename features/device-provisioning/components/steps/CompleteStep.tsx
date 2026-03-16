/**
 * Complete Step Component
 * Botanical luxury styled completion screen
 */

import { CheckCircle2, Flower2, Home, Sparkles } from 'lucide-react-native'
import React from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated'

// Theme constants
const THEME = {
  paper: '#fdfcf8',
  paperDark: '#f5f4ef',
  ink: '#14281d',
  inkLight: '#3a5a40',
  inkMuted: '#5a7a68',
  forest: '#4a795f',
  forestLight: 'rgba(74, 121, 95, 0.1)',
  orchidMain: '#9f5f80',
  orchidLight: 'rgba(159, 95, 128, 0.1)',
  gold: '#d4a574'
}

const FONTS = {
  serif: Platform.select({ ios: 'Georgia', default: 'serif' })
}

interface CompleteStepProps {
  serialNumber: string
  zoneName?: string
  onFinish: () => void
}

export function CompleteStep({ serialNumber, zoneName, onFinish }: CompleteStepProps) {
  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
      {/* Success icon with sparkles */}
      <Animated.View entering={ZoomIn.delay(100).duration(400)} style={styles.iconWrap}>
        <View style={styles.iconContainer}>
          <CheckCircle2 size={56} color={THEME.forest} strokeWidth={1.5} />
        </View>
        <Animated.View entering={FadeIn.delay(400).duration(300)} style={styles.sparkle}>
          <Sparkles size={24} color={THEME.gold} />
        </Animated.View>
      </Animated.View>

      {/* Title */}
      <Animated.Text entering={FadeInDown.delay(200).duration(300)} style={styles.title}>
        All Set!
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(250).duration(300)} style={styles.subtitle}>
        Your OrchidPal device is ready to start monitoring your plants.
      </Animated.Text>

      {/* Summary */}
      <Animated.View entering={FadeIn.delay(300).duration(300)} style={styles.summarySection}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <CheckCircle2 size={20} color={THEME.forest} />
          </View>
          <View style={styles.summaryText}>
            <Animated.Text style={styles.summaryLabel}>Device</Animated.Text>
            <Animated.Text style={styles.summaryValue} numberOfLines={1}>
              {serialNumber}
            </Animated.Text>
          </View>
        </View>

        <View style={[styles.summaryCard, styles.summaryCardOrchid, !zoneName && { opacity: 0.5 }]}>
          <View style={[styles.summaryIcon, styles.summaryIconOrchid]}>
            <Flower2 size={20} color={THEME.orchidMain} />
          </View>
          <View style={styles.summaryText}>
            <Animated.Text style={[styles.summaryLabel, styles.labelOrchid]}>Zone</Animated.Text>
            <Animated.Text style={styles.summaryValue}>{zoneName || 'Not assigned'}</Animated.Text>
          </View>
        </View>
      </Animated.View>

      {/* What's next */}
      <Animated.View entering={FadeInUp.delay(350).duration(300)} style={styles.nextSection}>
        <Animated.Text style={styles.nextTitle}>What's next?</Animated.Text>
        <Animated.Text style={styles.nextItem}>• Place your device near your orchids</Animated.Text>
        <Animated.Text style={styles.nextItem}>• Monitor real-time sensor data on your dashboard</Animated.Text>
        <Animated.Text style={styles.nextItem}>• Receive care recommendations from our experts</Animated.Text>
      </Animated.View>

      {/* Finish button */}
      <Animated.View entering={FadeInUp.delay(400).duration(300)} style={styles.buttonWrap}>
        <Pressable style={styles.primaryBtn} onPress={onFinish}>
          <Home size={18} color='white' />
          <Animated.Text style={styles.primaryBtnText}>Go to Dashboard</Animated.Text>
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
  iconWrap: {
    position: 'relative',
    marginBottom: 20
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.forestLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.serif,
    fontWeight: '500',
    color: THEME.forest,
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: THEME.inkMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24
  },
  summarySection: {
    width: '100%',
    gap: 12,
    marginBottom: 20
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: THEME.forestLight,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(74, 121, 95, 0.15)'
  },
  summaryCardOrchid: {
    backgroundColor: THEME.orchidLight,
    borderColor: 'rgba(159, 95, 128, 0.15)'
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74, 121, 95, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  summaryIconOrchid: {
    backgroundColor: 'rgba(159, 95, 128, 0.15)'
  },
  summaryText: {
    flex: 1
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.forest,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  labelOrchid: {
    color: THEME.orchidMain
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink
  },
  nextSection: {
    width: '100%',
    backgroundColor: THEME.paperDark,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 18,
    marginBottom: 24
  },
  nextTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink,
    marginBottom: 12
  },
  nextItem: {
    fontSize: 13,
    color: THEME.inkMuted,
    lineHeight: 22
  },
  buttonWrap: {
    width: '100%'
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
  }
})
