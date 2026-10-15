import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  smallBold: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 20,
  },
  default: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: Fonts.medium,
    fontSize: 19,
    lineHeight: 26,
  },
  link: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 30,
  },
  linkPrimary: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.accent,
  },
});
