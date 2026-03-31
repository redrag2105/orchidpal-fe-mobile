import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { Activity, ChevronRight, Plus } from 'lucide-react-native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

export function ZoneAssignmentCard({
  isAssigned,
  device,
  handleUnassignDevice,
  handleOpenAssign
}: {
  isAssigned: boolean
  device: any
  handleUnassignDevice: () => void
  handleOpenAssign: () => void
}) {
  const router = useRouter()

  return (
    <>
      <View className='flex-row items-center justify-between'>
        <Text className='mb-1 mt-2 font-serif text-[18px] font-bold text-ink'>Zone Assignment</Text>
        {isAssigned && (
          <TouchableOpacity onPress={handleUnassignDevice} className='mr-5 mt-2.5'>
            <Text className='font-sans text-[13px] font-semibold text-orchid-main'>Unassign</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        className='rounded-[20px] bg-white p-5'
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 3
        }}
      >
        {isAssigned ? (
          <VStack className='gap-3'>
            <Text className='font-sans text-[15px] text-ink-light'>Currently monitoring:</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push(('/zone/' + device.zoneId) as any)}>
              <View className='flex-row items-center gap-3 rounded-2xl bg-[rgba(74,121,95,0.08)] p-4'>
                <Activity size={20} color={THEME.forest} />
                <Text className='font-sans text-base font-semibold text-forest'>{device.zoneName}</Text>
                <ChevronRight size={20} color={THEME.forest} style={{ marginLeft: 'auto' }} />
              </View>
            </TouchableOpacity>
          </VStack>
        ) : (
          <VStack className='items-center gap-4 py-2'>
            <Text className='px-5 text-center font-sans text-[14px] leading-5 text-ink-light'>
              This device is not linked to any zone yet. Link it to start collecting data.
            </Text>
            <TouchableOpacity
              className='w-full flex-row items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5'
              onPress={handleOpenAssign}
            >
              <Plus size={20} color='white' />
              <Text className='font-sans text-base font-semibold text-white'>Assign to a Zone</Text>
            </TouchableOpacity>
          </VStack>
        )}
      </View>
    </>
  )
}
