import * as AppleAuthentication from 'expo-apple-authentication';

import { supabase } from '@/lib/supabase';

export async function signInWithApple(): Promise<'signed-in' | 'cancelled'> {
  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') return 'cancelled';
    throw error;
  }

  if (!credential.identityToken) throw new Error("Apple n'a pas renvoyé de jeton d'identité.");

  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  });
  if (error) throw error;
  return 'signed-in';
}
