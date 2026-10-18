import '@/global.css';

import { DefaultTheme, type Theme } from 'expo-router';
import { Platform } from 'react-native';

export const Colors = {
  text: '#1C1B18',
  textSecondary: '#57524A',
  textMuted: '#6B665D',
  placeholder: '#8A857B',
  background: '#FDFBF6',
  backgroundElement: '#F2EFE8',
  backgroundMuted: '#F8F6F1',
  backgroundSelected: '#FBEDE6',
  backgroundSelectedBorder: '#F1C4AF',
  onBackgroundSelected: '#7A2A0E',
  surface: '#FFFFFF',
  accent: '#C9461B',
  accentDark: '#9E3412',
  onAccent: '#FFFFFF',
  border: '#E4E0D7',
  borderStrong: '#D6D1C6',
  danger: '#A3261B',
  dangerBorder: '#E2C2BC',
  onAccentDivider: 'rgba(255, 255, 255, 0.18)',
} as const;

export const AvatarColors = ['#FCE9E0', '#F4A58A', '#F8C66A'] as const;

export const MemberAvatarColors = ['#F4A58A', '#B9D3C6', '#F8C66A', '#C9C3E6', '#FCE9E0'] as const;

export const MemberNameColors = ['#9E3412', '#2F5E48', '#7A5200', '#4A3F8C', '#9E3412'] as const;

export type ThemeColor = keyof typeof Colors;

export const Fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  boldItalic: 'Poppins-BoldItalic',
} as const;

export const NavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.accent,
    background: Colors.background,
    card: Colors.background,
    text: Colors.text,
    border: Colors.border,
  },
  fonts: {
    regular: { fontFamily: Fonts.regular, fontWeight: 'normal' },
    medium: { fontFamily: Fonts.medium, fontWeight: 'normal' },
    bold: { fontFamily: Fonts.semiBold, fontWeight: 'normal' },
    heavy: { fontFamily: Fonts.bold, fontWeight: 'normal' },
  },
};

export const Radius = {
  small: 10,
  medium: 12,
  card: 14,
  large: 16,
  extraLarge: 20,
  pill: 999,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
