import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { BackButton } from '@/features/group/components/back-button/back-button';
import { EditProfileFields } from '@/features/profile/components/edit-profile-fields/edit-profile-fields';
import { EditProfilePhoto } from '@/features/profile/components/edit-profile-photo/edit-profile-photo';
import { saveMyProfile, type MyProfile } from '@/features/profile/helpers/myProfile/myProfile';
import { pickPhoto } from '@/features/profile/helpers/photo/photo';

export type EditProfileProps = {
  userId: string;
  profile: MyProfile;
  onSaved: () => void;
  onBack: () => void;
};

export function EditProfile({ userId, profile, onSaved, onBack }: EditProfileProps) {
  const [typedFirstName, setTypedFirstName] = useState(profile.firstName);
  const [pickedPhotoUri, setPickedPhotoUri] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'failed'>('idle');
  const firstName = typedFirstName.trim();

  async function pickNewPhoto() {
    const photo = await pickPhoto();
    if (photo.type === 'picked') setPickedPhotoUri(photo.uri);
  }

  async function saveProfile() {
    setSaveStatus('saving');
    try {
      await saveMyProfile(userId, { firstName, photoUri: pickedPhotoUri });
      onSaved();
    } catch {
      setSaveStatus('failed');
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <BackButton onPress={onBack} />
      <ThemedText type="title" style={styles.title}>
        Modifier mon profil
      </ThemedText>
      <EditProfilePhoto
        firstName={firstName || profile.firstName}
        photoUrl={pickedPhotoUri ?? profile.photoUrl}
        onChange={pickNewPhoto}
      />
      <EditProfileFields
        firstName={typedFirstName}
        city={profile.city}
        onChangeFirstName={setTypedFirstName}
      />
      <View style={styles.spacer} />
      {saveStatus === 'failed' && (
        <ThemedText themeColor="danger" style={styles.error}>
          Une erreur, réessaie plus tard.
        </ThemedText>
      )}
      <PrimaryButton
        label="Enregistrer"
        onPress={saveProfile}
        disabled={saveStatus === 'saving' || firstName.length === 0}
      />
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
  title: {
    marginTop: 8,
    fontSize: 28,
    lineHeight: 34,
  },
  spacer: {
    flex: 1,
  },
  error: {
    marginBottom: 12,
    textAlign: 'center',
  },
});
