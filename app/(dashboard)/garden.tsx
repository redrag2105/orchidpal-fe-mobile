/**
 * Garden Screen
 * Manage orchid zones and plants
 */

import { Flower2, Plus } from 'lucide-react-native'
import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'

const THEME = {
  paper: '#fdfcf8',
  ink: '#14281d',
  inkLight: '#3a5a40',
  orchidMain: '#9f5f80',
  forest: '#4a795f',
}

export default function GardenScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <HStack style={styles.header}>
          <VStack>
            <Text style={styles.headerTitle}>My Garden</Text>
            <Text style={styles.headerSubtitle}>2 zones • 15 orchids</Text>
          </VStack>
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={20} color="white" strokeWidth={2} />
          </TouchableOpacity>
        </HStack>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Empty state for now */}
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Flower2 size={48} color={THEME.orchidMain} strokeWidth={1} />
            </View>
            <Text style={styles.emptyTitle}>Your Garden Zones</Text>
            <Text style={styles.emptyDesc}>
              Create zones to organize your orchids by location, light conditions, or care needs.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.paper,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.ink,
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.inkLight,
    marginTop: 2,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(159,95,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.ink,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: THEME.inkLight,
    textAlign: 'center',
    lineHeight: 20,
  },
})
