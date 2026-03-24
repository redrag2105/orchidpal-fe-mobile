import React from 'react'
import { Text } from 'react-native'

export const FormattedText = ({ text, style }: { text: string; style: any }) => {
  if (!text) return null
  const strText = String(text)
  const parts = strText.split(/(\*\*.*?\*\*)/g)

  // Ensure parts are not completely empty and have proper React Native Text wrapping without causing errors
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (!part) return null // handle empty splits
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={index} style={{ fontWeight: 'bold' }}>
              {part.slice(2, -2)}
            </Text>
          )
        }
        return <Text key={index}>{part}</Text>
      })}
    </Text>
  )
}
