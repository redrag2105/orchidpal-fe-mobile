import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import * as ImagePicker from 'expo-image-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Camera, Mic, Send, Droplets, Sun, Leaf, Search, User, Flower2, ChevronLeft } from 'lucide-react-native'
import { THEME, FONTS } from '@/components/dashboard/theme'
import { useUIStore } from '@/hooks/useUIStore'
import { useRouter, useFocusEffect } from 'expo-router'

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  image?: string;
  suggestions?: string[];
}

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

  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true))
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false))
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  const handleBack = () => {
    if (messages.length > 0) {
      Alert.alert(
        'Exit Conversation',
        'Are you sure you want to exit? Your conversation will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => router.back() }
        ]
      )
    } else {
      router.back()
    }
  }

  const handleSend = () => {
    if (!inputText.trim()) return
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText }
    setMessages([...messages, newMsg])
    setInputText('')
    setIsTyping(true)
    
    // Fake AI reply after 1s
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Hello OrchidPal! Based on your query, let's check some signs.",
        suggestions: ['Detailed diagnosis?', 'Check soil moisture?']
      }])
    }, 1000)
  }

  const handleQuickPrompt = (prompt: string) => {
    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: prompt }
    if (prompt === 'Identify by photo') {
      newMsg.image = 'placeholder';
    }
    setMessages([...messages, newMsg])
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Hello OrchidPal! Based on your photo, this looks like a nutrient deficiency or overwatering. Let's check some signs.",
        suggestions: ['Detailed diagnosis?', 'Check soil moisture?']
      }])
    }, 800)
  }

  const pickImage = async (source: 'camera' | 'gallery') => {
    let result;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need camera permissions to take photos!');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need media library permissions to pick existing photos!');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: '', image: result.assets[0].uri };
      setMessages([...messages, newMsg]);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I see your photo! Let me analyze it... It looks like a healthy orchid. Let me know if you have specific concerns.",
          suggestions: ['When to water?', 'Check sunlight?']
        }]);
      }, 1500);
    }
  };

  const handleCameraPress = () => {
    Alert.alert(
      'Attach Photo',
      'Choose a photo source',
      [
        { text: 'Take a Photo', onPress: () => pickImage('camera') },
        { text: 'Choose from Gallery', onPress: () => pickImage('gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.icon3dContainer}>
        <Flower2 size={64} color="#d6a7d5" strokeWidth={1.5} />
      </View>
      <Text style={styles.emptySubtitle}>Your botanical expert is ready.</Text>

      <View style={{ width: '100%', marginTop: 30 }}>
        <Text style={styles.quickPromptsTitle}>Quick Prompts</Text>
        <View style={styles.promptsGrid}>
          <TouchableOpacity style={styles.promptCard} onPress={() => handleQuickPrompt('When to water?')}>
            <View style={[styles.promptIcon, { backgroundColor: '#eef3e8' }]}>
              <Droplets size={24} color={THEME.forest} />
            </View>
            <Text style={styles.promptText}>When to{'\n'}water?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.promptCard} onPress={() => handleQuickPrompt('Sunlight needs?')}>
            <View style={[styles.promptIcon, { backgroundColor: '#fcf4dc' }]}>
              <Sun size={24} color="#d4a34b" />
            </View>
            <Text style={styles.promptText}>Sunlight{'\n'}needs?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.promptCard} onPress={() => handleQuickPrompt('Is my plant healthy?')}>
            <View style={[styles.promptIcon, { backgroundColor: '#e2f2e5' }]}>
              <Leaf size={24} color="#5e9960" />
            </View>
            <Text style={styles.promptText}>Is my plant{'\n'}healthy?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.promptCard} onPress={() => handleQuickPrompt('Identify by photo')}>
            <View style={[styles.promptIcon, { backgroundColor: '#f3e6f9' }]}>
              <Camera size={18} color="#a671c4" />
            </View>
            <Text style={styles.promptText}>Identify{'\n'}by photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderMessages = () => (
    <View style={styles.messagesContainer}>
      {messages.map((msg, index) => {
        const isUser = msg.sender === 'user'
        if (isUser) {
          return (
            <View key={msg.id} style={styles.userMsgWrapper}>
              <View style={styles.userBubble}>
                {!!msg.text && <Text style={styles.userText}>{msg.text}</Text>}
                {msg.image && (
                  <View style={styles.imageAttachment}>
                    {msg.image === 'placeholder' ? (
                      <View style={{width: 140, height: 100, backgroundColor: '#cce2cb', borderRadius: 12, marginTop: msg.text ? 8 : 0}} />
                    ) : (
                      <Image source={{uri: msg.image}} style={{width: 200, height: 150, borderRadius: 12, marginTop: msg.text ? 8 : 0}} resizeMode="cover" />
                    )}
                  </View>
                )}
              </View>
              <View style={styles.userAvatar}>
                <User size={16} color={THEME.inkLight} />
              </View>
            </View>
          )
        } else {
          return (
            <View key={msg.id} style={styles.aiMsgWrapper}>
              <View style={styles.aiBubbleContainer}>
                <BlurView intensity={40} tint="light" style={styles.aiBubble}>
                  <View style={styles.aiHeaderRow}>
                    <View style={styles.aiAvatarWrapper}><Flower2 size={18} color="#fff" /></View>
                    <Text style={styles.aiText}>{msg.text}</Text>
                  </View>
                </BlurView>
              </View>
              {msg.suggestions && (
                <View style={styles.suggestionsRow}>
                  {msg.suggestions.map((sug, i) => (
                    <TouchableOpacity key={i} style={styles.suggestionChip}>
                      <BlurView intensity={30} tint="light" style={styles.suggestionBlur}>
                        {i === 0 ? <Search size={16} color={THEME.forest} style={{marginRight: 6}} /> : <Droplets size={16} color="#d4a34b" style={{marginRight: 6}} />}
                        <Text style={styles.suggestionText}>{sug}</Text>
                      </BlurView>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )
        }
      })}
      
      {isTyping && (
        <View style={styles.aiMsgWrapper}>
          <View style={[styles.aiBubbleContainer, { width: 100 }]}>
            <BlurView intensity={40} tint="light" style={[styles.aiBubble, { paddingVertical: 12, justifyContent: 'center' }]}>
              <View style={styles.aiHeaderRow}>
                <View style={styles.aiAvatarWrapper}>
                  <Flower2 size={18} color="#fff" />
                </View>
                <ActivityIndicator size="small" color={THEME.orchidMain} style={{ marginLeft: 10, marginTop: 4 }} />
              </View>
            </BlurView>
          </View>
        </View>
      )}
    </View>
  )

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: THEME.paper }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>Ask Orchid AI</Text>
          <Text style={styles.headerSubtitle}>Expert guidance for your collection</Text>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent]}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})}
      >
        {messages.length === 0 && !isTyping ? renderEmptyState() : renderMessages()}
      </ScrollView>

      {/* Bottom Input Area */}
      <View style={[styles.inputContainer, { paddingBottom: isKeyboardVisible ? (Platform.OS === 'ios' ? 12 : 24) : Math.max(insets.bottom, 24) + 70 }]}>
        <View style={styles.inputBubbleShadow}>
          <BlurView intensity={80} tint="light" style={styles.inputBlur}>
            {/* Row 1: Text Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask a question or take a photo..."
                placeholderTextColor={THEME.inkLight}
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
            </View>
            
            {/* Row 2: Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleCameraPress}>
                <View style={styles.cameraBtnBg}>
                  <Camera size={18} color={THEME.forest} />
                </View>
                <Text style={styles.iconLabel}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn}>
                <View style={[styles.cameraBtnBg, styles.voiceBtnBg]}>
                  <Mic size={18} color={THEME.inkLight} />
                </View>
                <Text style={styles.iconLabel}>Voice</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconBtn} onPress={handleSend}>
                <View style={[styles.cameraBtnBg, styles.sendBtnBg]}>
                  <Send size={16} color="white" style={{marginLeft: -2, marginTop: 2}} />
                </View>
                <Text style={[styles.iconLabel, {color: THEME.forest}]}>Send</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </View>
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
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: THEME.ink,
    fontFamily: FONTS.serif,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.inkMuted,
    fontFamily: FONTS.sans,
    marginTop: 2,
  },
  headerHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  icon3dContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: FONTS.sans,
    color: THEME.inkMuted,
    marginBottom: 40,
    fontWeight: '500',
  },
  quickPromptsTitle: {
    fontSize: 17,
    fontFamily: FONTS.sans,
    fontWeight: '700',
    color: THEME.ink,
    marginBottom: 16,
  },
  promptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  promptCard: {
    backgroundColor: 'rgba(255,255,255,0.9)', 
    width: '48%',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 4,
  },
  promptIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  promptText: {
    fontSize: 13,
    fontFamily: FONTS.sans,
    fontWeight: '600',
    color: THEME.ink,
    lineHeight: 18,
  },
  messagesContainer: {
    flex: 1,
    paddingTop: 20,
  },
  userMsgWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  userBubble: {
    backgroundColor: THEME.clay,
    padding: 16,
    borderRadius: 24,
    borderTopRightRadius: 8,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userText: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: THEME.ink,
    lineHeight: 22,
  },
  imageAttachment: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d8eadb',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 4,
  },
  aiMsgWrapper: {
    alignItems: 'flex-start',
    marginBottom: 24,
    maxWidth: '90%',
  },
  aiBubbleContainer: {
    borderRadius: 24,
    borderTopLeftRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  aiBubble: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.5)', 
  },
  aiAvatarWrapper: { width: 32, height: 32, borderRadius: 16, backgroundColor: THEME.orchidMain, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiText: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: THEME.ink,
    lineHeight: 22,
    flex: 1,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  suggestionBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.ink,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputBubbleShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  inputBlur: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 36,
    backgroundColor: 'rgba(253,252,248,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
  },
  inputWrapper: {
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  textInput: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: THEME.ink,
    minHeight: 24,
    maxHeight: 100,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  cameraBtnBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d8eadb', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  voiceBtnBg: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sendBtnBg: {
    backgroundColor: THEME.forest,
    shadowColor: THEME.forest,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.inkLight,
  },
})
