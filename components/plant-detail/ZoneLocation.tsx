import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { ChevronRight, MapPin, Trees } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export function ZoneLocation({
  currentZone,
  handleUnassignZone,
  handleOpenAssign
}: {
  currentZone: any
  handleUnassignZone: () => void
  handleOpenAssign: () => void
}) {
  const router = useRouter()

  return (
    <View className='mb-8 w-full gap-4'>
      <View className='flex-row items-center justify-between'>
        <Text className='font-serif text-[22px] font-bold text-ink'>Location</Text>
        {currentZone && (
          <TouchableOpacity onPress={handleUnassignZone}>
            <Text className='font-sans text-[13px] font-semibold text-orchid-main'>Unassign</Text>
          </TouchableOpacity>
        )}
      </View>

      {currentZone ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(`/zone/${currentZone.id}`)}
          className='shadow-soft flex-row items-center rounded-[24px] bg-white p-6'
        >
          <View className='mr-4 h-12 w-12 items-center justify-center rounded-full bg-[#4a795f]/10'>
            <MapPin size={24} color={THEME.forest} />
          </View>
          <VStack className='flex-1'>
            <Text className='font-serif text-lg font-bold text-ink'>{currentZone.name || 'Unnamed Zone'}</Text>
            <Text className='mt-1 font-sans text-sm text-ink-muted'>
              {currentZone.location_city || 'Your Home Environment'}
            </Text>
          </VStack>
          <ChevronRight size={20} color={THEME.inkMuted} />
        </TouchableOpacity>
      ) : (
        <View className='shadow-soft items-center rounded-[24px] bg-white px-6 py-8'>
          <Trees size={40} color={THEME.paperDeep} style={{ marginBottom: 16 }} />
          <View className='w-full items-center px-4'>
            <Text className='mb-6 text-center font-sans text-[15px] leading-[22px] text-ink-muted'>
              This plant hasn't been placed in any monitoring zone yet.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleOpenAssign}
            className='w-full flex-row items-center justify-center gap-3 rounded-full bg-forest px-8 py-[18px]'
            style={{
              shadowColor: THEME.forest,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 4
            }}
          >
            <MapPin size={20} color={THEME.paper} />
            <Text className='font-sans text-base font-semibold text-paper'>Assign to Zone</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
