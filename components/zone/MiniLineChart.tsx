import React from 'react'
import { View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'

export type MiniLineChartProps = {
  values: number[]
  color: string
}

export function MiniLineChart({ values, color }: MiniLineChartProps) {
  if (!values || values.length === 0) return null
  const width = 80
  const height = 30
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = width / Math.max(values.length - 1, 1)
  const points = values
    .map((v, i) => {
      const x = i * stepX
      const y = height - ((v - min) / range) * (height - 6) - 3
      return `${x},${y}`
    })
    .join(' ')

  return (
    <View style={{ marginTop: 8, width: 80, height: 30 }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  )
}
