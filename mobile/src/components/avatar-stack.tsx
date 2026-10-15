import { StyleSheet, View } from 'react-native';

import { AvatarColors, Colors } from '@/constants/theme';

export function AvatarStack() {
  return (
    <View
      style={styles.stack}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {AvatarColors.map((color, index) => (
        <View
          key={color}
          style={[styles.avatar, { backgroundColor: color }, index > 0 && styles.overlap]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  overlap: {
    marginLeft: -10,
  },
});
