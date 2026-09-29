import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type ScreenStatusProps = {
  failed: boolean;
};

export function ScreenStatus({ failed }: ScreenStatusProps) {
  return (
    <ThemedView style={styles.centered}>
      {failed ? (
        <ThemedText themeColor="textSecondary">Une erreur, réessaie plus tard.</ThemedText>
      ) : (
        <ActivityIndicator />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
