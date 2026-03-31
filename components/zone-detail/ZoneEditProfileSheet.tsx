import { FONTS, THEME } from '@/constants/theme'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import { Camera, Edit3 } from 'lucide-react-native'
import React, { useCallback, useMemo } from 'react'
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import { zoneStyles as styles } from './ZoneDetailStyles'

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
  )
}
