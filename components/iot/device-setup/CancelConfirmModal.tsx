import React from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'

export interface CancelConfirmModalProps {
  visible: boolean
  title?: string
  message?: string
  cancelText?: string
  confirmText?: string
  onCancel: () => void
  onConfirm: () => void
}

export const CancelConfirmModal = ({
  visible,
  title = 'Cancel Setup?',
  message = 'Are you sure you want to cancel? Your progress will be lost.',
  cancelText = 'Continue Setup',
  confirmText = 'Yes, Cancel',
  onCancel,
  onConfirm
}: CancelConfirmModalProps) => {
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButtonSecondary} onPress={onCancel}>
              <Text style={styles.modalButtonSecondaryText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonPrimary} onPress={onConfirm}>
              <Text style={styles.modalButtonPrimaryText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
