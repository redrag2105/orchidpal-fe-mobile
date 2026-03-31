import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { FONTS, THEME } from '@/constants/theme'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { Check } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface StatusFilterSheetProps {
  sheetRef: React.RefObject<BottomSheetModalMethods>
  tempPlantStatus: string
  plantStatus: string
  setTempPlantStatus: (status: string) => void
  setPlantStatus: (status: string) => void
}

export function StatusFilterSheet({
  sheetRef,
  tempPlantStatus,
  plantStatus,
  setTempPlantStatus,
  setPlantStatus
}: StatusFilterSheetProps) {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
      <Text style={styles.sheetTitle}>Filter by Status</Text>
      <View style={{ marginTop: 16, gap: 12 }}>
        {['All', 'Unassigned', 'Assigned'].map((status) => {
          const isSelected = tempPlantStatus === status
          return (
            <TouchableOpacity
              key={status}
              style={[styles.sheetListItem, isSelected && styles.sheetListItemActive]}
              onPress={() => setTempPlantStatus(status)}
            >
              <Text style={[styles.sheetItemTitle, isSelected && { color: THEME.forest }]}>{status}</Text>
              <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
      <HStack style={styles.sheetActions}>
        <TouchableOpacity style={styles.btnCancel} onPress={() => sheetRef.current?.dismiss()}>
          <Text style={styles.btnCancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnApply, tempPlantStatus === plantStatus && styles.btnApplyDisabled]}
          disabled={tempPlantStatus === plantStatus}
          onPress={() => {
            setPlantStatus(tempPlantStatus)
            sheetRef.current?.dismiss()
          }}
        >
          <Text style={styles.btnApplyText}>Apply</Text>
        </TouchableOpacity>
      </HStack>
    </BottomSheetScrollView>
  )
}

interface SpeciesFilterSheetProps {
  sheetRef: React.RefObject<BottomSheetModalMethods>
  availableSpecies: string[]
  tempPlantSpecies: string[]
  plantSpecies: string[]
  setTempPlantSpecies: React.Dispatch<React.SetStateAction<string[]>>
  setPlantSpecies: (species: string[]) => void
  toggleSpecies: (species: string) => void
}

export function SpeciesFilterSheet({
  sheetRef,
  availableSpecies,
  tempPlantSpecies,
  plantSpecies,
  setTempPlantSpecies,
  setPlantSpecies,
  toggleSpecies
}: SpeciesFilterSheetProps) {
  return (
    <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
      <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.sheetTitle}>Filter by Species</Text>
        <TouchableOpacity disabled={tempPlantSpecies.length === 0} onPress={() => setTempPlantSpecies([])}>
          <Text style={[styles.clearBtnText, tempPlantSpecies.length === 0 && styles.clearBtnTextDisabled]}>Clear</Text>
        </TouchableOpacity>
      </HStack>
      <View style={{ marginTop: 16, gap: 12 }}>
        {availableSpecies.map((species) => {
          const isSelected = tempPlantSpecies.includes(species)
          return (
            <TouchableOpacity
              key={species}
              style={[styles.sheetListItem, isSelected && styles.sheetListItemActive]}
              onPress={() => toggleSpecies(species)}
            >
              <Text style={[styles.sheetItemTitle, isSelected && { color: THEME.forest }]}>{species}</Text>
              <View style={[styles.checkboxOuter, isSelected && styles.checkboxOuterSelected]}>
                {isSelected && <Check size={14} color='white' />}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
      <HStack style={styles.sheetActions}>
        <TouchableOpacity style={styles.btnCancel} onPress={() => sheetRef.current?.dismiss()}>
          <Text style={styles.btnCancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btnApply,
            JSON.stringify([...tempPlantSpecies].sort()) === JSON.stringify([...plantSpecies].sort()) &&
              styles.btnApplyDisabled
          ]}
          disabled={JSON.stringify([...tempPlantSpecies].sort()) === JSON.stringify([...plantSpecies].sort())}
          onPress={() => {
            setPlantSpecies(tempPlantSpecies)
            sheetRef.current?.dismiss()
          }}
        >
          <Text style={styles.btnApplyText}>Apply</Text>
        </TouchableOpacity>
      </HStack>
    </BottomSheetScrollView>
  )
}

const styles = StyleSheet.create({
  sheetContent: { padding: 24, paddingBottom: 40 },
  sheetTitle: { fontSize: 20, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  sheetListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME.paper,
    borderRadius: 16
  },
  sheetListItemActive: { backgroundColor: 'rgba(74, 121, 95, 0.1)' },
  sheetItemTitle: { fontSize: 16, fontWeight: '600', color: THEME.ink },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: THEME.inkMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioOuterSelected: { borderColor: THEME.forest },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: THEME.forest },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: THEME.inkMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxOuterSelected: { borderColor: THEME.forest, backgroundColor: THEME.forest },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.paperDeep
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: THEME.inkMuted,
    alignItems: 'center'
  },
  btnCancelText: { fontSize: 16, fontWeight: '600', color: THEME.ink },
  btnApply: { flex: 1, paddingVertical: 14, borderRadius: 999, backgroundColor: THEME.forest, alignItems: 'center' },
  btnApplyDisabled: { opacity: 0.5 },
  btnApplyText: { fontSize: 16, fontWeight: '600', color: 'white' },
  clearBtnText: { fontSize: 14, fontWeight: '600', color: THEME.orchidMain },
  clearBtnTextDisabled: { color: THEME.inkMuted }
})
