import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

export function ChatOpenRow() {
  return (
    <View style={styles.row}>
      <SymbolView
        name={{ ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
        size={20}
        tintColor={Colors.onAccent}
      />
      <ThemedText themeColor="onAccent" style={styles.label}>
        Le chat est ouvert, avec tout l&apos;historique
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingVertical: 8,
  },
  label: {
    flex: 1,
    fontFamily: Fonts.medium,
  },
});
