import { PROFILE_PHOTOS_BUCKET } from '@/features/photo-storage/helpers/photoStorage/photoStorage';
import { signOut } from '@/features/auth/helpers/signOut/signOut';
import { supabase } from '@/lib/supabase';

export async function deleteMyAccount(userId: string): Promise<void> {
  const removed = await supabase.storage
    .from(PROFILE_PHOTOS_BUCKET)
    .remove([`${userId}/photo.jpg`]);
  if (removed.error) throw removed.error;

  const deleted = await supabase.rpc('delete_my_account');
  if (deleted.error) throw deleted.error;

  await signOut();
}
