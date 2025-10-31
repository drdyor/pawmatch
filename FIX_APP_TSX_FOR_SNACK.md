# 🔧 Fix App.tsx for Expo Snack

**Remove polyfill imports - Snack doesn't support them!**

---

## ❌ **REMOVE THESE LINES:**

```typescript
// ---- polyfills must run BEFORE anything else ----
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { decode as atob, encode as btoa } from 'base-64';
if (typeof global.atob === 'undefined') { (global as any).atob = atob; }
if (typeof global.btoa === 'undefined') { (global as any).btoa = btoa; }
// -------------------------------------------------
```

**Delete all of this!** These cause errors in Snack.

---

## ✅ **CORRECTED VERSION (Copy This):**

```typescript
// App.tsx - Snack-compatible
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import your navigation
import AppNavigator from './src/navigation/AppNavigator';
import { supabase } from './src/services/supabase';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
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
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.dim}>Booting PawMatch…</Text>
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
  dim: { fontSize: 14, color: '#6B7280' },
});
```

---

## 🎯 **WHAT CHANGED:**

- ❌ **Removed:** All polyfill imports
- ❌ **Removed:** base-64 imports
- ✅ **Kept:** Your app logic
- ✅ **Added:** Connection to your AppNavigator

---

**Copy this version into Snack - it will work!** ✅
