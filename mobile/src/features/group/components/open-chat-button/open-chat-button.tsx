import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';

export type OpenChatButtonProps = {
  color: 'accent' | 'onAccent';
  onPress: () => void;
};

export function OpenChatButton({ color, onPress }: OpenChatButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { borderColor: Colors[color] },
        pressed && styles.pressed,
      ]}
    >
      <SymbolView
        name={{ ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
        size={18}
        tintColor={Colors[color]}
      />
      <ThemedText themeColor={color} style={styles.label}>
        Ouvrir le chat du groupe
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderWidth: 1.5,
    borderRadius: Radius.small,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: Fonts.semiBold,
  },
});
