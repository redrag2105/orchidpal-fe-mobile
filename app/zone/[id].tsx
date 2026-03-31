import { Text } from '@/components/ui/text'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Settings } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AutomationRulesList, LinkedDeviceCard, LinkedPlantCard } from '@/components/zone'
import { ZoneAiSuggestionCard } from '@/components/zone-detail/ZoneAiSuggestionCard'
import { THEME } from '@/constants/theme'

import { ZoneActionModals } from '@/components/zone-detail/ZoneActionModals'
import { useZoneDetailLogic } from '@/components/zone-detail/useZoneDetailLogic'

export default function ZoneDetailScreen() {
  const { id } = useLocalSearchParams()
  const toast = useToast()

  const showToast = (message: string) => {
    toast.show({
      placement: 'bottom',
      duration: 1500,
      render: ({ id }) => (
        <Toast
          nativeID={id}
          action='success'
          variant='solid'
          className='elevation-6 mb-20 flex-row items-center gap-2 rounded-full bg-forest px-5 py-3 shadow-[0_6px_12px_rgba(74,121,95,0.3)]'
        >
          <View className='h-2 w-2 rounded-full bg-gold' />
          <ToastTitle className='font-sans text-[15px] font-semibold text-white'>{message}</ToastTitle>
        </Toast>
      )
    })
  }

  const logic = useZoneDetailLogic(id as string, showToast)
  const {
    loading,
    zone,
    router,
    linkedPlant,
    linkedDevice,
    telemetryData,
    activeRelays,
    activeSensors,
    relayState,
    hasRelayChanged,
    toggleRelay,
    saveRelayState,
    handleOpenAssign,
    handleUnassignPlant,
    handleUnassignDevice,
    handleOpenEditProfile,
    rules,
    handleOpenRule,
    isAnalyzing,
    handleAnalyze,
    aiSuggestion,
    setAiSuggestion,
    handleApproveAiRule,
    summarizeAiLogic
  } = logic

  if (loading || !zone) {
    return (
      <View className='flex-1 items-center justify-center bg-paper'>
        <ActivityIndicator size='large' color={THEME.orchidMain} />
      </View>
    )
  }

  return (
    <View className='flex-1 bg-paper'>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View className='relative w-full' style={{ height: 380 }}>
          <Image
            source={{
              uri:
                zone.image_url ||
                'https://images.unsplash.com/photo-1596434452758-52fb58fce47c?auto=format&fit=crop&q=80&w=800'
            }}
            className='h-full w-full'
            style={{ resizeMode: 'cover' }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            className='absolute left-0 right-0 top-0'
            style={{ height: 120 }}
          />

          <SafeAreaView
            edges={['top']}
            className='absolute left-0 right-0 top-0 flex-row items-center justify-between px-5 pt-2.5'
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className='elevation-4 h-11 w-11 items-center justify-center rounded-full bg-[rgba(253,252,248,0.9)] shadow-[0_4px_10px_rgba(0,0,0,0.15)]'
            >
              <ArrowLeft color={THEME.ink} size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenEditProfile}
              className='elevation-4 h-11 w-11 items-center justify-center rounded-full bg-[rgba(253,252,248,0.9)] shadow-[0_4px_10px_rgba(0,0,0,0.15)]'
            >
              <Settings size={24} color={THEME.ink} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View className='-mt-10 gap-8 rounded-tr-[80px] bg-paper p-6 pt-8'>
          <View className='mb-6'>
            <Text className='font-serif text-4xl font-extrabold leading-[42px] tracking-tight text-ink'>
              {zone.name}
            </Text>
            <Text className='mt-1 font-sans text-base text-ink-muted'>{zone.location_city}</Text>
          </View>

          <View className='gap-4'>
            <View className='flex-row items-center justify-between pr-2.5'>
              <Text className='font-serif text-xl font-bold text-ink'>Linked Plant</Text>
              {linkedPlant && (
                <TouchableOpacity onPress={handleUnassignPlant}>
                  <Text className='font-sans text-[13px] font-semibold text-orchid-main'>Unassign</Text>
                </TouchableOpacity>
              )}
            </View>
            <LinkedPlantCard linkedPlant={linkedPlant} onAddPlant={() => handleOpenAssign('plant')} />
          </View>

          <View className='gap-4'>
            <View className='flex-row items-center justify-between pr-2.5'>
              <Text className='font-serif text-xl font-bold text-ink'>Linked Device</Text>
              {linkedDevice && (
                <TouchableOpacity onPress={handleUnassignDevice}>
                  <Text className='font-sans text-[13px] font-semibold text-orchid-main'>Unassign</Text>
                </TouchableOpacity>
              )}
            </View>
            <LinkedDeviceCard
              linkedDevice={linkedDevice}
              activeSensors={activeSensors}
              activeRelays={activeRelays}
              relayState={relayState}
              hasRelayChanged={hasRelayChanged}
              onToggleRelay={toggleRelay}
              onSaveRelayState={saveRelayState}
              onLinkDevice={() => handleOpenAssign('device')}
              telemetryData={telemetryData}
            />
          </View>

          {linkedDevice && (activeSensors > 0 || activeRelays.length > 0) && (
            <AutomationRulesList rules={rules} onOpenRule={handleOpenRule} />
          )}

          {linkedDevice && (
            <ZoneAiSuggestionCard
              isAnalyzing={isAnalyzing}
              handleAnalyze={handleAnalyze}
              aiSuggestion={aiSuggestion}
              setAiSuggestion={setAiSuggestion}
              handleApproveAiRule={handleApproveAiRule}
              summarizeAiLogic={summarizeAiLogic}
            />
          )}
        </View>
      </ScrollView>

      <ZoneActionModals logic={logic} />
    </View>
  )
}
