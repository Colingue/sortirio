import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Empty on purpose: story 1.3 fills this in.
export default function CityScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Inscription — ville</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
