import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if we're in demo mode (invalid credentials)
export const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('demo') || supabaseAnonKey.includes('demo');

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
