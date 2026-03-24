import { sendChatMessage } from '@/apis/chat.api'
import { ChatEmptyState } from '@/components/ai-chat/ChatEmptyState'
import { ChatInputArea } from '@/components/ai-chat/ChatInputArea'
import { ChatMessageList } from '@/components/ai-chat/ChatMessageList'
import { FONTS, THEME } from '@/components/dashboard/theme'
import { useUIStore } from '@/hooks/useUIStore'
import { ChatMessage } from '@/types/chat.types'
import * as ImagePicker from 'expo-image-picker'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AskAIScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const setTabBarSticky = useUIStore((s) => s.setTabBarSticky)

  useFocusEffect(
    useCallback(() => {
      setTabBarSticky(true)
      return () => setTabBarSticky(false)
    }, [setTabBarSticky])
  )

  const [sessionId] = useState(() => 'session-' + Date.now().toString() + Math.random().toString(36).substring(7))
  const [inputText, setInputText] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () =>
      setKeyboardVisible(true)
    )
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () =>
      setKeyboardVisible(false)
    )
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return
    const currentText = inputText
    const currentImage = selectedImage

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentText,
      image: currentImage || undefined
    }
    setMessages((prev) => [...prev, newMsg])
    setInputText('')
    setSelectedImage(null)
    setIsTyping(true)

    try {
      const response = await sendChatMessage(sessionId, currentText || 'Analyze this photo.', currentImage || undefined)
      console.log('AI Response:', response)
      setMessages((prev) => [
        ...prev,
        {
          id: response.modelMessageId || (Date.now() + 1).toString(),
          sender: 'ai',
          text: typeof response === 'string' ? response : response?.reply || JSON.stringify(response)
        }
      ])
    } catch (e) {
      console.log('Chat error', e)
      Alert.alert('Error', 'Failed to get response from AI')
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickPrompt = async (prompt: string) => {
    if (prompt === 'Identify by photo') {
      handleCameraPress()
      return
    }
    const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: prompt }

    setMessages((prev) => [...prev, newMsg])
    setIsTyping(true)

    try {
      const response = await sendChatMessage(sessionId, prompt)
      console.log('AI Response:', response)
      setMessages((prev) => [
        ...prev,
        {
          id: response.modelMessageId || (Date.now() + 1).toString(),
          sender: 'ai',
          text: typeof response === 'string' ? response : response?.reply || JSON.stringify(response)
        }
      ])
    } catch (e) {
      console.log('Chat error', e)
      Alert.alert('Error', 'Failed to get response from AI')
    } finally {
      setIsTyping(false)
    }
  }

  const pickImage = async (source: 'camera' | 'gallery') => {
    let result
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need camera permissions to take photos!')
        return
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need media library permissions to pick existing photos!')
        return
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })
    }

    if (!result.canceled) {
      const uri = result.assets[0].uri
      setSelectedImage(uri)
    }
  }

  const handleCameraPress = () => {
    Alert.alert('Attach Photo', 'Choose a photo source', [
      { text: 'Take a Photo', onPress: () => pickImage('camera') },
      { text: 'Choose from Gallery', onPress: () => pickImage('gallery') },
      { text: 'Cancel', style: 'cancel' }
    ])
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: THEME.paper }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Ask Orchid AI</Text>
          <Text style={styles.headerSubtitle}>Expert guidance for your collection</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent]}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && !isTyping ? (
          <ChatEmptyState onPrompt={handleQuickPrompt} />
        ) : (
          <ChatMessageList messages={messages} isTyping={isTyping} />
        )}
      </ScrollView>

      <ChatInputArea
        inputText={inputText}
        setInputText={setInputText}
        selectedImage={selectedImage}
        onClearImage={() => setSelectedImage(null)}
        onSend={handleSend}
        onCameraPress={handleCameraPress}
        paddingBottom={isKeyboardVisible ? (Platform.OS === 'ios' ? 12 : 24) : Math.max(insets.bottom, 24) + 70}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: THEME.ink,
    fontFamily: FONTS.serif
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.inkMuted,
    fontFamily: FONTS.sans,
    marginTop: 2
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20
  }
})
