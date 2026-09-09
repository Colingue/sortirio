import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  pickFromLibrary,
  takePhoto,
  type PickedPhoto,
} from '@/features/profile/helpers/photo/photo';
import { useTheme } from '@/hooks/use-theme';

type PhotoSourceButtonsProps = {
  busy: boolean;
  onPick: (pick: () => Promise<PickedPhoto>) => Promise<void>;
};

export function PhotoSourceButtons({ busy, onPick }: PhotoSourceButtonsProps) {
  const theme = useTheme();
  const style = [styles.button, { backgroundColor: theme.backgroundElement }];

  return (
    <ThemedView style={styles.container}>
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void onPick(pickFromLibrary)}
        style={style}
      >
        <ThemedText>Choisir une photo</ThemedText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void onPick(takePhoto)}
        style={style}
      >
        <ThemedText>Prendre une photo</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  button: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
});
