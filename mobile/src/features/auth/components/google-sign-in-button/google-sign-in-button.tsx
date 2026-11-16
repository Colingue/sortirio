import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Radius } from '@/constants/theme';

export function GoogleSignInButton({ busy, onPress }: { busy: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: busy }}
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => [styles.button, (pressed || busy) && styles.dimmed]}
    >
      <Image source={require('@/assets/images/google-logo.png')} style={styles.logo} />
      <ThemedText style={styles.label}>Continuer avec Google</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 54,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: '#747775',
    backgroundColor: '#FFFFFF',
  },
  dimmed: {
    opacity: 0.7,
  },
  logo: {
    width: 20,
    height: 20,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    color: '#1F1F1F',
  },
});
