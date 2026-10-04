import { supabase } from '@/lib/supabase';

export async function fetchMyReportedUserIds(): Promise<Set<string>> {
  const { data, error } = await supabase.rpc('get_my_reported_user_ids');
  if (error) throw error;

  return new Set((data ?? []) as string[]);
}

export async function saveMemberReport(userId: string): Promise<void> {
  const { error } = await supabase.rpc('report_member', { target_user_id: userId });
  if (error) throw error;
}
