import { supabase } from '@/lib/supabase';

export type ProfileStatus = { exists: boolean; onboardingIntroSeen: boolean };

export async function getProfileStatus(userId: string): Promise<ProfileStatus> {
  const { data, error } = await supabase
    .from('profiles')
    .select('onboarding_intro_seen')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return { exists: data !== null, onboardingIntroSeen: data?.onboarding_intro_seen ?? false };
}
