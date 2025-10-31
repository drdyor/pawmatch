// Polyfill for React Native URL support (needed for Supabase)
// Commented out for Expo Snack compatibility - uncomment when using local Expo
try {
  require('react-native-url-polyfill/auto');
} catch (e) {
  // Polyfill not available (e.g., in Expo Snack) - some features may be limited
  console.warn('react-native-url-polyfill not available - using fallback');
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase keys from environment or hardcode for Snack
const supabaseUrl = 
  Constants.expoConfig?.extra?.supabaseUrl || 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  ''; // Add your URL here for Snack: 'https://your-project.supabase.co'

const supabaseAnonKey = 
  Constants.expoConfig?.extra?.supabaseAnonKey || 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  ''; // Add your key here for Snack: 'eyJ...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
