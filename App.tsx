// App.tsx - WITH AUTH BYPASS for Testing
// Polyfills must be imported first
import 'react-native-get-random-values';

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

// BYPASS AUTH FOR TESTING - Set to false when Supabase auth works
const BYPASS_AUTH = true;

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (BYPASS_AUTH) {
      // Skip auth - automatically log in as test user
      const testUser = {
        id: 'test-user-123',
        email: 'test@pawmatch.com',
        full_name: 'Test User',
        role: 'buyer', // Change to 'breeder_independent', 'shelter', 'vet', etc. to test different roles
        country: 'Malta',
      };
      setUser(testUser);
      setLoading(false);
      console.log('? Auth bypassed - logged in as test user');
    } else {
      // Normal auth flow with Supabase
      import('./src/services/supabase').then(({ supabase }) => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            fetchUserProfile(session.user.id);
          } else {
            setLoading(false);
          }
        });

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            fetchUserProfile(session.user.id);
          } else {
            setUser(null);
            setLoading(false);
          }
        });

        return () => subscription.unsubscribe();
      });
    }
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { supabase } = await import('./src/services/supabase');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppNavigator userRole={user?.role || null} />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
