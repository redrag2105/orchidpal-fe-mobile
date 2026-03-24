import { FONTS, THEME } from '@/components/dashboard/theme'
import { CancelConfirmModal } from '@/components/iot/device-setup'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { VStack } from '@/components/ui/vstack'
import { useAssignPlantToZone } from '@/hooks/mutations/useAssignPlantToZone'
import { useRemovePlantFromZone } from '@/hooks/mutations/useRemovePlantFromZone'
import { useUpdatePlant } from '@/hooks/mutations/useUpdatePlant'
import { usePlantDetail } from '@/hooks/queries/usePlantDetail'
import { useZones } from '@/hooks/queries/useZones'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  ArrowLeft,
  Calendar,
  Camera,
  ChevronRight,
  Droplets,
  Edit3,
  HeartPulse,
  MapPin,
  Settings,
  ShieldCheck,
  Sun,
  Thermometer,
  Trees
} from 'lucide-react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const toast = useToast()
  const insets = useSafeAreaInsets()

  const { data: plantCallData, isLoading } = usePlantDetail(id as string)
  const plant = plantCallData?.data || plantCallData

  const { data: zones } = useZones()
  const { mutateAsync: removePlantFromZone } = useRemovePlantFromZone()
  const { mutateAsync: assignPlant } = useAssignPlantToZone()
  const { mutateAsync: updatePlant, isPending: isUpdating } = useUpdatePlant()

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

  const assignSheetRef = useRef<BottomSheet>(null)
  const editProfileSheetRef = useRef<BottomSheet>(null)
  const assignSnapPoints = useMemo(() => ['50%', '67%'], [])
  const editProfileSnapPoints = useMemo(() => ['50%'], [])
  const isSheetProgrammaticallyClosing = useRef(false)
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />,
    []
  )

  const [editForm, setEditForm] = useState({ nickname: '', imageUrl: '' })
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

        const hasChanges = editForm.nickname !== plant?.nickname || editForm.imageUrl !== plant?.image_url
        if (hasChanges) {
          showConfirm(
            'Discard Changes',
            'You have unsaved changes. Are you sure you want to discard them?',
            () => {
              setEditForm({ nickname: plant?.nickname || '', imageUrl: plant?.image_url || '' })
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
    [editForm, plant]
  )

  if (isLoading)
    return (
      <View style={{ flex: 1, backgroundColor: THEME.paper, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={THEME.orchidMain} />
      </View>
    )
  if (!plant) return null

  const currentZone: any = plant.planting_zones || null
  const wikiInfo = plant.species_wiki

  const emptyZones: any[] = (zones || []).filter((z: any) => !z.has_plant)

  const handleOpenAssign = () => assignSheetRef.current?.expand()
  const handleOpenEditProfile = () => {
    setEditForm({ nickname: plant.nickname, imageUrl: plant.image_url })
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
    try {
      await updatePlant({
        id: plant.id as string,
        data: {
          nickname: editForm.nickname,
          image_url: editForm.imageUrl
        }
      })
      showToast('Plant profile updated successfully.')
      isSheetProgrammaticallyClosing.current = true
      editProfileSheetRef.current?.close()
    } catch (error) {
      showToast('Failed to update plant profile.')
    }
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

  const handleConfirmLink = (zoneId: string) => {
    showConfirm(
      'Confirm Assignment',
      'Are you sure you want to assign this plant to this zone?',
      () => {
        assignPlant({ plant_id: plant.id as string, zone_id: zoneId }).then(() => {
          assignSheetRef.current?.close()
          showToast('Plant has been successfully assigned.')
        })
      },
      'Assign',
      'Cancel'
    )
  }

  const handleUnassignZone = () => {
    showConfirm(
      'Unassign Zone',
      'Are you sure you want to remove this plant from the zone?',
      () => {
        removePlantFromZone(plant.id as string).then(() => {
          showToast('Plant has been successfully unassigned.')
        })
      },
      'Unassign',
      'Cancel'
    )
  }

  const isHealthy = plant.health_status === 'GOOD'

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Full Bleed Header */}
        <Animated.View entering={FadeIn.duration(600)} style={{ width: '100%', height: 400, position: 'relative' }}>
          <Image
            source={{ uri: plant.image_url || 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3' }}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            style={{ width: '100%', height: 120, position: 'absolute', top: 0 }}
          />

          <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft color={THEME.ink} size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOpenEditProfile} style={styles.headerButton}>
              <Settings size={24} color={THEME.ink} />
            </TouchableOpacity>
          </SafeAreaView>
        </Animated.View>

        <View style={styles.body}>
          <View style={{ marginBottom: 24 }}>
            <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.heroNickname}>
              {plant.nickname || 'Unknown Plant'}
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(300).duration(500)} style={styles.heroSpecies}>
              {wikiInfo?.common_name || 'Mysterious Species'}
            </Animated.Text>
          </View>

          {/* Status & Actions Floating Bar */}
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.statusBar}>
            <View style={styles.statusCell}>
              <View
                style={[
                  styles.statusIconElegant,
                  { backgroundColor: isHealthy ? 'rgba(74, 121, 95, 0.08)' : 'rgba(212, 165, 116, 0.1)' }
                ]}
              >
                <HeartPulse size={22} color={isHealthy ? THEME.forest : THEME.gold} strokeWidth={2.5} />
              </View>
              <View style={styles.statusTextWrapper}>
                <Text style={styles.statusLabelElegant}>Health Status</Text>
                <Text style={[styles.statusValueElegant, { color: isHealthy ? THEME.forest : THEME.gold }]}>
                  {plant.health_status ? plant.health_status.toUpperCase() : 'UNKNOWN'}
                </Text>
              </View>
            </View>

            <View style={styles.statusDivider} />

            <View style={styles.statusCell}>
              <View style={[styles.statusIconElegant, { backgroundColor: 'rgba(20, 40, 29, 0.04)' }]}>
                <Calendar size={22} color={THEME.ink} strokeWidth={2} />
              </View>
              <View style={styles.statusTextWrapper}>
                <Text style={styles.statusLabelElegant}>Planted On</Text>
                <Text style={styles.statusValueElegantDate}>
                  {plant.planted_at
                    ? new Date(plant.planted_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'Unknown'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Botanical Info System (Glassmorphic Pills) */}
          <View style={[styles.section, { marginRight: -24 }]}>
            <Text style={styles.sectionTitle}>Botanical Guidelines</Text>
            {wikiInfo ? (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 24, gap: 12, paddingBottom: 16 }}
                >
                  <View style={styles.pillCardWrapper}>
                    <View style={styles.glassPill}>
                      <View style={styles.iconCircle}>
                        <Thermometer size={20} color='#FF6B6B' />
                      </View>
                      <View style={styles.pillTextContainer}>
                        <Text style={styles.pillLabel}>Ideal Temp</Text>
                        <Text style={styles.pillValue}>
                          {wikiInfo.ideal_temp_min}-{wikiInfo.ideal_temp_max}°C
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.pillCardWrapper}>
                    <View style={styles.glassPill}>
                      <View style={styles.iconCircle}>
                        <Droplets size={20} color='#4BA3E3' />
                      </View>
                      <View style={styles.pillTextContainer}>
                        <Text style={styles.pillLabel}>Humidity</Text>
                        <Text style={styles.pillValue}>
                          {wikiInfo.ideal_humid_min}-{wikiInfo.ideal_humid_max}%
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.pillCardWrapper}>
                    <View style={styles.glassPill}>
                      <View style={styles.iconCircle}>
                        <Sun size={20} color='#FFA502' />
                      </View>
                      <View style={styles.pillTextContainer}>
                        <Text style={styles.pillLabel}>Light Role</Text>
                        <Text style={styles.pillValue}>Indirect</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                <View style={[styles.card, { marginTop: 8, marginRight: 24 }]}>
                  <Text style={styles.gridLabel}>Scientific Name</Text>
                  <Text style={[styles.gridValue, { fontStyle: 'italic', marginTop: 4, fontFamily: FONTS.serif }]}>
                    {wikiInfo.scientific_name || wikiInfo.common_name}
                  </Text>
                  <View style={{ height: 16 }} />
                  <HStack style={{ alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <ShieldCheck size={20} color={THEME.forest} />
                    <Text style={[styles.gridLabel, { marginTop: 0 }]}>Care Instructions</Text>
                  </HStack>
                  <Text style={styles.careText}>
                    {wikiInfo.care_instruction
                      ? wikiInfo.care_instruction
                          .split('.')
                          .filter((s) => s.trim().length > 0)
                          .map((sentence, index, arr) => (
                            <React.Fragment key={index}>
                              • {sentence.trim()}.{index !== arr.length - 1 && '\n\n'}
                            </React.Fragment>
                          ))
                      : 'No specific care instructions found. Keep an eye on moisture and light levels.'}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={{ color: THEME.inkLight, fontFamily: FONTS.sans }}>
                No botanical info available for this species.
              </Text>
            )}
          </View>

          {/* Zone Location */}
          <View style={[styles.section, { paddingRight: 24 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>Location</Text>
              {currentZone && (
                <TouchableOpacity onPress={handleUnassignZone}>
                  <Text style={{ fontSize: 13, color: THEME.orchidMain, fontWeight: '600' }}>Unassign</Text>
                </TouchableOpacity>
              )}
            </View>
            {currentZone ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push(`/zone/${currentZone.id}`)}
                style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}
              >
                <View style={[styles.statusIconBase, { backgroundColor: 'rgba(74, 121, 95, 0.1)', marginRight: 16 }]}>
                  <MapPin size={24} color={THEME.forest} />
                </View>
                <VStack style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink }}>
                    {currentZone.name || 'Unnamed Zone'}
                  </Text>
                  <Text style={{ fontSize: 14, color: THEME.inkMuted, marginTop: 4, fontFamily: FONTS.sans }}>
                    {currentZone.location_city || 'Your Home Environment'}
                  </Text>
                </VStack>
                <ChevronRight size={20} color={THEME.inkMuted} />
              </TouchableOpacity>
            ) : (
              <View style={[styles.card, { alignItems: 'center', paddingVertical: 32 }]}>
                <Trees size={40} color={THEME.paperDeep} style={{ marginBottom: 16 }} />
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={styles.emptyZoneDesc}>This plant hasn't been placed in any monitoring zone yet.</Text>
                </View>
                <TouchableOpacity onPress={handleOpenAssign} style={styles.assignButtonBig}>
                  <MapPin size={20} color={THEME.paper} />
                  <Text style={{ color: THEME.paper, fontFamily: FONTS.sans, fontWeight: '600', fontSize: 16 }}>
                    Assign to Zone
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Assignment Bottom Sheet */}
      <BottomSheet
        ref={assignSheetRef}
        index={-1}
        snapPoints={assignSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Assign Zone</Text>
          <Text style={styles.sheetDesc}>Select an available zone to move this plant to.</Text>

          <VStack style={{ gap: 12, marginTop: 24 }}>
            {emptyZones.length > 0 ? (
              emptyZones.map((z: any) => (
                <TouchableOpacity key={z.id} style={styles.sheetListItem} onPress={() => handleConfirmLink(z.id)}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: THEME.paperDeep,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MapPin size={24} color={THEME.forest} />
                  </View>
                  <VStack style={{ flex: 1 }}>
                    <Text style={styles.sheetItemTitle}>{z.name || 'Unnamed Zone'}</Text>
                    <Text style={styles.sheetItemSub}>{z.location_city || 'Your Environment'}</Text>
                  </VStack>
                  <ChevronRight size={20} color={THEME.inkLight} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 40, opacity: 0.8 }}>
                <Trees size={48} color={THEME.paperDeep} style={{ marginBottom: 16 }} />
                <Text style={{ textAlign: 'center', color: THEME.inkLight, fontSize: 16, fontFamily: FONTS.sans }}>
                  No empty zones available to place this plant.
                </Text>
              </View>
            )}
          </VStack>
        </BottomSheetScrollView>
      </BottomSheet>

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
            <View style={styles.editImageBadge}>
              <Edit3 size={16} color='white' />
            </View>
          </TouchableOpacity>

          <Text style={styles.detailLabel}>Nickname</Text>
          <BottomSheetTextInput
            style={styles.sheetInput}
            value={editForm.nickname}
            onChangeText={(t) => setEditForm((prev) => ({ ...prev, nickname: t }))}
            placeholder='E.g. Monstera'
            placeholderTextColor={THEME.inkLight}
          />

          <TouchableOpacity
            onPress={handleSaveProfile}
            style={[
              styles.assignButtonBig,
              { marginTop: 32 },
              (isUpdating || (editForm.nickname === plant.nickname && editForm.imageUrl === plant.image_url)) && {
                opacity: 0.5
              }
            ]}
            disabled={isUpdating || (editForm.nickname === plant.nickname && editForm.imageUrl === plant.image_url)}
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
  headerSafeArea: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  headerButton: {
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
  headerTitleContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24
  },
  heroNickname: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: FONTS.serif,
    color: THEME.ink,
    letterSpacing: -0.5,
    lineHeight: 42
  },
  heroSpecies: {
    fontSize: 16,
    fontFamily: FONTS.sans,
    color: THEME.inkMuted,
    marginTop: 4
  },
  body: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: THEME.paper,
    borderTopRightRadius: 80,
    marginTop: -40,
    paddingTop: 32
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(20,40,29,0.03)',
    marginBottom: 32
  },
  statusCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1
  },
  statusIconElegant: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusTextWrapper: {
    justifyContent: 'center',
    flexShrink: 1
  },
  statusLabelElegant: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: THEME.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  statusValueElegant: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  statusValueElegantDate: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '600',
    color: THEME.ink,
    letterSpacing: 0.3
  },
  statusDivider: {
    height: 32,
    width: 1,
    backgroundColor: THEME.paperDeep,
    marginHorizontal: 8
  },
  statusIconBase: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: { gap: 16, marginBottom: 32 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: FONTS.serif,
    color: THEME.ink,
    marginBottom: 8
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 24,
    elevation: 2
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between'
  },
  gridItem: {
    width: (width - 48 - 16) / 2,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2
  },
  gridLabel: {
    fontSize: 12,
    fontFamily: FONTS.sans,
    color: THEME.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700'
  },
  gridValue: {
    fontSize: 16,
    fontFamily: FONTS.sans,
    fontWeight: '600',
    color: THEME.ink,
    marginTop: 4
  },
  careText: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: THEME.ink,
    lineHeight: 24,
    marginTop: 4
  },
  emptyZoneDesc: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: THEME.inkMuted,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 22
  },
  pillCardWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(250, 249, 244, 0.7)', // Fallback without native blur but looks like glass
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(240, 239, 234, 0.8)'
  },
  glassPill: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    width: 90
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1
  },
  pillTextContainer: {
    alignItems: 'center'
  },
  pillLabel: {
    fontSize: 11,
    fontFamily: FONTS.sans,
    color: THEME.inkMuted,
    marginBottom: 2,
    fontWeight: '600'
  },
  pillValue: {
    fontSize: 14,
    fontFamily: FONTS.sans,
    fontWeight: '700',
    color: THEME.ink
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
  sheetBackground: { backgroundColor: THEME.paper, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetIndicator: { width: 40, height: 5, backgroundColor: THEME.paperDeep, borderRadius: 3, marginTop: 12 },
  sheetContent: { padding: 24, paddingBottom: 40 },
  sheetTitle: { fontSize: 28, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  sheetDesc: { fontSize: 16, fontFamily: FONTS.sans, color: THEME.inkLight, marginTop: 6 },
  sheetInput: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: THEME.ink,
    borderWidth: 1,
    borderColor: 'rgba(20,40,29,0.1)',
    fontFamily: FONTS.sans,
    marginTop: 8
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: FONTS.sans,
    color: THEME.inkLight,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 8
  },
  sheetListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(20,40,29,0.05)'
  },
  sheetItemTitle: { fontSize: 17, fontWeight: '600', fontFamily: FONTS.sans, color: THEME.ink },
  sheetItemSub: { fontSize: 14, fontFamily: FONTS.sans, color: THEME.inkMuted, marginTop: 4 },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: THEME.forest,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: THEME.paper
  },
  toast: {
    backgroundColor: THEME.forest,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 8,
    shadowColor: THEME.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12
  },
  toastDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.gold },
  toastTitle: { color: 'white', fontFamily: FONTS.sans, fontWeight: '600', fontSize: 15 }
})
