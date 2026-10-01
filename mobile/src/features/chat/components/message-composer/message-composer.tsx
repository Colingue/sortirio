import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

const MAX_MESSAGE_LENGTH = 2000;

export type MessageComposerProps = {
  onSend: (body: string) => void;
};

export function MessageComposer({ onSend }: MessageComposerProps) {
  const theme = useTheme();
  const [draft, setDraft] = useState('');

  function createMessage() {
    if (!draft.trim()) return;

    onSend(draft);
    setDraft('');
  }

  return (
    <ThemedView style={styles.composer}>
      <TextInput
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        value={draft}
        onChangeText={setDraft}
        placeholder="Écris au groupe"
        placeholderTextColor={theme.textSecondary}
        maxLength={MAX_MESSAGE_LENGTH}
        multiline
        submitBehavior="submit"
        returnKeyType="send"
        onSubmitEditing={createMessage}
      />
      <PrimaryButton label="Envoyer" onPress={createMessage} disabled={!draft.trim()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  composer: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  input: {
    maxHeight: 120,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
});
