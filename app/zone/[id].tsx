import { refreshAutomationRules } from '@/apis/zone.api'
import { FONTS, THEME } from '@/components/dashboard/theme'
import { CancelConfirmModal, RuleSetupModal } from '@/components/iot'
import { Text } from '@/components/ui/text'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { useAnalyzeSeasonalConfig } from '@/hooks/mutations/useAnalyzeSeasonalConfig'
import { useAssignDeviceToZone } from '@/hooks/mutations/useAssignDeviceToZone'
import { useAssignPlantToZone } from '@/hooks/mutations/useAssignPlantToZone'
import { useControlDevice } from '@/hooks/mutations/useControlDevce'
import { useRemoveDeviceFromZone } from '@/hooks/mutations/useRemoveDeviceFromZone'
import { useRemovePlantFromZone } from '@/hooks/mutations/useRemovePlantFromZone'
import { useUpdateAutomationRules } from '@/hooks/mutations/useUpdateAutomationRules'
import { useUpdateZone } from '@/hooks/mutations/useUpdateZone'
import { useDevices } from '@/hooks/queries/useDevices'
import { usePlants } from '@/hooks/queries/usePlants'
import { useTelemetryLatest } from '@/hooks/queries/useTelemetryLatest'
import { useZoneDetail } from '@/hooks/queries/useZoneDetail'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Camera, Edit3, Settings, Sparkles } from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AssignBottomSheet, AutomationRulesList, LinkedDeviceCard, LinkedPlantCard } from '@/components/zone'

