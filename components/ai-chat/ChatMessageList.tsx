import { FONTS, THEME } from '@/components/dashboard/theme'
import { ChatMessage } from '@/types/chat.types'
import { BlurView } from 'expo-blur'
import { Droplets, Flower2, Search, User } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Markdown from 'react-native-markdown-display'

interface ChatMessageListProps {
  messages: ChatMessage[]
  isTyping: boolean
}

export const ChatMessageList = ({ messages, isTyping }: ChatMessageListProps) => {
  return (
    <View style={styles.messagesContainer}>
      {messages.map((msg) => {
        const isUser = msg.sender === 'user'
        if (isUser) {
          return (
            <View key={msg.id} style={styles.userMsgWrapper}>
              <View style={styles.userBubble}>
                {!!msg.text && <Text style={styles.userText}>{msg.text}</Text>}
                {msg.image && (
                  <View style={styles.imageAttachment}>
                    {msg.image === 'placeholder' ? (
                      <View
                        style={{
                          width: 140,
                          height: 100,
                          backgroundColor: '#cce2cb',
                          borderRadius: 12,
                          marginTop: msg.text ? 8 : 0
                        }}
                      />
                    ) : (
                      <Image
                        source={{ uri: msg.image }}
                        style={{ width: 200, height: 150, borderRadius: 12, marginTop: msg.text ? 8 : 0 }}
                        resizeMode='cover'
                      />
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
                <BlurView intensity={40} tint='light' style={styles.aiBubble}>
                  <View style={styles.aiHeaderRow}>
                    <View style={styles.aiAvatarWrapper}>
                      <Flower2 size={18} color='#fff' />
                    </View>
                    <View style={styles.aiTextWrapper}>
                      <Markdown style={markdownStyles}>{msg.text || ''}</Markdown>
                    </View>
                  </View>
                </BlurView>
              </View>
              {msg.suggestions && (
                <View style={styles.suggestionsRow}>
                  {msg.suggestions.map((sug, i) => (
                    <TouchableOpacity key={i} style={styles.suggestionChip}>
                      <BlurView intensity={30} tint='light' style={styles.suggestionBlur}>
                        {i === 0 ? (
                          <Search size={16} color={THEME.forest} style={{ marginRight: 6 }} />
                        ) : (
                          <Droplets size={16} color='#d4a34b' style={{ marginRight: 6 }} />
                        )}
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
            <BlurView
              intensity={40}
              tint='light'
              style={[styles.aiBubble, { paddingVertical: 12, justifyContent: 'center' }]}
            >
              <View style={styles.aiHeaderRow}>
                <View style={styles.aiAvatarWrapper}>
                  <Flower2 size={18} color='#fff' />
                </View>
                <ActivityIndicator size='small' color={THEME.orchidMain} style={{ marginLeft: 10, marginTop: 4 }} />
              </View>
            </BlurView>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
    paddingTop: 20
  },
  userMsgWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginBottom: 20
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
    elevation: 2
  },
  userText: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: THEME.ink,
    lineHeight: 22
  },
  imageAttachment: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d8eadb',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 4
  },
  aiMsgWrapper: {
    alignItems: 'flex-start',
    marginBottom: 4, // Reduced from 24 to cut huge space
    maxWidth: '90%'
  },
  aiBubbleContainer: {
    borderRadius: 24,
    borderTopLeftRadius: 8,
    overflow: 'hidden',
    marginBottom: 4
  },
  aiBubble: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  aiAvatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.orchidMain,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  aiTextWrapper: {
    flexShrink: 1
  },
  aiText: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: THEME.ink,
    lineHeight: 22
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  suggestionChip: {
    borderRadius: 20,
    overflow: 'hidden'
  },
  suggestionBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.6)'
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.ink
  }
})

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 15,
    fontFamily: FONTS.sans,
    color: THEME.ink,
    lineHeight: 22
  },
  strong: {
    fontWeight: 'bold'
  },
  em: {
    fontStyle: 'italic'
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4 // Reduced from 8
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4 // Reduced from 8
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0 // Was 8, removing block margins to keep it tight
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  }
})
