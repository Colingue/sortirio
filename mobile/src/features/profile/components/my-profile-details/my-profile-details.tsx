import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { type MyProfile } from '@/features/profile/helpers/myProfile/myProfile';

export function MyProfileDetails({ profile }: { profile: MyProfile }) {
  const details = [
    { label: 'Prénom', value: profile.firstName },
    { label: 'Âge', value: `${profile.age} ans` },
    { label: 'Ville', value: profile.city },
  ];

  return (
    <View style={styles.card}>
      {details.map((detail, index) => (
        <View key={detail.label} style={[styles.row, index > 0 && styles.divided]}>
          <ThemedText themeColor="textSecondary" style={styles.label}>
            {detail.label}
          </ThemedText>
          <ThemedText style={styles.value}>{detail.value}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: Radius.card,
    backgroundColor: Colors.backgroundElement,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
  },
  divided: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontFamily: Fonts.medium,
  },
});
