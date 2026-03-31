import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/constants/theme'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { ChevronRight } from 'lucide-react-native'
import React, { useCallback, useMemo } from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'

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
      backgroundStyle={{
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32
      }}
      handleIndicatorStyle={{
        backgroundColor: THEME.paperDeep,
        width: 48,
        height: 5,
        borderRadius: 3,
        marginTop: 10
      }}
    >
      <BottomSheetScrollView style={{ width: '100%' }} contentContainerClassName='w-full px-6 pb-10'>
        <Text className='mb-2 w-full font-serif text-[20px] font-bold text-ink'>Assign Zone</Text>
        <Text className='mb-6 w-full font-sans text-[15px] leading-[22px] text-ink-muted'>
          Select an available zone to assign this device to.
        </Text>
        <VStack className='mt-4 w-full gap-3'>
          {availableZones.length > 0 ? (
            availableZones.map((z: any) => (
              <TouchableOpacity
                key={z.id}
                className='w-full flex-row items-center rounded-2xl border border-[rgba(20,40,29,0.05)] bg-white p-4'
                onPress={() => onAssign(z)}
              >
                <Image source={{ uri: z.image_url }} className='h-14 w-14 rounded-xl bg-paper-deep' />
                <VStack className='ml-4 flex-1'>
                  <Text className='mb-1 font-sans text-[17px] font-bold text-ink'>{z.name}</Text>
                  <Text className='font-sans text-[14px] text-ink-muted'>{z.location_city}</Text>
                </VStack>
                <ChevronRight size={20} color={THEME.inkLight} />
              </TouchableOpacity>
            ))
          ) : (
            <Text className='mt-5 text-center font-sans text-ink-light'>No available zones matching criteria.</Text>
          )}
        </VStack>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}
