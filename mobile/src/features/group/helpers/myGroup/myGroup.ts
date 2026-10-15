import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';
import { supabase } from '@/lib/supabase';

const BUCKET = 'profile-photos';
const PHOTO_URL_TTL_SECONDS = 3600;

export type GroupMember = {
  userId: string;
  firstName: string;
  age: number;
  photoUrl: string | null;
};

export type MyGroup = {
  groupId: string;
  friday: string;
  venueName: string;
  venueAddress: string;
  members: GroupMember[];
};

export type GroupRow = {
  group_id: string;
  friday: string;
  venue_name: string;
  venue_address: string;
  member_user_id: string;
  member_first_name: string;
  member_age: number;
  member_photo_path: string;
};

export type GroupMemberProfile = {
  member: GroupMember;
  colorIndex: number;
  friday: string;
};

export function buildMyGroup(rows: GroupRow[], photoUrls: Map<string, string>): MyGroup | null {
  const [firstRow] = rows;
  if (!firstRow) return null;

  return {
    groupId: firstRow.group_id,
    friday: firstRow.friday,
    venueName: firstRow.venue_name,
    venueAddress: firstRow.venue_address,
    members: rows.map((row) => ({
      userId: row.member_user_id,
      firstName: row.member_first_name,
      age: row.member_age,
      photoUrl: photoUrls.get(row.member_photo_path) ?? null,
    })),
  };
}

export function formatMeetingLabel(friday: string): string {
  return `${formatFridayLabel(friday)} · 20 h`;
}

export function formatShortFridayLabel(friday: string): string {
  const [year, month, day] = friday.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatMembersCount(members: GroupMember[]): string {
  return `${members.length} personnes, toi compris`;
}

export function formatMembersSentence(otherMembers: GroupMember[]): string {
  const firstNames = otherMembers.map((member) => member.firstName);
  return firstNames.length === 0 ? 'Toi.' : `${firstNames.join(', ')} et toi.`;
}

export function getOtherMembers(group: MyGroup, myUserId: string | undefined): GroupMember[] {
  return group.members.filter((member) => member.userId !== myUserId);
}

export function findGroupMemberProfile(
  group: MyGroup | null,
  userId: string,
): GroupMemberProfile | null {
  const colorIndex = group ? group.members.findIndex((member) => member.userId === userId) : -1;
  if (!group || colorIndex < 0) return null;

  return { member: group.members[colorIndex], colorIndex, friday: group.friday };
}

export async function signPhotoUrls(paths: string[]): Promise<Map<string, string>> {
  const signed = new Map<string, string>();

  try {
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(paths, PHOTO_URL_TTL_SECONDS);

    for (const signature of data ?? []) {
      if (signature.path && signature.signedUrl) signed.set(signature.path, signature.signedUrl);
    }
  } catch {
    return signed;
  }

  return signed;
}

export async function fetchMyGroup(): Promise<MyGroup | null> {
  const { data, error } = await supabase.rpc('get_my_group');
  if (error) throw error;

  const rows = (data ?? []) as GroupRow[];
  if (rows.length === 0) return null;

  return buildMyGroup(rows, await signPhotoUrls(rows.map((row) => row.member_photo_path)));
}

export async function fetchGroupDetails(groupId: string): Promise<MyGroup | null> {
  const { data, error } = await supabase.rpc('get_group_details', { target_group_id: groupId });
  if (error) throw error;

  const rows = (data ?? []) as GroupRow[];
  if (rows.length === 0) return null;

  return buildMyGroup(rows, await signPhotoUrls(rows.map((row) => row.member_photo_path)));
}
