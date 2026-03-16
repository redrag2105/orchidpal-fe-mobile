/**
 * Settings Screen
 * App configuration and account management
 */

import { logout } from '@/apis'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { NotificationBell } from '@/components/dashboard'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { Bell, ChevronRight, CircleUser, HelpCircle, LogOut, Moon, Shield, Smartphone, Wifi } from 'lucide-react-native'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const THEME = {
  paper: '#fdfcf8',
  paperDark: '#f0efea',
  ink: '#14281d',
  inkLight: '#3a5a40',
  orchidMain: '#9f5f80',
  forest: '#4a795f'
}

function SettingsItem({
  icon: Icon,
  label,
  value,
  onPress,
  danger
}: {
  icon: typeof Bell
  label: string
  value?: string
  onPress?: () => void
  danger?: boolean
}) {
  return (
    <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7} onPress={onPress}>
      <HStack style={{ gap: 14, alignItems: 'center', flex: 1 }}>
        <View style={[styles.settingsIcon, danger && styles.settingsIconDanger]}>
          <Icon size={18} color={danger ? '#dc2626' : THEME.forest} strokeWidth={1.5} />
        </View>
        <Text style={[styles.settingsLabel, danger && { color: '#dc2626' }]}>{label}</Text>
      </HStack>
      {value ? <Text style={styles.settingsValue}>{value}</Text> : <ChevronRight size={18} color={THEME.inkLight} />}
    </TouchableOpacity>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </VStack>
  )
}

export default function SettingsScreen() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setIsSigningOut(true)
          try {
            // Call logout API to invalidate server-side session
            await logout()
          } catch (error) {
            // Continue with local logout even if API fails
            console.warn('Logout API failed:', error)
          } finally {
            // Clear local tokens
            await SecureStore.deleteItemAsync('access_token')
            await SecureStore.deleteItemAsync('refresh_token')
            setIsSigningOut(false)
            // Navigate to welcome/login
            router.replace('/(auth)/login')
          }
        }
      }
    ])
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <HStack style={{ paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Settings</Text>
          <NotificationBell />
        </HStack>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile */}
          <TouchableOpacity style={styles.profileCard} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <CircleUser size={32} color={THEME.inkLight} strokeWidth={1.5} />
            </View>
            <VStack style={{ flex: 1 }}>
              <Text style={styles.profileName}>Orchid Lover</Text>
              <Text style={styles.profileEmail}>user@orchidpal.com</Text>
            </VStack>
            <ChevronRight size={20} color={THEME.inkLight} />
          </TouchableOpacity>

          {/* Devices */}
          <SettingsSection title='Devices'>
            <SettingsItem icon={Wifi} label='Connected Devices' value='1' />
            <SettingsItem icon={Smartphone} label='Add New Device' />
          </SettingsSection>

          {/* Preferences */}
          <SettingsSection title='Preferences'>
            <SettingsItem icon={Bell} label='Notifications' />
            <SettingsItem icon={Moon} label='Appearance' value='Light' />
          </SettingsSection>

          {/* Support */}
          <SettingsSection title='Support'>
            <SettingsItem icon={HelpCircle} label='Help Center' />
            <SettingsItem icon={Shield} label='Privacy Policy' />
          </SettingsSection>

          {/* Account */}
          <SettingsSection title='Account'>
            <SettingsItem icon={LogOut} label='Sign Out' danger onPress={handleSignOut} />
          </SettingsSection>

          <Text style={styles.version}>OrchidPal v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.paper
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.ink
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 24
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.paperDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.ink
  },
  profileEmail: {
    fontSize: 13,
    color: THEME.inkLight,
    marginTop: 2
  },
  section: {
    gap: 10
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden'
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)'
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(74,121,95,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  settingsIconDanger: {
    backgroundColor: 'rgba(220,38,38,0.1)'
  },
  settingsLabel: {
    fontSize: 15,
    color: THEME.ink
  },
  settingsValue: {
    fontSize: 14,
    color: THEME.inkLight
  },
  version: {
    fontSize: 12,
    color: THEME.inkLight,
    textAlign: 'center',
    marginTop: 8
  }
})
