import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { signInWithGoogle } from '@/features/auth/sign-in-with-google';

export default function LoginScreen() {
  const theme = useTheme();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signIn() {
    setBusy(true);
    setFailed(false);
    try {
      await signInWithGoogle();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={signIn}
        disabled={busy}
        style={[styles.button, { backgroundColor: theme.backgroundElement }, busy && styles.busy]}
      >
        <ThemedText type="subtitle">Continuer avec Google</ThemedText>
      </Pressable>

      {failed ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.error}>
          La connexion n&apos;a pas abouti. Réessayer.
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.four,
  },
  busy: {
    opacity: 0.5,
  },
  error: {
    textAlign: 'center',
  },
});
