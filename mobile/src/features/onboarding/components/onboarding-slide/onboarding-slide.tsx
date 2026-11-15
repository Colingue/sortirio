import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';

const STEPS = [1, 2, 3];

export type OnboardingSlideProps = {
  step: number;
  visual?: ReactNode;
  title: string;
  body: string;
  buttonLabel: string;
  onPress: () => void;
  busy?: boolean;
  error?: string;
};

export function OnboardingSlide({
  step,
  visual,
  title,
  body,
  buttonLabel,
  onPress,
  busy = false,
  error,
}: OnboardingSlideProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.visual}>{visual}</View>

      <View style={styles.text}>
        <ThemedText type="title" style={styles.centered}>
          {title}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={[styles.centered, styles.body]}>
          {body}
        </ThemedText>
      </View>

      <View
        accessibilityRole="progressbar"
        accessibilityLabel={`Étape ${step} sur ${STEPS.length}`}
        style={styles.dots}
      >
        {STEPS.map((dot) => (
          <View key={dot} style={[styles.dot, dot === step && styles.dotCurrent]} />
        ))}
      </View>

      {error ? (
        <ThemedText type="small" themeColor="danger" style={[styles.centered, styles.error]}>
          {error}
        </ThemedText>
      ) : null}

      <PrimaryButton label={buttonLabel} onPress={onPress} disabled={busy} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    backgroundColor: Colors.background,
  },
  visual: {
    height: 340,
    marginTop: Spacing.five,
    borderRadius: Radius.extraLarge,
    overflow: 'hidden',
  },
  text: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.three,
  },
  centered: {
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotCurrent: {
    width: 24,
    backgroundColor: Colors.accent,
  },
  error: {
    marginBottom: Spacing.three,
  },
});
