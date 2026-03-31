import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/constants/theme'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { ChevronRight, MapPin, Trees } from 'lucide-react-native'
import React, { forwardRef, useCallback } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface AssignZoneSheetProps {
  snapPoints: string[]
  emptyZones: any[]
  handleConfirmLink: (zoneId: string) => void
}

export const AssignZoneSheet = forwardRef<BottomSheet, AssignZoneSheetProps>(
  ({ snapPoints, emptyZones, handleConfirmLink }, ref) => {
    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />,
      []
    )

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: THEME.paper, borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
        handleIndicatorStyle={{
          width: 40,
          height: 5,
          backgroundColor: THEME.paperDeep,
          borderRadius: 3,
          marginTop: 12
        }}
      >
        <BottomSheetScrollView contentContainerClassName='px-6 pb-10 w-full'>
          <Text className='w-full font-serif text-[28px] font-bold text-ink'>Assign Zone</Text>
          <Text className='mt-1.5 w-full font-sans text-base text-ink-light'>
            Select an available zone to move this plant to.
          </Text>

          <VStack className='mt-6 w-full gap-3'>
            {emptyZones.length > 0 ? (
              emptyZones.map((z: any) => (
                <TouchableOpacity
                  key={z.id}
                  className='w-full flex-row items-center gap-4 rounded-[20px] border border-[#14281d]/5 bg-white p-4'
                  onPress={() => handleConfirmLink(z.id)}
                >
                  <View className='bg-paper-deep h-[50px] w-[50px] items-center justify-center rounded-full'>
                    <MapPin size={24} color={THEME.forest} />
                  </View>
                  <VStack className='flex-1'>
                    <Text className='font-sans text-[17px] font-semibold text-ink'>{z.name || 'Unnamed Zone'}</Text>
                    <Text className='mt-1 font-sans text-sm text-ink-muted'>
                      {z.location_city || 'Your Environment'}
                    </Text>
                  </VStack>
                  <ChevronRight size={20} color={THEME.inkLight} />
                </TouchableOpacity>
              ))
            ) : (
              <View className='items-center py-10 opacity-80'>
                <Trees size={48} color={THEME.paperDeep} style={{ marginBottom: 16 }} />
                <Text className='text-center font-sans text-base text-ink-light'>
                  No empty zones available to place this plant.
                </Text>
              </View>
            )}
          </VStack>
        </BottomSheetScrollView>
      </BottomSheet>
    )
  }
)
