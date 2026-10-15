import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

export type GroupAnnouncementDetailsProps = {
  meetingLabel: string;
  venueName: string;
  venueAddress: string;
};

export function GroupAnnouncementDetails({
  meetingLabel,
  venueName,
  venueAddress,
}: GroupAnnouncementDetailsProps) {
  return (
    <View style={styles.list}>
      <View style={[styles.row, styles.divided]}>
        <SymbolView
          name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
          size={20}
          tintColor={Colors.onAccent}
        />
        <ThemedText themeColor="onAccent" style={styles.medium}>
          {meetingLabel}
        </ThemedText>
      </View>
      <View style={styles.row}>
        <SymbolView
          name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
          size={20}
          tintColor={Colors.onAccent}
        />
        <View style={styles.venue}>
          <ThemedText themeColor="onAccent" style={styles.venueName}>
            {venueName}
          </ThemedText>
          <ThemedText type="small" themeColor="onAccent">
            {venueAddress}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 28,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Colors.accentDark,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingVertical: 8,
  },
  divided: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.onAccentDivider,
  },
  medium: {
    fontFamily: Fonts.medium,
  },
  venue: {
    flex: 1,
  },
  venueName: {
    fontFamily: Fonts.semiBold,
  },
});
