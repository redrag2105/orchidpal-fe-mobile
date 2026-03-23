
import { Tabs } from 'expo-router'
import { Cpu, Flower2, Home, Lightbulb, Settings } from 'lucide-react-native'
import React, { useState, useEffect } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View, Keyboard } from 'react-native'
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUIStore } from '@/hooks/useUIStore'

const THEME = {
  paper: '#fdfcf8',
  ink: '#14281d',
  forest: '#4a795f',
  inkMuted: '#8a9a90',
  orchidMain: '#9f5f80'
}

// Animated tab button component
function TabButton({
  label,
  isFocused,
  isHome,
  isSticky,
  onPress,
  children
}: {
  label: string
  isFocused: boolean
  isHome: boolean
  isSticky: boolean
  onPress: () => void
  children: React.ReactNode
}) {
  const activeColor = isHome ? THEME.orchidMain : THEME.forest

  const animatedBgStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      isFocused ? (isHome ? 'rgba(159, 95, 128, 0.12)' : 'rgba(74, 121, 95, 0.12)') : 'transparent',
      { duration: 200 }
    ),
    transform: [{ scale: withTiming(isFocused ? 1 : 0.95, { duration: 150 }) }]
  }))

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSticky ? 0 : isFocused ? 1 : 0.6, { duration: 200 }),
    height: withTiming(isSticky ? 0 : 16, { duration: 200 }),
    transform: [{ translateY: withTiming(isFocused ? 0 : 2, { duration: 150 }) }],
    marginTop: withTiming(isSticky ? 0 : 3, { duration: 200 })
  }))

  return (
    <TouchableOpacity style={[styles.tabButton, { paddingVertical: isSticky ? 2 : 4 }]} onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.tabButtonInner, animatedBgStyle]}>{children}</Animated.View>
      <Animated.Text
        style={[styles.tabLabel, { color: isFocused ? activeColor : THEME.inkMuted }, animatedTextStyle]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  )
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true))
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false))
    return () => { showSub.remove(); hideSub.remove() }
  }, [])
  const insets = useSafeAreaInsets()
  const isTabBarSticky = useUIStore((s) => s.isTabBarSticky)
  // const setTabBarSticky = useUIStore((s) => s.setTabBarSticky)

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isKeyboardVisible ? 0 : 1, { duration: 200 }),
      transform: [{ translateY: withTiming(isKeyboardVisible ? 100 : 0, { duration: 200 }) }],
      paddingHorizontal: withSpring(isTabBarSticky ? 0 : 20, { damping: 14, stiffness: 90, mass: 0.8 }),
      paddingBottom: withSpring(isTabBarSticky ? 0 : Math.max(insets.bottom, 10), { damping: 14, stiffness: 90, mass: 0.8 })
    }
  })

  const pillAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderBottomLeftRadius: withSpring(isTabBarSticky ? 0 : 28, { damping: 14, stiffness: 90, mass: 0.8 }),
      borderBottomRightRadius: withSpring(isTabBarSticky ? 0 : 28, { damping: 14, stiffness: 90, mass: 0.8 }),
      borderTopLeftRadius: withSpring(isTabBarSticky ? 24 : 28, { damping: 14, stiffness: 90, mass: 0.8 }),
      borderTopRightRadius: withSpring(isTabBarSticky ? 24 : 28, { damping: 14, stiffness: 90, mass: 0.8 }),
      paddingBottom: withSpring(isTabBarSticky ? Math.max(insets.bottom - 4, 4) : 8, { damping: 14, stiffness: 90, mass: 0.8 }),
      paddingTop: withSpring(isTabBarSticky ? 4 : 8, { damping: 14, stiffness: 90, mass: 0.8 }),
    }
  })

  return (
    <Animated.View style={[styles.tabBarWrapper, wrapperAnimatedStyle]} pointerEvents={isKeyboardVisible ? 'none' : 'auto'}>
      <Animated.View style={[styles.tabBarPill, pillAnimatedStyle]}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          const isHome = index === 2

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const activeColor = isHome ? THEME.orchidMain : THEME.forest

          return (
            <TabButton key={route.key} label={options.title} isFocused={isFocused} isHome={isHome} isSticky={isTabBarSticky} onPress={onPress}>
              {options.tabBarIcon?.({
                color: isFocused ? activeColor : THEME.inkMuted,
                focused: isFocused,
                size: 22
              })}
            </TabButton>
          )
        })}
      </Animated.View>
    </Animated.View>
  )
}

export default function DashboardLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'none',
        lazy: true,
        sceneStyle: { backgroundColor: THEME.paper }
      }}
    >
      <Tabs.Screen
        name='garden'
        options={{
          title: 'Garden',
          tabBarIcon: ({ color, focused }) => <Flower2 size={22} color={color} strokeWidth={focused ? 2.4 : 1.9} />
        }}
      />
      <Tabs.Screen
        name='ai-chat'
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, focused }) => <Lightbulb size={22} color={color} strokeWidth={focused ? 2.4 : 1.9} />
        }}
      />
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Home size={22} color={color} strokeWidth={focused ? 2.4 : 1.9} />
        }}
      />
      <Tabs.Screen
        name='devices'
        options={{
          title: 'Devices',
          tabBarIcon: ({ color, focused }) => <Cpu size={22} color={color} strokeWidth={focused ? 2.4 : 1.9} />
        }}
      />
      <Tabs.Screen
        name='store'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <Settings size={22} color={color} strokeWidth={focused ? 2.4 : 1.9} />
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  tabBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(253, 252, 248, 0.98)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(74, 121, 95, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 8,
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4
  },
  tabButtonInner: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    marginTop: 3,
    letterSpacing: 0.1
  }
})

