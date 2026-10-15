import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

type PhotoPickerProps = {
  uri?: string;
  busy: boolean;
  onPress: () => void;
};

export function PhotoPicker({ uri, busy, onPress }: PhotoPickerProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={uri ? 'Changer de photo' : 'Choisir une photo'}
      accessibilityState={{ disabled: busy }}
      disabled={busy}
      onPress={onPress}
      style={({ pressed }) => [styles.zone, uri && styles.zoneFilled, pressed && styles.pressed]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.photo} contentFit="cover" />
      ) : (
        <>
          <View style={styles.badge}>
            <SymbolView
              name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
              size={30}
              tintColor={Colors.onAccent}
            />
          </View>
          <ThemedText themeColor="accent" style={styles.label}>
            Choisir une photo
          </ThemedText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  zone: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    alignSelf: 'center',
    width: 240,
    height: 300,
    marginTop: 28,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.accent,
    backgroundColor: Colors.backgroundSelected,
    overflow: 'hidden',
  },
  zoneFilled: {
    borderStyle: 'solid',
  },
  pressed: {
    opacity: 0.8,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
