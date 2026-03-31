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
import { zoneStyles as styles } from '@/components/zone-detail/ZoneDetailStyles'
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
        <Toast nativeID={id} action='success' variant='solid' style={styles.toast}>
          <View style={styles.toastDot} />
          <ToastTitle style={styles.toastTitle}>{message}</ToastTitle>
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.paper }}>
        <ActivityIndicator size='large' color={THEME.orchidMain} />
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.overviewContainer}>
          <Image
            source={{
              uri:
                zone.image_url ||
                'https://images.unsplash.com/photo-1596434452758-52fb58fce47c?auto=format&fit=crop&q=80&w=800'
            }}
            style={styles.coverImage}
          />
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={styles.coverGradient} />

          <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={THEME.ink} size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOpenEditProfile} style={styles.backButton}>
              <Settings size={24} color={THEME.ink} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <View style={styles.overviewContent}>
            <Text style={styles.zoneName}>{zone.name}</Text>
            <Text style={styles.zoneCity}>{zone.location_city}</Text>
          </View>

          <View style={styles.section}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10 }}
            >
              <Text style={styles.sectionTitle}>Linked Plant</Text>
              {linkedPlant && (
                <TouchableOpacity onPress={handleUnassignPlant}>
                  <Text style={{ fontSize: 13, color: THEME.orchidMain, fontWeight: '600' }}>Unassign</Text>
                </TouchableOpacity>
              )}
            </View>
            <LinkedPlantCard linkedPlant={linkedPlant} onAddPlant={() => handleOpenAssign('plant')} />
          </View>

          <View style={styles.section}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10 }}
            >
              <Text style={styles.sectionTitle}>Linked Device</Text>
              {linkedDevice && (
                <TouchableOpacity onPress={handleUnassignDevice}>
                  <Text style={{ fontSize: 13, color: THEME.orchidMain, fontWeight: '600' }}>Unassign</Text>
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
