import { Platform } from 'react-native'

// Theme constants synced with web
export const THEME = {
  paper: '#fdfcf8',
  paperDark: '#f0efea',
  paperDeep: '#e8e6df',
  ink: '#14281d',
  inkLight: '#3a5a40',
  inkMuted: '#5a7a68',
  orchidMain: '#9f5f80',
  orchidDeep: '#582c4d',
  orchidLight: '#c89bae',
  forest: '#4a795f',
  forestLight: '#6a9b7f',
  clay: '#e6b8a2',
  gold: '#d4a574'
} as const

export const FONTS = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' })
} as const

export type ThemeColors = keyof typeof THEME
