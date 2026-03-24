import { FONTS, THEME } from '@/components/dashboard/theme'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { Zap, ZapOff } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type AutomationRulesListProps = {
  rules: any[] // TODO: strongly type this
  onOpenRule: (rule: any) => void
}

const summarizeRule = (rule: any) => {
  if (rule.condition && rule.action) return `When ${rule.condition}, ${rule.action}`
  const logic = rule.logic_config?.[0]
  if (!logic) return 'No logic defined'

  // Convert logic operators to human readable language
  const metricMap: Record<string, string> = {
    temp: 'temperature',
    temperature: 'temperature',
    moisture: 'soil moisture',
    soil_moisture: 'soil moisture',
    humidity: 'air humidity',
    light: 'light level'
  }
  const opMap: Record<string, string> = {
    '>': 'rises above',
    '<': 'drops below',
    '>=': 'is at least',
    '<=': 'is at most',
    '==': 'is exactly'
  }
  const metric = metricMap[logic.if.metric] || logic.if.metric
  const op = opMap[logic.if.op] || logic.if.op
  const action = logic.then.action?.replace(/_/g, ' ') || 'action'
  const durationSecs = logic.then.duration_ms ? Math.round(logic.then.duration_ms / 1000) : 0

  return `When ${metric} ${op} ${logic.if.value}, turn on ${action} for ${durationSecs}s`
}

export function AutomationRulesList({ rules, onOpenRule }: AutomationRulesListProps) {
  const activeRules = rules.filter((r) => r.is_active)
  const inactiveRules = rules.filter((r) => !r.is_active)

  // Sort inactive rules by created_at descending (latest first)
  const sortedInactive = inactiveRules.sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
    return timeB - timeA
  })

  const displayRules = [...activeRules, ...(sortedInactive.length > 0 ? [sortedInactive[0]] : [])]

  return (
    <View style={styles.section}>
      <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={styles.sectionTitle}>Automation Rules</Text>
      </HStack>

      {displayRules.length > 0 ? (
        <VStack style={{ gap: 12 }}>
          {displayRules.map((rule: any) => (
            <TouchableOpacity
              key={rule.id}
              style={[styles.ruleCard, !rule.is_active && styles.ruleCardInactive]}
              onPress={() => onOpenRule(rule)}
              activeOpacity={0.8}
            >
              <View style={[styles.ruleIcon, !rule.is_active && styles.ruleIconInactive]}>
                {rule.is_active ? (
                  <Zap size={20} color={THEME.orchidMain} fill={THEME.orchidMain} fillOpacity={0.2} />
                ) : (
                  <ZapOff size={20} color={THEME.inkMuted} />
                )}
              </View>

              <VStack style={{ flex: 1, gap: 4 }}>
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.ruleName, !rule.is_active && styles.ruleNameInactive]} numberOfLines={1}>
                    {rule.name}
                  </Text>

                  <View
                    style={[styles.statusPill, rule.is_active ? styles.statusPillActive : styles.statusPillInactive]}
                  >
                    <View
                      style={[styles.statusDot, rule.is_active ? styles.statusDotActive : styles.statusDotInactive]}
                    />
                    <Text
                      style={[styles.statusText, rule.is_active ? styles.statusTextActive : styles.statusTextInactive]}
                    >
                      {rule.is_active ? 'Running' : 'Paused'}
                    </Text>
                  </View>
                </HStack>
                <Text style={[styles.ruleDetail, !rule.is_active && styles.ruleDetailInactive]} numberOfLines={2}>
                  {summarizeRule(rule)}
                </Text>
              </VStack>
            </TouchableOpacity>
          ))}
        </VStack>
      ) : (
        <View style={styles.card}>
          <Text style={styles.emptyText}>No automation rules set.</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: FONTS.serif,
    color: THEME.ink
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3
  },
  emptyText: {
    fontSize: 15,
    color: THEME.inkLight,
    marginBottom: 20,
    textAlign: 'center'
  },
  ruleCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  ruleCardInactive: {
    backgroundColor: '#FAFAFA',
    borderColor: '#F0F0F0',
    elevation: 0,
    shadowOpacity: 0,
    opacity: 0.85
  },
  ruleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(159, 95, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ruleIconInactive: {
    backgroundColor: THEME.paperDark
  },
  ruleName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.ink,
    flex: 1,
    marginRight: 8
  },
  ruleNameInactive: {
    color: THEME.inkLight
  },
  ruleDetail: {
    fontSize: 14,
    color: THEME.inkLight,
    lineHeight: 20
  },
  ruleDetailInactive: {
    color: THEME.inkMuted
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1
  },
  statusPillActive: {
    backgroundColor: 'rgba(74, 121, 95, 0.06)',
    borderColor: 'rgba(74, 121, 95, 0.2)'
  },
  statusPillInactive: {
    backgroundColor: 'transparent',
    borderColor: THEME.paperDark
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  statusDotActive: {
    backgroundColor: THEME.forest,
    shadowColor: THEME.forest,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2
  },
  statusDotInactive: {
    backgroundColor: THEME.inkMuted
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statusTextActive: {
    color: THEME.forest
  },
  statusTextInactive: {
    color: THEME.inkMuted
  }
})
