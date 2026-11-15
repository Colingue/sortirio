import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export type ScreenStatusProps = {
  failed: boolean;
};

export function ScreenStatus({ failed }: ScreenStatusProps) {
  return (
    <View style={styles.centered}>
      {failed ? (
        <ThemedText themeColor="textSecondary">Une erreur, réessaie plus tard.</ThemedText>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
