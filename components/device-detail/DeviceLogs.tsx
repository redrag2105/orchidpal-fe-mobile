import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { AlertTriangle, CheckCircle, Router } from 'lucide-react-native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

export function DeviceLogs({ logsData, serialNumber, id }: { logsData: any; serialNumber: string; id: string }) {
  const router = useRouter()

  if (!logsData?.data || logsData.data.length === 0) {
    return (
      <View
        className='rounded-[20px] bg-white pb-2'
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 3
        }}
      >
        <View className='items-center justify-center p-6'>
          <Text className='mt-2 font-sans text-sm text-ink-light'>No recent logs for this device</Text>
        </View>
      </View>
    )
  }

  return (
    <View
      className='rounded-[20px] bg-white pb-2'
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3
      }}
    >
      {(logsData.data || []).map((log: any, index: number) => {
        const isAction = log.action && !log.action.includes('error') && !log.action.includes('fail')
        const isAlert = log.action && (log.action.includes('error') || log.action.includes('fail'))

        return (
          <View key={log._id}>
            <HStack className='items-start gap-4 px-5 py-4'>
              <View className='mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-paper-deep'>
                {isAction && <CheckCircle size={16} color={THEME.forest} />}
                {isAlert && <AlertTriangle size={16} color={THEME.gold} />}
                {!isAction && !isAlert && <Router size={16} color={THEME.inkLight} />}
              </View>
              <VStack className='flex-1'>
                <Text className='font-sans text-[15px] leading-[22px] text-ink'>{log.action}</Text>
                <Text className='mt-1 font-sans text-[13px] text-ink-muted'>
                  {new Date(log.created_at).toLocaleString()}
                </Text>
              </VStack>
            </HStack>
            {index < logsData.data.length - 1 && <View className='ml-[68px] mr-5 h-[1px] bg-paper-deep' />}
          </View>
        )
      })}
      {logsData.data.length > 0 && logsData.total > 4 && (
        <TouchableOpacity
          className='items-center border-t border-[rgba(0,0,0,0.05)] p-4'
          onPress={() =>
            router.push({ pathname: `/device/${id}/logs`, params: { serial_number: serialNumber } } as any)
          }
        >
          <Text className='font-sans text-[14px] font-semibold text-forest'>View Complete Logs</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
