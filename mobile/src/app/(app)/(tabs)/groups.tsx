import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function MyGroupsScreen() {
  return (
    <ThemedView style={styles.centered}>
      <ThemedText themeColor="textSecondary" style={styles.empty}>
        Tes groupes apparaîtront ici après ton premier vendredi.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  empty: {
    textAlign: 'center',
  },
});
