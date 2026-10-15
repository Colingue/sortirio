import { saveProfilePhoto } from '@/features/profile/helpers/myProfile/myProfile';
import { isoDay } from '@/features/signup/helpers/isoDay/isoDay';
import type { CompleteDraft } from '@/features/signup/providers/signup-draft/signup-draft';
import { supabase } from '@/lib/supabase';

export async function createProfile(draft: CompleteDraft, userId: string): Promise<void> {
  const photoPath = await saveProfilePhoto(userId, draft.photoUri);

  const written = await supabase.from('profiles').insert({
    id: userId,
    first_name: draft.firstName,
    birthdate: isoDay(draft.birthdate),
    photo_path: photoPath,
    city: draft.city,
  });
  if (written.error) throw written.error;
}
