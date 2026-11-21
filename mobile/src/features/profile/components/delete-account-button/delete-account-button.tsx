import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { deleteMyAccount } from '@/features/profile/helpers/deleteMyAccount/deleteMyAccount';

const CONFIRM_TITLE = 'Supprimer mon compte ?';
const CONFIRM_MESSAGE =
  "C'est définitif. Ton profil, ta photo et tes inscriptions seront effacés. " +
  'Tes messages restent dans les chats, sous « Utilisateur supprimé ».';
const FAILURE_MESSAGE = "La suppression n'a pas abouti. Réessaie.";

export function DeleteAccountButton({ userId }: { userId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteAccount() {
    setIsDeleting(true);
    try {
      await deleteMyAccount(userId);
    } catch {
      setIsDeleting(false);
      Alert.alert(FAILURE_MESSAGE);
    }
  }

  function askConfirmation() {
    Alert.alert(CONFIRM_TITLE, CONFIRM_MESSAGE, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => void deleteAccount() },
    ]);
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDeleting}
      onPress={askConfirmation}
      style={styles.button}
    >
      <ThemedText themeColor="textMuted" style={styles.label}>
        {isDeleting ? 'Suppression…' : 'Supprimer mon compte'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});
