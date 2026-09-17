import { supabase } from '@/lib/supabase';

const ALREADY_DECLARED = '23505';

export async function declareAvailability(userId: string): Promise<void> {
  const { error } = await supabase.from('availabilities').insert({ user_id: userId });
  if (error && error.code !== ALREADY_DECLARED) throw error;
}
