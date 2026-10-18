import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { CityHeader } from '@/features/availability/components/city-header/city-header';
import { LateSignupCard } from '@/features/availability/components/late-signup-card/late-signup-card';

const STEPS = [
  "Dès qu'au moins 3 personnes de ton âge sont dispo ce soir, on forme votre groupe avec un lieu et on te prévient tout de suite.",
  "Dans tous les cas, la recherche s'arrête à 18 h. Toujours sans groupe à ce moment-là ? Pas de sortie ce soir, mais tu pourras t'inscrire pour vendredi prochain.",
];

export type LateSignupWaitingProps = {
  city: string;
  topCard?: ReactNode;
  postedFriday: string;
  signupClosesAt: string;
};

export function LateSignupWaiting({
  city,
  topCard,
  postedFriday,
  signupClosesAt,
}: LateSignupWaitingProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <CityHeader city={city} />
        {topCard}

        <ThemedText type="title" style={styles.title}>
          On te cherche un groupe
        </ThemedText>

        <LateSignupCard city={city} postedFriday={postedFriday} signupClosesAt={signupClosesAt} />

        <ThemedText type="subtitle" style={styles.section}>
          Comment ça marche
        </ThemedText>
        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNumber}>
                <ThemedText themeColor="onAccent" style={styles.stepNumberLabel}>
                  {index + 1}
                </ThemedText>
              </View>
              <ThemedText type="small" style={styles.stepLabel}>
                {step}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    marginTop: 24,
    fontSize: 28,
    lineHeight: 34,
  },
  section: {
    marginTop: 28,
    marginBottom: 12,
  },
  steps: {
    gap: 10,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.medium,
    backgroundColor: Colors.backgroundElement,
  },
  stepNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
  },
  stepNumberLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  stepLabel: {
    flex: 1,
  },
});
