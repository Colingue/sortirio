import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { getFollowingFridays } from '@/features/availability/helpers/fridays/fridays';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';

const SHOWN_FRIDAYS = 3;

type UpcomingFridaysProps = {
  after: string;
  city: string;
};

export function UpcomingFridays({ after, city }: UpcomingFridaysProps) {
  return (
    <View style={styles.list}>
      {getFollowingFridays(after, SHOWN_FRIDAYS).map((friday) => (
        <View key={friday} style={styles.row}>
          <View>
            <ThemedText style={styles.date}>{formatFridayLabel(friday)}</ThemedText>
            <ThemedText type="small" themeColor="textMuted">
              {city} · 20 h
            </ThemedText>
          </View>
          <View style={styles.badge}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.badgeLabel}>
              Bientôt
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.medium,
    backgroundColor: Colors.backgroundElement,
  },
  date: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.backgroundMuted,
  },
  badgeLabel: {
    fontFamily: Fonts.medium,
  },
});
