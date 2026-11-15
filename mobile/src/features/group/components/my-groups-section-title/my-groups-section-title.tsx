import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

export type MyGroupsSectionTitleProps = {
  title: string;
  count: number;
  marginTop: number;
};

export function MyGroupsSectionTitle({ title, count, marginTop }: MyGroupsSectionTitleProps) {
  return (
    <View style={[styles.line, { marginTop }]}>
      <ThemedText accessibilityRole="header" style={styles.title}>
        {title}
      </ThemedText>
      <View style={styles.count}>
        <ThemedText themeColor="textSecondary" style={styles.countLabel}>
          {count}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  count: {
    height: 24,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },
  countLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
  },
});
