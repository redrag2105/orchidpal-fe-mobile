import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, ChevronRight, Cpu, Droplets, Leaf, Plus, Power, Settings2, Thermometer, Sun, Wind, X } from 'lucide-react-native'
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { Animated, Image, ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Alert, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { useToast, Toast, ToastTitle } from '@/components/ui/toast'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { THEME, FONTS } from '@/components/dashboard/theme'
import { MOCK_ZONES, MOCK_PLANTS, MOCK_DEVICES, WIKI_DATA, MOCK_RULES } from '../(dashboard)/garden'
import { LinearGradient } from 'expo-linear-gradient'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { CircularStat } from '@/components/dashboard/CircularStat'
import { AddDeviceButton } from '@/components/devices/AddDeviceButton'
import { CancelConfirmModal, Rule, RuleSetupModal } from '@/components/iot'
import Svg, { Polyline } from 'react-native-svg'

// --- Types & Helpers ---
type MiniLineChartProps = {
  values: number[];
  color: string;
}

function MiniLineChart({ values, color }: MiniLineChartProps) {
  if (!values || values.length === 0) return null;
  const width = 80;
  const height = 30;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / Math.max(values.length - 1, 1);
  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={{ marginTop: 8, width: 80, height: 30 }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const TRENDS = {
  temp: [22, 23, 24, 23.5, 23.8, 24.2, 25],
  humidity: [60, 62, 58, 59, 61, 65, 63],
  light: [30, 40, 50, 70, 80, 90, 85],
  moisture: [45, 43, 40, 38, 35, 45, 50]
};

function RelayToggle({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) {
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 40]
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onToggle}>
      <View style={styles.toggleTrack}>
        <Animated.View style={{ 
          position: 'absolute', 
          right: 12, 
          opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) 
        }}>
          <Text style={styles.toggleOffText}>OFF</Text>
        </Animated.View>
        
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: anim, justifyContent: 'center' }]}>
          <LinearGradient 
            colors={[THEME.forest, THEME.forestLight]} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }} 
            style={StyleSheet.absoluteFillObject} 
          />
          <Text style={styles.toggleOnText}>ON</Text>
        </Animated.View>

        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX }] }]} />
      </View>
    </TouchableOpacity>
  );
}

