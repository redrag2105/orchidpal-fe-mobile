import { refreshAutomationRules } from '@/apis/zone.api'
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
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'

export function useZoneDetailLogic(id: string, showToast: (msg: string) => void) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: zoneData, isLoading: loading } = useZoneDetail(id)
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
          setRelayState(initialRelayState)
        }
      },
      'Save',
      'Cancel'
    )
  }

  const assignSheetRef = useRef<any>(null)
  const editProfileSheetRef = useRef<any>(null)
  const assignSnapPoints = useMemo(() => ['50%', '67%'], [])
  const isSheetProgrammaticallyClosing = useRef(false)

  const [editForm, setEditForm] = useState({ nickname: '', imageUrl: '' })
  const [assignTarget, setAssignTarget] = useState<'plant' | 'device' | null>(null)
  const [isRuleModalVisible, setIsRuleModalVisible] = useState(false)
  const [editingRule, setEditingRule] = useState<any>(null)

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
    return logicArr.map((logic) => {
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

  const linkPlant = (p: any) => {
    showConfirm(
      'Confirm Link',
      `Are you sure you want to link plant "${p.nickname}"?`,
      () => {
        assignPlant({ plant_id: p.id, zone_id: id })
          .then(async () => {
            if (linkedDevice) {
              try {
                await refreshAutomationRules(id)
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
  }

  const linkDevice = (d: any) => {
    showConfirm(
      'Confirm Link',
      `Are you sure you want to link device "${d.serial_number}"?`,
      () => {
        assignDevice({
          serialNumber: d.serial_number,
          payload: { zone_id: id }
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
  }

  const saveRule = async (ruleData: any) => {
    try {
      setIsRuleModalVisible(false)
      await mutateAutomationRules({ id: zone?.id || '', logic: ruleData.logic_config })
      showToast('Automation rules updated successfully!')
    } catch (err: any) {
      console.error('Failed to update automation rules:', err.response?.data || err.message)
      showToast('There is an error occurs, please contact support team.')
      setIsRuleModalVisible(true)
    }
  }

  return {
    router,
    loading,
    zone,
    linkedPlant,
    linkedDevice,
    telemetryData,
    activeRelays,
    availableSensors,
    activeSensors,
    rules,
    availablePlants,
    availableDevices,
    relayState,
    hasRelayChanged,
    toggleRelay,
    saveRelayState,
    assignSheetRef,
    editProfileSheetRef,
    assignSnapPoints,
    isSheetProgrammaticallyClosing,
    editForm,
    setEditForm,
    assignTarget,
    isRuleModalVisible,
    setIsRuleModalVisible,
    editingRule,
    aiSuggestion,
    setAiSuggestion,
    confirmModal,
    setConfirmModal,
    showConfirm,
    handleOpenAssign,
    handleUnassignPlant,
    handleUnassignDevice,
    handleOpenEditProfile,
    handleSaveProfile,
    handleOpenRule,
    handleAnalyze,
    handleApproveAiRule,
    summarizeAiLogic,
    linkPlant,
    linkDevice,
    saveRule,
    isUpdating,
    isAnalyzing
  }
}
