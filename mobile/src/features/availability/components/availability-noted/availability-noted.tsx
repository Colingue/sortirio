import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function AvailabilityNoted() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.centered}>
        C&apos;est noté, on te prévient jeudi 19 h.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  centered: {
    textAlign: 'center',
  },
});
