import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';
import { formatMessageTime } from '@/features/chat/helpers/groupMessages/groupMessages';
import { signPhotoUrls } from '@/features/group/helpers/myGroup/myGroup';
import { supabase } from '@/lib/supabase';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const UNKNOWN_AUTHOR_LABEL = 'Un membre';

export type LastMessage = {
  preview: string;
  timeLabel: string;
};

export type GroupFace = {
  firstName: string;
  photoUrl: string | null;
};

export type MyGroupsItem = {
  groupId: string;
  fridayLabel: string;
  venueName: string;
  memberFaces: GroupFace[];
  lastMessage: LastMessage | null;
};

export type MyGroupsRow = {
  group_id: string;
  friday: string;
  venue_name: string;
  member_first_names: string[];
  member_photo_paths: string[];
  last_message_body: string | null;
  last_message_at: string | null;
  last_message_author_id: string | null;
  last_message_author_first_name: string | null;
};

export function formatLastMessageTime(sentAt: string, now: Date): string {
  const sent = new Date(sentAt);
  if (sent.toDateString() === now.toDateString()) return formatMessageTime(sentAt);
  if (now.getTime() - sent.getTime() < WEEK_MS) {
    return sent.toLocaleDateString('fr-FR', { weekday: 'short' });
  }
  return sent.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function buildLastMessage(
  row: MyGroupsRow,
  myUserId: string | undefined,
  now: Date,
): LastMessage | null {
  if (!row.last_message_body || !row.last_message_at) return null;

  const author =
    row.last_message_author_id === myUserId
      ? 'Toi'
      : (row.last_message_author_first_name ?? UNKNOWN_AUTHOR_LABEL);

  return {
    preview: `${author} : ${row.last_message_body}`,
    timeLabel: formatLastMessageTime(row.last_message_at, now),
  };
}

export function buildMyGroupsItem(
  row: MyGroupsRow,
  myUserId: string | undefined,
  now: Date,
  photoUrls: Map<string, string>,
): MyGroupsItem {
  return {
    groupId: row.group_id,
    fridayLabel: formatFridayLabel(row.friday),
    venueName: row.venue_name,
    memberFaces: row.member_first_names.map((firstName, index) => ({
      firstName,
      photoUrl: photoUrls.get(row.member_photo_paths[index]) ?? null,
    })),
    lastMessage: buildLastMessage(row, myUserId, now),
  };
}

export async function fetchMyGroups(myUserId: string | undefined): Promise<MyGroupsItem[]> {
  const { data, error } = await supabase.rpc('get_my_groups');
  if (error) throw error;

  const rows = (data ?? []) as MyGroupsRow[];
  const photoUrls = await signPhotoUrls([
    ...new Set(rows.flatMap((row) => row.member_photo_paths)),
  ]);
  const now = new Date();
  return rows.map((row) => buildMyGroupsItem(row, myUserId, now, photoUrls));
}
