/**
 * Theme Configuration
 * Centralized theme constants synced with OrchidPal web app
 * Botanical luxury aesthetic
 */

import { FONTS, FONT_WEIGHTS } from './Fonts'

// Color palette - synced with web
export const COLORS = {
  // Backgrounds
  paper: '#fdfcf8', // Warm Off-White (primary background)
  paperDark: '#f0efea', // Slightly darker paper
  paperDeep: '#e8e6df', // Even deeper paper

  // Primary text colors
  ink: '#14281d', // Very Deep Green (primary text)
  inkLight: '#3a5a40', // Muted Green (secondary text)
  inkMuted: '#5a7a68', // Even lighter for tertiary

  // Brand colors
  orchidMain: '#9f5f80', // Muted Dusty Purple/Pink
  orchidDeep: '#582c4d', // Deep Velvet Purple
  orchidLight: '#c89bae', // Light orchid tint

  // Nature palette
  forest: '#4a795f', // Forest green (titles, primary actions)
  forestLight: '#6a9b7f', // Lighter forest
  forestDark: '#3a5a48', // Darker forest

  // Accent colors
  clay: '#e6b8a2', // Earthy accent
  gold: '#d4a574', // Warm gold
  cream: '#f5f0e8', // Cream accent

  // Status colors
  success: '#4a795f', // Forest green
  warning: '#d4a574', // Warm gold
  error: '#c75b5b', // Muted red
  info: '#5f8a9f', // Muted blue

  // UI colors
  white: '#ffffff',
  black: '#000000',
  border: 'rgba(0,0,0,0.08)',
  borderDark: 'rgba(0,0,0,0.12)',
  overlay: 'rgba(20,40,29,0.5)'
} as const

// Typography configuration
export const TYPOGRAPHY = {
  fonts: FONTS,
  weights: FONT_WEIGHTS,

  // Font sizes (matching web scale)
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48
  },

  // Line heights
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },

  // Letter spacing
  tracking: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1
  }
} as const

// Spacing scale (matching Tailwind)
export const SPACING = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128
} as const

// Border radius
export const RADIUS = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999
} as const

// Shadow definitions
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12
  }
} as const

// Combined theme export
export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS
} as const

// Legacy THEME constant for backward compatibility
// (used in existing components)
export const THEME_COLORS = COLORS
