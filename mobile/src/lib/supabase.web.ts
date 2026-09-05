import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

// Web sibling of supabase.ts. It exists for one reason: expo-sqlite's web build
// needs a WASM/worker Metro setup that Metro refuses to bundle out of the box
// ("Worker chunk not found for expo-sqlite/web/worker.ts"). In a browser,
// supabase-js already persists the session in localStorage, so there is nothing
// to configure — and no auto-refresh listener, because a tab is always "active".

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!url || !key) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY — see .env.example.',
  );
}

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
