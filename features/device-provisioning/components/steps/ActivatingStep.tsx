/**
 * Activating Step Component
 * Loading state while device is being activated
 */

import { Card } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { Loader2 } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

interface ActivatingStepProps {
  message?: string
}

export function ActivatingStep({ message = 'Activating device...' }: ActivatingStepProps) {
  const rotation = useSharedValue(0)

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1200 }), -1, false)
  }, [rotation])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }))

  return (
    <Card className='rounded-3xl bg-background-0 p-8' variant='elevated'>
      <VStack className='items-center gap-6'>
        <View className='h-24 w-24 items-center justify-center rounded-full bg-primary-100'>
          <Animated.View style={animatedStyle}>
            <Loader2 size={48} color='#8c4a7a' strokeWidth={1.5} />
          </Animated.View>
        </View>

        <Heading size='xl' className='text-center'>
          {message}
        </Heading>
        <Text size='sm' className='text-center text-typography-500'>
          Please wait while we connect your device to your account.
        </Text>
      </VStack>
    </Card>
  )
}
