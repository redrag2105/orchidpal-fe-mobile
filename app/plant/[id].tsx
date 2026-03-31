import { CancelConfirmModal } from '@/components/iot/device-setup'
import { AssignZoneSheet } from '@/components/plant-detail/AssignZoneSheet'
import { BotanicalInfo } from '@/components/plant-detail/BotanicalInfo'
import { EditProfileSheet } from '@/components/plant-detail/EditProfileSheet'
import { PlantHero } from '@/components/plant-detail/PlantHero'
import { ZoneLocation } from '@/components/plant-detail/ZoneLocation'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
import { THEME } from '@/constants/theme'
import { useAssignPlantToZone } from '@/hooks/mutations/useAssignPlantToZone'
import { useRemovePlantFromZone } from '@/hooks/mutations/useRemovePlantFromZone'
import { useUpdatePlant } from '@/hooks/mutations/useUpdatePlant'
import { usePlantDetail } from '@/hooks/queries/usePlantDetail'
import { useZones } from '@/hooks/queries/useZones'
import BottomSheet from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Settings } from 'lucide-react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const toast = useToast()

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

  const [editForm, setEditForm] = useState({ nickname: '', imageUrl: '' })

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: THEME.paper, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={THEME.orchidMain} />
      </View>
    )
  }
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
        <Toast
          nativeID={id}
          action='success'
          variant='solid'
          className='elevation-8 mb-20 flex-row items-center gap-2.5 rounded-full bg-forest px-5 py-3.5 shadow-[0_6px_12px_rgba(74,121,95,0.3)]'
        >
          <View className='h-2 w-2 rounded-full bg-gold' />
          <ToastTitle className='font-sans text-[15px] font-semibold text-white'>{message}</ToastTitle>
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

  return (
    <View className='flex-1 bg-paper'>
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

          <SafeAreaView edges={['top']} className='android:pt-10 z-10 flex-row items-center justify-between px-5 pt-3'>
            <TouchableOpacity
              onPress={() => router.back()}
              className='elevation-4 h-11 w-11 items-center justify-center rounded-full bg-[#fdfcf8]/90 shadow-[0_4px_10px_rgba(0,0,0,0.15)]'
            >
              <ArrowLeft color={THEME.ink} size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenEditProfile}
              className='elevation-4 h-11 w-11 items-center justify-center rounded-full bg-[#fdfcf8]/90 shadow-[0_4px_10px_rgba(0,0,0,0.15)]'
            >
              <Settings size={24} color={THEME.ink} />
            </TouchableOpacity>
          </SafeAreaView>
        </Animated.View>

        <View className='-mt-10 rounded-tr-[80px] bg-paper px-6 pb-10 pt-8'>
          <PlantHero plant={plant} wikiInfo={wikiInfo} />

          {/* Botanical Info System */}
          <BotanicalInfo wikiInfo={wikiInfo} />

          {/* Zone Location */}
          <ZoneLocation
            currentZone={currentZone}
            handleUnassignZone={handleUnassignZone}
            handleOpenAssign={handleOpenAssign}
          />
        </View>
      </ScrollView>

      {/* Assignment Bottom Sheet */}
      <AssignZoneSheet
        ref={assignSheetRef}
        snapPoints={assignSnapPoints}
        emptyZones={emptyZones}
        handleConfirmLink={handleConfirmLink}
      />

      {/* Edit Profile Bottom Sheet */}
      <EditProfileSheet
        ref={editProfileSheetRef}
        snapPoints={editProfileSnapPoints}
        editForm={editForm}
        setEditForm={setEditForm}
        plant={plant}
        handleEditSheetChange={handleEditSheetChange}
        pickImage={pickImage}
        handleSaveProfile={handleSaveProfile}
        isUpdating={isUpdating}
      />

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
