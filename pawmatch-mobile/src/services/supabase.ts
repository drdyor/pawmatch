// --- Polyfills (order matters) ----------------------------------------------
// Try to polyfill URL (needed by supabase-js on RN)
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react-native-url-polyfill/auto');
} catch { /* ok if not installed (but add it in Snack deps) */ }

// Ensure crypto.getRandomValues exists (recommended)
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react-native-get-random-values');
} catch { /* ok if not installed (but add it in Snack deps) */ }

// --- Imports ----------------------------------------------------------------
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { SUPABASE_CONFIG } from '../config/supabase';

// --- Helpers ----------------------------------------------------------------
const clean = (v?: string | null): string => {
  if (!v) return '';
  // Remove all invisible/zero-width characters and trim
  return String(v)
    .replace(/[\u200B-\u200D\uFEFF\u00A0\u2028\u2029]/g, '')
    .replace(/\s+/g, '')
    .trim();
};

// Expo (SDK 49+) uses expoConfig; Snack can also surface extras here.
const extras =
  (Constants?.expoConfig as any)?.extra ??
  (Constants as any)?.manifest?.extra ?? // legacy
  {};

// Resolve URL & KEY in this priority: extras ? env ? config fallback
const supabaseUrl =
  clean(extras?.supabaseUrl) ||
  clean(process.env.EXPO_PUBLIC_SUPABASE_URL) ||
  clean(SUPABASE_CONFIG?.url);

const supabaseAnonKey =
  clean(extras?.supabaseAnonKey) ||
  clean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) ||
  clean(SUPABASE_CONFIG?.anonKey);

// Demo mode if missing/placeholder
export const isDemoMode =
  !supabaseUrl ||
  !supabaseAnonKey ||
  /placeholder/i.test(supabaseUrl) ||
  /placeholder/i.test(supabaseAnonKey);

// Dummy creds to keep app booting without real keys
const DUMMY_URL = 'https://placeholder.supabase.co';
const DUMMY_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU0MjM0MjAsImV4cCI6MTk2MDk5OTQyMH0.placeholder';

// --- Client -----------------------------------------------------------------
export const supabase = createClient(
  isDemoMode ? DUMMY_URL : (supabaseUrl as string),
  isDemoMode ? DUMMY_KEY : (supabaseAnonKey as string),
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // mobile
    },
  }
);

// Optional: log status (remove in prod)
if (isDemoMode) {
  console.warn(
    '[supabase] Running in DEMO MODE: set supabaseUrl/supabaseAnonKey in Constants.expoConfig.extra or env.'
  );
} else {
  console.log('[supabase] Connected ?', supabaseUrl);
}