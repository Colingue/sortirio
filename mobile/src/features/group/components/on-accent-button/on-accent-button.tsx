import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';

export type OnAccentButtonProps = {
  label: string;
  onPress: () => void;
};

export function OnAccentButton({ label, onPress }: OnAccentButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <ThemedText themeColor="accent" style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: Radius.medium,
    backgroundColor: Colors.surface,
  },
  pressed: {
    backgroundColor: Colors.backgroundSelected,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
  },
});
