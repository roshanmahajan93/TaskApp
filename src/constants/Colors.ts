export const accent = {
  green: '#C5F277',
  greenDark: '#A8E055',
  greenSoft: '#E8FAC4',
};

export const Colors = {
  light: {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    surfaceMuted: '#F0F0F2',
    surfaceInverted: '#0A0A0A',
    border: '#E4E4E7',
    text: '#0A0A0A',
    textMuted: '#71717A',
    textInverted: '#FAFAFA',
    primary: accent.green,
    primaryFg: '#0A0A0A',
    danger: '#EF4444',
    success: accent.green,
    overlay: 'rgba(0,0,0,0.4)',
    statusBar: 'dark' as const,
  },
  dark: {
    background: '#0A0A0A',
    surface: '#161618',
    surfaceMuted: '#1F1F22',
    surfaceInverted: '#FAFAFA',
    border: '#27272A',
    text: '#FAFAFA',
    textMuted: '#A1A1AA',
    textInverted: '#0A0A0A',
    primary: accent.green,
    primaryFg: '#0A0A0A',
    danger: '#F87171',
    success: accent.green,
    overlay: 'rgba(0,0,0,0.6)',
    statusBar: 'light' as const,
  },
};

export type ThemeName = keyof typeof Colors;
export type ColorTokens = (typeof Colors)['light'];

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const typography = {
  display: { fontSize: 44, fontWeight: '900' as const, letterSpacing: -1 },
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.5 },
};
