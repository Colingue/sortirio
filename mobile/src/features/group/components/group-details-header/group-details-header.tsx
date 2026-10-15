import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

export function GroupDetailsHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        style={styles.back}
        onPress={onBack}
      >
        <SymbolView
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={22}
          tintColor={Colors.text}
        />
      </Pressable>
      <ThemedText style={styles.title}>Mon groupe</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 44,
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    marginLeft: -10,
  },
  title: {
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 22,
    lineHeight: 30,
  },
});
