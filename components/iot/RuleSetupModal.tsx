import { Plus, Trash2, X, ChevronDown } from 'lucide-react-native'
import React, { useEffect, useState, useMemo } from 'react'
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { FONTS, THEME } from '../devices/theme'

// Gluestack UI components
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader
} from '../ui/alert-dialog'
import { Button, ButtonText } from '../ui/button'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'

export interface RuleLogic {
  if: { metric: string; op: string; value: number }
  then: { action: string; duration_ms: number }
}

export interface Rule {
  id?: string
  name: string
  is_active: boolean
  logic_config: RuleLogic[]
}

interface RuleSetupModalProps {
  visible: boolean
  onClose: () => void
  onSave: (rule: Rule) => void
  initialRule?: Rule | null
  availableRelays?: string[]
  defaultRuleName?: string
}

const METRICS = [
  { label: 'Temperature (°C)', value: 'temperature' },
  { label: 'Air Humidity (%)', value: 'humidity' },
  { label: 'Soil Moisture (%)', value: 'soil_moisture' },
  { label: 'Light Level (%)', value: 'light' }
]

const OPERATORS = [
  { label: 'Less than (<)', value: '<' },
  { label: 'Greater than (>)', value: '>' },
  { label: 'Equals (==)', value: '==' }
]

interface CustomSelectProps {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (val: string) => void
}

function CustomSelect({ label, value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedLabel = options.find((o) => o.value === value)?.label || 'Select...'

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsOpen(!isOpen)
  }

  const handleSelect = (val: string) => {
    onChange(val)
    toggleOpen()
  }

  return (
    <View style={styles.selectContainer}>
      <RNText style={styles.selectLabel}>{label}</RNText>
      <TouchableOpacity activeOpacity={0.8} style={styles.selectBox} onPress={toggleOpen}>
        <RNText style={styles.selectText} numberOfLines={1}>{selectedLabel}</RNText>
        <ChevronDown size={20} color={THEME.inkMuted} style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownArea}>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.dropdownItem, i !== options.length - 1 && styles.dropdownItemBorder]}
              onPress={() => handleSelect(opt.value)}
            >
              <RNText style={[styles.dropdownItemText, value === opt.value && styles.dropdownItemTextSelected]}>
                {opt.label}
              </RNText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

