import { THEME } from '@/components/devices/theme'
import { VStack } from '@/components/ui/vstack'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { ChevronRight } from 'lucide-react-native'
import React, { useCallback, useMemo } from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { deviceStyles as styles } from './DeviceDetailStyles'

export function AssignDeviceSheet({
  bottomSheetRef,
  availableZones,
  onAssign
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
  availableZones: any[]
  onAssign: (zone: any) => void
}) {
  const snapPoints = useMemo(() => ['50%', '67%'], [])

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />,
    []
  )

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetIndicator}
    >
      <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
        <Text style={styles.sheetTitle}>Assign Zone</Text>
        <Text style={styles.sheetDesc}>Select an available zone to assign this device to.</Text>
        <VStack style={{ gap: 12, marginTop: 16 }}>
          {availableZones.length > 0 ? (
            availableZones.map((z: any) => (
              <TouchableOpacity key={z.id} style={styles.sheetListItem} onPress={() => onAssign(z)}>
                <Image source={{ uri: z.image_url }} style={styles.sheetThumb} />
                <VStack style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.sheetItemTitle}>{z.name}</Text>
                  <Text style={styles.sheetItemSub}>{z.location_city}</Text>
                </VStack>
                <ChevronRight size={20} color={THEME.inkLight} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: THEME.inkLight }}>
              No available zones matching criteria.
            </Text>
          )}
        </VStack>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}
