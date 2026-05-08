// Design System Tokens - TENDRYX Brand
// Colores basados en la identidad visual de la marca

export const colors = {
  // Primary - Azul Oscuro (fondo principal de la marca)
  primary: {
    900: '#0A1219',
    800: '#0F1C2E',
    700: '#142536',
    600: '#1A2942',
    500: '#243550',
    400: '#364761',
    300: '#4A5B72',
    200: '#6B7A8F',
    100: '#9AA5B5',
    50: '#D1D7DF',
  },

  // Secondary - Dorado (acentos y elementos destacados)
  secondary: {
    900: '#705A0F',
    800: '#8B7012',
    700: '#A68516',
    600: '#C9A227',
    500: '#D4A843',
    400: '#DDB85F',
    300: '#E6C87B',
    200: '#EFD99D',
    100: '#F5E8C1',
    50: '#FBF5E6',
  },

  // Neutrals
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    900: '#0D0D0D',
    800: '#1A1A1A',
    700: '#333333',
    600: '#4D4D4D',
    500: '#666666',
    400: '#808080',
    300: '#999999',
    200: '#B3B3B3',
    100: '#E6E6E6',
    50: '#F5F5F5',
  },

  // Semantic Colors
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
  },
} as const;

export const typography = {
  fontFamily: {
    primary: "'Poppins', 'Segoe UI', sans-serif",
    secondary: "'Playfair Display', Georgia, serif",
    mono: "'Fira Code', 'Consolas', monospace",
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  gold: '0 4px 20px rgba(212, 168, 67, 0.3)',
  glow: '0 0 20px rgba(212, 168, 67, 0.4)',
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '300ms ease',
  slow: '500ms ease',
  spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
} as const;
