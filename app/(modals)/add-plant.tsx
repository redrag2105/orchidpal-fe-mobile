import {
  Step1Species,
  Step2Name,
  Step3Photo,
  Step4Care,
  Step5Zone,
  Step6Review,
  type PlantData
} from '@/components/add-plant'
import { CancelConfirmModal } from '@/components/iot/device-setup'
import { THEME } from '@/constants/theme'
import { useAssignPlantToZone } from '@/hooks/mutations/useAssignPlantToZone'
import { useCreatePlant } from '@/hooks/mutations/useCreatePlant'
import { useSpecies } from '@/hooks/queries/useSpecies'
import { useZones } from '@/hooks/queries/useZones'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { CheckCircle2, ChevronLeft, X } from 'lucide-react-native'
import React, { useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated'

const TOTAL_STEPS = 6

export default function AddPlantStoryScreen() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const [plantData, setPlantData] = useState<PlantData>({
    nickname: '',
    species_id: '',
    zone_id: null,
    planted_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3?auto=format&fit=crop&q=80&w=300'
  })

  const [savedNickname, setSavedNickname] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [newBrandPlantId, setNewBrandPlantId] = useState('')

  const { data: speciesRes, isLoading: isSpeciesLoading } = useSpecies()
  const speciesList = speciesRes?.data || []

  const { data: zonesList, isLoading: isZonesLoading } = useZones()
  const { mutateAsync: createPlantMutate, isPending: isSubmitting } = useCreatePlant()
  const { mutateAsync: assignPlantMutate } = useAssignPlantToZone()

  const currentSpecies = speciesList.find((s: any) => s.id === plantData.species_id)
  const currentZone = (zonesList || []).find((z: any) => z.id === plantData.zone_id)

  const enteringAnim = direction === 'forward' ? SlideInRight.duration(400) : SlideInLeft.duration(400)
  const exitingAnim = direction === 'forward' ? SlideOutLeft.duration(400) : SlideOutRight.duration(400)

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const goToStep = (targetStep: number) => {
    Keyboard.dismiss()
    setDirection(targetStep > step ? 'forward' : 'backward')
    if (targetStep > step) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    setTimeout(() => setStep(targetStep), 50)
  }

  const nextStep = () => {
    if (step === 2) setSavedNickname(plantData.nickname || '')
    if (step < TOTAL_STEPS) goToStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) goToStep(step - 1)
    else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setIsConfirmModalVisible(true)
    }
  }

  const handleFinish = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    try {
      const payload = {
        species_id: plantData.species_id,
        nickname: plantData.nickname,
        planted_at: plantData.planted_at.split('T')[0], // yyyy-mm-dd
        image_url: plantData.image_url
      }

      // 1. Create plant without zone_id
      const res = await createPlantMutate(payload as any)
      const newPlantId = res?.data?.id || res?.id || ''

      // 2. Assign plant to zone if chosen
      if (plantData.zone_id && newPlantId) {
        await assignPlantMutate({ plant_id: newPlantId, zone_id: plantData.zone_id })
      }

      setNewBrandPlantId(newPlantId)
      setIsSuccess(true)
      setTimeout(() => {
        router.replace(`/plant/${newPlantId}`)
      }, 3000)
    } catch (err) {
      console.error(err)
      router.back()
    }
  }

  const renderProgressBar = () => {
    return (
      <View className='flex-row gap-2 px-5 pt-[60px]'>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={index}
            className='h-1 flex-1 rounded-full'
            style={{ backgroundColor: index < step ? THEME.forest : 'rgba(255, 255, 255, 0.4)' }}
          />
        ))}
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <View className='mt-4 flex-row justify-between px-5'>
        <TouchableOpacity onPress={prevStep} className='p-2'>
          <ChevronLeft size={28} color={THEME.ink} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            setIsConfirmModalVisible(true)
          }}
          className='p-2'
        >
          <X size={28} color={THEME.ink} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderStep = () => {
    if (isSuccess) {
      return (
        <Animated.View
          entering={enteringAnim}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <CheckCircle2 size={100} color={THEME.forest} className='mb-6' />
          <Text className='mb-3 text-center font-serif text-[32px] text-ink'>Plant Created!</Text>
          <Text className='mb-10 text-center font-sans text-[16px] text-ink-muted'>Redirecting to detail page...</Text>
          <TouchableOpacity
            onPress={() => router.replace(`/plant/${newBrandPlantId}`)}
            className='rounded-[30px] bg-forest px-8 py-4'
          >
            <Text className='font-sans text-[16px] font-semibold text-paper'>Let's see</Text>
          </TouchableOpacity>
        </Animated.View>
      )
    }

    const commonProps = {
      plantData,
      setPlantData,
      nextStep,
      enteringAnim,
      exitingAnim
    }

    switch (step) {
      case 1:
        return (
          <Step1Species
            {...commonProps}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSpeciesLoading={isSpeciesLoading}
            filteredSpecies={speciesList.filter(
              (s: any) =>
                s.common_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            currentSpecies={currentSpecies}
          />
        )
      case 2:
        return <Step2Name {...commonProps} savedNickname={savedNickname} />
      case 3:
        return <Step3Photo {...commonProps} />
      case 4:
        return <Step4Care {...commonProps} currentSpecies={currentSpecies} />
      case 5:
        return <Step5Zone {...commonProps} isZonesLoading={isZonesLoading} zonesList={zonesList || []} />
      case 6:
        return (
          <Step6Review
            {...commonProps}
            currentSpecies={currentSpecies}
            currentZone={currentZone}
            goToStep={goToStep}
            isSubmitting={isSubmitting}
            handleFinish={handleFinish}
          />
        )
      default:
        return null
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <LinearGradient colors={[THEME.paper, THEME.paperDeep]} style={{ flex: 1 }}>
        {renderProgressBar()}
        {renderHeader()}
        {renderStep()}
      </LinearGradient>

      <CancelConfirmModal
        visible={isConfirmModalVisible}
        title='Discard Changes?'
        message='Are you sure you want to stop adding this plant? Your progress will be lost.'
        cancelText='Keep Editing'
        confirmText='Discard'
        onCancel={() => setIsConfirmModalVisible(false)}
        onConfirm={() => {
          setIsConfirmModalVisible(false)
          router.back()
        }}
      />
    </KeyboardAvoidingView>
  )
}
