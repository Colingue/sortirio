import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { LoginIllustration } from '@/features/auth/components/login-illustration/login-illustration';
import { signInWithGoogle } from '@/features/auth/helpers/signInWithGoogle/signInWithGoogle';

export default function LoginScreen() {
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
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <ThemedText themeColor="accent" style={styles.brand}>
          Dispo
        </ThemedText>
      </View>

      <LoginIllustration />

      <ThemedText type="title" style={styles.title}>
        Un verre, un vendredi, des gens de ton âge.
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.lead}>
        Pas de mot de passe, pas de profil à rallonge. Connecte-toi et c&apos;est parti.
      </ThemedText>

      <View style={styles.spacer} />

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: busy }}
        onPress={signIn}
        disabled={busy}
        style={({ pressed }) => [styles.button, (pressed || busy) && styles.dimmed]}
      >
        <ThemedText themeColor="onAccent" style={styles.buttonLabel}>
          Continuer avec Google
        </ThemedText>
      </Pressable>

      {failed ? (
        <ThemedText type="small" themeColor="danger" style={styles.error}>
          La connexion n&apos;a pas abouti. Réessaie.
        </ThemedText>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: Colors.background,
  },
  header: {
    height: 44,
    justifyContent: 'center',
  },
  brand: {
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 24,
    lineHeight: 32,
  },
  title: {
    marginTop: 32,
  },
  lead: {
    marginTop: 12,
  },
  spacer: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: Radius.medium,
    backgroundColor: Colors.text,
  },
  dimmed: {
    opacity: 0.7,
  },
  buttonLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
  },
  error: {
    marginTop: 16,
    textAlign: 'center',
  },
});
