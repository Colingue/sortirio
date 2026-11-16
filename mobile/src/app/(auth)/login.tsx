import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { AppleSignInButton } from '@/features/auth/components/apple-sign-in-button/apple-sign-in-button';
import { GoogleSignInButton } from '@/features/auth/components/google-sign-in-button/google-sign-in-button';
import { LoginIllustration } from '@/features/auth/components/login-illustration/login-illustration';
import { signInWithApple } from '@/features/auth/helpers/signInWithApple/signInWithApple';
import { signInWithGoogle } from '@/features/auth/helpers/signInWithGoogle/signInWithGoogle';

export default function LoginScreen() {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signIn(signInWithProvider: () => Promise<'signed-in' | 'cancelled'>) {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await signInWithProvider();
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

      <AppleSignInButton busy={busy} onPress={() => signIn(signInWithApple)} />

      <GoogleSignInButton busy={busy} onPress={() => signIn(signInWithGoogle)} />

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
  error: {
    marginTop: 16,
    textAlign: 'center',
  },
});
