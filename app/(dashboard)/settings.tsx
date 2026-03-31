/**
 * Settings Screen
 * App configuration and account management
 */

import { logout } from '@/apis/auth.api'
import { NotificationBell } from '@/components/dashboard'
import { THEME } from '@/constants/theme'
import { useDevices } from '@/hooks/queries/useDevices'
import { useDynamicBottomTab } from '@/hooks/useDynamicBottomTab'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { Bell, ChevronRight, CircleUser, HelpCircle, LogOut, Moon, Shield, Smartphone, Wifi } from 'lucide-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

function SettingsItem({
  icon: Icon,
  label,
  value,
  onPress,
  danger
}: {
  icon: any
  label: string
  value?: string
  onPress?: () => void
  danger?: boolean
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className='flex-row items-center border-b border-[rgba(0,0,0,0.04)] px-4 py-3.5'
    >
      <View
        className={`mr-3.5 h-9 w-9 items-center justify-center rounded-[10px] ${
          danger ? 'bg-[rgba(220,38,38,0.1)]' : 'bg-forest/10'
        }`}
      >
        <Icon size={18} color={danger ? '#dc2626' : THEME.forest} />
      </View>
      <Text className={`flex-1 font-sans text-[15px] font-medium ${danger ? 'text-[#dc2626]' : 'text-ink'}`}>
        {label}
      </Text>
      {value && <Text className='mr-2 font-sans text-sm text-ink-light'>{value}</Text>}
      {onPress && <ChevronRight size={18} color={THEME.inkLight} />}
    </TouchableOpacity>
  )
}

export default function SettingsScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const handleScroll = useDynamicBottomTab()
  const { data: apiResponse } = useDevices()
  const devices = apiResponse?.data || []

  const [profile, setProfile] = useState<{ email?: string; id?: string }>({})

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries()
    setRefreshing(false)
  }, [queryClient])

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await SecureStore.getItemAsync('user_profile')
        if (stored) {
          setProfile(JSON.parse(stored))
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadProfile()
  }, [])

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out of OrchidPal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout()
            await SecureStore.deleteItemAsync('token')
            queryClient.clear()
            router.replace('/(auth)/login' as any)
          } catch (error) {
            console.error('Logout failed', error)
            Alert.alert('Error', 'Failed to log out cleanly. You have been forced out locally.')
            await SecureStore.deleteItemAsync('token')
            queryClient.clear()
            router.replace('/(auth)/login' as any)
          }
        }
      }
    ])
  }

  const onlineDevices = devices.filter((d: { status: string }) => d.status === 'ONLINE').length

  return (
    <View className='flex-1 bg-paper'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <View className='flex-row items-center justify-between px-5 pb-2 pt-4'>
          <Text className='py-2 font-serif text-[28px] font-semibold leading-9 text-ink'>Settings</Text>
          <NotificationBell />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 24 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.forest} />}
        >
          <View className='elevation-1 flex-row items-center gap-3.5 rounded-[18px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'>
            <View className='h-14 w-14 items-center justify-center rounded-full bg-paper-dark'>
              <CircleUser size={28} color={THEME.inkMuted} strokeWidth={1.5} />
            </View>
            <View className='flex-1 justify-center'>
              <Text className='font-sans text-base font-semibold text-ink'>
                {profile.email?.split('@')[0] || 'Guest User'}
              </Text>
              <Text className='mt-0.5 font-sans text-[13px] text-ink-light'>{profile.email || 'Not logged in'}</Text>
            </View>
            <TouchableOpacity className='rounded-full bg-paper-dark px-4 py-2'>
              <Text className='font-sans text-xs font-semibold text-ink'>Edit</Text>
            </TouchableOpacity>
          </View>

          <View className='gap-2.5'>
            <Text className='px-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-light'>
              Preferences
            </Text>
            <View className='overflow-hidden rounded-2xl bg-white'>
              <SettingsItem icon={Bell} label='Notifications' value='Enabled' onPress={() => {}} />
              <SettingsItem icon={Moon} label='Appearance' value='Light' onPress={() => {}} />
            </View>
          </View>

          <View className='gap-2.5'>
            <Text className='px-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-light'>
              Smart Environment
            </Text>
            <View className='overflow-hidden rounded-2xl bg-white'>
              <SettingsItem
                icon={Wifi}
                label='IoT Network'
                value={`${onlineDevices}/${devices.length} Online`}
                onPress={() => {}}
              />
              <SettingsItem
                icon={Smartphone}
                label='Paired Devices'
                value={String(devices.length)}
                onPress={() => {}}
              />
            </View>
          </View>

          <View className='gap-2.5'>
            <Text className='px-1 font-sans text-xs font-semibold uppercase tracking-wide text-ink-light'>Support</Text>
            <View className='overflow-hidden rounded-2xl bg-white'>
              <SettingsItem icon={HelpCircle} label='Help Center' onPress={() => {}} />
              <SettingsItem icon={Shield} label='Privacy Policy' onPress={() => {}} />
            </View>
          </View>

          <View className='mt-2 gap-2.5'>
            <View className='overflow-hidden rounded-2xl bg-white'>
              <SettingsItem icon={LogOut} label='Log Out' danger onPress={handleLogout} />
            </View>
          </View>

          <Text className='mt-2 text-center font-sans text-xs text-ink-light'>OrchidPal v1.0.0 (Build 34)</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
