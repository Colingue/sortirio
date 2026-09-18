import { supabase } from '@/lib/supabase';

export type FridayState = {
  nextOpenFriday: string;
  postedFriday: string | null;
};

type FridayStateRow = { next_open_friday: string; posted_friday: string | null };

export async function fetchFridayState(): Promise<FridayState> {
  const { data, error } = await supabase.rpc('get_friday_availability_status').single();
  if (error) throw error;

  const row = data as FridayStateRow;
  return { nextOpenFriday: row.next_open_friday, postedFriday: row.posted_friday };
}
