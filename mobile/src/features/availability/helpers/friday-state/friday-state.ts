import { supabase } from '@/lib/supabase';

export type FridayState = {
  openFriday: string;
  postedFriday: string | null;
};

type FridayStateRow = { open_friday: string; posted_friday: string | null };

export async function fetchFridayState(): Promise<FridayState> {
  const { data, error } = await supabase.rpc('friday_state').single();
  if (error) throw error;

  const row = data as FridayStateRow;
  return { openFriday: row.open_friday, postedFriday: row.posted_friday };
}
