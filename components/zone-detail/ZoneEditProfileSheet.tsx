import { THEME } from '@/constants/theme'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import { Camera, Edit3 } from 'lucide-react-native'
import React, { useCallback, useMemo } from 'react'
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native'

interface ZoneEditProfileSheetProps {
  editProfileSheetRef: React.RefObject<BottomSheet | null>
  editForm: { nickname: string; imageUrl: string }
  setEditForm: React.Dispatch<React.SetStateAction<{ nickname: string; imageUrl: string }>>
  zone: any
  isUpdating: boolean
  handleSaveProfile: () => void
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string,
    onCancel?: () => void
  ) => void
  isSheetProgrammaticallyClosing: React.MutableRefObject<boolean>
}

export function ZoneEditProfileSheet({
  editProfileSheetRef,
  editForm,
  setEditForm,
  zone,
  isUpdating,
  handleSaveProfile,
  showConfirm,
  isSheetProgrammaticallyClosing
}: ZoneEditProfileSheetProps) {
  const editProfileSnapPoints = useMemo(() => ['50%'], [])

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
    [editForm, zone, showConfirm, setEditForm, editProfileSheetRef, isSheetProgrammaticallyClosing]
  )

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

  return (
    <BottomSheet
      ref={editProfileSheetRef as any}
      index={-1}
      snapPoints={editProfileSnapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderEditBackdrop}
      keyboardBehavior='interactive'
      onChange={handleEditSheetChange}
      backgroundStyle={{ backgroundColor: THEME.paper, borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
      handleIndicatorStyle={{ width: 40, height: 5, backgroundColor: THEME.paperDeep, borderRadius: 3, marginTop: 12 }}
    >
      <BottomSheetScrollView contentContainerClassName='p-6 pb-10'>
        <Text className='font-serif text-[28px] font-bold text-ink'>Edit Profile</Text>

        <TouchableOpacity onPress={pickImage} className='mb-8 mt-6 self-center'>
          {editForm.imageUrl ? (
            <Image
              source={{ uri: editForm.imageUrl }}
              className='h-[120px] w-[120px] rounded-full border-[3px] border-paper-deep'
            />
          ) : (
            <View className='h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-dashed border-ink-light bg-paper-deep'>
              <Camera size={32} color={THEME.inkLight} />
            </View>
          )}
          <View className='absolute bottom-0 right-0 rounded-[20px] border-[3px] border-paper bg-orchid-main p-2'>
            <Edit3 size={16} color='white' />
          </View>
        </TouchableOpacity>

        <Text className='mb-2 ml-2 font-sans text-[13px] font-bold uppercase tracking-wide text-ink-light'>
          Zone Name
        </Text>
        <BottomSheetTextInput
          className='rounded-2xl border border-[rgba(20,40,29,0.1)] bg-white px-5 py-[18px] font-sans text-base text-ink'
          value={editForm.nickname}
          onChangeText={(t) => setEditForm((prev) => ({ ...prev, nickname: t }))}
          placeholder='E.g. Balcony'
          placeholderTextColor={THEME.inkLight}
        />

        <TouchableOpacity
          onPress={handleSaveProfile}
          className={`elevation-4 mt-8 w-full flex-row items-center justify-center rounded-full bg-forest px-8 py-[18px] shadow-[0_8px_16px_rgba(74,121,95,0.2)] ${
            isUpdating || (editForm.nickname === zone?.name && editForm.imageUrl === zone?.image_url)
              ? 'opacity-50'
              : ''
          }`}
          disabled={isUpdating || (editForm.nickname === zone?.name && editForm.imageUrl === zone?.image_url)}
        >
          {isUpdating ? (
            <ActivityIndicator color={THEME.paper} />
          ) : (
            <Text className='font-sans text-base font-semibold text-paper'>Save Changes</Text>
          )}
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
