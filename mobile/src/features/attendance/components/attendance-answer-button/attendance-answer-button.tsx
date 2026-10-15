import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';

export type AttendanceAnswerButtonProps = {
  label: string;
  filled: boolean;
  disabled: boolean;
  onPress: () => void;
};

export function AttendanceAnswerButton({
  label,
  filled,
  disabled,
  onPress,
}: AttendanceAnswerButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        filled ? styles.filled : styles.outlined,
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      <ThemedText themeColor={filled ? 'accent' : 'onAccent'} style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: Radius.small,
  },
  filled: {
    backgroundColor: Colors.surface,
  },
  outlined: {
    borderWidth: 2,
    borderColor: Colors.onAccent,
  },
  dimmed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
  },
});
