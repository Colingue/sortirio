import { StyleSheet, View } from 'react-native';

import { AvatarStack } from '@/components/avatar-stack';
import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { AttendanceAnswerButton } from '@/features/attendance/components/attendance-answer-button/attendance-answer-button';
import { type AttendanceQuestionState } from '@/features/attendance/hooks/useAttendanceQuestion/useAttendanceQuestion';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';

export function AttendanceQuestionCard({ attendance }: { attendance: AttendanceQuestionState }) {
  const { question, saving, saveFailed, handleAnswer } = attendance;
  if (!question) return null;

  return (
    <View style={styles.block}>
      <View style={styles.card}>
        <AvatarStack />
        <View>
          <ThemedText themeColor="onAccent" style={styles.title}>
            Tu y es allé vendredi soir ?
          </ThemedText>
          <ThemedText themeColor="onAccent" style={styles.when}>
            {formatFridayLabel(question.friday)} · {question.venueName}
          </ThemedText>
        </View>
        <View style={styles.answers}>
          <AttendanceAnswerButton
            label="Oui"
            filled
            disabled={saving}
            onPress={() => void handleAnswer(true)}
          />
          <AttendanceAnswerButton
            label="Non"
            filled={false}
            disabled={saving}
            onPress={() => void handleAnswer(false)}
          />
        </View>
      </View>
      <ThemedText type="small" themeColor={saveFailed ? 'danger' : 'textMuted'} style={styles.note}>
        {saveFailed
          ? "L'enregistrement n'a pas abouti. Réessaie."
          : "Une seule question, pas de note ni d'avis. Ta réponse n'est pas partagée avec le groupe."}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 24,
  },
  card: {
    gap: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: Radius.large,
    backgroundColor: Colors.accent,
  },
  title: {
    fontFamily: Fonts.boldItalic,
    fontStyle: 'italic',
    fontSize: 30,
    lineHeight: 36,
  },
  when: {
    marginTop: 8,
  },
  answers: {
    flexDirection: 'row',
    gap: 10,
  },
  note: {
    marginTop: 12,
    marginHorizontal: 4,
    textAlign: 'center',
  },
});
