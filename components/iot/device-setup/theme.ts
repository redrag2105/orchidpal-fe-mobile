import { Platform } from 'react-native'

/**
 * Device Setup Theme Constants
 * Shared theme colors for all device setup components
 */

export const THEME = {
  paper: '#fdfcf8',
  paperDark: '#f0efea',
  ink: '#14281d',
  inkLight: '#3a5a40',
  inkMuted: '#8a9a90',
  orchidMain: '#9f5f80',
  orchidDeep: '#582c4d',
  forest: '#4a795f',
  clay: '#e6b8a2'
} as const

export const FONTS = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' })
} as const

export type ThemeColor = keyof typeof THEME
