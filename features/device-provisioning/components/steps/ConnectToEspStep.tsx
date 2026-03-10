/**
 * Connect to ESP Step Component
 * Botanical luxury styled WiFi configuration guide
 */

import { AlertCircle, ArrowRight, RefreshCw, Settings, Wifi } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useDeviceStatus } from '../../hooks'

// Theme constants
const THEME = {
  paper: '#fdfcf8',
  paperDark: '#f5f4ef',
  ink: '#14281d',
  inkLight: '#3a5a40',
  inkMuted: '#5a7a68',
  forest: '#4a795f',
  forestLight: 'rgba(74, 121, 95, 0.1)',
  orchidMain: '#9f5f80',
  orchidLight: 'rgba(159, 95, 128, 0.1)',
  clay: '#e6b8a2',
  info: '#3b82f6',
  infoBg: '#eff6ff',
  warning: '#d97706'
}

const FONTS = {
  serif: Platform.select({ ios: 'Georgia', default: 'serif' })
}

interface ConnectToEspStepProps {
  espWifiName: string
  serialNumber: string
  onConnected: () => void
}

export function ConnectToEspStep({ espWifiName, serialNumber, onConnected }: ConnectToEspStepProps) {
  const { isOnline, isChecking, lastCheckedAt, refresh } = useDeviceStatus({
    serialNumber,
    pollInterval: 5000,
    initialDelay: 3000,
    enabled: true
  })

  const openWifiSettings = async () => {
    if (Platform.OS === 'ios') {
      Linking.openSettings()
    } else {
      Linking.sendIntent('android.settings.WIFI_SETTINGS')
    }
  }

  const formatLastChecked = () => {
    if (!lastCheckedAt) return null
    return lastCheckedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
      {/* Icon */}
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.iconContainer}>
        <Wifi size={44} color={THEME.orchidMain} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text entering={FadeInDown.delay(150).duration(300)} style={styles.title}>
        Connect to Device WiFi
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(200).duration(300)} style={styles.subtitle}>
        Go to your phone's WiFi settings and connect to the device network:
      </Animated.Text>

      {/* WiFi name */}
      <Animated.View entering={FadeIn.delay(250).duration(300)} style={styles.wifiCard}>
        <Wifi size={24} color={THEME.orchidMain} />
        <Animated.Text style={styles.wifiName} numberOfLines={1}>
          {espWifiName}
        </Animated.Text>
      </Animated.View>

      {/* Instructions */}
      <Animated.View entering={FadeIn.delay(300).duration(300)} style={styles.infoCard}>
        <AlertCircle size={18} color={THEME.info} />
        <Animated.Text style={styles.infoText}>
          A configuration page will appear automatically after connecting. Enter your home WiFi credentials there.
        </Animated.Text>
      </Animated.View>

      {/* Open WiFi Settings button */}
      <Animated.View entering={FadeInUp.delay(350).duration(300)} style={styles.fullWidth}>
        <Pressable style={styles.outlineBtn} onPress={openWifiSettings}>
          <Settings size={18} color={THEME.forest} />
          <Animated.Text style={styles.outlineBtnText}>Open WiFi Settings</Animated.Text>
        </Pressable>
      </Animated.View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Status section */}
      <Animated.View entering={FadeIn.delay(400).duration(300)} style={styles.fullWidth}>
        {isOnline ? (
          // Device is online - show success
          <View style={styles.successStatus}>
            <View style={styles.onlineDot} />
            <Animated.Text style={styles.successText}>Device is online! You can proceed.</Animated.Text>
          </View>
        ) : (
          // Device is offline - show status with refresh
          <View style={styles.pendingStatus}>
            <View style={styles.pendingInfo}>
              <View style={styles.pendingRow}>
                <View style={styles.offlineDot} />
                <Animated.Text style={styles.pendingText}>Waiting for device to come online...</Animated.Text>
              </View>
              {lastCheckedAt && (
                <Animated.Text style={styles.lastChecked}>Last checked: {formatLastChecked()}</Animated.Text>
              )}
            </View>
            <Pressable style={styles.refreshBtn} onPress={refresh} disabled={isChecking}>
              {isChecking ? (
                <ActivityIndicator size='small' color={THEME.forest} />
              ) : (
                <RefreshCw size={18} color={THEME.forest} />
              )}
            </Pressable>
          </View>
        )}
      </Animated.View>

      {/* Continue button */}
      <Animated.View entering={FadeInUp.delay(450).duration(300)} style={styles.fullWidth}>
        <Pressable
          style={[styles.primaryBtn, !isOnline && styles.btnDisabled]}
          onPress={onConnected}
          disabled={!isOnline}
        >
          <Animated.Text style={[styles.primaryBtnText, !isOnline && styles.btnTextDisabled]}>
            I've Configured WiFi
          </Animated.Text>
          <ArrowRight size={18} color={isOnline ? 'white' : '#9ca3af'} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.paper,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: THEME.ink,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 4
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: THEME.orchidLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.serif,
    fontWeight: '500',
    color: THEME.ink,
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: THEME.inkMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  wifiCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: THEME.orchidLight,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(159, 95, 128, 0.15)',
    marginBottom: 16
  },
  wifiName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: THEME.orchidMain
  },
  infoCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: THEME.infoBg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: THEME.info,
    lineHeight: 18
  },
  fullWidth: {
    width: '100%'
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: THEME.clay,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: 'transparent'
  },
  outlineBtnText: {
    color: THEME.forest,
    fontSize: 15,
    fontWeight: '600'
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 20
  },
  successStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: THEME.forestLight,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.forest
  },
  successText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: THEME.forest
  },
  pendingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  pendingInfo: {
    flex: 1,
    gap: 4
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.warning
  },
  pendingText: {
    fontSize: 14,
    color: THEME.inkMuted
  },
  lastChecked: {
    fontSize: 12,
    color: THEME.inkMuted,
    opacity: 0.7
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.paper
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: THEME.forest,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: THEME.forest,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  btnDisabled: {
    backgroundColor: THEME.paperDark,
    shadowOpacity: 0
  },
  btnTextDisabled: {
    color: '#9ca3af'
  }
})
