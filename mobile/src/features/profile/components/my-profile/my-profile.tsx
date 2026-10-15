import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MemberAvatar } from '@/components/member-avatar';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { MyProfileDetails } from '@/features/profile/components/my-profile-details/my-profile-details';
import { type MyProfile as MyProfileData } from '@/features/profile/helpers/myProfile/myProfile';

export type MyProfileProps = {
  profile: MyProfileData;
  onEdit: () => void;
  onSignOut: () => void;
};

export function MyProfile({ profile, onEdit, onSignOut }: MyProfileProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Mon profil
        </ThemedText>

        <MemberAvatar
          firstName={profile.firstName}
          photoUrl={profile.photoUrl}
          size={128}
          colorIndex={4}
          style={styles.photo}
        />
        <ThemedText style={styles.name}>{profile.firstName}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.summary}>
          {profile.age} ans · {profile.city}
        </ThemedText>

        <MyProfileDetails profile={profile} />
        <ThemedText type="small" themeColor="textMuted" style={styles.note}>
          Les membres de ton groupe voient ta photo, ton prénom et ton âge.
        </ThemedText>

        <Pressable
          accessibilityRole="button"
          onPress={onEdit}
          style={({ pressed }) => [styles.edit, pressed && styles.pressed]}
        >
          <ThemedText themeColor="accent" style={styles.editLabel}>
            Modifier mon profil
          </ThemedText>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onSignOut} style={styles.signOut}>
          <ThemedText themeColor="textSecondary" style={styles.signOutLabel}>
            Se déconnecter
          </ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  photo: {
    alignSelf: 'center',
    marginTop: 24,
    borderWidth: 3,
  },
  name: {
    alignSelf: 'center',
    marginTop: 14,
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  summary: {
    alignSelf: 'center',
    marginBottom: 26,
  },
  note: {
    marginTop: 10,
    marginHorizontal: 4,
  },
  edit: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 22,
    borderRadius: Radius.small,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  pressed: {
    backgroundColor: Colors.backgroundSelected,
  },
  editLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
  signOut: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 8,
  },
  signOutLabel: {
    fontFamily: Fonts.medium,
  },
});
