import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, MemberAvatarColors, MemberNameColors } from '@/constants/theme';

export type MemberAvatarProps = {
  firstName: string;
  photoUrl: string | null;
  size: number;
  colorIndex: number;
  style?: StyleProp<ViewStyle>;
};

export function MemberAvatar({ firstName, photoUrl, size, colorIndex, style }: MemberAvatarProps) {
  const paletteIndex = colorIndex % MemberAvatarColors.length;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: MemberAvatarColors[paletteIndex],
        },
        style,
      ]}
    >
      <ThemedText
        style={[styles.initial, { fontSize: size * 0.38, color: MemberNameColors[paletteIndex] }]}
      >
        {firstName.charAt(0)}
      </ThemedText>
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.photo} contentFit="cover" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderColor: Colors.accent,
  },
  initial: {
    fontFamily: Fonts.semiBold,
    lineHeight: undefined,
  },
  photo: {
    ...StyleSheet.absoluteFill,
  },
});
