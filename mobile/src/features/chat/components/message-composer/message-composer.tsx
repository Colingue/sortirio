import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

const MAX_MESSAGE_LENGTH = 2000;

export type MessageComposerProps = {
  onSend: (body: string) => void;
};

export function MessageComposer({ onSend }: MessageComposerProps) {
  const [draft, setDraft] = useState('');
  const empty = !draft.trim();

  function createMessage() {
    if (empty) return;

    onSend(draft);
    setDraft('');
  }

  return (
    <View style={styles.composer}>
      <TextInput
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        placeholder="Écris un message…"
        placeholderTextColor={Colors.placeholder}
        accessibilityLabel="Message"
        maxLength={MAX_MESSAGE_LENGTH}
        multiline
        submitBehavior="submit"
        returnKeyType="send"
        onSubmitEditing={createMessage}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Envoyer"
        accessibilityState={{ disabled: empty }}
        disabled={empty}
        onPress={createMessage}
        style={({ pressed }) => [styles.send, (pressed || empty) && styles.dimmed]}
      >
        <SymbolView
          name={{ ios: 'paperplane', android: 'send', web: 'send' }}
          size={20}
          tintColor={Colors.onAccent}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
  },
  send: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accent,
  },
  dimmed: {
    opacity: 0.5,
  },
});
