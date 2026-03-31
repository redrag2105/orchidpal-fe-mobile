import { THEME } from '@/constants/theme'
import { Bell } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

interface NotificationBellProps extends TouchableOpacityProps {
  color?: string
  size?: number
  hasNotification?: boolean
}

export const NotificationBell = ({
  color = THEME.ink,
  size = 20,
  hasNotification = true,
  style,
  ...props
}: NotificationBellProps) => {
  return (
    <TouchableOpacity style={[styles.headerBtn, style]} {...props}>
      <Bell size={size} color={color} strokeWidth={1.5} />
      {hasNotification && <View style={styles.notifDot} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.orchidMain
  }
})
