import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Cpu, Plus } from 'lucide-react-native'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { THEME, FONTS } from '@/components/dashboard/theme'

type AssignBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>
  snapPoints: string[]
  renderBackdrop: (props: any) => JSX.Element
  assignTarget: 'plant' | 'device' | null
  availablePlants: any[]
  availableDevices: any[]
  onLinkPlant: (p: any) => void
  onLinkDevice: (d: any) => void
}

export function AssignBottomSheet({
  bottomSheetRef,
  snapPoints,
  renderBackdrop,
  assignTarget,
  availablePlants,
  availableDevices,
  onLinkPlant,
  onLinkDevice
}: AssignBottomSheetProps) {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.sheetIndicator}
    >
      <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
        <Text style={styles.sheetTitle}>
          {assignTarget === 'plant' ? 'Assign Plant' : 'Link Device'}
        </Text>
        <Text style={styles.sheetDesc}>
          Select an available {assignTarget} to add to this zone.
        </Text>
        <VStack style={{ gap: 12, marginTop: 16 }}>
          {assignTarget === 'plant' &&
            availablePlants.map((p: any) => (
              <TouchableOpacity
                key={p.id}
                style={styles.sheetListItem}
                onPress={() => onLinkPlant(p)}
              >
                <Image source={{ uri: p.image_url }} style={styles.sheetThumb} />
                <VStack style={{ flex: 1 }}>
                  <Text style={styles.sheetItemTitle}>{p.nickname}</Text>
                  <Text style={styles.sheetItemSub}>{p.species_wiki.common_name}</Text>
                </VStack>
                <Plus size={20} color={THEME.orchidMain} />
              </TouchableOpacity>
            ))}
          {assignTarget === 'device' &&
            availableDevices.map((d: any) => (
              <TouchableOpacity
                key={d.id}
                style={styles.sheetListItem}
                onPress={() => onLinkDevice(d)}
              >
                <View style={styles.sheetDeviceIcon}>
                  <Cpu size={24} color={THEME.forest} />
                </View>
                <VStack style={{ flex: 1 }}>
                  <Text style={styles.sheetItemTitle}>{d.serial_number}</Text>
                  <Text style={styles.sheetItemSub}>
                    {Object.values(d.hardware_config.sensors).filter(Boolean).length} sensors
                  </Text>
                </VStack>
                <Plus size={20} color={THEME.orchidMain} />
              </TouchableOpacity>
            ))}
        </VStack>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  },
  sheetIndicator: {
    width: 48,
    height: 5,
    backgroundColor: THEME.paperDeep,
    borderRadius: 3,
    marginTop: 10
  },
  sheetContent: {
    padding: 24,
    paddingBottom: 40
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: FONTS.serif,
    color: THEME.ink
  },
  sheetDesc: {
    fontSize: 15,
    color: THEME.inkLight,
    marginTop: 4
  },
  sheetListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME.paper,
    borderRadius: 20,
    gap: 16
  },
  sheetThumb: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: THEME.paperDeep
  },
  sheetDeviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 121, 95, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sheetItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.ink
  },
  sheetItemSub: {
    fontSize: 14,
    color: THEME.inkLight,
    marginTop: 4
  }
})
