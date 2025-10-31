# ✅ Clean Supabase File for Expo Snack

**Copy this ENTIRE file into `src/services/supabase.ts` in Snack:**

```typescript
// Expo Snack-compatible Supabase client
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Get Supabase keys from environment or hardcode for Snack
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// If environment variables don't work in Snack, hardcode here:
// const supabaseUrl = 'https://your-project.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## 🔑 **IMPORTANT: Add Your Keys!**

**Replace the empty strings with your actual keys:**

```typescript
const supabaseUrl = 'https://your-project.supabase.co'; // Your actual URL
const supabaseAnonKey = 'eyJ...'; // Your actual anon key
```

**OR use Snack's Secrets tab** to set environment variables.

---

**This version has NO syntax errors - copy it exactly!** ✅
