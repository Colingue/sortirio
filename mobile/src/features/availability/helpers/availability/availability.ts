import { supabase } from '@/lib/supabase';

const ALREADY_DECLARED = '23505';

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

export async function declareAvailability(userId: string): Promise<void> {
  const { error } = await supabase.from('availabilities').insert({ user_id: userId });
  if (error && error.code !== ALREADY_DECLARED) throw error;
}

export async function cancelAvailability(friday: string): Promise<void> {
  const { error } = await supabase.from('availabilities').delete().eq('friday', friday);
  if (error) throw error;
}
