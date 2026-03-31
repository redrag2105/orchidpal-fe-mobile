import { CancelConfirmModal, RuleSetupModal } from '@/components/iot'
import { AssignBottomSheet } from '@/components/zone'
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import React, { useCallback } from 'react'
import { ZoneEditProfileSheet } from './ZoneEditProfileSheet'

export function ZoneActionModals({ logic }: { logic: any }) {
  const {
    zone,
    activeRelays,
    availableSensors,
    assignSheetRef,
    assignSnapPoints,
    assignTarget,
    availablePlants,
    availableDevices,
    linkPlant,
    linkDevice,
    isRuleModalVisible,
    setIsRuleModalVisible,
    editingRule,
    saveRule,
    editProfileSheetRef,
    editForm,
    setEditForm,
    isUpdating,
    handleSaveProfile,
    showConfirm,
    isSheetProgrammaticallyClosing,
    confirmModal,
    setConfirmModal
  } = logic

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />,
    []
  )

  if (!zone) return null

  return (
    <>
      <AssignBottomSheet
        bottomSheetRef={assignSheetRef}
        snapPoints={assignSnapPoints}
        renderBackdrop={renderBackdrop}
        assignTarget={assignTarget}
        availablePlants={availablePlants}
        availableDevices={availableDevices}
        onLinkPlant={linkPlant}
        onLinkDevice={linkDevice}
      />

      <RuleSetupModal
        visible={isRuleModalVisible}
        onClose={() => setIsRuleModalVisible(false)}
        initialRule={editingRule}
        availableRelays={activeRelays}
        availableSensors={availableSensors}
        defaultRuleName={zone.name + ' Auto Mode'}
        onSave={saveRule}
      />

      <ZoneEditProfileSheet
        editProfileSheetRef={editProfileSheetRef}
        editForm={editForm}
        setEditForm={setEditForm}
        zone={zone}
        isUpdating={isUpdating}
        handleSaveProfile={handleSaveProfile}
        showConfirm={showConfirm}
        isSheetProgrammaticallyClosing={isSheetProgrammaticallyClosing}
      />

      <CancelConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        cancelText={confirmModal.cancelText}
        confirmText={confirmModal.confirmText}
        onCancel={() => {
          setConfirmModal((prev: any) => ({ ...prev, visible: false }))
          if (confirmModal.onCancel) confirmModal.onCancel()
        }}
        onConfirm={() => {
          confirmModal.onConfirm()
          setConfirmModal((prev: any) => ({ ...prev, visible: false }))
        }}
      />
    </>
  )
}
