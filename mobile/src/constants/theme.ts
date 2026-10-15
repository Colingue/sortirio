import '@/global.css';

import { DefaultTheme, type Theme } from 'expo-router';
import { Platform } from 'react-native';

export const Colors = {
  text: '#1C1B18',
  textSecondary: '#57524A',
  textMuted: '#6B665D',
  background: '#FDFBF6',
  backgroundElement: '#F2EFE8',
  backgroundSelected: '#FBEDE6',
  accent: '#C9461B',
  accentDark: '#9E3412',
  onAccent: '#FFFFFF',
  border: '#E4E0D7',
  borderStrong: '#D6D1C6',
  danger: '#A3261B',
} as const;

export const AvatarColors = ['#FCE9E0', '#F4A58A', '#F8C66A'] as const;

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
  large: 16,
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
