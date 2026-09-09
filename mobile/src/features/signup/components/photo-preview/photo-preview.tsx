import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function PhotoPreview({ uri }: { uri?: string }) {
  const theme = useTheme();

  if (!uri) {
    return <ThemedView style={[styles.preview, { backgroundColor: theme.backgroundElement }]} />;
  }

  return <Image source={{ uri }} style={styles.preview} contentFit="cover" />;
}

const styles = StyleSheet.create({
  preview: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    marginVertical: Spacing.three,
  },
});
