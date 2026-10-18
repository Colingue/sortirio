import { useId, useState, type Ref } from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
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
  const accessoryId = useId();

  return (
    <>
      <TextInput
        {...rest}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        returnKeyType="done"
        inputAccessoryViewID={accessoryId}
        placeholderTextColor={Colors.placeholder}
        style={[styles.input, focused && styles.focused, style]}
      />
      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID={accessoryId}>
          <View style={styles.toolbar}>
            <Pressable onPress={Keyboard.dismiss} accessibilityRole="button" hitSlop={12}>
              <ThemedText style={styles.done}>OK</ThemedText>
            </Pressable>
          </View>
        </InputAccessoryView>
      ) : null}
    </>
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
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderStrong,
  },
  done: {
    fontFamily: Fonts.semiBold,
    color: Colors.accent,
  },
});
