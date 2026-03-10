/**
 * Font Configuration
 * Defines font families for the app, synced with web theme
 *
 * Web uses: Fraunces (serif) + Geist (sans)
 * Mobile uses: System fallbacks until custom fonts are loaded
 */

import { Platform } from 'react-native'

// Font family names - these map to loaded fonts or system fallbacks
export const FONTS = {
  // Serif font for headings and accents (Fraunces on web)
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif'
  }),

  // Sans-serif for body text (Geist on web)
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif'
  }),

  // Monospace for code/technical content
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace'
  }),

  // Medium weight sans
  sansMedium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'sans-serif'
  }),

  // Bold weight sans
  sansBold: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif'
  })
} as const

// Font weights for StyleSheet
export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const
}
