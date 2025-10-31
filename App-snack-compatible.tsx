// App.tsx - Snack-compatible version (polyfills removed)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import your navigation when ready
import AppNavigator from './src/navigation/AppNavigator';
import { supabase } from './src/services/supabase';

export default function App() {
  const [ready, setReady] = useState(false);
  const [ping, setPing] = useState<'ok' | 'fail' | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
        setReady(true);
      }
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
        setReady(true);
      }
    });

    // Lightweight sanity check
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setPing('ok');
      } catch (e) {
        console.warn('Supabase auth ping failed:', e);
        setPing('fail');
      } finally {
        setReady(true);
      }
    })();

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
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
      setReady(true);
    }
  };

  if (!ready || loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.dim}>Booting PawMatch…</Text>
          <Text style={styles.dimSmall}>
            Supabase: {ping === 'ok' ? 'connected ✅' : ping === 'fail' ? 'failed ❌' : 'checking...'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppNavigator userRole={user?.role || null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#2F3A4A' },
  dim: { fontSize: 14, color: '#6B7280' },
  dimSmall: { fontSize: 12, color: '#9CA3AF' },
});
