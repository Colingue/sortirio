import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

const STEPS = [1, 2, 3, 4];

export function SignupStepHeader({ step }: { step: number }) {
  return (
    <View>
      <View style={styles.header}>
        {step === 1 ? (
          <ThemedText themeColor="accent" style={styles.brand}>
            Dispo
          </ThemedText>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={() => router.back()}
            style={styles.back}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={22}
              tintColor={Colors.text}
            />
          </Pressable>
        )}
        <ThemedText themeColor="textMuted" style={styles.step}>
          Étape {step} sur {STEPS.length}
        </ThemedText>
      </View>

      <View style={styles.progress}>
        {STEPS.map((segment) => (
          <View key={segment} style={[styles.segment, segment <= step && styles.segmentDone]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  brand: {
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 24,
    lineHeight: 32,
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    marginLeft: -10,
  },
  step: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    lineHeight: 20,
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  segmentDone: {
    backgroundColor: Colors.accent,
  },
});
