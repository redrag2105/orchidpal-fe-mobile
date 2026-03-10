/**
 * Devices Theme Constants
 * Shared colors and fonts for device components
 */

import { Platform } from 'react-native'

export const THEME = {
  paper: '#fdfcf8',
  paperDark: '#f0efea',
  paperDeep: '#e8e6df',
  ink: '#14281d',
  inkLight: '#3a5a40',
  inkMuted: '#5a7a68',
  orchidMain: '#9f5f80',
  forest: '#4a795f',
  forestLight: '#6a9b7f',
  gold: '#d4a574'
}

export const FONTS = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' })
}
