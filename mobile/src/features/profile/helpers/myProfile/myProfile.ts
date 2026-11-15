import { File } from 'expo-file-system';

import {
  PROFILE_PHOTOS_BUCKET,
  signPhotoUrls,
} from '@/features/photo-storage/helpers/photoStorage/photoStorage';
import { getAgeOn } from '@/features/signup/helpers/age/age';
import { supabase } from '@/lib/supabase';

export type MyProfile = {
  firstName: string;
  age: number;
  city: string;
  photoUrl: string | null;
};

export type ProfileRow = {
  first_name: string;
  birthdate: string;
  city: string;
  photo_path: string;
};

export function parseIsoDay(isoDay: string): Date {
  const [year, month, day] = isoDay.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function buildMyProfile(row: ProfileRow, photoUrl: string | null, today: Date): MyProfile {
  return {
    firstName: row.first_name,
    age: getAgeOn(parseIsoDay(row.birthdate), today),
    city: row.city,
    photoUrl,
  };
}

export async function fetchMyProfile(userId: string): Promise<MyProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, birthdate, city, photo_path')
    .eq('id', userId)
    .single<ProfileRow>();
  if (error) throw error;

  const photoUrls = await signPhotoUrls([data.photo_path]);

  return buildMyProfile(data, photoUrls.get(data.photo_path) ?? null, new Date());
}

export async function saveProfilePhoto(userId: string, photoUri: string): Promise<string> {
  const photoPath = `${userId}/photo.jpg`;
  const bytes = await new File(photoUri).arrayBuffer();

  const sent = await supabase.storage
    .from(PROFILE_PHOTOS_BUCKET)
    .upload(photoPath, bytes, { contentType: 'image/jpeg', upsert: true });
  if (sent.error) throw sent.error;

  return photoPath;
}

export async function saveMyProfile(
  userId: string,
  changes: { firstName: string; photoUri: string | null },
): Promise<void> {
  if (changes.photoUri) await saveProfilePhoto(userId, changes.photoUri);

  const { error } = await supabase
    .from('profiles')
    .update({ first_name: changes.firstName })
    .eq('id', userId);
  if (error) throw error;
}
