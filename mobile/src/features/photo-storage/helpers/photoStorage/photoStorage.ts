import { supabase } from '@/lib/supabase';

export const PROFILE_PHOTOS_BUCKET = 'profile-photos';
const PHOTO_URL_TTL_SECONDS = 3600;

export async function signPhotoUrls(paths: string[]): Promise<Map<string, string>> {
  const signed = new Map<string, string>();

  try {
    const { data } = await supabase.storage
      .from(PROFILE_PHOTOS_BUCKET)
      .createSignedUrls(paths, PHOTO_URL_TTL_SECONDS);

    for (const signature of data ?? []) {
      if (signature.path && signature.signedUrl) signed.set(signature.path, signature.signedUrl);
    }
  } catch {
    return signed;
  }

  return signed;
}
