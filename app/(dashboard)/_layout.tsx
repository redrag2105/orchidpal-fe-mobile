import { THEME } from '@/constants/theme'
import { useUIStore } from '@/hooks/useUIStore'
import { Tabs } from 'expo-router'
import { Cpu, Flower2, Home, Lightbulb, Settings } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Keyboard, Platform, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
    <TouchableOpacity
      className='flex-1 items-center justify-center'
      style={{ paddingVertical: isSticky ? 2 : 4 }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View className='h-[42px] w-[42px] items-center justify-center rounded-[14px]' style={animatedBgStyle}>
        {children}
      </Animated.View>
      <Animated.Text
        className='mt-[3px] font-sans text-[10px] font-semibold tracking-[0.1px]'
        style={[{ color: isFocused ? activeColor : THEME.inkMuted }, animatedTextStyle]}
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
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () =>
      setKeyboardVisible(true)
    )
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () =>
      setKeyboardVisible(false)
    )
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  const insets = useSafeAreaInsets()
  const isTabBarSticky = useUIStore((s) => s.isTabBarSticky)

  const springConfig = { damping: 14, stiffness: 90, mass: 0.8 }

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isKeyboardVisible ? 0 : 1, { duration: 200 }),
      transform: [{ translateY: withTiming(isKeyboardVisible ? 100 : 0, { duration: 200 }) }],
      paddingHorizontal: withSpring(isTabBarSticky ? 0 : 20, springConfig),
      paddingBottom: withSpring(isTabBarSticky ? 0 : Math.max(insets.bottom, 10), springConfig)
    }
  })

  const pillAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: withSpring(isTabBarSticky ? 0 : 28, springConfig),
      paddingBottom: withSpring(isTabBarSticky ? Math.max(insets.bottom - 16, 4) : 8, springConfig),
      paddingTop: withSpring(isTabBarSticky ? 11 : 8, springConfig)
    }
  })

  return (
    <Animated.View
      className='absolute bottom-0 left-0 right-0 items-center'
      style={wrapperAnimatedStyle}
      pointerEvents={isKeyboardVisible ? 'none' : 'auto'}
    >
      <Animated.View
        className='shadow-tab-bar elevation-12 w-full flex-row items-center justify-between border border-forest/10 bg-paper/[.98] px-1.5'
        style={pillAnimatedStyle}
      >
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
            <TabButton
              key={route.key}
              label={options.title}
              isFocused={isFocused}
              isHome={isHome}
              isSticky={isTabBarSticky}
              onPress={onPress}
            >
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
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <Settings size={22} color={color} strokeWidth={focused ? 2.4 : 1.9} />
        }}
      />
    </Tabs>
  )
}
