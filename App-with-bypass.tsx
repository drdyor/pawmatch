// App.tsx with Auth Bypass for Testing
// Use this version in Snack to skip authentication

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { BYPASS_AUTH, getBypassUser } from './src/services/authBypass';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (BYPASS_AUTH) {
      // Bypass auth - use test user
      const testUser = getBypassUser();
      setUser(testUser);
      setLoading(false);
    } else {
      // Normal auth flow (if Supabase works)
      // Import and use supabase auth here
      setLoading(false);
    }
  }, []);

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