export default function ZoneDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const toast = useToast()
  const { width: windowWidth } = useWindowDimensions()

  const [zone, setZone] = useState(MOCK_ZONES.find(z => z.id === id))
  
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, confirmText = 'Confirm', cancelText = 'Cancel') => {
    setConfirmModal({ visible: true, title, message, onConfirm, confirmText, cancelText });
  };
  
  if (!zone) return null;

  const linkedPlant = MOCK_PLANTS.find(p => p.id === zone.plant_id);
  const linkedDevice = MOCK_DEVICES.find((d: any) => d.id === zone.device_id);
  const wikiInfo = linkedPlant ? WIKI_DATA[linkedPlant.species_wiki.common_name as keyof typeof WIKI_DATA] : null;
  const activeRelays = linkedDevice ? Object.values(linkedDevice.hardware_config.relays).filter(v => v !== 'null') : [];
  const activeSensors = linkedDevice ? Object.values(linkedDevice.hardware_config.sensors).filter(Boolean).length : 0;
  const summarizeRule = (rule: any) => {
    if (rule.condition && rule.action) return `IF ${rule.condition} THEN ${rule.action}`;
    const logic = rule.logic_config?.[0];
    if (!logic) return "No logic defined";
    return `IF ${logic.if.metric} ${logic.if.op} ${logic.if.value} THEN ${logic.then.action} for ${logic.then.duration_ms / 1000}s`;
  };
  const rules = MOCK_RULES.filter((r: any) => zone.automation_rules.includes(r.id));

  const availablePlants = MOCK_PLANTS.filter((p: any) => !p.zone_id);
  const availableDevices = MOCK_DEVICES.filter((d: any) => !d.zone_id);

  const [relayState, setRelayState] = useState<Record<string, boolean>>({});
  const [initialRelayState, setInitialRelayState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (linkedDevice) {
      const defaultState: Record<string, boolean> = {};
      activeRelays.forEach((r: any) => {
        defaultState[r] = false;
      });
      setInitialRelayState(defaultState);
      setRelayState(defaultState);
    }
  }, [linkedDevice?.id]);

  const hasRelayChanged = JSON.stringify(initialRelayState) !== JSON.stringify(relayState);

  const toggleRelay = (relay: string) => {
    setRelayState(prev => ({ ...prev, [relay]: !prev[relay] }));
  };

  const saveRelayState = () => {
    showConfirm(
      "Confirm Action",
      "Are you sure you want to save these device settings?",
      () => {
        setInitialRelayState(relayState);
        showToast('Device settings updated successfully');
      },
      "Save",
      "Cancel"
    );
  };

  const assignSheetRef = useRef<BottomSheet>(null);
  const ruleSheetRef = useRef<BottomSheet>(null);
  const assignSnapPoints = useMemo(() => ['50%', '67%'], []);
  const ruleSnapPoints = useMemo(() => ['67%'], []);

  const [assignTarget, setAssignTarget] = useState<'plant' | 'device' | null>(null);
  const [isRuleModalVisible, setIsRuleModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [ruleName, setRuleName] = useState('');
  const [ruleCond, setRuleCond] = useState('');
  const [ruleAct, setRuleAct] = useState('');

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />
  ), []);

  const handleOpenAssign = (target: 'plant' | 'device') => {
    if (target === 'device' && !zone?.plant_id && !zone?.device_id) {
      showConfirm(
        "Action Required",
        "You need to add a plant to this zone before linking a device.",
        () => handleOpenAssign('plant'),
        "Add Plant"
      );
      return;
    }
    setAssignTarget(target);
    assignSheetRef.current?.expand();
  };

  const handleOpenRule = (rule: any = null) => {
    setEditingRule(rule);
    setIsRuleModalVisible(true);
  };

  const showToast = (message: string) => {
    toast.show({
      placement: "bottom",
      duration: 1500,
      render: ({ id }) => (
        <Toast nativeID={id} action="success" variant="solid" style={styles.toast}>
          <View style={styles.toastDot} />
          <ToastTitle style={styles.toastTitle}>{message}</ToastTitle>
        </Toast>
      )
    })
  }

  

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.overviewContainer}>
          <Image source={{ uri: zone.image_url }} style={styles.coverImage} />
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.8)']} style={styles.coverGradient} />
          
          <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color="white" size={24} />
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
            {linkedPlant ? (
              <TouchableOpacity 
                style={styles.card} 
                activeOpacity={0.8} 
                onPress={() => router.push(`/plant/${linkedPlant.id}`)}
              >
                <HStack style={{ gap: 16 }}>
                  <Image source={{ uri: linkedPlant.image_url }} style={styles.plantThumb} />
                  <VStack style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.plantNickname}>{linkedPlant.nickname}</Text>
                    <Text style={styles.plantSpecies}>{linkedPlant.species_wiki.common_name}</Text>
                    {!!wikiInfo && (
                      <HStack style={styles.idealConditions}>
                        <View style={styles.conditionPill}>
                          <Thermometer size={12} color={THEME.inkLight} />
                          <Text style={styles.conditionText}>{wikiInfo.min_temp}-{wikiInfo.max_temp}°C</Text>
                        </View>
                        <View style={styles.conditionPill}>
                          <Droplets size={12} color={THEME.inkLight} />
                          <Text style={styles.conditionText}>{wikiInfo.min_hum}-{wikiInfo.max_hum}%</Text>
                        </View>
                      </HStack>
                    )}
                  </VStack>
                  <ChevronRight size={24} color={THEME.inkLight} />
                </HStack>
              </TouchableOpacity>
            ) : (
              <View style={styles.card}>
                <Text style={styles.emptyText}>No plant assigned to this zone.</Text>
                <AddDeviceButton title="Add Plant to Zone" onPress={() => handleOpenAssign('plant')} />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linked Device</Text>
            {linkedDevice ? (
              <View style={styles.card}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(dashboard)/devices')}>
                  <HStack style={styles.deviceHeader}>
                    <HStack style={{ gap: 16, alignItems: 'center' }}>
                      <View style={styles.deviceIcon}>
                        <Cpu size={24} color={THEME.forest} />
                      </View>
                      <VStack>
                        <Text style={styles.deviceSerial}>{linkedDevice.serial_number}</Text>
                        <Text style={styles.deviceStatus}>
                          <Text style={{ color: THEME.inkLight }}>Status: </Text>
                          <Text style={{ color: linkedDevice.status === 'ONLINE' ? THEME.forest : THEME.orchidMain }}>
                            {linkedDevice.status.toUpperCase()}
                          </Text>
                        </Text>
                      </VStack>
                    </HStack>
                    <ChevronRight size={20} color={THEME.inkLight} />
                  </HStack>
                </TouchableOpacity>

                <View style={styles.statsGrid}>
                  <View style={styles.statColumn}>
                    <CircularStat value={zone?.temperature || 24} maxValue={40} label="Temp °C" color={THEME.orchidMain} icon={Thermometer} delay={150} />
                    <MiniLineChart values={TRENDS.temp} color={THEME.orchidMain} />
                  </View>
                  <View style={styles.statColumn}>
                    <CircularStat value={zone?.humidity || 60} maxValue={100} label="Humidity %" color="#3b82f6" icon={Droplets} delay={200} />
                    <MiniLineChart values={TRENDS.humidity} color="#3b82f6" />
                  </View>
                  <View style={styles.statColumn}>
                    <CircularStat value={72} maxValue={100} label="Light %" color={THEME.gold} icon={Sun} delay={250} />
                    <MiniLineChart values={TRENDS.light} color={THEME.gold} />
                  </View>
                  <View style={styles.statColumn}>
                    <CircularStat value={45} maxValue={100} label="Moisture %" color={THEME.forest} icon={Droplets} delay={300} />
                    <MiniLineChart values={TRENDS.moisture} color={THEME.forest} />
                  </View>
                </View>

                <View style={styles.divider} />
                
                <Text style={styles.hardwareInfoText}>
                  Hardware: {activeSensors} sensors, {activeRelays.length} relays
                </Text>

                <View style={styles.quickControl}>
                  {activeRelays.map((relay: any) => (
                    <View key={relay} style={styles.relayRow}>
                      <HStack style={{ gap: 12, alignItems: 'center' }}>
                        <View style={styles.relayIconContainer}>
                          <Power size={20} color={relayState[relay] ? THEME.forest : THEME.inkLight} />
                        </View>
                        <VStack>
                          <Text style={styles.relayTitle}>{relay.charAt(0).toUpperCase() + relay.slice(1)}</Text>
                          <Text style={styles.relaySubtitle}>{relayState[relay] ? 'Currently Active' : 'Currently Inactive'}</Text>
                        </VStack>
                      </HStack>
                      <RelayToggle isActive={!!relayState[relay]} onToggle={() => toggleRelay(relay)} />
                    </View>
                  ))}
                </View>

                {hasRelayChanged && (
                  <View style={{ marginTop: 24 }}>
                    <AddDeviceButton title="Save Changes" onPress={saveRelayState} />
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.emptyText}>No device linked to this zone.</Text>
                <AddDeviceButton title="Link Device" onPress={() => handleOpenAssign('device')} />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Automation Rules</Text>
            </HStack>

            {rules.length > 0 ? (
              <VStack style={{ gap: 12 }}>
                {rules.map((rule: any) => (
                  <TouchableOpacity key={rule.id} style={styles.ruleCard} onPress={() => handleOpenRule(rule)} activeOpacity={0.8}>
                    <View style={styles.ruleIcon}>
                      <Settings2 size={20} color={THEME.orchidMain} />
                    </View>
                    <VStack style={{ flex: 1 }}>
                      <Text style={styles.ruleName}>{rule.name}</Text>
                      <Text style={styles.ruleDetail}>{summarizeRule(rule)}</Text>
                    </VStack>
                  </TouchableOpacity>
                ))}
              </VStack>
            ) : (
              <View style={styles.card}>
                <Text style={styles.emptyText}>No automation rules set.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Assignment Bottom Sheet */}
      <BottomSheet ref={assignSheetRef} index={-1} snapPoints={assignSnapPoints} enablePanDownToClose backdropComponent={renderBackdrop} backgroundStyle={styles.sheetBg} handleIndicatorStyle={styles.sheetIndicator}>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <Text style={styles.sheetTitle}>{assignTarget === 'plant' ? 'Assign Plant' : 'Link Device'}</Text>
          <Text style={styles.sheetDesc}>Select an available {assignTarget} to add to this zone.</Text>
          <VStack style={{ gap: 12, marginTop: 16 }}>
            {assignTarget === 'plant' && availablePlants.map((p: any) => (
              <TouchableOpacity key={p.id} style={styles.sheetListItem} onPress={() => {
                showConfirm(
                  "Confirm Link",
                  `Are you sure you want to link plant "${p.nickname}"?`,
                  () => {
                    const pIndex = MOCK_PLANTS.findIndex(pl => pl.id === p.id);
                    if (pIndex !== -1) MOCK_PLANTS[pIndex] = { ...MOCK_PLANTS[pIndex], zone_id: zone.id };
                    const zIndex = MOCK_ZONES.findIndex(z => z.id === zone.id);
                    if (zIndex !== -1) MOCK_ZONES[zIndex] = { ...MOCK_ZONES[zIndex], plant_id: p.id };
                    setZone({ ...zone, plant_id: p.id });
                    assignSheetRef.current?.close();
                    showToast('Successfully linked plant!');
                  },
                  "Link",
                  "Cancel"
                );
              }}>
                <Image source={{ uri: p.image_url }} style={styles.sheetThumb} />
                <VStack style={{ flex: 1 }}>
                  <Text style={styles.sheetItemTitle}>{p.nickname}</Text>
                  <Text style={styles.sheetItemSub}>{p.species_wiki.common_name}</Text>
                </VStack>
                <Plus size={20} color={THEME.orchidMain} />
              </TouchableOpacity>
            ))}
            {assignTarget === 'device' && availableDevices.map((d: any) => (
              <TouchableOpacity key={d.id} style={styles.sheetListItem} onPress={() => {
                showConfirm(
                  "Confirm Link",
                  `Are you sure you want to link device "${d.serial_number}"?`,
                  () => {
                    const dIndex = MOCK_DEVICES.findIndex(dev => dev.id === d.id);
                    if (dIndex !== -1) MOCK_DEVICES[dIndex] = { ...MOCK_DEVICES[dIndex], zone_id: zone.id };
                    const zIndex = MOCK_ZONES.findIndex(z => z.id === zone.id);
                    if (zIndex !== -1) MOCK_ZONES[zIndex] = { ...MOCK_ZONES[zIndex], device_id: d.id };
                    setZone({ ...zone, device_id: d.id });
                    assignSheetRef.current?.close();
                    showToast('Successfully linked device!');
                  },
                  "Link",
                  "Cancel"
                );
              }}>
                <View style={styles.sheetDeviceIcon}><Cpu size={24} color={THEME.forest} /></View>
                <VStack style={{ flex: 1 }}>
                  <Text style={styles.sheetItemTitle}>{d.serial_number}</Text>
                  <Text style={styles.sheetItemSub}>{Object.values(d.hardware_config.sensors).filter(Boolean).length} sensors</Text>
                </VStack>
                <Plus size={20} color={THEME.orchidMain} />
              </TouchableOpacity>
            ))}
          </VStack>
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Rule Full-Screen Modal */}
        <RuleSetupModal
          visible={isRuleModalVisible}
          onClose={() => setIsRuleModalVisible(false)}
          initialRule={editingRule}
          availableRelays={activeRelays}
          defaultRuleName={zone.name + " Auto Mode"}
          onSave={(ruleData) => {
            if (ruleData.id) {
               const idx = MOCK_RULES.findIndex(r => r.id === ruleData.id);
               if (idx !== -1) MOCK_RULES[idx] = { ...MOCK_RULES[idx], ...ruleData };
            } else {
               const newRule = { ...ruleData, id: 'r' + Date.now(), zone_id: zone.id, is_active: true };
               MOCK_RULES.push(newRule);
               MOCK_ZONES.find(z => z.id === zone.id)?.automation_rules.push(newRule.id);
               setZone({ ...zone, automation_rules: [...zone.automation_rules, newRule.id] });
            }
            setIsRuleModalVisible(false);
            showToast('Automation Rule saved successfully!');
          }}
        />

      <CancelConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        cancelText={confirmModal.cancelText}
        confirmText={confirmModal.confirmText}
        onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal(prev => ({ ...prev, visible: false }));
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
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  overviewContent: { position: 'absolute', bottom: 24, left: 24, right: 24 },
  zoneName: { fontSize: 36, fontWeight: '700', fontFamily: FONTS.serif, color: 'white', letterSpacing: -0.5 },
  zoneCity: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4, fontStyle: 'italic' },
  body: { padding: 24, gap: 32 },
  section: { gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 20, shadowColor: THEME.ink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 3 },
  emptyText: { fontSize: 15, color: THEME.inkLight, marginBottom: 20, textAlign: 'center' },
  plantThumb: { width: 64, height: 64, borderRadius: 16, backgroundColor: THEME.paperDeep },
  plantNickname: { fontSize: 17, fontWeight: '700', color: THEME.ink },
  plantSpecies: { fontSize: 14, color: THEME.inkLight, fontStyle: 'italic', marginBottom: 8 },
  idealConditions: { gap: 8 },
  conditionPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.paperDeep, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, gap: 6 },
  conditionText: { fontSize: 12, color: THEME.inkLight, fontWeight: '600' },
  deviceHeader: { justifyContent: 'space-between', alignItems: 'center' },
  deviceIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(74, 121, 95, 0.1)', alignItems: 'center', justifyContent: 'center' },
  deviceSerial: { fontSize: 17, fontWeight: '700', color: THEME.ink },
  deviceStatus: { fontSize: 14, marginTop: 2 },
  statsGrid: { flexDirection: 'column', gap: 16, marginBottom: 4 },
  statColumn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', backgroundColor: THEME.paper, paddingVertical: 16, paddingHorizontal: 24, borderRadius: 24 },
  divider: { height: 1, backgroundColor: THEME.paper, marginVertical: 20 },
  hardwareInfoText: { fontSize: 14, color: THEME.inkLight, marginBottom: 16 },
  quickControl: { flexDirection: 'column', gap: 12 },
  relayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: THEME.paper, padding: 16, borderRadius: 20, width: '100%' },
  relayIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  relayTitle: { fontSize: 16, fontWeight: '700', color: THEME.ink },
  relaySubtitle: { fontSize: 13, color: THEME.inkLight, marginTop: 2 },
  toggleTrack: { width: 68, height: 34, borderRadius: 17, justifyContent: 'center', backgroundColor: THEME.paperDark, elevation: 2, overflow: 'hidden' },
  toggleThumb: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'white', elevation: 3 },
  toggleOnText: { position: 'absolute', left: 14, color: 'white', fontWeight: '800', fontSize: 11 },
  toggleOffText: { color: THEME.inkLight, fontWeight: '700', fontSize: 11 },
  ruleCard: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 24, padding: 16, elevation: 2, alignItems: 'center', gap: 16 },
  ruleIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(159, 95, 128, 0.1)', alignItems: 'center', justifyContent: 'center' },
  ruleName: { fontSize: 16, fontWeight: '700', color: THEME.ink },
  ruleDetail: { fontSize: 14, color: THEME.inkLight, marginTop: 4 },
  sheetBg: { backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetIndicator: { width: 48, height: 5, backgroundColor: THEME.paperDeep, borderRadius: 3, marginTop: 10 },
  sheetContent: { padding: 24, paddingBottom: 40 },
  sheetTitle: { fontSize: 24, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  sheetDesc: { fontSize: 15, color: THEME.inkLight, marginTop: 4 },
  sheetListItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: THEME.paper, borderRadius: 20, gap: 16 },
  sheetThumb: { width: 56, height: 56, borderRadius: 16, backgroundColor: THEME.paperDeep },
  sheetDeviceIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(74, 121, 95, 0.1)', alignItems: 'center', justifyContent: 'center' },
  sheetItemTitle: { fontSize: 16, fontWeight: '700', color: THEME.ink },
  sheetItemSub: { fontSize: 14, color: THEME.inkLight, marginTop: 4 },
  formSection: { marginTop: 24 },
  formLabel: { fontSize: 14, fontWeight: '700', color: THEME.ink, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  formInput: { backgroundColor: THEME.paper, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16, fontSize: 16, color: THEME.ink },
  toast: { backgroundColor: THEME.forest, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 80, flexDirection: 'row', alignItems: 'center', gap: 8, elevation: 6 },
  toastDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.gold },
  toastTitle: { color: 'white', fontWeight: '600', fontSize: 15 }
})