/**
 * Activation Success Step Component
 * Botanical luxury styled success screen after device activation
 */

import { THEME } from '@/constants/theme'
import { ArrowRight, CheckCircle2, Wifi } from 'lucide-react-native'
import React from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'

const FONTS = {
  serif: Platform.select({ ios: 'Georgia', default: 'serif' })
}

interface ActivationSuccessStepProps {
  serialNumber: string
  onContinue: () => void
}

export function ActivationSuccessStep({ serialNumber, onContinue }: ActivationSuccessStepProps) {
  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
      {/* Success icon */}
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.iconContainer}>
        <CheckCircle2 size={52} color={THEME.forest} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text entering={FadeInDown.delay(150).duration(300)} style={styles.title}>
        Device Activated!
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(200).duration(300)} style={styles.subtitle}>
        Your OrchidPal device has been linked to your account.
      </Animated.Text>

      {/* Device info */}
      <Animated.View entering={FadeIn.delay(250).duration(300)} style={styles.deviceInfoCard}>
        <View style={styles.checkBadge}>
          <CheckCircle2 size={20} color={THEME.forest} />
        </View>
        <View style={styles.deviceInfoText}>
          <Animated.Text style={styles.deviceLabel}>Serial Number</Animated.Text>
          <Animated.Text style={styles.deviceValue} numberOfLines={1}>
            {serialNumber}
          </Animated.Text>
        </View>
      </Animated.View>

      {/* Next step info */}
      <Animated.View entering={FadeInUp.delay(300).duration(300)} style={styles.nextStepCard}>
        <View style={styles.nextStepIcon}>
          <Wifi size={18} color={THEME.orchidMain} />
        </View>
        <View style={styles.nextStepText}>
          <Animated.Text style={styles.nextStepTitle}>Next: Connect to WiFi</Animated.Text>
          <Animated.Text style={styles.nextStepDesc}>
            You'll need to connect your phone to the device's WiFi network and configure your home WiFi credentials.
          </Animated.Text>
        </View>
      </Animated.View>

      {/* Continue button */}
      <Animated.View entering={FadeInUp.delay(400).duration(300)} style={styles.buttonWrap}>
        <Pressable style={styles.primaryBtn} onPress={onContinue}>
          <Animated.Text style={styles.primaryBtnText}>Continue to WiFi Setup</Animated.Text>
          <ArrowRight size={18} color='white' />
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
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: THEME.forestLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 26,
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
    marginBottom: 24
  },
  deviceInfoCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: THEME.forestLight,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(74, 121, 95, 0.15)',
    marginBottom: 16
  },
  checkBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74, 121, 95, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deviceInfoText: {
    flex: 1
  },
  deviceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.forest,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  deviceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink
  },
  nextStepCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: THEME.paperDark,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 24
  },
  nextStepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(159, 95, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nextStepText: {
    flex: 1
  },
  nextStepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink,
    marginBottom: 4
  },
  nextStepDesc: {
    fontSize: 13,
    color: THEME.inkMuted,
    lineHeight: 18
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
