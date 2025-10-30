import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Check if we're in demo mode (no real Supabase configured)
export const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || supabaseUrl.includes('demo');

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  match_id: string;
  created_at: string;
  other_user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  last_message?: Message;
  unread_count?: number;
}
