/**
 * Onboarding Carousel Component
 * Premium welcome walkthrough with botanical luxury aesthetics
 * Theme synced with OrchidPal web app
 */

import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowRight, Droplets, Flower2, Leaf, Sparkles, Thermometer, Wifi } from 'lucide-react-native'
import React, { useCallback, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  TouchableOpacity,
  View,
  ViewToken
} from 'react-native'
import Animated, {
  Extrapolate,
  FadeInDown,
  FadeInUp,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

// Theme constants synced with web
const THEME = {
  paper: '#fdfcf8',
  paperDark: '#f0efea',
  ink: '#14281d',
  inkLight: '#3a5a40',
  orchidMain: '#9f5f80',
  orchidDeep: '#582c4d',
  forest: '#4a795f',
  forestLight: '#6a9b7f',
  clay: '#e6b8a2'
}

const FONTS = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' })
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface OnboardingSlide {
  id: string
  icon: React.ReactNode
  decorIcon?: React.ReactNode
  title: string
  titleAccent?: string
  subtitle: string
  description: string
  bgGradient: [string, string]
  accentColor: string
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon: <Flower2 size={56} color={THEME.forest} strokeWidth={1.2} />,
    decorIcon: <Leaf size={24} color={THEME.forestLight} strokeWidth={1.5} />,
    title: 'The Orchid',
    titleAccent: 'Whisperer.',
    subtitle: 'Expert Care System',
    description:
      'Listen to the silent language of your flora. An expert system designed for the most delicate living things.',
    bgGradient: ['#f0f6f2', '#e8f4eb'],
    accentColor: THEME.forest
  },
  {
    id: '2',
    icon: <Wifi size={56} color={THEME.orchidMain} strokeWidth={1.2} />,
    decorIcon: <Thermometer size={20} color={THEME.orchidDeep} strokeWidth={1.5} />,
    title: 'Precision',
    titleAccent: 'Sensing.',
    subtitle: 'Real-time Monitoring',
    description: 'Monitor temperature, humidity, light, and soil moisture with millimeter-accurate IoT sensors.',
    bgGradient: ['#fdf4f9', '#f9e8f2'],
    accentColor: THEME.orchidMain
  },
  {
    id: '3',
    icon: <Droplets size={56} color='#5f8a9f' strokeWidth={1.2} />,
    decorIcon: <Sparkles size={20} color={THEME.clay} strokeWidth={1.5} />,
    title: 'Automated',
    titleAccent: 'Care.',
    subtitle: 'Smart Automations',
    description:
      "Set up intelligent automations that respond to sensor data. Your orchids will thrive even when you're away.",
    bgGradient: ['#f4f8fa', '#e8f2f6'],
    accentColor: '#5f8a9f'
  },
  {
    id: '4',
    icon: <Sparkles size={56} color={THEME.orchidDeep} strokeWidth={1.2} />,
    decorIcon: <Flower2 size={20} color={THEME.orchidMain} strokeWidth={1.5} />,
    title: 'Expert',
    titleAccent: 'Guidance.',
    subtitle: 'AI + Human Experts',
    description: 'Get AI-powered recommendations and connect with orchid experts for personalized care advice.',
    bgGradient: ['#f8f4fd', '#f0e8fa'],
    accentColor: THEME.orchidDeep
  }
]

interface OnboardingCarouselProps {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingCarousel({ onComplete, onSkip }: OnboardingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null)
  const scrollX = useSharedValue(0)

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index)
    }
  }, [])

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  }

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.value = event.nativeEvent.contentOffset.x
    },
    [scrollX]
  )

  const goToNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true })
    } else {
      onComplete()
    }
  }, [currentIndex, onComplete])

  const renderSlide = useCallback(
    ({ item, index }: { item: OnboardingSlide; index: number }) => (
      <SlideItem item={item} index={index} scrollX={scrollX} />
    ),
    [scrollX]
  )

  const isLastSlide = currentIndex === SLIDES.length - 1
  const currentSlide = SLIDES[currentIndex]

  return (
    <View className='flex-1' style={{ backgroundColor: THEME.paper }}>
      {/* Decorative background circles */}
      <View
        style={{
          position: 'absolute',
          top: -100,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: currentSlide.bgGradient[0],
          opacity: 0.6
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 100,
          left: -60,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: currentSlide.bgGradient[1],
          opacity: 0.4
        }}
      />

      {/* Skip button */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <HStack className='items-center justify-between px-6 pt-4'>
          <Text style={{ color: THEME.inkLight, fontFamily: FONTS.serif, fontStyle: 'italic' }} className='text-sm'>
            OrchidPal
          </Text>
          <TouchableOpacity onPress={onSkip} className='px-4 py-2'>
            <Text style={{ color: THEME.inkLight }} className='text-sm font-medium'>
              Skip
            </Text>
          </TouchableOpacity>
        </HStack>
      </Animated.View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index
        })}
        contentContainerStyle={{ alignItems: 'center' }}
      />

      {/* Bottom Section */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <VStack className='gap-8 px-6 pb-10'>
          {/* Pagination dots */}
          <HStack className='justify-center gap-3'>
            {SLIDES.map((slide, index) => (
              <PaginationDot key={index} index={index} scrollX={scrollX} accentColor={slide.accentColor} />
            ))}
          </HStack>

          {/* Navigation button */}
          <TouchableOpacity
            className='flex-row items-center justify-center gap-3 rounded-full py-5 shadow-lg'
            style={{
              backgroundColor: isLastSlide ? THEME.forest : THEME.ink,
              shadowColor: isLastSlide ? THEME.forest : THEME.ink,
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 16,
              elevation: 8
            }}
            onPress={goToNext}
            activeOpacity={0.85}
          >
            <Text className='text-lg font-semibold text-white' style={{ letterSpacing: 0.5 }}>
              {isLastSlide ? 'Begin Journey' : 'Continue'}
            </Text>
            <ArrowRight size={20} color='white' strokeWidth={2} />
          </TouchableOpacity>
        </VStack>
      </Animated.View>
    </View>
  )
}