export function RuleSetupModal({
  visible,
  onClose,
  onSave,
  initialRule,
  availableRelays = [],
  defaultRuleName = ''
}: RuleSetupModalProps) {
  const [name, setName] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [logicConfig, setLogicConfig] = useState<RuleLogic[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Cấu hình mặc định khi tạo mới
  const defaultLogicConfig = useMemo(() => [
    {
      if: { metric: 'humidity', op: '<', value: 60 },
      then: { action: availableRelays[0] || 'pump', duration_ms: 10000 }
    }
  ], [availableRelays])

  useEffect(() => {
    if (visible) {
      if (initialRule) {
        setName(initialRule.name)
        setIsActive(initialRule.is_active ?? true)
        setLogicConfig(initialRule.logic_config ? JSON.parse(JSON.stringify(initialRule.logic_config)) : [])
      } else {
        setName(defaultRuleName)
        setIsActive(true)
        setLogicConfig(JSON.parse(JSON.stringify(defaultLogicConfig)))
      }
    }
  }, [visible, initialRule, defaultRuleName, defaultLogicConfig])

  // Hàm kiểm tra xem dữ liệu hiện tại có khác với dữ liệu gốc không
  const checkHasChanges = () => {
    const current = { 
      name: name.trim(), 
      is_active: isActive, 
      logic_config: logicConfig 
    }
    const original = initialRule 
      ? { 
          name: initialRule.name.trim(), 
          is_active: initialRule.is_active ?? true, 
          logic_config: initialRule.logic_config || [] 
        }
      : { 
          name: defaultRuleName.trim(), 
          is_active: true, 
          logic_config: defaultLogicConfig 
        }
    
    return JSON.stringify(current) !== JSON.stringify(original)
  }

  // Nút save chỉ bật khi: Tên không trống VÀ có sự thay đổi
  const hasChanges = checkHasChanges()
  const isSaveEnabled = name.trim().length > 0 && hasChanges

  const handleAddCondition = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setLogicConfig(prev => [
      ...prev,
      {
        if: { metric: 'temperature', op: '>', value: 30 },
        then: { action: availableRelays[0] || 'fan', duration_ms: 5000 }
      }
    ])
  }

  const handleRemoveCondition = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setLogicConfig(prev => {
      const newConfig = [...prev]
      newConfig.splice(index, 1)
      return newConfig
    })
  }

  const updateLogic = (index: number, section: 'if' | 'then', field: string, value: any) => {
    setLogicConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev))
      newConfig[index][section][field] = value
      return newConfig
    })
  }

  const handleSaveBtnClick = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmSave = () => {
    setShowConfirmModal(false)
    // Sử dụng requestAnimationFrame để đảm bảo Alert đóng hẳn trước khi thực thi callback
    requestAnimationFrame(() => {
      onSave({
        id: initialRule?.id,
        name: name.trim(),
        is_active: isActive,
        logic_config: logicConfig
      })
      onClose()
    })
  }

  const relayOptions = useMemo(() => 
    availableRelays.length > 0
      ? availableRelays.map((r) => ({ label: r.charAt(0).toUpperCase() + r.slice(1), value: r }))
      : [{ label: 'No relays available', value: '' }]
  , [availableRelays])

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet' onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.container}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <X size={24} color={THEME.ink} />
          </TouchableOpacity>
          <RNText style={styles.headerTitle}>{initialRule ? 'Edit Rule' : 'New Rule'}</RNText>
          <View style={{ width: 40 }} />
        </SafeAreaView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <RNText style={styles.sectionTitle}>General Information</RNText>
          <View style={styles.card}>
            <View style={styles.formRow}>
              <RNText style={styles.label}>Rule Name</RNText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder='e.g. Morning Mist'
                placeholderTextColor={THEME.inkMuted}
              />
            </View>
            <View style={[styles.formRow, styles.rowBetween]}>
              <RNText style={styles.label}>Active Status</RNText>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: THEME.paperDeep, true: THEME.forest }}
                thumbColor={Platform.OS === 'android' ? 'white' : undefined}
              />
            </View>
          </View>

          <View style={[styles.rowBetween, { marginTop: 32, marginBottom: 12 }]}>
            <RNText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>Logic Conditions</RNText>
            <TouchableOpacity onPress={handleAddCondition} style={styles.addBtn}>
              <Plus size={16} color={THEME.forest} />
              <RNText style={styles.addBtnText}>Add</RNText>
            </TouchableOpacity>
          </View>

          {logicConfig.map((logic, index) => (
            <View key={index} style={styles.logicCard}>
              <View style={styles.logicHeader}>
                <RNText style={styles.logicIndex}>Condition {index + 1}</RNText>
                {logicConfig.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveCondition(index)}>
                    <Trash2 size={20} color={THEME.orchidMain} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.logicBlock}>
                <RNText style={styles.blockTitle}>IF</RNText>
                <CustomSelect
                  label='Metric Element'
                  value={logic.if.metric}
                  options={METRICS}
                  onChange={(val) => updateLogic(index, 'if', 'metric', val)}
                />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1.3 }}>
                    <CustomSelect
                      label='Operator'
                      value={logic.if.op}
                      options={OPERATORS}
                      onChange={(val) => updateLogic(index, 'if', 'op', val)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <RNText style={styles.selectLabel}>Value</RNText>
                    <TextInput
                      style={styles.input}
                      keyboardType='numeric'
                      value={String(logic.if.value)}
                      onChangeText={(val) => updateLogic(index, 'if', 'value', Number(val) || 0)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.logicBlock}>
                <RNText style={[styles.blockTitle, { color: THEME.forest }]}>THEN</RNText>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1.5 }}>
                    <CustomSelect
                      label='Action Relay'
                      value={logic.then.action}
                      options={relayOptions}
                      onChange={(val) => updateLogic(index, 'then', 'action', val)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <RNText style={styles.selectLabel}>Dur. (secs)</RNText>
                    <TextInput
                      style={styles.input}
                      keyboardType='numeric'
                      value={String(logic.then.duration_ms / 1000)}
                      onChangeText={(val) => updateLogic(index, 'then', 'duration_ms', (Number(val) || 0) * 1000)}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.saveBtn, !isSaveEnabled && styles.saveBtnDisabled]} 
            onPress={isSaveEnabled ? handleSaveBtnClick : undefined} 
            activeOpacity={isSaveEnabled ? 0.8 : 1}
          >
            <RNText style={[styles.saveBtnText, !isSaveEnabled && styles.saveBtnTextDisabled]}>
              {hasChanges ? 'Save Automation Rule' : 'No Changes to Save'}
            </RNText>
          </TouchableOpacity>
        </View>

        {/* AlertDialog đặt trong Modal để hiển thị được trên iOS PageSheet */}
        <AlertDialog isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Heading size='md'>Save Rule Changes</Heading>
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text size='sm'>
                Are you sure you want to save these changes to your automation rule?
                Current running schedules may be affected.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter className="mt-4 gap-3">
              <Button
                variant='outline'
                action='secondary'
                onPress={() => setShowConfirmModal(false)}
                size='sm'
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size='sm'
                onPress={handleConfirmSave}
                style={{ backgroundColor: THEME.forest }}
              >
                <ButtonText>Confirm Save</ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcf8'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONTS.serif,
    color: THEME.ink
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)'
  },
  formRow: {
    marginBottom: 16
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.ink,
    marginBottom: 8
  },
  input: {
    backgroundColor: THEME.paper,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    fontSize: 15,
    color: THEME.ink,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)'
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 121, 95, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.forest
  },
  logicCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)'
  },
  logicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.paperDeep
  },
  logicIndex: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.ink,
    fontFamily: FONTS.serif
  },
  logicBlock: {
    backgroundColor: THEME.paper,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.ink,
    marginBottom: 12,
    letterSpacing: 0.5
  },
  selectContainer: {
    marginBottom: 12,
    position: 'relative',
    zIndex: 1
  },
  selectLabel: {
    fontSize: 13,
    color: THEME.inkLight,
    marginBottom: 6,
    fontWeight: '500'
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 52,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)'
  },
  selectText: {
    fontSize: 15,
    color: THEME.ink,
    flex: 1,
    marginRight: 8
  },
  dropdownArea: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden'
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)'
  },
  dropdownItemText: {
    fontSize: 15,
    color: THEME.ink
  },
  dropdownItemTextSelected: {
    color: THEME.forest,
    fontWeight: '600'
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)'
  },
  saveBtn: {
    backgroundColor: THEME.forest,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveBtnDisabled: {
    backgroundColor: THEME.paperDeep,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  saveBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  saveBtnTextDisabled: {
    color: THEME.inkMuted
  }
})