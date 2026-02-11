/**
 * Design System Tokens
 * Centralized design values for consistent styling across the application
 */

// Color Tokens
export const COLORS = {
  // Primary colors
  PRIMARY: {
    MAIN: '#2196F3',
    LIGHT: '#64B5F6',
    DARK: '#1976D2',
    DARKER: '#0D47A1'
  },

  // Secondary colors
  SECONDARY: {
    MAIN: '#BDBDBD',
    LIGHT: '#E0E0E0',
    DARK: '#9E9E9E'
  },

  // Background colors
  TEXT: {
    PRIMARY: '#000000',
    SECONDARY: '#666666',
    DISABLED: '#999999',
    HINT: '#757575'
  },

  // Text colors
  BACKGROUND: {
    PRIMARY: '#ffffff',
    SECONDARY: '#999999',
    DISABLED: '#666666',
    HINT: '#757575'
  },

  // Grid colors
  GRID: {
    BACKGROUND: {
      BLACK: '#1a1a1a',
      DARK: '#222222'
    },
    LINE: {
      DEFAULT: '#333333',
      EMPHASIS: '#444444'
    }
  },

  // Note colors
  NOTE: {
    DEFAULT: '#4CAF50',
    SELECTED: '#66BB6A',
    BORDER: '#2e7d32'
  },

  // Utility colors
  SUCCESS: '#4CAF50',
  SUCCESS_LIGHT: '#e8f5e9',
  ERROR: '#f44336',
  WARNING: '#ff9800',
  WARNING_LIGHT: '#fff3e0',
  INFO: '#2196f3',

  // Grayscale
  GRAY: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  }
} as const;

// Font Size Tokens (in pixels)
export const FONT_SIZE = {
  XS: 10,
  SMALL: 11,
  SM: 11,
  BASE: 14,
  MEDIUM: 14,
  MD: 16,
  LARGE: 18,
  LG: 18,
  XLARGE: 20,
  XL: 20,
  '2XL': 24,
  '3XL': 30,
  '4XL': 36,
  '5XL': 48
} as const;

// Line Height Tokens
export const LINE_HEIGHT = {
  TIGHT: 1.25,
  NORMAL: 1.5,
  RELAXED: 1.75,
  LOOSE: 2
} as const;

// Font Weight Tokens
export const FONT_WEIGHT = {
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
  EXTRABOLD: 800
} as const;

// Spacing Tokens (in pixels)
export const SPACING = {
  0: 0,
  XSMALL: 4,
  XS: 4, // 0.5 * 8
  SMALL: 8,
  SM: 8, // 1 * 8
  MEDIUM: 16,
  MD: 16, // 2 * 8
  LARGE: 24,
  LG: 24, // 3 * 8
  XLARGE: 32,
  XL: 32, // 4 * 8
  '2XL': 40, // 5 * 8
  '3XL': 48, // 6 * 8
  '4XL': 64, // 8 * 8
  '5XL': 80, // 10 * 8
  '6XL': 96 // 12 * 8
} as const;

// Border Radius Tokens (in pixels)
export const BORDER_RADIUS = {
  NONE: 0,
  SM: 2,
  BASE: 4,
  MEDIUM: 6,
  MD: 6,
  LG: 8,
  XL: 12,
  '2XL': 16,
  '3XL': 24,
  FULL: 9999
} as const;

// Shadow Tokens
export const SHADOWS = {
  NONE: 'none',
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  BASE: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
} as const;

// Z-Index Tokens
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070
} as const;

// Transition Tokens
export const TRANSITIONS = {
  FAST: '150ms',
  BASE: '200ms',
  SLOW: '300ms',
  SLOWER: '500ms'
} as const;

// Breakpoint Tokens (in pixels)
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920
} as const;

// Export all design tokens as a single object
export const DESIGN_SYSTEM = {
  COLORS,
  FONT_SIZE,
  LINE_HEIGHT,
  FONT_WEIGHT,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  Z_INDEX,
  TRANSITIONS,
  BREAKPOINTS
} as const;

// Type exports for TypeScript autocomplete
export type Colors = typeof COLORS;
export type FontSize = typeof FONT_SIZE;
export type LineHeight = typeof LINE_HEIGHT;
export type FontWeight = typeof FONT_WEIGHT;
export type Spacing = typeof SPACING;
export type BorderRadius = typeof BORDER_RADIUS;
export type Shadows = typeof SHADOWS;
export type ZIndex = typeof Z_INDEX;
export type Transitions = typeof TRANSITIONS;
export type Breakpoints = typeof BREAKPOINTS;
export type DesignSystem = typeof DESIGN_SYSTEM;
