import { THEME } from '@/constants/theme'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { Camera, Edit3 } from 'lucide-react-native'
import React, { forwardRef, useCallback } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'

interface EditProfileSheetProps {
  snapPoints: string[]
  editForm: { nickname: string; imageUrl: string }
  setEditForm: React.Dispatch<React.SetStateAction<{ nickname: string; imageUrl: string }>>
  plant: any
  handleEditSheetChange: (index: number) => void
  pickImage: () => void
  handleSaveProfile: () => void
  isUpdating: boolean
}

export const EditProfileSheet = forwardRef<BottomSheet, EditProfileSheetProps>(
  (
    { snapPoints, editForm, setEditForm, plant, handleEditSheetChange, pickImage, handleSaveProfile, isUpdating },
    ref
  ) => {
    const renderEditBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />,
      []
    )

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderEditBackdrop}
        keyboardBehavior='interactive'
        onChange={handleEditSheetChange}
        backgroundStyle={{ backgroundColor: THEME.paper, borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
        handleIndicatorStyle={{
          width: 40,
          height: 5,
          backgroundColor: THEME.paperDeep,
          borderRadius: 3,
          marginTop: 12
        }}
      >
        <BottomSheetScrollView style={{ width: '100%' }} contentContainerClassName='px-6 pb-10 w-full'>
          <Text className='w-full font-serif text-[28px] font-bold text-ink'>Edit Profile</Text>

          <TouchableOpacity onPress={pickImage} className='mb-8 mt-6 self-center'>
            {editForm.imageUrl ? (
              <Image
                source={{ uri: editForm.imageUrl }}
                className='border-paper-deep h-[120px] w-[120px] rounded-full border-[3px]'
              />
            ) : (
              <View className='bg-paper-deep h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-dashed border-ink-light'>
                <Camera size={32} color={THEME.inkLight} />
              </View>
            )}
            <View className='absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-[3px] border-paper bg-forest'>
              <Edit3 size={16} color='white' />
            </View>
          </TouchableOpacity>

          <Text className='ml-2 font-sans text-[13px] font-bold uppercase tracking-[0.5px] text-ink-light'>
            Nickname
          </Text>
          <BottomSheetTextInput
            className='mt-2 w-full rounded-2xl border border-[#14281d]/10 bg-white px-5 py-[18px] font-sans text-base text-ink'
            value={editForm.nickname}
            onChangeText={(t) => setEditForm((prev) => ({ ...prev, nickname: t }))}
            placeholder='E.g. Monstera'
            placeholderTextColor={THEME.inkLight}
          />

          <TouchableOpacity
            onPress={handleSaveProfile}
            className={`mt-8 w-full flex-row items-center justify-center gap-3 rounded-full bg-forest px-8 py-[18px] ${isUpdating || (editForm.nickname === plant.nickname && editForm.imageUrl === plant.image_url) ? 'opacity-50' : ''}`}
            disabled={isUpdating || (editForm.nickname === plant.nickname && editForm.imageUrl === plant.image_url)}
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
)
