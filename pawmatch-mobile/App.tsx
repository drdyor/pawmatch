import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { OnboardingFlow } from './src/screens/onboarding/OnboardingFlow';
import { supabase, isDemoMode } from './src/services/supabase';
import { User } from './src/types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // In demo mode, show onboarding first
    if (isDemoMode) {
      console.log('🎉 Running in DEMO MODE - Showing new onboarding!');
      setLoading(false);
      setShowOnboarding(true);
      return;
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
        setShowOnboarding(true); // Show onboarding for new users
      }
    }).catch((error) => {
      console.error('Auth error:', error);
      setLoading(false);
      setShowOnboarding(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
        setShowOnboarding(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
      // If user exists and has completed onboarding, skip onboarding
      setShowOnboarding(!data || !data.role);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setShowOnboarding(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // TODO: Add splash screen
  }

  // Show new onboarding flow
  if (showOnboarding) {
    return (
      <SafeAreaProvider>
        <OnboardingFlow
          onComplete={(data) => {
            console.log('Onboarding completed:', data);
            setShowOnboarding(false);
          }}
        />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  // Show main app after onboarding
  return (
    <SafeAreaProvider>
      <AppNavigator userRole={user?.role || null} />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
