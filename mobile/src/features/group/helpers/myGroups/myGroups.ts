import { formatFridayLabel } from '@/features/availability/helpers/formatFridayLabel/formatFridayLabel';
import { supabase } from '@/lib/supabase';

export type MyGroupsItem = {
  groupId: string;
  fridayLabel: string;
  venueName: string;
  memberFirstNames: string;
};

export type MyGroupsRow = {
  group_id: string;
  friday: string;
  venue_name: string;
  member_first_names: string[];
};

export function buildMyGroupsItem(row: MyGroupsRow): MyGroupsItem {
  return {
    groupId: row.group_id,
    fridayLabel: formatFridayLabel(row.friday),
    venueName: row.venue_name,
    memberFirstNames: row.member_first_names.join(', '),
  };
}

export async function fetchMyGroups(): Promise<MyGroupsItem[]> {
  const { data, error } = await supabase.rpc('get_my_groups');
  if (error) throw error;

  return ((data ?? []) as MyGroupsRow[]).map(buildMyGroupsItem);
}
