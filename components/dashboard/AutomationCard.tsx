import { AlertTriangle, Zap } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export type AutomationNextAction = {
  id: string
  label: string
  time: string
  target: string
}

export type AutomationSuggestion = {
  title: string
  delta: string
  baseline: string
  impact: string
}

export type DashboardAlert = {
  id: string
  level: 'critical' | 'warning' | 'info'
  title: string
  plant: string
  time: string
}

type Props = {
  nextActions: AutomationNextAction[]
  suggestion: AutomationSuggestion
  alerts: DashboardAlert[]
}

export function AutomationCard({ nextActions, suggestion, alerts }: Props) {
  return (
    <View style={styles.card}>
      {/* Quick actions & schedules */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCirclePrimary}>
            <Zap size={18} color='white' />
          </View>
          <View>
            <Text style={styles.title}>Control & schedules</Text>
            <Text style={styles.subtitle}>Most used actions today</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickRow}>
        <View style={styles.quickTile}>
          <Text style={styles.quickLabel}>Irrigation</Text>
          <Text style={styles.quickValue}>All zones • Auto</Text>
          <Text style={styles.quickMeta}>Next run: 07:00</Text>
        </View>

        <View style={styles.quickTile}>
          <Text style={styles.quickLabel}>Grow lights</Text>
          <Text style={styles.quickValue}>Bench East • On</Text>
          <Text style={styles.quickMeta}>Until: 21:15</Text>
        </View>
      </View>

      <View style={styles.nextActionsHeader}>
        <Text style={styles.nextActionsTitle}>Upcoming actions</Text>
        <Text style={styles.nextActionsSubtitle}>Generated from your rules</Text>
      </View>

      {nextActions.map(item => (
        <View key={item.id} style={styles.nextRow}>
          <View style={styles.nextBullet} />
          <View style={styles.nextContent}>
            <Text style={styles.nextLabel}>{item.label}</Text>
            <Text style={styles.nextTarget}>{item.target}</Text>
          </View>
          <Text style={styles.nextTime}>{item.time}</Text>
        </View>
      ))}

      {/* AI suggestion */}
      <View style={styles.sectionDivider} />

      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCirclePrimary}>
            <Zap size={18} color='white' />
          </View>
          <View>
            <Text style={styles.title}>AI seasonal insight</Text>
            <Text style={styles.subtitle}>Review before applying</Text>
          </View>
        </View>
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>{suggestion.title}</Text>
        <View style={styles.aiDeltaRow}>
          <View style={styles.aiDeltaPill}>
            <Text style={styles.aiDeltaText}>{suggestion.delta}</Text>
          </View>
          <Text style={styles.aiBaseline}>{suggestion.baseline}</Text>
        </View>
        <Text style={styles.aiImpact}>{suggestion.impact}</Text>

        <View style={styles.aiActionsRow}>
          <TouchableOpacity style={styles.aiPrimaryButton}>
            <Text style={styles.aiPrimaryText}>Apply suggestion</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.aiSecondaryButton}>
            <Text style={styles.aiSecondaryText}>Adjust & compare</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Alerts */}
      <View style={styles.sectionDivider} />

      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircleWarning}>
            <AlertTriangle size={18} color='#b45309' />
          </View>
          <View>
            <Text style={styles.title}>Priority alerts</Text>
            <Text style={styles.subtitle}>Sorted by impact</Text>
          </View>
        </View>
      </View>

      {alerts.map(alert => (
        <View key={alert.id} style={styles.alertRow}>
          <View style={styles.alertDotColumn}>
            <View
              style={[
                styles.alertDot,
                alert.level === 'critical'
                  ? { backgroundColor: '#dc2626' }
                  : alert.level === 'warning'
                  ? { backgroundColor: '#eab308' }
                  : { backgroundColor: '#60a5fa' },
              ]}
            />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertPlant}>{alert.plant}</Text>
            <Text style={styles.alertTime}>{alert.time}</Text>
          </View>
          <TouchableOpacity style={styles.alertAction}>
            <Text style={styles.alertActionText}>Review</Text>
          </TouchableOpacity>
        </View>
      ))}
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
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCirclePrimary: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a795f',
    marginRight: 10,
  },
  iconCircleWarning: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3c7',
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
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  quickTile: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  quickLabel: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 2,
  },
  quickValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  quickMeta: {
    marginTop: 2,
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
  },
  nextActionsHeader: {
    marginTop: 4,
    marginBottom: 4,
  },
  nextActionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  nextActionsSubtitle: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  nextBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#368358',
    marginRight: 8,
  },
  nextContent: {
    flex: 1,
  },
  nextLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  nextTarget: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.55)',
  },
  nextTime: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.55)',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 10,
  },
  aiCard: {
    borderRadius: 18,
    padding: 10,
    backgroundColor: '#f8fafc',
    marginBottom: 10,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  aiDeltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  aiDeltaPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#ecfdf3',
  },
  aiDeltaText: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '500',
  },
  aiBaseline: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.55)',
  },
  aiImpact: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.7)',
    marginTop: 2,
    marginBottom: 8,
  },
  aiActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  aiPrimaryButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#111827',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPrimaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  aiSecondaryButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'white',
  },
  aiSecondaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  alertDotColumn: {
    width: 20,
    alignItems: 'center',
    paddingTop: 6,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertContent: {
    flex: 1,
    paddingRight: 8,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  alertPlant: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 2,
  },
  alertTime: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.45)',
    marginTop: 2,
  },
  alertAction: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  alertActionText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#111827',
  },
})

