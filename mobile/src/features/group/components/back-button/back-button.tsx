import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Retour"
      style={styles.back}
      onPress={onPress}
    >
      <SymbolView
        name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
        size={22}
        tintColor={Colors.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    marginLeft: -10,
  },
});
