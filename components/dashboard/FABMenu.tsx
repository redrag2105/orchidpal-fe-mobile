import { Text } from '@/components/ui/text'
import { useFocusEffect, useRouter } from 'expo-router'
import { Cpu, Flower2, Leaf, Plus } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { THEME } from './theme'

export interface FABAction {
  key: string
  label: string
  icon: React.ElementType
  color: string
  route: string
}

export interface FABMenuProps {
  actions?: FABAction[]
}

export function FABMenu({ actions: customActions }: FABMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsOpen(false)
      }
    }, [])
  )

  // Order: closest to FAB first (zone -> plant -> device)
  const defaultActions = [
    { key: 'zone', label: 'Add Zone', icon: Leaf, color: THEME.gold, route: '/(modals)/add-zone' },
    { key: 'plant', label: 'Add Plant', icon: Flower2, color: THEME.orchidMain, route: '/(modals)/add-plant' },
    { key: 'device', label: 'Add Device', icon: Cpu, color: THEME.forest, route: '/(modals)/device-setup' }
  ]

  const actions = customActions || defaultActions

  return (
    <>
      {/* Overlay when menu is open */}
      {isOpen && <TouchableOpacity style={styles.fabOverlay} activeOpacity={1} onPress={() => setIsOpen(false)} />}

      {/* FAB Container */}
      <View style={styles.fabContainer}>
        {/* Action items - reverse animation so nearest to FAB appears first */}
        {isOpen &&
          actions.map((action, index) => (
            <Animated.View
              key={action.key}
              entering={FadeInUp.delay((actions.length - 1 - index) * 80)
                .duration(250)
                .springify()}
            >
              <TouchableOpacity
                style={styles.fabAction}
                onPress={() => {
                  setIsOpen(false)
                  router.push(action.route as any)
                }}
                activeOpacity={0.85}
              >
                <View style={[styles.fabActionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={18} color='white' strokeWidth={2} />
                </View>
                <View style={styles.fabActionLabel}>
                  <Text style={styles.fabActionText}>{action.label}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

        {/* Main FAB button */}
        <TouchableOpacity
          style={[styles.fab, isOpen && styles.fabOpen]}
          onPress={() => setIsOpen(!isOpen)}
          activeOpacity={0.9}
        >
          <Animated.View
            style={{
              transform: [{ rotate: isOpen ? '45deg' : '0deg' }]
            }}
          >
            <Plus size={28} color='white' strokeWidth={2.5} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  fabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  fabContainer: {
    position: 'absolute',
    bottom: 130,
    right: 20,
    alignItems: 'flex-end',
    gap: 12,
    zIndex: 100
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.forest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10
  },
  fabOpen: {
    backgroundColor: THEME.orchidMain,
    shadowColor: THEME.orchidMain
  },
  fabAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  fabActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  fabActionLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  fabActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.ink
  }
})
