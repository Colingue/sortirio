import { supabase } from '@/lib/supabase';

export async function cancelAvailability(friday: string): Promise<void> {
  const { error } = await supabase.from('availabilities').delete().eq('friday', friday);
  if (error) throw error;
}
