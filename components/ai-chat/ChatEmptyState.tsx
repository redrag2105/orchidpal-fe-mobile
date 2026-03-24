import { FONTS, THEME } from '@/components/dashboard/theme'
import { Camera, Droplets, Flower2, Leaf, Sun } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export const ChatEmptyState = ({ onPrompt }: { onPrompt: (prompt: string) => void }) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.icon3dContainer}>
        <Flower2 size={64} color='#d6a7d5' strokeWidth={1.5} />
      </View>
      <Text style={styles.emptySubtitle}>Your botanical expert is ready.</Text>

      <View style={{ width: '100%', marginTop: 30 }}>
        <Text style={styles.quickPromptsTitle}>Quick Prompts</Text>
        <View style={styles.promptsGrid}>
          <TouchableOpacity style={styles.promptCard} onPress={() => onPrompt('When to water?')}>
            <View style={[styles.promptIcon, { backgroundColor: '#eef3e8' }]}>
              <Droplets size={24} color={THEME.forest} />
            </View>
            <Text style={styles.promptText}>When to{'\n'}water?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.promptCard} onPress={() => onPrompt('Sunlight needs?')}>
            <View style={[styles.promptIcon, { backgroundColor: '#fcf4dc' }]}>
              <Sun size={24} color='#d4a34b' />
            </View>
            <Text style={styles.promptText}>Sunlight{'\n'}needs?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.promptCard} onPress={() => onPrompt('Is my plant healthy?')}>
            <View style={[styles.promptIcon, { backgroundColor: '#e2f2e5' }]}>
              <Leaf size={24} color='#5e9960' />
            </View>
            <Text style={styles.promptText}>Is my plant{'\n'}healthy?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.promptCard} onPress={() => onPrompt('Identify by photo')}>
            <View style={[styles.promptIcon, { backgroundColor: '#f3e6f9' }]}>
              <Camera size={18} color='#a671c4' />
            </View>
            <Text style={styles.promptText}>Identify{'\n'}by photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40
  },
  icon3dContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: FONTS.sans,
    color: THEME.inkMuted,
    marginBottom: 40,
    fontWeight: '500'
  },
  quickPromptsTitle: {
    fontSize: 17,
    fontFamily: FONTS.sans,
    fontWeight: '700',
    color: THEME.ink,
    marginBottom: 16
  },
  promptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
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
    marginBottom: 4
  },
  promptIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  promptText: {
    fontSize: 13,
    fontFamily: FONTS.sans,
    fontWeight: '600',
    color: THEME.ink,
    lineHeight: 18
  }
})
