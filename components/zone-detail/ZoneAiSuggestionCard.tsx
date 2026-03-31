import { THEME } from '@/constants/theme'
import { Sparkles } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

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
    <View className='gap-4'>
      <TouchableOpacity
        className='mt-2 flex-row items-center justify-center rounded-full bg-orchid-main/10 px-5 py-3.5'
        onPress={handleAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <ActivityIndicator color={THEME.orchidMain} style={{ marginRight: 8 }} />
        ) : (
          <Sparkles size={20} color={THEME.orchidMain} style={{ marginRight: 8 }} />
        )}
        <Text className='font-sans text-[15px] font-bold text-orchid-main'>Analyze Stats & Get AI Suggestion</Text>
      </TouchableOpacity>

      {aiSuggestion && (
        <View className='mt-3 rounded-[20px] border border-[#f0a934]/30 bg-[#fff4e6]/40 p-4'>
          <View className='mb-2 flex-row items-center'>
            <Sparkles size={16} color={THEME.orchidMain} />
            <Text className='ml-1.5 font-sans text-base font-bold text-orchid-main'>AI Suggestion</Text>
          </View>

          <Text className='mb-3 font-sans text-sm leading-5 text-ink'>{aiSuggestion.analysis?.ai_note}</Text>

          <View className='mb-4 rounded-xl bg-white p-3'>
            <Text className='mb-1.5 font-sans text-[13px] font-bold uppercase tracking-wide text-ink-muted'>
              Suggested Rules:
            </Text>
            {summarizeAiLogic(aiSuggestion.suggestion?.logic_config || []).map((desc, idx) => (
              <Text key={idx} className='mb-1 font-sans text-sm leading-5 text-ink'>
                • {desc}
              </Text>
            ))}
          </View>

          <View className='flex-row justify-end gap-3'>
            <TouchableOpacity className='rounded-full bg-transparent px-5 py-2.5' onPress={() => setAiSuggestion(null)}>
              <Text className='font-sans text-sm font-semibold text-ink-light'>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity className='rounded-full bg-orchid-main px-5 py-2.5' onPress={handleApproveAiRule}>
              <Text className='font-sans text-sm font-semibold text-white'>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}
