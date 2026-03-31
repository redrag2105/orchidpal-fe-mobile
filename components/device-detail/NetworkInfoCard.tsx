import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import React from 'react'
import { View } from 'react-native'

export function NetworkInfoCard({ device }: { device: any }) {
  return (
    <>
      <Text className='mb-1 mt-2 font-serif text-[18px] font-bold text-ink'>Network & Info</Text>
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
        <VStack className='gap-4'>
          <HStack className='justify-between'>
            <Text className='font-sans text-[15px] text-ink-light'>IP Address</Text>
            <Text className='font-sans text-[15px] font-semibold text-ink'>{device.ip}</Text>
          </HStack>
          <HStack className='justify-between'>
            <Text className='font-sans text-[15px] text-ink-light'>MAC Address</Text>
            <Text className='font-sans text-[15px] font-semibold text-ink'>{device.hw_address}</Text>
          </HStack>
          <HStack className='justify-between'>
            <Text className='font-sans text-[15px] text-ink-light'>Update Method</Text>
            <Text className='font-sans text-[15px] font-semibold text-ink'>OTA Enabled</Text>
          </HStack>
        </VStack>
      </View>
    </>
  )
}
