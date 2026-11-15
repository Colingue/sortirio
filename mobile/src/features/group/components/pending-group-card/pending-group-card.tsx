import { StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AvatarColors, Colors, Fonts, Radius } from '@/constants/theme';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';

export type PendingGroupCardProps = {
  friday: string;
  isFormedThursday: boolean;
};

export function PendingGroupCard({ friday, isFormedThursday }: PendingGroupCardProps) {
  const isReducedMotion = useReducedMotion();

  return (
    <View accessibilityRole="summary" style={styles.card}>
      <View
        style={styles.faces}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {[styles.topLeft, styles.bottomRight].map((corner, index) => (
          <View key={index} style={[styles.face, corner]}>
            <ThemedText style={styles.question}>?</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.words}>
        <ThemedText themeColor="onAccent" style={styles.date}>
          {formatFridayLabel(friday)}
        </ThemedText>
        <View style={styles.badge}>
          <Animated.View style={[styles.dot, !isReducedMotion && styles.pulse]} />
          <ThemedText style={styles.badgeLabel}>En attente</ThemedText>
        </View>
        <ThemedText themeColor="onAccent" numberOfLines={1} style={styles.status}>
          {isFormedThursday
            ? 'Ton groupe sera formé jeudi à 19 h'
            : "On te prévient dès qu'il est prêt"}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    height: 98,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.card,
    backgroundColor: Colors.accent,
  },
  faces: {
    width: 52,
    height: 52,
  },
  face: {
    position: 'absolute',
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    borderWidth: 2,
    borderColor: Colors.accent,
    backgroundColor: AvatarColors[0],
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
  },
  question: {
    color: Colors.accent,
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 20,
  },
  words: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 4,
  },
  date: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  pulse: {
    animationName: {
      '50%': { transform: [{ scale: 1.7 }], opacity: 0.35 },
    },
    animationDuration: '1.8s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  },
  badgeLabel: {
    color: Colors.accentDark,
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    lineHeight: 16,
  },
  status: {
    alignSelf: 'stretch',
    fontSize: 14,
    lineHeight: 20,
  },
});
