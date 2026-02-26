import { CloudSun, Droplets, Power, Thermometer, Wind } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'

export type EnvironmentSnapshot = {
  location: string
  temp: string
  humidity: string
  condition: string
}

export type TrendData = {
  tempSeries: number[]
  moistureSeries: number[]
}

type Props = {
  snapshot: EnvironmentSnapshot
  trends: TrendData
}

export function EnvironmentCard({ snapshot, trends }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <CloudSun size={18} color='white' />
          </View>
          <View>
            <Text style={styles.title}>Environment snapshot</Text>
            <Text style={styles.subtitle}>{snapshot.location}</Text>
          </View>
        </View>
        <Text style={styles.badge}>Realtime</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricMain}>
          <Text style={styles.metricLabel}>Air temperature</Text>
          <Text style={styles.metricValue}>{snapshot.temp}</Text>
          <View style={styles.chipRow}>
            <Thermometer size={14} color='#4a795f' />
            <Text style={styles.chipText}>Optimal for Phalaenopsis</Text>
          </View>
        </View>
        <View style={styles.metricSide}>
          <Text style={styles.metricLabel}>Humidity</Text>
          <Text style={styles.metricValueSmall}>{snapshot.humidity}</Text>
          <View style={styles.chipRow}>
            <Droplets size={13} color='#4a795f' />
            <Text style={styles.chipText}>Stable</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.footerItem}>
          <Wind size={13} color='rgba(0,0,0,0.55)' />
          <Text style={styles.footerText}>Gentle airflow</Text>
        </View>
        <View style={styles.footerDot} />
        <View style={styles.footerItem}>
          <Power size={13} color='rgba(0,0,0,0.55)' />
          <Text style={styles.footerText}>All relays responsive</Text>
        </View>
      </View>

      <View style={styles.trendBlock}>
        <View style={styles.trendLabelRow}>
          <Text style={styles.trendTitle}>24h trends</Text>
          <Text style={styles.trendMeta}>Mini charts for fast scanning</Text>
        </View>
        <MiniLineChart values={trends.tempSeries} color='#4a795f' />
        <MiniLineChart values={trends.moistureSeries} color='#0f766e' />
      </View>
    </View>
  )
}

type MiniLineChartProps = {
  values: number[]
  color: string
}

function MiniLineChart({ values, color }: MiniLineChartProps) {
  if (!values.length) return null

  const width = 100
  const height = 36
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
    <View style={styles.trendChartWrapper}>
      <Svg width='100%' height={height} viewBox={`0 0 ${width} ${height}`}>
        <Polyline
          points={points}
          fill='none'
          stroke={color}
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.98)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a795f',
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  badge: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#ecfdf3',
    color: '#15803d',
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metricMain: {
    flex: 1.2,
    paddingRight: 10,
  },
  metricSide: {
    flex: 1,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.04)',
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.55)',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricValueSmall: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.55)',
  },
  footerRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.55)',
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.16)',
    marginHorizontal: 8,
  },
  trendBlock: {
    marginTop: 10,
  },
  trendLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  trendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  trendMeta: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
  },
  trendChartWrapper: {
    marginTop: 4,
  },
})

