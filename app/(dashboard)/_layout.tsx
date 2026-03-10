import { Tabs } from 'expo-router'
import { Cpu, Flower2, Home, Lightbulb, Settings } from 'lucide-react-native'
import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  onPress,
  children
}: {
  label: string
  isFocused: boolean
  isHome: boolean
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
    opacity: withTiming(isFocused ? 1 : 0.6, { duration: 200 }),
    transform: [{ translateY: withTiming(isFocused ? 0 : 2, { duration: 150 }) }]
  }))

  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress} activeOpacity={0.8}>
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
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.tabBarPill}>
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
            <TabButton key={route.key} label={options.title} isFocused={isFocused} isHome={isHome} onPress={onPress}>
              {options.tabBarIcon?.({
                color: isFocused ? activeColor : THEME.inkMuted,
                focused: isFocused,
                size: 22
              })}
            </TabButton>
          )
        })}
      </View>
    </View>
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
        name='expert'
        options={{
          title: 'Insights',
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
