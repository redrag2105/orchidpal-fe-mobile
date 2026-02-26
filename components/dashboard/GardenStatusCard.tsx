import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export type GardenStatus = {
  happy: number
  warning: number
  critical: number
}

type Props = {
  status: GardenStatus
  onOpenGardenList: () => void
}

export function GardenStatusCard({ status, onOpenGardenList }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Garden status</Text>
        <Text style={styles.subtitle}>Your connected plants</Text>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusPill, { backgroundColor: '#ecfdf3' }]}>
          <View style={[styles.statusDot, { backgroundColor: '#16a34a' }]} />
          <View>
            <Text style={styles.statusLabel}>Happy</Text>
            <Text style={styles.statusValue}>{status.happy} plants</Text>
          </View>
        </View>

        <View style={[styles.statusPill, { backgroundColor: '#fef9c3' }]}>
          <View style={[styles.statusDot, { backgroundColor: '#eab308' }]} />
          <View>
            <Text style={styles.statusLabel}>Needs attention</Text>
            <Text style={styles.statusValue}>{status.warning} plants</Text>
          </View>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusPill, { backgroundColor: '#fee2e2' }]}>
          <View style={[styles.statusDot, { backgroundColor: '#dc2626' }]} />
          <View>
            <Text style={styles.statusLabel}>Critical</Text>
            <Text style={styles.statusValue}>{status.critical} plant</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={onOpenGardenList}>
          <Text style={styles.secondaryButtonText}>Open garden list</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.98)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  headerRow: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 10,
  },
  statusPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  statusValue: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.55)',
  },
  secondaryButton: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
})

