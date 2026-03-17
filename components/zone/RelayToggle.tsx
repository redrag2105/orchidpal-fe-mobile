import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { THEME } from '@/components/dashboard/theme'
import { LinearGradient } from 'expo-linear-gradient'

type RelayToggleProps = {
  isActive: boolean
  onToggle: () => void
}

export function RelayToggle({ isActive, onToggle }: RelayToggleProps) {
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [isActive])

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 40]
  })

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onToggle}>
      <View style={styles.toggleTrack}>
        <Animated.View style={{
          position: 'absolute',
          right: 12,
          opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
        }}>
          <Text style={styles.toggleOffText}>OFF</Text>
        </Animated.View>
        
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: anim, justifyContent: 'center' }]}>
          <LinearGradient
            colors={[THEME.forest, THEME.forestLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.toggleOnText}>ON</Text>
        </Animated.View>

        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX }] }]} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  toggleTrack: {
    width: 68,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    backgroundColor: THEME.paperDark,
    elevation: 2,
    overflow: 'hidden'
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    elevation: 3
  },
  toggleOnText: {
    position: 'absolute',
    left: 14,
    color: 'white',
    fontWeight: '800',
    fontSize: 11
  },
  toggleOffText: {
    color: THEME.inkLight,
    fontWeight: '700',
    fontSize: 11
  }
})
