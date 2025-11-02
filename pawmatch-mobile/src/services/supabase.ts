import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Fallback credentials guard the app from crashing in development builds without env vars.
const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU0MjM0MjAsImV4cCI6MTk2MDk5OTQyMH0.placeholder';

const missingCredentials = !SUPABASE_URL || !SUPABASE_ANON_KEY;

if (missingCredentials) {
  console.warn('[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Using placeholder client.');
}

export const isDemoMode =
  missingCredentials ||
  SUPABASE_URL.includes('demo') ||
  SUPABASE_ANON_KEY.includes('demo');

export const supabase = createClient(
  missingCredentials ? FALLBACK_URL : SUPABASE_URL,
  missingCredentials ? FALLBACK_ANON_KEY : SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'pawmatch-mobile',
      },
    },
  }
);
