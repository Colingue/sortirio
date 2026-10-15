import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MemberAvatar } from '@/components/member-avatar';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';
import { BackButton } from '@/features/group/components/back-button/back-button';
import { type GroupMemberProfile } from '@/features/group/helpers/myGroup/myGroup';

export type MemberProfileProps = {
  profile: GroupMemberProfile;
  reported: boolean;
  onReport: () => void;
  onBack: () => void;
};

export function MemberProfile({ profile, reported, onReport, onBack }: MemberProfileProps) {
  const { member } = profile;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <ThemedText themeColor="textSecondary" style={styles.headerTitle}>
          Membre de ton groupe
        </ThemedText>
      </View>

      <MemberAvatar
        firstName={member.firstName}
        photoUrl={member.photoUrl}
        size={380}
        colorIndex={profile.colorIndex}
        style={styles.photo}
      />
      <ThemedText style={styles.name}>
        {member.firstName}, {member.age} ans
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.group}>
        Dans ton groupe du {formatFridayLabel(profile.friday).toLowerCase()}
      </ThemedText>

      <View style={styles.spacer} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: reported }}
        disabled={reported}
        onPress={onReport}
        style={({ pressed }) => [styles.report, pressed && styles.pressed, reported && styles.off]}
      >
        <SymbolView
          name={{ ios: 'flag', android: 'flag', web: 'flag' }}
          size={18}
          tintColor={Colors.danger}
        />
        <ThemedText themeColor="danger" style={styles.reportLabel}>
          {reported ? 'Signalement enregistré' : `Signaler ${member.firstName}`}
        </ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 44,
  },
  headerTitle: {
    fontFamily: Fonts.medium,
  },
  photo: {
    width: '100%',
    marginTop: 16,
    borderRadius: Radius.extraLarge,
  },
  name: {
    marginTop: 22,
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 32,
    lineHeight: 38,
  },
  group: {
    marginTop: 6,
  },
  spacer: {
    flex: 1,
  },
  report: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: Radius.small,
    borderWidth: 1.5,
    borderColor: Colors.dangerBorder,
  },
  pressed: {
    backgroundColor: Colors.backgroundElement,
  },
  off: {
    opacity: 0.5,
  },
  reportLabel: {
    fontFamily: Fonts.semiBold,
  },
});
