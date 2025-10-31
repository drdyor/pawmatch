# ⚠️ Remove Polyfill Line - Snack Doesn't Support It

**Your code is good, BUT remove the first line!**

---

## ❌ **REMOVE THIS LINE:**

```typescript
import 'react-native-url-polyfill/auto';  // ← DELETE THIS!
```

**This will cause:** `Unable to resolve module 'react-native-url-polyfill/auto.js'`

---

## ✅ **CORRECTED VERSION (Copy This):**

```typescript
// Expo Snack-compatible Supabase client
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// 🔒 Hard-coded, exactly as shown in your Supabase dashboard
const SUPABASE_URL = 'https://oyrsmfrpcegtrxrbadlu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4NTMxMzQsImV4cCI6MjA0MDExOTE0Mn0.e8jRrE-8EonGz4if_mRPBt6n9mefu122e05f2fAzREI';

// ✅ Validate and log (safe)
try {
  new URL(SUPABASE_URL);
  console.log('🔗 Supabase URL parses OK:', SUPABASE_URL);
} catch (e) {
  console.error('❌ Supabase URL parse failed:', SUPABASE_URL, e);
  throw e;
}

export const supabase = createClient(SUPABASE_URL.trim(), SUPABASE_ANON_KEY.trim(), {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## 🎯 **WHAT CHANGED:**

- ❌ **Removed:** `import 'react-native-url-polyfill/auto';`
- ✅ **Kept:** Everything else (your validation code is great!)

---

**Just delete that one line and your code will work!** ✅