import { useQueryClient } from '@tanstack/react-query'
export default function ZoneDetailScreen() {
  const queryClient = useQueryClient()
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const toast = useToast()

  const { data: zoneData, isLoading: loading } = useZoneDetail(id as string)
  const zone = zoneData || null
  const { data: plantsData } = usePlants()
  const { data: devicesData } = useDevices()
  const linkedDevice = zone?.devices?.[0]
  const { data: telemetryData } = useTelemetryLatest(linkedDevice?.serial_number)

  const { mutateAsync: mutateAutomationRules } = useUpdateAutomationRules()
  const { mutateAsync: assignDevice } = useAssignDeviceToZone()
  const { mutateAsync: assignPlant } = useAssignPlantToZone()
  const { mutateAsync: controlDeviceMutate } = useControlDevice()
  const { mutateAsync: updateZone, isPending: isUpdating } = useUpdateZone()
  const { mutateAsync: analyzeConfig, isPending: isAnalyzing } = useAnalyzeSeasonalConfig()
  const { mutateAsync: removePlantFromZone } = useRemovePlantFromZone()
  const { mutateAsync: removeDeviceFromZone } = useRemoveDeviceFromZone()

  const [aiSuggestion, setAiSuggestion] = useState<any>(null)

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    onConfirm: () => {},
    onCancel: undefined as (() => void) | undefined
  })

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onCancel?: () => void
  ) => {
    setConfirmModal({ visible: true, title, message, onConfirm, confirmText, cancelText, onCancel })
  }

  const linkedPlant = zone?.my_plants?.[0]
  const activeRelays = linkedDevice?.hardware_config?.relays
    ? (Object.values(linkedDevice.hardware_config.relays).filter((v: any) => v !== 'null') as string[])
    : []
  const availableSensors = linkedDevice?.hardware_config?.sensors
    ? Object.entries(linkedDevice.hardware_config.sensors)
        .filter(([_, v]) => v === true)
        .map(([k]) => k)
    : []
  const activeSensors = availableSensors.length
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
  const editProfileSheetRef = useRef<BottomSheet>(null)
  const assignSnapPoints = useMemo(() => ['50%', '67%'], [])
  const isSheetProgrammaticallyClosing = useRef(false)

  const renderEditBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />,
    []
  )

  const handleEditSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        if (isSheetProgrammaticallyClosing.current) {
          isSheetProgrammaticallyClosing.current = false
          return
        }

        const hasChanges = editForm.nickname !== zone?.name || editForm.imageUrl !== zone?.image_url
        if (hasChanges) {
          showConfirm(
            'Discard Changes',
            'You have unsaved changes. Are you sure you want to discard them?',
            () => {
              setEditForm({ nickname: zone?.name || '', imageUrl: zone?.image_url || '' })
            },
            'Discard',
            'Cancel',
            () => {
              editProfileSheetRef.current?.expand()
            }
          )
        }
      }
    },
    [editForm, zone]
  )
  const editProfileSnapPoints = useMemo(() => ['50%'], [])

  const [editForm, setEditForm] = useState({ nickname: '', imageUrl: '' })
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
  const handleUnassignPlant = () => {
    showConfirm(
      'Unassign Plant',
      'Are you sure you want to remove the plant from this zone?',
      () => {
        removePlantFromZone(linkedPlant?.id!)
          .then(() => showToast('Plant unassigned successfully!'))
          .catch(() => showToast('Failed to unassign plant.'))
      },
      'Unassign',
      'Cancel'
    )
  }

  const handleUnassignDevice = () => {
    showConfirm(
      'Unassign Device',
      'Are you sure you want to remove the device from this zone?',
      () => {
        removeDeviceFromZone(linkedDevice?.id!)
          .then(() => showToast('Device unassigned successfully!'))
          .catch(() => showToast('Failed to unassign device.'))
      },
      'Unassign',
      'Cancel'
    )
  }
  const handleOpenEditProfile = () => {
    setEditForm({ nickname: zone?.name || '', imageUrl: zone?.image_url || '' })
    editProfileSheetRef.current?.expand()
  }

  const pickImage = () => {
    Alert.alert('Upload Photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: async () => {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
          })
          if (!result.canceled) {
            setEditForm((prev) => ({ ...prev, imageUrl: result.assets[0].uri }))
          }
        }
      },
      {
        text: 'Library',
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
          })
          if (!result.canceled) {
            setEditForm((prev) => ({ ...prev, imageUrl: result.assets[0].uri }))
          }
        }
      },
      { text: 'Cancel', style: 'cancel' }
    ])
  }

  const handleSaveProfile = async () => {
    if (!zone) return
    try {
      await updateZone({
        id: zone.id as string,
        data: {
          name: editForm.nickname,
          image_url: editForm.imageUrl
        }
      })
      showToast('Zone profile updated successfully.')
      isSheetProgrammaticallyClosing.current = true
      editProfileSheetRef.current?.close()
    } catch (error) {
      showToast('Failed to update zone profile.')
    }
  }

  const handleOpenRule = (rule: any = null) => {
    setEditingRule(rule)
    setIsRuleModalVisible(true)
  }

  const handleAnalyze = async () => {
    if (!zone?.id) return
    try {
      const response = await analyzeConfig({ zoneId: zone.id, days: 30 })
      if (response?.suggestion) {
        setAiSuggestion(response)
      } else {
        showToast('No suggestion available.')
      }
    } catch (e: any) {
      console.error(e)
      const errorMsg = e.response?.data?.message || 'Failed to analyze stats.'
      showToast(errorMsg)
    }
  }

  const handleApproveAiRule = async () => {
    if (!zone?.id || !aiSuggestion) return
    try {
      await mutateAutomationRules({ id: zone.id, logic: aiSuggestion.suggestion.logic_config })
      showToast('Automation rules updated successfully with AI suggestion!')
      setAiSuggestion(null)
    } catch (err: any) {
      console.error(err)
      showToast('Failed to update rules.')
    }
  }

  const summarizeAiLogic = (logicArr: any[]) => {
    if (!Array.isArray(logicArr)) return []
    return logicArr.map((logic, index) => {
      const metricMap: Record<string, string> = {
        temp: 'temperature',
        temperature: 'temperature',
        moisture: 'soil moisture',
        soil_moisture: 'soil moisture',
        humidity: 'air humidity',
        light: 'light level'
      }
      const opMap: Record<string, string> = {
        '>': 'rises above',
        '<': 'drops below',
        '>=': 'is at least',
        '<=': 'is at most',
        '==': 'is exactly'
      }
      const metric = metricMap[logic?.if?.metric] || logic?.if?.metric || 'metric'
      const op = opMap[logic?.if?.op] || logic?.if?.op || 'changes'
      const action = logic?.then?.action?.replace(/_/g, ' ') || 'action'
      const durationSecs = logic?.then?.duration_ms ? Math.round(logic.then.duration_ms / 1000) : 0
      return `When ${metric} ${op} ${logic?.if?.value || ''}, turn on ${action} for ${durationSecs}s`
    })
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
            <View style={styles.section}>
              <TouchableOpacity style={styles.aiButton} onPress={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <ActivityIndicator color={THEME.orchidMain} style={{ marginRight: 8 }} />
                ) : (
                  <Sparkles size={20} color={THEME.orchidMain} style={{ marginRight: 8 }} />
                )}
                <Text style={styles.aiButtonText}>Analyze Stats & Get AI Suggestion</Text>
              </TouchableOpacity>

              {aiSuggestion && (
                <View style={styles.aiCard}>
                  <View style={styles.aiCardHeader}>
                    <Sparkles size={16} color={THEME.orchidMain} />
                    <Text style={styles.aiCardTitle}>AI Suggestion</Text>
                  </View>

                  <Text style={styles.aiNote}>{aiSuggestion.analysis?.ai_note}</Text>

                  <View style={styles.aiLogicContainer}>
                    <Text style={styles.aiLogicTitle}>Suggested Rules:</Text>
                    {summarizeAiLogic(aiSuggestion.suggestion?.logic_config || []).map((desc, idx) => (
                      <Text key={idx} style={styles.aiLogicText}>
                        • {desc}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.aiActions}>
                    <TouchableOpacity
                      style={[styles.aiActionButton, styles.aiButtonDismiss]}
                      onPress={() => setAiSuggestion(null)}
                    >
                      <Text style={styles.aiButtonDismissText}>Dismiss</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.aiActionButton, styles.aiButtonApprove]}
                      onPress={handleApproveAiRule}
                    >
                      <Text style={styles.aiButtonApproveText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
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
                .then(async () => {
                  if (linkedDevice) {
                    try {
                      await refreshAutomationRules(id as string)
                      queryClient.invalidateQueries({ queryKey: ['zone', id] })
                    } catch (e) {
                      console.error('Failed to refresh automation rules:', e)
                    }
                  }
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
        availableSensors={availableSensors}
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

      {/* Edit Profile Bottom Sheet */}
      <BottomSheet
        ref={editProfileSheetRef}
        index={-1}
        snapPoints={editProfileSnapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderEditBackdrop}
        keyboardBehavior='interactive'
        onChange={handleEditSheetChange}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <BottomSheetScrollView contentContainerStyle={[styles.sheetContent, { paddingBottom: 40 }]}>
          <Text style={styles.sheetTitle}>Edit Profile</Text>

          <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginTop: 24, marginBottom: 32 }}>
            {editForm.imageUrl ? (
              <Image
                source={{ uri: editForm.imageUrl }}
                style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: THEME.paperDeep }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: THEME.paperDeep,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: THEME.inkLight,
                  borderStyle: 'dashed'
                }}
              >
                <Camera size={32} color={THEME.inkLight} />
              </View>
            )}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: THEME.orchidMain,
                padding: 8,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: THEME.paper
              }}
            >
              <Edit3 size={16} color='white' />
            </View>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Zone Name</Text>
          <BottomSheetTextInput
            style={styles.input}
            value={editForm.nickname}
            onChangeText={(t) => setEditForm((prev) => ({ ...prev, nickname: t }))}
            placeholder='E.g. Balcony'
            placeholderTextColor={THEME.inkLight}
          />

          <TouchableOpacity
            onPress={handleSaveProfile}
            style={[
              styles.assignButtonBig,
              { marginTop: 32 },
              (isUpdating || (editForm.nickname === zone?.name && editForm.imageUrl === zone?.image_url)) && {
                opacity: 0.5
              }
            ]}
            disabled={isUpdating || (editForm.nickname === zone?.name && editForm.imageUrl === zone?.image_url)}
          >
            {isUpdating ? (
              <ActivityIndicator color={THEME.paper} />
            ) : (
              <Text style={{ color: THEME.paper, fontFamily: FONTS.sans, fontWeight: '600', fontSize: 16 }}>
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>

      <CancelConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        cancelText={confirmModal.cancelText}
        confirmText={confirmModal.confirmText}
        onCancel={() => {
          setConfirmModal((prev) => ({ ...prev, visible: false }))
          if (confirmModal.onCancel) {
            confirmModal.onCancel()
          }
        }}
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
  overviewContainer: { width: '100%', height: 380, position: 'relative' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  coverGradient: { position: 'absolute', top: 0, height: 120, left: 0, right: 0 },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(253, 252, 248, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4
  },
  overviewContent: { marginBottom: 24 },
  zoneName: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: FONTS.serif,
    color: THEME.ink,
    letterSpacing: -0.5,
    lineHeight: 42
  },
  zoneCity: { fontSize: 16, color: THEME.inkMuted, marginTop: 4, fontFamily: FONTS.sans },
  body: {
    padding: 24,
    gap: 32,
    backgroundColor: THEME.paper,
    borderTopRightRadius: 80,
    marginTop: -40,
    paddingTop: 32
  },
  section: { gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  sheetBackground: { backgroundColor: THEME.paper, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetIndicator: { width: 40, height: 5, backgroundColor: THEME.paperDeep, borderRadius: 3, marginTop: 12 },
  sheetContent: { padding: 24, paddingBottom: 40 },
  sheetTitle: { fontSize: 28, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  inputLabel: {
    fontSize: 13,
    fontFamily: FONTS.sans,
    color: THEME.inkLight,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 8,
    marginBottom: 8
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: THEME.ink,
    borderWidth: 1,
    borderColor: 'rgba(20,40,29,0.1)',
    fontFamily: FONTS.sans
  },
  assignButtonBig: {
    backgroundColor: THEME.forest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 999,
    gap: 12,
    shadowColor: THEME.forest,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
    width: '100%'
  },
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
  toastTitle: { color: 'white', fontWeight: '600', fontSize: 15 },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(159, 95, 128, 0.1)',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8
  },
  aiButtonText: {
    color: THEME.orchidMain,
    fontWeight: '700',
    fontFamily: FONTS.sans,
    fontSize: 15
  },
  aiCard: {
    backgroundColor: 'rgba(255, 244, 230, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(240, 169, 52, 0.3)',
    borderRadius: 20,
    padding: 16,
    marginTop: 12
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  aiCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.orchidMain,
    fontFamily: FONTS.sans,
    marginLeft: 6
  },
  aiNote: {
    fontSize: 14,
    color: THEME.ink,
    lineHeight: 20,
    fontFamily: FONTS.sans,
    marginBottom: 12
  },
  aiLogicContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  aiLogicTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.inkMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  aiLogicText: {
    fontSize: 14,
    color: THEME.ink,
    lineHeight: 20,
    fontFamily: FONTS.sans,
    marginBottom: 4
  },
  aiActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  aiActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999
  },
  aiButtonDismiss: {
    backgroundColor: 'transparent'
  },
  aiButtonDismissText: {
    color: THEME.inkLight,
    fontWeight: '600',
    fontSize: 14
  },
  aiButtonApprove: {
    backgroundColor: THEME.orchidMain
  },
  aiButtonApproveText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  }
})
