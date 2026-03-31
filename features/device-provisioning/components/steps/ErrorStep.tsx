/**
 * Error Step Component
 * Botanical luxury styled error screen with retry option
 */

import { FONTS, THEME } from '@/constants/theme'
import { AlertCircle, RefreshCw } from 'lucide-react-native'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated'

interface ErrorStepProps {
  error: string
  onRetry: () => void
}

export function ErrorStep({ error, onRetry }: ErrorStepProps) {
  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
      {/* Error icon */}
      <Animated.View entering={ZoomIn.delay(100).duration(400)} style={styles.iconContainer}>
        <AlertCircle size={52} color={THEME.error} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text entering={FadeInDown.delay(200).duration(300)} style={styles.title}>
        Something went wrong
      </Animated.Text>

      {/* Error message */}
      <Animated.View entering={FadeIn.delay(300).duration(300)} style={styles.errorCard}>
        <Animated.Text style={styles.errorText}>{error}</Animated.Text>
      </Animated.View>

      {/* Retry button */}
      <Animated.View entering={FadeInUp.delay(400).duration(300)} style={styles.buttonWrap}>
        <Pressable style={styles.retryBtn} onPress={onRetry}>
          <RefreshCw size={18} color='white' />
          <Animated.Text style={styles.retryBtnText}>Try Again</Animated.Text>
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
    backgroundColor: THEME.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.serif,
    fontWeight: '500',
    color: THEME.error,
    textAlign: 'center',
    marginBottom: 20
  },
  errorCard: {
    width: '100%',
    backgroundColor: THEME.errorBg,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.errorLight,
    marginBottom: 28
  },
  errorText: {
    fontSize: 14,
    color: THEME.error,
    textAlign: 'center',
    lineHeight: 20
  },
  buttonWrap: {
    width: '100%'
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: THEME.error,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: THEME.error,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3
  },
  retryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
})
