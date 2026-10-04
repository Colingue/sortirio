import { type MessageAuthor } from '@/features/chat/helpers/groupMessages/groupMessages';
import { signPhotoUrls } from '@/features/group/helpers/myGroup/myGroup';
import { supabase } from '@/lib/supabase';

export type GroupMemberRow = {
  user_id: string;
  first_name: string;
  photo_path: string;
};

export function buildMessageAuthors(
  rows: GroupMemberRow[],
  photoUrls: Map<string, string>,
): Map<string, MessageAuthor> {
  return new Map(
    rows.map((row) => [
      row.user_id,
      { firstName: row.first_name, photoUrl: photoUrls.get(row.photo_path) ?? null },
    ]),
  );
}

export async function fetchMessageAuthors(groupId: string): Promise<Map<string, MessageAuthor>> {
  const { data, error } = await supabase.rpc('get_group_members', { target_group_id: groupId });
  if (error) throw error;

  const rows = (data ?? []) as GroupMemberRow[];
  if (rows.length === 0) return new Map();

  return buildMessageAuthors(rows, await signPhotoUrls(rows.map((row) => row.photo_path)));
}
