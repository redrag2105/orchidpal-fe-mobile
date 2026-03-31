import { THEME } from '@/constants/theme'
import { Sparkles } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { zoneStyles as styles } from './ZoneDetailStyles'

interface ZoneAiSuggestionCardProps {
  isAnalyzing: boolean
  handleAnalyze: () => void
  aiSuggestion: any
  setAiSuggestion: React.Dispatch<React.SetStateAction<any>>
  handleApproveAiRule: () => void
  summarizeAiLogic: (logicArr: any[]) => string[]
}

export function ZoneAiSuggestionCard({
  isAnalyzing,
  handleAnalyze,
  aiSuggestion,
  setAiSuggestion,
  handleApproveAiRule,
  summarizeAiLogic
}: ZoneAiSuggestionCardProps) {
  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.aiButton} onPress={handleAnalyze} disabled={isAnalyzing}>
        {isAnalyzing ? (
          <ActivityIndicator color={THEME.orchidMain} style={{ marginRight: 8 }} />
        ) : (
          <Sparkles size={20} color={THEME.orchidMain} style={{ marginRight: 8 }} />
        )}
        <Text style={styles.aiButtonText}>Analyze Stats & Get AI Suggestion</Text>
      </TouchableOpacity>

      {aiSuggestion && (
        <View style={styles.aiCard}>
          <View style={styles.aiCardHeader}>
            <Sparkles size={16} color={THEME.orchidMain} />
            <Text style={styles.aiCardTitle}>AI Suggestion</Text>
          </View>

          <Text style={styles.aiNote}>{aiSuggestion.analysis?.ai_note}</Text>

          <View style={styles.aiLogicContainer}>
            <Text style={styles.aiLogicTitle}>Suggested Rules:</Text>
            {summarizeAiLogic(aiSuggestion.suggestion?.logic_config || []).map((desc, idx) => (
              <Text key={idx} style={styles.aiLogicText}>
                • {desc}
              </Text>
            ))}
          </View>

          <View style={styles.aiActions}>
            <TouchableOpacity
              style={[styles.aiActionButton, styles.aiButtonDismiss]}
              onPress={() => setAiSuggestion(null)}
            >
              <Text style={styles.aiButtonDismissText}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.aiActionButton, styles.aiButtonApprove]} onPress={handleApproveAiRule}>
              <Text style={styles.aiButtonApproveText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}
