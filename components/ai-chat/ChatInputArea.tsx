import { FONTS, THEME } from '@/components/dashboard/theme'
import { BlurView } from 'expo-blur'
import { Camera, Send, X } from 'lucide-react-native'
import React from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface ChatInputAreaProps {
  inputText: string
  setInputText: (text: string) => void
  selectedImage?: string | null
  onClearImage?: () => void
  onSend: () => void
  onCameraPress: () => void
  paddingBottom: number
}

export const ChatInputArea = ({
  inputText,
  setInputText,
  selectedImage,
  onClearImage,
  onSend,
  onCameraPress,
  paddingBottom
}: ChatInputAreaProps) => {
  return (
    <View style={[styles.inputContainer, { paddingBottom }]}>
      <View style={styles.inputBubbleShadow}>
        <BlurView intensity={80} tint='light' style={styles.inputBlur}>
          {/* Image Preview Area */}
          {!!selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.clearImageBtn} onPress={onClearImage}>
                <X size={14} color='#fff' />
              </TouchableOpacity>
            </View>
          )}

          {/* Row 1: Text Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder='Ask a question or take a photo...'
              placeholderTextColor={THEME.inkLight}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>

          {/* Row 2: Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={onCameraPress}>
              <View style={styles.cameraBtnBg}>
                <Camera size={18} color={THEME.forest} />
              </View>
              <Text style={styles.iconLabel}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={onSend}>
              <View style={[styles.cameraBtnBg, styles.sendBtnBg]}>
                <Send size={16} color='white' style={{ marginLeft: -2, marginTop: 2 }} />
              </View>
              <Text style={[styles.iconLabel, { color: THEME.forest }]}>Send</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 10
  },
  inputBubbleShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8
  },
  inputBlur: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 36,
    backgroundColor: 'rgba(253,252,248,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden'
  },
  inputWrapper: {
    paddingHorizontal: 10,
    marginBottom: 4
  },
  imagePreviewContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 4,
    position: 'relative',
    alignSelf: 'flex-start'
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  clearImageBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: THEME.ink,
    minHeight: 24,
    maxHeight: 100
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60
  },
  cameraBtnBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d8eadb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  sendBtnBg: {
    backgroundColor: THEME.forest,
    shadowColor: THEME.forest,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.inkLight
  }
})
