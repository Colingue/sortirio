import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import Storage from 'expo-sqlite/kv-store';
import { AppState } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!url || !key) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY — see .env.example.',
  );
}

export const supabase = createClient(url, key, {
  auth: {
    storage: Storage,
    autoRefreshToken: true,
    persistSession: true,
    // No URL-based session detection on native: sessions come back through deep links.
    detectSessionInUrl: false,
  },
});

// The session only refreshes while the app is in the foreground; a token that expires in
// the background is refreshed on the next resume instead of failing the first request.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
