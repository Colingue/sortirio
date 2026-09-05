import { supabase } from '@/lib/supabase';

/**
 * Whether the signed-in user has finished signing up. RLS means this can only ever
 * see the caller's own row, so no filtering happens in the app.
 *
 * A failed read throws rather than returning false: answering "no profile" on a
 * network error would send someone who already signed up back through sign-up.
 */
export async function hasProfile(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}
