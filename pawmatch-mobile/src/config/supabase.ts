// Supabase Configuration
// For Expo Snack: Set these as environment variables in Snack settings
// For local development: Create a .env file with these values

export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://oyrsmfrpcegtrxrbadlu.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMxODIsImV4cCI6MjA3NzQyOTE4Mn0.e8jRrE-8EonGzIif_mRPBtc8fn9mefu122eo5f2ZaRE',
};
