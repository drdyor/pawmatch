// URL polyfill for React Native (Supabase requires it)
// Import with fallback for Expo Snack compatibility
// Note: react-native-url-polyfill is in dependencies
try {
  // Try ES6 import first (works in most environments)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react-native-url-polyfill/auto');
} catch (e) {
  // Fallback: try importing from main package
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native-url-polyfill');
  } catch (e2) {
    // Polyfill not available - Supabase will use native URL if available
    // This is OK for most Expo environments
    console.warn('react-native-url-polyfill not available, using native URL');
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { SUPABASE_CONFIG } from '../config/supabase';

// Get Supabase credentials from config (which reads from env vars or uses defaults)
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || SUPABASE_CONFIG.url;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_CONFIG.anonKey;

// Check if we're in demo mode (invalid credentials)
export const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder');

// Create a dummy client for demo mode to prevent errors
const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU0MjM0MjAsImV4cCI6MTk2MDk5OTQyMH0.placeholder';

export const supabase = createClient(
  isDemoMode ? dummyUrl : supabaseUrl, 
  isDemoMode ? dummyKey : supabaseAnonKey, 
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Log connection status (remove in production)
if (!isDemoMode) {
  console.log('? Supabase connected:', supabaseUrl);
}
