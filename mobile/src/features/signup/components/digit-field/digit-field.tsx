import { useState, type Ref } from 'react';
import { StyleSheet, TextInput, type StyleProp, type TextStyle } from 'react-native';

import { Colors, Fonts, Radius } from '@/constants/theme';

type DigitFieldProps = {
  ref?: Ref<TextInput>;
  value: string;
  onChangeText: (text: string) => void;
  maxLength: number;
  placeholder: string;
  accessibilityLabel: string;
  autoFocus?: boolean;
  style?: StyleProp<TextStyle>;
};

export function DigitField({ style, ...rest }: DigitFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      {...rest}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      keyboardType="number-pad"
      placeholderTextColor={Colors.placeholder}
      style={[styles.input, focused && styles.focused, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 56,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    fontFamily: Fonts.regular,
    fontSize: 20,
    textAlign: 'center',
    color: Colors.text,
  },
  focused: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },
});