// Slide Item Component
interface SlideItemProps {
  item: OnboardingSlide
  index: number
  scrollX: SharedValue<number>
}

function SlideItem({ item, index, scrollX }: SlideItemProps) {
  const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH]

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.85, 1, 0.85], Extrapolate.CLAMP)
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolate.CLAMP)
    const translateY = interpolate(scrollX.value, inputRange, [40, 0, 40], Extrapolate.CLAMP)
    const rotate = interpolate(scrollX.value, inputRange, [-5, 0, 5], Extrapolate.CLAMP)

    return {
      transform: [{ scale }, { translateY }, { rotate: `${rotate}deg` }],
      opacity
    }
  })

  return (
    <View style={{ width: SCREEN_WIDTH }} className='justify-center px-6'>
      <Animated.View style={animatedStyle}>
        {/* Wrapper for positioning decorator outside overflow:hidden */}
        <View style={{ position: 'relative' }}>
          {/* Main Card */}
          <View
            className='overflow-hidden rounded-[2.5rem]'
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              shadowColor: item.accentColor,
              shadowOpacity: 0.15,
              shadowOffset: { width: 0, height: 12 },
              shadowRadius: 32,
              elevation: 12
            }}
          >
            {/* Gradient Header */}
            <LinearGradient
              colors={item.bgGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className='items-center px-8 pb-8 pt-10'
            >
              {/* Icon container */}
              <View className='relative'>
                <View
                  className='h-32 w-32 items-center justify-center rounded-full'
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    shadowColor: item.accentColor,
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 8 },
                    shadowRadius: 20,
                    elevation: 8
                  }}
                >
                  {item.icon}
                </View>
              </View>

              {/* Subtitle badge */}
              <View className='mt-5 rounded-full px-4 py-2' style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                <Text className='text-xs font-semibold uppercase tracking-wider' style={{ color: item.accentColor }}>
                  {item.subtitle}
                </Text>
              </View>
            </LinearGradient>

            {/* Content Section */}
            <VStack className='items-center gap-4 px-8 py-8'>
              {/* Title */}
              <Text
                className='text-center text-4xl leading-tight'
                style={{ color: THEME.ink, fontFamily: FONTS.serif, fontWeight: '600' }}
              >
                {item.title}{' '}
                <Text className='italic' style={{ color: item.accentColor, fontFamily: FONTS.serif }}>
                  {item.titleAccent}
                </Text>
              </Text>

              {/* Description */}
              <Text className='px-2 text-center text-base leading-7' style={{ color: THEME.inkLight }}>
                {item.description}
              </Text>
            </VStack>
          </View>

          {/* Floating decorator - positioned outside overflow:hidden card */}
          {item.decorIcon && (
            <View
              style={{
                position: 'absolute',
                top: 32,
                right: 32,
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 22,
                backgroundColor: 'white',
                shadowColor: item.accentColor,
                shadowOpacity: 0.25,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
                elevation: 6
              }}
            >
              {item.decorIcon}
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  )
}

// Pagination Dot Component
interface PaginationDotProps {
  index: number
  scrollX: SharedValue<number>
  accentColor: string
}

function PaginationDot({ index, scrollX, accentColor }: PaginationDotProps) {
  const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH]

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(scrollX.value, inputRange, [10, 32, 10], Extrapolate.CLAMP)
    const opacity = interpolate(scrollX.value, inputRange, [0.25, 1, 0.25], Extrapolate.CLAMP)
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP)

    return {
      width: withSpring(width, { damping: 20, stiffness: 300 }),
      opacity,
      transform: [{ scale }]
    }
  })

  return <Animated.View style={[animatedStyle, { backgroundColor: accentColor }]} className='h-3 rounded-full' />
}
