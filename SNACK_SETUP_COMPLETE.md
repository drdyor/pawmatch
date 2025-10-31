# ✅ Complete Expo Snack Setup Guide

---

## 🔧 **STEP 1: Fix Missing Package**

**In Expo Snack:**

1. **Find "Packages" or "Dependencies" tab** (left sidebar or top menu)
2. **Click "Add Package"**
3. **Search:** `react-native-url-polyfill`
4. **Install** it

**OR remove the import temporarily:**

**Edit `src/services/supabase.ts`:**

```typescript
// Comment out or remove this line:
// import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Hardcode your keys temporarily (or use Secrets tab)
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

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

## 🔑 **STEP 2: Add Supabase Keys**

**Option A: Use Secrets Tab (Best)**

1. **Top menu** → **"Secrets"** or **"⚙️ Settings"**
2. **Add:**
   - `EXPO_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = `eyJ...`

**Option B: Hardcode in Code (Quick Test)**

Edit `src/services/supabase.ts` and add your keys directly (see above).

---

## 📦 **STEP 3: Install Missing Dependencies**

**In Snack's Packages tab, also install:**

- `@supabase/supabase-js` (if not already)
- `@react-native-async-storage/async-storage`
- `expo-linear-gradient`
- `react-native-modal`
- `lottie-react-native` (optional)

---

## ✅ **STEP 4: Save and Test**

1. **Click "Save"** in Snack
2. **Wait for reload**
3. **Check for errors**

---

## 🎯 **QUICK FIX SUMMARY:**

1. ✅ Remove `react-native-url-polyfill/auto` import (or install package)
2. ✅ Add Supabase keys (Secrets tab or hardcode)
3. ✅ Install missing packages
4. ✅ Save → Test!

---

**Do these steps and your app should work in Snack!** 🚀
