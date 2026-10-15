import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AvatarColors, Colors, Fonts } from '@/constants/theme';

export function LoginIllustration() {
  return (
    <View
      style={styles.card}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={[styles.circle, styles.first]} />
      <View style={[styles.circle, styles.second]} />
      <View style={[styles.circle, styles.third]} />
      <View style={[styles.circle, styles.fourth]} />
      <View style={styles.badge}>
        <ThemedText themeColor="onAccent" style={styles.badgeText}>
          Vendredi · 20 h
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 250,
    marginTop: 28,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 4,
    borderColor: Colors.accent,
  },
  first: { left: 38, top: 52, width: 92, height: 92, backgroundColor: AvatarColors[0] },
  second: { left: 112, top: 100, width: 84, height: 84, backgroundColor: AvatarColors[1] },
  third: { left: 182, top: 44, width: 100, height: 100, backgroundColor: AvatarColors[2] },
  fourth: { left: 252, top: 120, width: 72, height: 72, backgroundColor: Colors.background },
  badge: {
    position: 'absolute',
    right: 18,
    top: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.accentDark,
  },
  badgeText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
  },
});
