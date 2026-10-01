import { supabase } from '@/lib/supabase';

const BUCKET = 'profile-photos';
const PHOTO_URL_TTL_SECONDS = 3600;

export const MEETING_TIME_LABEL = 'Vendredi 20h';

export type GroupMember = {
  userId: string;
  firstName: string;
  age: number;
  photoUrl: string | null;
};

export type MyGroup = {
  groupId: string;
  venueName: string;
  venueAddress: string;
  members: GroupMember[];
};

export type GroupRow = {
  group_id: string;
  venue_name: string;
  venue_address: string;
  member_user_id: string;
  member_first_name: string;
  member_age: number;
  member_photo_path: string;
};

export function buildMyGroup(rows: GroupRow[], photoUrls: Map<string, string>): MyGroup | null {
  const [firstRow] = rows;
  if (!firstRow) return null;

  return {
    groupId: firstRow.group_id,
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

export function getOtherMembers(group: MyGroup, myUserId: string | undefined): GroupMember[] {
  return group.members.filter((member) => member.userId !== myUserId);
}

async function signPhotoUrls(paths: string[]): Promise<Map<string, string>> {
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
