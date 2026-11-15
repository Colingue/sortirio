import { type FridayState } from '@/features/availability/helpers/availability/availability';
import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';
import { formatMessageTime } from '@/features/chat/helpers/groupMessages/groupMessages';
import { signPhotoUrls } from '@/features/group/helpers/myGroup/myGroup';
import { isoDay } from '@/features/date/helpers/isoDay/isoDay';
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
  friday: string;
  fridayLabel: string;
  venueName: string;
  memberFaces: GroupFace[];
  lastMessage: LastMessage | null;
};

export type UpcomingItem =
  | { kind: 'group'; group: MyGroupsItem }
  | { kind: 'pending'; friday: string; isFormedThursday: boolean };

export type MyGroupsSections = {
  upcoming: UpcomingItem | null;
  past: MyGroupsItem[];
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
    friday: row.friday,
    fridayLabel: formatFridayLabel(row.friday),
    venueName: row.venue_name,
    memberFaces: row.member_first_names.map((firstName, index) => ({
      firstName,
      photoUrl: photoUrls.get(row.member_photo_paths[index]) ?? null,
    })),
    lastMessage: buildLastMessage(row, myUserId, now),
  };
}

function getUpcomingItem(
  upcomingGroup: MyGroupsItem | undefined,
  fridayState: FridayState | null,
  now: Date,
): UpcomingItem | null {
  if (upcomingGroup) return { kind: 'group', group: upcomingGroup };

  const postedFriday = fridayState?.postedFriday ?? null;
  if (postedFriday === null || postedFriday < isoDay(now)) return null;

  const formationAt = fridayState?.groupFormationAt ?? null;
  return {
    kind: 'pending',
    friday: postedFriday,
    isFormedThursday: formationAt !== null && now < new Date(formationAt),
  };
}

export function getMyGroupsSections(
  groups: MyGroupsItem[],
  fridayState: FridayState | null,
  now: Date,
): MyGroupsSections {
  const today = isoDay(now);
  const upcomingGroup = groups.find((group) => group.friday >= today);

  return {
    upcoming: getUpcomingItem(upcomingGroup, fridayState, now),
    past: groups.filter((group) => group.friday < today),
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
