import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { Text } from '@/components/ui/text'
import { THEME } from '@/components/dashboard/theme'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// Parent 'body' padding: 24 (left/right = 48)
// 'LinkedDeviceCard' padding: 20 (left/right = 40)
// Total padding = 88. 
// Available screen width for the whole chart component = SCREEN_WIDTH - 88
// Y-Axis takes about 40px width.
// Chart drawing area = (SCREEN_WIDTH - 88) - 40 = SCREEN_WIDTH - 128
const CHART_WIDTH = SCREEN_WIDTH - 130
const SPACING = (CHART_WIDTH - 20) / 12 // 10 initial + 10 end = 20

export function DeviceDataChart() {
  const [activeTab, setActiveTab] = useState<'temp' | 'humidity' | 'light' | 'moisture'>('temp')

  const TABS = [
    { id: 'temp', label: 'Temp', color: THEME.orchidMain },
    { id: 'humidity', label: 'Humidity', color: '#3b82f6' },
    { id: 'light', label: 'Light', color: THEME.gold },
    { id: 'moisture', label: 'Moisture', color: THEME.forest }
  ]

  // Mock 24-hour data (every 2 hours)
  const chartData = {
    temp: [
      { value: 22, label: '00' }, { value: 21, label: '02' }, { value: 21, label: '04' },
      { value: 22, label: '06' }, { value: 24, label: '08' }, { value: 26, label: '10' },
      { value: 29, label: '12' }, { value: 31, label: '14' }, { value: 30, label: '16' },
      { value: 28, label: '18' }, { value: 25, label: '20' }, { value: 23, label: '22' },
      { value: 22, label: '24' }
    ],
    humidity: [
      { value: 65, label: '00' }, { value: 68, label: '02' }, { value: 70, label: '04' },
      { value: 72, label: '06' }, { value: 65, label: '08' }, { value: 60, label: '10' },
      { value: 55, label: '12' }, { value: 50, label: '14' }, { value: 52, label: '16' },
      { value: 58, label: '18' }, { value: 62, label: '20' }, { value: 64, label: '22' },
      { value: 65, label: '24' }
    ],
    light: [
      { value: 0, label: '00' }, { value: 0, label: '02' }, { value: 0, label: '04' },
      { value: 20, label: '06' }, { value: 50, label: '08' }, { value: 80, label: '10' },
      { value: 100, label: '12' }, { value: 95, label: '14' }, { value: 70, label: '16' },
      { value: 30, label: '18' }, { value: 0, label: '20' }, { value: 0, label: '22' },
      { value: 0, label: '24' }
    ],
    moisture: [
      { value: 45, label: '00' }, { value: 44, label: '02' }, { value: 43, label: '04' },
      { value: 42, label: '06' }, { value: 40, label: '08' }, { value: 80, label: '10' },
      { value: 75, label: '12' }, { value: 70, label: '14' }, { value: 65, label: '16' },
      { value: 60, label: '18' }, { value: 55, label: '20' }, { value: 50, label: '22' },
      { value: 45, label: '24' }
    ]
  }

  const activeColor = TABS.find((t) => t.id === activeTab)?.color || THEME.forest
  const data = chartData[activeTab]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>24h Environment Trends</Text>
      <View style={styles.tabs}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && { backgroundColor: tab.color }]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text style={[styles.tabText, isActive && { color: 'white' }]} numberOfLines={1}>{tab.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.chartWrapper}>
        <LineChart
          data={data}
          width={CHART_WIDTH}
          height={220}
          spacing={SPACING}
          initialSpacing={10}
          endSpacing={10}

          color1={activeColor}
          textColor1={activeColor}
          dataPointsColor1={activeColor}
          startFillColor1={activeColor}
          endFillColor1={activeColor}
          startOpacity={0.2}
          endOpacity={0.05}
          thickness={3}
          hideRules
          hideYAxisText={false}
          yAxisLabelWidth={40}
          yAxisTextStyle={{ color: THEME.inkLight, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: THEME.inkLight, fontSize: 10, width: 40, marginLeft: -10 }}
          yAxisColor={THEME.paperDeep}
          xAxisColor={THEME.paperDeep}
          curved
          isAnimated
          animationDuration={1200}
          areaChart
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: activeColor,
            radius: 6,
            pointerLabelWidth: 80,
            pointerLabelHeight: 30,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: any) => {
              return (
                <View
                  style={{
                    height: 30,
                    width: 70,
                    justifyContent: 'center',
                    backgroundColor: '#1E1E1E',
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    {items[0].value} {activeTab === 'temp' ? '°C' : '%'}
                  </Text>
                </View>
              )
            },
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingTop: 16,
    marginTop: 0,
    borderWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.ink,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(20,40,29,0.05)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.inkLight,
  },
  chartWrapper: {
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 10
  }
})
