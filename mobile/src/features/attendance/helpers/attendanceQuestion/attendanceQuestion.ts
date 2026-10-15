import { supabase } from '@/lib/supabase';

export type AttendanceQuestion = {
  groupId: string;
  friday: string;
  venueName: string;
};

type AttendanceQuestionRow = {
  group_id: string;
  friday: string;
  venue_name: string;
};

export async function fetchPendingAttendanceQuestion(): Promise<AttendanceQuestion | null> {
  const { data, error } = await supabase.rpc('get_pending_attendance_question');
  if (error) throw error;

  const [row] = (data ?? []) as AttendanceQuestionRow[];
  if (!row) return null;

  return { groupId: row.group_id, friday: row.friday, venueName: row.venue_name };
}

export async function saveAttendanceAnswer(groupId: string, went: boolean): Promise<void> {
  const { error } = await supabase.rpc('save_attendance_answer', {
    target_group_id: groupId,
    went,
  });
  if (error) throw error;
}
