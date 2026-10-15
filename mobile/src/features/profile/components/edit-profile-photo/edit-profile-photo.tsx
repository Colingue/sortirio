import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { MemberAvatar } from '@/components/member-avatar';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

export type EditProfilePhotoProps = {
  firstName: string;
  photoUrl: string | null;
  onChange: () => void;
};

export function EditProfilePhoto({ firstName, photoUrl, onChange }: EditProfilePhotoProps) {
  return (
    <View style={styles.zone}>
      <Pressable accessibilityLabel="Ta photo actuelle" onPress={onChange}>
        <MemberAvatar firstName={firstName} photoUrl={photoUrl} size={116} colorIndex={4} />
        <View style={styles.badge}>
          <SymbolView
            name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
            size={16}
            tintColor={Colors.onAccent}
          />
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onChange} style={styles.button}>
        <ThemedText themeColor="accent" style={styles.label}>
          Changer la photo
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: Colors.background,
    backgroundColor: Colors.accent,
  },
  button: {
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 12,
  },
  label: {
    fontFamily: Fonts.semiBold,
  },
});
