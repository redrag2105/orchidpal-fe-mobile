import { FONTS, THEME } from '@/components/dashboard/theme'
import { CancelConfirmModal, RuleSetupModal } from '@/components/iot'
import { Text } from '@/components/ui/text'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { useAssignDeviceToZone } from '@/hooks/mutations/useAssignDeviceToZone'
import { useAssignPlantToZone } from '@/hooks/mutations/useAssignPlantToZone'
import { useControlDevice } from '@/hooks/mutations/useControlDevce'
import { useUpdateAutomationRules } from '@/hooks/mutations/useUpdateAutomationRules'
import { useDevices } from '@/hooks/queries/useDevices'
import { usePlants } from '@/hooks/queries/usePlants'
import { useZoneDetail } from '@/hooks/queries/useZoneDetail'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AssignBottomSheet, AutomationRulesList, LinkedDeviceCard, LinkedPlantCard } from '@/components/zone'

export default function ZoneDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const toast = useToast()

  const { data: zoneData, isLoading: loading } = useZoneDetail(id as string)
  const zone = zoneData || null
  const { data: plantsData } = usePlants()
  const { data: devicesData } = useDevices()

  const { mutateAsync: mutateAutomationRules } = useUpdateAutomationRules()
  const { mutateAsync: assignDevice } = useAssignDeviceToZone()
  const { mutateAsync: assignPlant } = useAssignPlantToZone()
  const { mutateAsync: controlDeviceMutate } = useControlDevice()

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    onConfirm: () => {}
  })

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    setConfirmModal({ visible: true, title, message, onConfirm, confirmText, cancelText })
  }

  const linkedPlant = zone?.my_plants?.[0]
  const linkedDevice = zone?.devices?.[0]
  const activeRelays = linkedDevice?.hardware_config
    ? (Object.values(linkedDevice.hardware_config.relays).filter((v: any) => v !== 'null') as string[])
    : []
  const activeSensors = linkedDevice?.hardware_config
    ? Object.values(linkedDevice.hardware_config.sensors).filter(Boolean).length
    : 0
  const rules = zone?.automation_rules || []

  const availablePlants = (plantsData?.plants || []).filter((p: any) => !p.zone_id)
  const availableDevices = (devicesData?.data || []).filter((d: any) => !d.zone_id)

  const [relayState, setRelayState] = useState<Record<string, boolean>>({})
  const [initialRelayState, setInitialRelayState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (linkedDevice) {
      const defaultState: Record<string, boolean> = {}
      activeRelays.forEach((r: any) => {
        defaultState[r] = false
      })
      setInitialRelayState(defaultState)
      setRelayState(defaultState)
    }
  }, [linkedDevice?.id])

  const hasRelayChanged = JSON.stringify(initialRelayState) !== JSON.stringify(relayState)

  const toggleRelay = (relay: string) => {
    setRelayState((prev) => ({ ...prev, [relay]: !prev[relay] }))
  }

  const saveRelayState = () => {
    showConfirm(
      'Confirm Action',
      'Are you sure you want to save these device settings?',
      async () => {
        if (!linkedDevice?.serial_number) {
          showToast('Device information is missing')
          return
        }

        try {
          const changedRelays = Object.keys(relayState).filter((r) => relayState[r] !== initialRelayState[r])
          if (changedRelays.length > 0) {
            await Promise.all(
              changedRelays.map((r) =>
                controlDeviceMutate({
                  serialNumber: linkedDevice.serial_number,
                  role: r,
                  action: relayState[r] ? 'ON' : 'OFF'
                })
              )
            )
          }
          setInitialRelayState(relayState)
          showToast('Device settings updated successfully')
        } catch (error) {
          showToast('Failed to update device settings')
          // Revert on error
          setRelayState(initialRelayState)
        }
      },
      'Save',
      'Cancel'
    )
  }

  const assignSheetRef = useRef<BottomSheet>(null)
  const assignSnapPoints = useMemo(() => ['50%', '67%'], [])

  const [assignTarget, setAssignTarget] = useState<'plant' | 'device' | null>(null)
  const [isRuleModalVisible, setIsRuleModalVisible] = useState(false)
  const [editingRule, setEditingRule] = useState<any>(null)

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />,
    []
  )

  const handleOpenAssign = (target: 'plant' | 'device') => {
    if (target === 'device' && !linkedPlant) {
      showConfirm(
        'Action Required',
        'You need to add a plant to this zone before linking a device.',
        () => handleOpenAssign('plant'),
        'Add Plant'
      )
      return
    }
    setAssignTarget(target)
    assignSheetRef.current?.expand()
  }

  const handleOpenRule = (rule: any = null) => {
    setEditingRule(rule)
    setIsRuleModalVisible(true)
  }

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
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.8)']} style={styles.coverGradient} />

          <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color='white' size={24} />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.overviewContent}>
            <Text style={styles.zoneName}>{zone.name}</Text>
            <Text style={styles.zoneCity}>{zone.location_city}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linked Plant</Text>
            <LinkedPlantCard linkedPlant={linkedPlant} onAddPlant={() => handleOpenAssign('plant')} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linked Device</Text>
            <LinkedDeviceCard
              linkedDevice={linkedDevice}
              activeSensors={activeSensors}
              activeRelays={activeRelays}
              relayState={relayState}
              hasRelayChanged={hasRelayChanged}
              onToggleRelay={toggleRelay}
              onSaveRelayState={saveRelayState}
              onLinkDevice={() => handleOpenAssign('device')}
            />
          </View>

          <AutomationRulesList rules={rules} onOpenRule={handleOpenRule} />
        </View>
      </ScrollView>

      <AssignBottomSheet
        bottomSheetRef={assignSheetRef}
        snapPoints={assignSnapPoints}
        renderBackdrop={renderBackdrop}
        assignTarget={assignTarget}
        availablePlants={availablePlants}
        availableDevices={availableDevices}
        onLinkPlant={(p: any) => {
          showConfirm(
            'Confirm Link',
            `Are you sure you want to link plant "${p.nickname}"?`,
            () => {
              assignPlant({ plant_id: p.id, zone_id: id as string })
                .then(() => {
                  assignSheetRef.current?.close()
                  showToast('Successfully linked plant!')
                })
                .catch(() => {
                  showToast('Failed to link plant.')
                })
            },
            'Link',
            'Cancel'
          )
        }}
        onLinkDevice={(d: any) => {
          showConfirm(
            'Confirm Link',
            `Are you sure you want to link device "${d.serial_number}"?`,
            () => {
              assignDevice({
                serialNumber: d.serial_number,
                payload: { zone_id: id as string }
              })
                .then(() => {
                  assignSheetRef.current?.close()
                  showToast('Successfully linked device!')
                })
                .catch(() => {
                  showToast('Failed to link device.')
                })
            },
            'Link',
            'Cancel'
          )
        }}
      />

      <RuleSetupModal
        visible={isRuleModalVisible}
        onClose={() => setIsRuleModalVisible(false)}
        initialRule={editingRule}
        availableRelays={activeRelays}
        defaultRuleName={zone.name + ' Auto Mode'}
        onSave={async (ruleData) => {
          try {
            setIsRuleModalVisible(false)
            await mutateAutomationRules({ id: zone.id, logic: ruleData.logic_config })
            showToast('Automation rules updated successfully!')
          } catch (err: any) {
            console.error('Failed to update automation rules:', err.response?.data || err.message)
            showToast('There is an error occurs, please contact support team.')
            setIsRuleModalVisible(true)
          } finally {
          }
        }}
      />

      <CancelConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        cancelText={confirmModal.cancelText}
        confirmText={confirmModal.confirmText}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, visible: false }))}
        onConfirm={() => {
          confirmModal.onConfirm()
          setConfirmModal((prev) => ({ ...prev, visible: false }))
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.paper },
  scrollContent: { paddingBottom: 60 },
  overviewContainer: { width: '100%', height: 280, position: 'relative' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  coverGradient: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  headerSafeArea: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 10 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  overviewContent: { position: 'absolute', bottom: 24, left: 24, right: 24 },
  zoneName: { fontSize: 36, fontWeight: '700', fontFamily: FONTS.serif, color: 'white', letterSpacing: -0.5 },
  zoneCity: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4, fontStyle: 'italic' },
  body: { padding: 24, gap: 32 },
  section: { gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  toast: {
    backgroundColor: THEME.forest,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 6
  },
  toastDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.gold },
  toastTitle: { color: 'white', fontWeight: '600', fontSize: 15 }
})
