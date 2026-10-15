import { useEffect, useState } from 'react';

import {
  fetchPendingAttendanceQuestion,
  saveAttendanceAnswer,
  type AttendanceQuestion,
} from '@/features/attendance/helpers/attendanceQuestion/attendanceQuestion';

export type AttendanceQuestionState = {
  question: AttendanceQuestion | null;
  saving: boolean;
  saveFailed: boolean;
  handleAnswer: (went: boolean) => Promise<void>;
};

export function useAttendanceQuestion(): AttendanceQuestionState {
  const [question, setQuestion] = useState<AttendanceQuestion | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchPendingAttendanceQuestion()
      .then((pending) => !cancelled && setQuestion(pending))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAnswer(went: boolean) {
    if (!question) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      await saveAttendanceAnswer(question.groupId, went);
      setQuestion(null);
    } catch {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  }

  return { question, saving, saveFailed, handleAnswer };
}
