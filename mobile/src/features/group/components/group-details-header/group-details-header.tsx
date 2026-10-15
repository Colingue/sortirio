import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { BackButton } from '@/features/group/components/back-button/back-button';

export function GroupDetailsHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <BackButton onPress={onBack} />
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
  title: {
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 22,
    lineHeight: 30,
  },
});
