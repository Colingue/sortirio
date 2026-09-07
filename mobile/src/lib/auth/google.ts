import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export async function signInWithGoogle(): Promise<'signed-in' | 'cancelled'> {
  if (!webClientId) {
    throw new Error('Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID — see .env.example.');
  }
  if (Platform.OS === 'ios' && !iosClientId) {
    throw new Error('Missing EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID — see .env.example.');
  }

  GoogleSignin.configure({ webClientId, iosClientId });
  await GoogleSignin.hasPlayServices();

  const response = await GoogleSignin.signIn();
  if (response.type === 'cancelled') return 'cancelled';

  const idToken = response.data.idToken;
  if (!idToken) throw new Error("Google n'a pas renvoyé de jeton d'identité.");

  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });
  if (error) throw error;
  return 'signed-in';
}
