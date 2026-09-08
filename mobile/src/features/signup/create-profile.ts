import { File } from 'expo-file-system';

import { isoDay } from '@/features/signup/iso-day';
import type { CompleteDraft } from '@/features/signup/signup-draft';
import { supabase } from '@/lib/supabase';

const BUCKET = 'profile-photos';

export async function createProfile(draft: CompleteDraft, userId: string): Promise<void> {
  const photoPath = `${userId}/photo.jpg`;
  const bytes = await new File(draft.photoUri).arrayBuffer();

  const sent = await supabase.storage
    .from(BUCKET)
    .upload(photoPath, bytes, { contentType: 'image/jpeg', upsert: true });
  if (sent.error) throw sent.error;

  const written = await supabase.from('profiles').insert({
    id: userId,
    first_name: draft.firstName,
    birthdate: isoDay(draft.birthdate),
    photo_path: photoPath,
    city: draft.city,
  });
  if (written.error) throw written.error;
}
