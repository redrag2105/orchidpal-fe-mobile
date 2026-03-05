import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { Plus } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  AutomationCard,
  AutomationNextAction,
  AutomationSuggestion,
  DashboardAlert
} from '../../components/dashboard/AutomationCard'
import { EnvironmentCard, EnvironmentSnapshot, TrendData } from '../../components/dashboard/EnvironmentCard'
import { GardenStatus, GardenStatusCard } from '../../components/dashboard/GardenStatusCard'

const ENVIRONMENT_SNAPSHOT: EnvironmentSnapshot = {
  location: 'Da Lat • Greenhouse A',
  temp: '23.4°C',
  humidity: '68% RH',
  condition: 'Mild & bright'
}

const GARDEN_STATUS: GardenStatus = {
  happy: 12,
  warning: 3,
  critical: 1
}

const NEXT_ACTIONS: AutomationNextAction[] = [
  {
    id: 'n1',
    label: 'Morning mist cycle',
    time: 'In 12 min',
    target: 'Rack 01 • Phalaenopsis'
  },
  {
    id: 'n2',
    label: 'Nutrient flush',
    time: 'Today • 18:30',
    target: 'Bench East • Cattleya mix'
  }
]

const AI_SUGGESTION: AutomationSuggestion = {
  title: 'Seasonal mode: early heatwave detected',
  delta: '+1 light mist cycle / day',
  baseline: 'Profile: “Spring Orchid • Default”',
  impact: 'Keeps VPD inside 0.8–1.1 kPa band for blooming zone.'
}

const TREND_DATA: TrendData = {
  tempSeries: [22.1, 22.8, 23.4, 24.0, 23.7, 23.2, 22.9],
  moistureSeries: [54, 57, 60, 59, 58, 56, 55]
}

const PRIORITY_ALERTS: DashboardAlert[] = [
  {
    id: '1',
    level: 'critical',
    title: 'Soil moisture below threshold',
    plant: 'Phalaenopsis Rack 02',
    time: '2 min ago'
  },
  {
    id: '2',
    level: 'warning',
    title: 'High VPD detected during noon peak',
    plant: 'Cattleya Bench West',
    time: '18 min ago'
  },
  {
    id: '3',
    level: 'info',
    title: 'Seasonal suggestion ready',
    plant: 'Global profile “Spring Orchid”',
    time: 'Today • 07:00'
  }
]

export default function Dashboard() {
  const router = useRouter()
  const [tokens, setTokens] = useState<{ accessToken: string | null; refreshToken: string | null }>({
    accessToken: null,
    refreshToken: null
  })

  useEffect(() => {
    const loadTokens = async () => {
      const accessToken = await SecureStore.getItemAsync('access_token')
      const refreshToken = await SecureStore.getItemAsync('refresh_token')
      setTokens({ accessToken, refreshToken })
      console.log('Loaded tokens:', { accessToken, refreshToken })
    }
    loadTokens()
  }, [])

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Today in your sanctuary</Text>
          <Text style={styles.headerTitle}>Orchid overview</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/')}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Debug: Token info card */}
        <View style={styles.tokenCard}>
          <Text style={styles.tokenTitle}>Stored Tokens (Debug)</Text>
          <View style={styles.tokenRow}>
            <Text style={styles.tokenLabel}>Access Token:</Text>
            <Text style={styles.tokenValue} numberOfLines={2}>
              {tokens.accessToken ? `${tokens.accessToken.substring(0, 50)}...` : 'Not found'}
            </Text>
          </View>
          <View style={styles.tokenRow}>
            <Text style={styles.tokenLabel}>Refresh Token:</Text>
            <Text style={styles.tokenValue} numberOfLines={2}>
              {tokens.refreshToken ? `${tokens.refreshToken.substring(0, 50)}...` : 'Not found'}
            </Text>
          </View>
        </View>

        {/* Weather / environment card */}
        <EnvironmentCard snapshot={ENVIRONMENT_SNAPSHOT} trends={TREND_DATA} />

        {/* Garden status */}
        <GardenStatusCard
          status={GARDEN_STATUS}
          onOpenGardenList={() => Alert.alert('Navigation', 'Garden list screen will be implemented next.')}
        />

        {/* Quick actions & schedules & AI & Alerts tied together in AutomationCard */}
        <AutomationCard nextActions={NEXT_ACTIONS} suggestion={AI_SUGGESTION} alerts={PRIORITY_ALERTS} />
      </ScrollView>

      {/* FAB: Add Device */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(modals)/device-setup')} activeOpacity={0.8}>
        <Plus size={24} color='white' strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f3f0'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(0,0,0,0.45)'
  },
  headerTitle: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '700',
    color: '#374151'
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.7)'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14
  },
  tokenCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f59e0b'
  },
  tokenTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 10
  },
  tokenRow: {
    marginBottom: 8
  },
  tokenLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 2
  },
  tokenValue: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#78350f',
    backgroundColor: '#fde68a',
    padding: 6,
    borderRadius: 4
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1f2933',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6
  }
})
