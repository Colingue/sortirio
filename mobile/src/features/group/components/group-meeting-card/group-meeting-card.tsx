import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { formatShortFridayLabel } from '@/features/group/helpers/myGroup/myGroup';

export type GroupMeetingCardProps = {
  friday: string;
  venueName: string;
  venueAddress: string;
  onOpenAddress: () => void;
};

export function GroupMeetingCard({
  friday,
  venueName,
  venueAddress,
  onOpenAddress,
}: GroupMeetingCardProps) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onOpenAddress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.when}>
        <ThemedText themeColor="onAccent" style={styles.hour}>
          20 h
        </ThemedText>
        <ThemedText themeColor="onAccent" style={styles.day}>
          ven. {formatShortFridayLabel(friday)}
        </ThemedText>
      </View>
      <View style={styles.venue}>
        <ThemedText themeColor="onAccent" style={styles.venueName}>
          {venueName}
        </ThemedText>
        <ThemedText type="small" themeColor="onAccent" style={styles.address}>
          {venueAddress}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: Radius.large,
    backgroundColor: Colors.accent,
  },
  pressed: {
    backgroundColor: Colors.accentDark,
  },
  when: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 68,
    borderRadius: Radius.medium,
    backgroundColor: Colors.accentDark,
  },
  hour: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 28,
  },
  day: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  venue: {
    flex: 1,
    gap: 2,
  },
  venueName: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    lineHeight: 24,
  },
  address: {
    textDecorationLine: 'underline',
  },
});
