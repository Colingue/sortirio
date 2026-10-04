import { Alert, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export type ReportMemberButtonProps = {
  firstName: string;
  reported: boolean;
  onReport: () => Promise<void>;
};

export function ReportMemberButton({ firstName, reported, onReport }: ReportMemberButtonProps) {
  async function confirmReport() {
    try {
      await onReport();
      Alert.alert(
        'Signalement enregistré',
        'Ton groupe de cette semaine ne change pas. Vous ne serez plus dans le même groupe les semaines suivantes.',
      );
    } catch {
      Alert.alert('Une erreur, réessaie plus tard.');
    }
  }

  function askReport() {
    Alert.alert(`Signaler ${firstName} ?`, 'Vous ne serez plus jamais dans le même groupe.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Signaler', style: 'destructive', onPress: () => void confirmReport() },
    ]);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: reported }}
      disabled={reported}
      onPress={askReport}
    >
      <ThemedText type="link" themeColor="textSecondary">
        {reported ? 'Signalé' : 'Signaler'}
      </ThemedText>
    </Pressable>
  );
}
