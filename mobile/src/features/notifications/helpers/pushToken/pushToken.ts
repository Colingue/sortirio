import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import { supabase } from '@/lib/supabase';

export async function registerPushToken(userId: string): Promise<void> {
  try {
    const { granted } = await Notifications.getPermissionsAsync();
    if (!granted) return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

    await supabase.from('profiles').update({ expo_push_token: token }).eq('id', userId);
  } catch {
    return;
  }
}
