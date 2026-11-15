import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { PlacePill } from '@/features/onboarding/components/place-pill/place-pill';

const MEMBERS: ImageSource[] = [
  require('@/assets/images/onboarding/member-1.jpg'),
  require('@/assets/images/onboarding/member-2.jpg'),
  require('@/assets/images/onboarding/member-3.jpg'),
  require('@/assets/images/onboarding/member-4.jpg'),
  require('@/assets/images/onboarding/member-5.jpg'),
];

const MESSAGES = [
  { member: 0, text: 'Salut ! Nouvelle à Lyon, et vous ?' },
  { member: 1, text: 'Pareil, je connais personne ici' },
  { member: null, text: 'Trop bien, on sera au moins 4 !' },
  { member: 2, text: "Hâte d'être à vendredi" },
];

export function GroupPreview() {
  return (
    <View
      style={styles.preview}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.avatars}>
        {MEMBERS.map((source, index) => (
          <Image
            key={index}
            source={source}
            style={[styles.avatar, index > 0 && styles.avatarOverlap]}
            contentFit="cover"
          />
        ))}
      </View>

      <PlacePill label="Le bar du vendredi" />

      <View style={styles.chat}>
        {MESSAGES.map(({ member, text }) =>
          member === null ? (
            <ThemedText key={text} themeColor="onAccent" style={[styles.bubble, styles.mine]}>
              {text}
            </ThemedText>
          ) : (
            <View key={text} style={styles.row}>
              <Image source={MEMBERS[member]} style={styles.author} contentFit="cover" />
              <ThemedText style={[styles.bubble, styles.theirs]}>{text}</ThemedText>
            </View>
          ),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundElement,
  },
  avatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: Colors.backgroundElement,
  },
  avatarOverlap: {
    marginLeft: -16,
  },
  chat: {
    alignSelf: 'stretch',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  author: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  bubble: {
    maxWidth: 230,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 13,
    lineHeight: 18,
    overflow: 'hidden',
  },
  theirs: {
    borderRadius: Radius.card,
    borderBottomLeftRadius: 4,
    backgroundColor: Colors.surface,
  },
  mine: {
    alignSelf: 'flex-end',
    borderRadius: Radius.card,
    borderBottomRightRadius: 4,
    backgroundColor: Colors.accent,
  },
});
