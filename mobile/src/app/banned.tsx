import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { signOut } from '@/features/auth/helpers/signOut/signOut';

export default function BannedScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ThemedText themeColor="accent" style={styles.brand}>
        Dispo
      </ThemedText>

      <View style={styles.body}>
        <View style={styles.badge}>
          <SymbolView
            name={{ ios: 'nosign', android: 'block', web: 'block' }}
            size={44}
            tintColor={Colors.textSecondary}
          />
        </View>
        <ThemedText type="title" style={styles.title}>
          Ton compte a été désactivé
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.paragraph}>
          Ton compte a été signalé par plusieurs membres et a été banni de Dispo. Il a été retiré de
          ton groupe en cours.
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.paragraph}>
          Tu ne peux plus participer aux verres Dispo.
        </ThemedText>
      </View>

      <ThemedText type="small" themeColor="textMuted" style={styles.contact}>
        Une question ? Écris-nous à dispo@mailachanger.com.
      </ThemedText>
      <Pressable
        accessibilityRole="button"
        onPress={() => void signOut().catch(() => {})}
        style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
      >
        <ThemedText style={styles.signOutLabel}>Se déconnecter</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: Colors.background,
  },
  brand: {
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 24,
    lineHeight: 32,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: 96,
    borderRadius: Radius.pill,
    backgroundColor: Colors.backgroundElement,
  },
  title: {
    marginTop: 28,
  },
  paragraph: {
    marginTop: 12,
    lineHeight: 23,
  },
  contact: {
    marginBottom: 14,
    textAlign: 'center',
  },
  signOut: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.medium,
  },
  pressed: {
    opacity: 0.7,
  },
  signOutLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
});
