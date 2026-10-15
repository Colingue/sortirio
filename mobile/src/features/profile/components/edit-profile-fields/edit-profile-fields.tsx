import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';

const MAX_LENGTH = 30;

export type EditProfileFieldsProps = {
  firstName: string;
  city: string;
  onChangeFirstName: (firstName: string) => void;
};

export function EditProfileFields({ firstName, city, onChangeFirstName }: EditProfileFieldsProps) {
  return (
    <>
      <View style={styles.field}>
        <ThemedText style={styles.label}>Prénom</ThemedText>
        <TextInput
          value={firstName}
          onChangeText={onChangeFirstName}
          maxLength={MAX_LENGTH}
          autoCorrect={false}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="done"
          accessibilityLabel="Prénom"
          style={styles.input}
        />
      </View>
      <View style={[styles.field, styles.city]}>
        <ThemedText style={styles.label}>Ville</ThemedText>
        <View style={styles.input}>
          <ThemedText style={styles.value}>{city}</ThemedText>
        </View>
        <ThemedText type="small" themeColor="textMuted">
          Pour l&apos;instant, Dispo n&apos;est ouvert qu&apos;à {city}.
        </ThemedText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
    marginTop: 16,
  },
  city: {
    marginTop: 18,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 16,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.text,
  },
  value: {
    fontSize: 16,
  },
});
