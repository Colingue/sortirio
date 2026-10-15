import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';

export type ReportMemberActionsProps = {
  firstName: string;
  onReport: () => Promise<void>;
  onReported: () => void;
  onCancel: () => void;
};

export function ReportMemberActions(props: ReportMemberActionsProps) {
  const [saving, setSaving] = useState(false);

  async function confirmReport() {
    setSaving(true);
    try {
      await props.onReport();
      Alert.alert(
        'Signalement enregistré',
        'Ton groupe de cette semaine ne change pas. Vous ne serez plus dans le même groupe les semaines suivantes.',
        [{ text: 'OK', onPress: props.onReported }],
      );
    } catch {
      setSaving(false);
      Alert.alert('Une erreur, réessaie plus tard.');
    }
  }

  return (
    <>
      <ThemedText type="small" themeColor="textSecondary" style={styles.emergency}>
        En cas de danger immédiat, appelle le 17 ou le 112.
      </ThemedText>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: saving }}
        disabled={saving}
        onPress={() => void confirmReport()}
        style={({ pressed }) => [styles.report, (pressed || saving) && styles.pressed]}
      >
        <ThemedText themeColor="onAccent" style={styles.reportLabel}>
          Signaler {props.firstName}
        </ThemedText>
      </Pressable>
      <Pressable accessibilityRole="button" style={styles.cancel} onPress={props.onCancel}>
        <ThemedText themeColor="textSecondary" style={styles.cancelLabel}>
          Annuler
        </ThemedText>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  emergency: {
    marginBottom: 14,
    textAlign: 'center',
  },
  report: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: Radius.medium,
    backgroundColor: Colors.danger,
  },
  pressed: {
    opacity: 0.7,
  },
  reportLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
  },
  cancel: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 6,
  },
  cancelLabel: {
    fontFamily: Fonts.medium,
  },
});
