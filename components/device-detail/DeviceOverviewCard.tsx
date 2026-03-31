import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/constants/theme'
import { Clock, Router, Signal } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'

export function DeviceOverviewCard({ device, isOnline }: { device: any; isOnline: boolean }) {
  return (
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
      <HStack className='items-center gap-4'>
        <View
          className={`h-16 w-16 items-center justify-center rounded-full ${isOnline ? 'bg-[#e8f5e9]' : 'bg-paper-dark'}`}
        >
          <Router size={32} color={isOnline ? THEME.forest : THEME.inkMuted} />
        </View>
        <VStack className='flex-1 gap-1'>
          <Text className='font-sans text-[20px] font-bold text-ink'>{device.serial_number}</Text>
          <Text className='font-mono text-xs text-ink-muted'>ID: {device.id}</Text>
          <HStack className='items-center gap-1.5'>
            <View className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-[#4caf50]' : 'bg-[#9e9e9e]'}`} />
            <Text className='font-sans text-sm font-medium text-ink-muted'>{isOnline ? 'Online' : 'Offline'}</Text>
          </HStack>
        </VStack>
      </HStack>

      <View className='my-5 h-[1px] bg-paper-deep' />

      <HStack className='justify-between'>
        <VStack className='gap-1'>
          <Text className='font-sans text-[13px] font-medium text-ink-light'>Signal</Text>
          <HStack className='items-center gap-1'>
            <Signal size={16} color={isOnline ? THEME.forest : THEME.inkMuted} />
            <Text className='font-sans text-[15px] font-semibold text-ink'>
              {isOnline ? `${device.signalStrength}%` : '--'}
            </Text>
          </HStack>
        </VStack>
        <VStack className='gap-1'>
          <Text className='font-sans text-[13px] font-medium text-ink-light'>Last Seen</Text>
          <HStack className='items-center gap-1'>
            <Clock size={16} color={THEME.inkMuted} />
            <Text className='font-sans text-[15px] font-semibold text-ink'>{device.last_online_at}</Text>
          </HStack>
        </VStack>
        <VStack className='gap-1'>
          <Text className='font-sans text-[13px] font-medium text-ink-light'>Firmware</Text>
          <Text className='font-sans text-[15px] font-semibold text-ink'>{device.firmware}</Text>
        </VStack>
      </HStack>
    </View>
  )
}
