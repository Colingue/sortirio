import { supabase } from '@/lib/supabase';

export async function saveOnboardingIntroSeen(userId: string): Promise<void> {
  const written = await supabase
    .from('profiles')
    .update({ onboarding_intro_seen: true })
    .eq('id', userId);
  if (written.error) throw written.error;
}
