import { THEME } from '@/constants/theme'
import { Thermometer } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import Svg, { Circle as SvgCircle } from 'react-native-svg'

interface CircularStatProps {
  value: number
  maxValue: number
  label: string
  color: string
  icon: typeof Thermometer
  delay: number
}

export function CircularStat({ value, maxValue, label, color, icon: Icon, delay }: CircularStatProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const size = 64
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)} style={styles.circularStatWrap}>
      <View style={styles.circularStatOuter}>
        {/* SVG Progress Ring */}
        <Svg width={size} height={size} style={styles.circularProgressSvg}>
          {/* Background circle */}
          <SvgCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`${color}20`}
            strokeWidth={strokeWidth}
            fill='transparent'
          />
          {/* Progress arc */}
          <SvgCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill='transparent'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        {/* Inner content */}
        <View style={[styles.circularStatInner, { backgroundColor: `${color}08` }]}>
          <Icon size={16} color={color} strokeWidth={1.5} />
          <Text style={[styles.circularStatValue, { color: THEME.ink }]}>{value}</Text>
        </View>
      </View>
      <Text style={styles.circularStatLabel}>{label}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  circularStatWrap: {
    alignItems: 'center',
    gap: 6
  },
  circularStatOuter: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  circularProgressSvg: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  circularStatInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2
  },
  circularStatValue: {
    fontSize: 13,
    fontWeight: '700'
  },
  circularStatLabel: {
    fontSize: 10,
    color: THEME.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center'
  }
})
