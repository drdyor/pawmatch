# 🔧 Fix Missing Dependencies in Expo Snack

**Error:** `Unable to resolve module 'react-native-url-polyfill/auto.js'`

**Problem:** Expo Snack doesn't have this package installed

---

## ✅ **SOLUTION 1: Install Package in Snack**

**In Expo Snack:**

1. **Look for "Packages" or "Dependencies" tab** (usually at top or in left sidebar)
2. **Click "Add Package"** or **"Install Package"**
3. **Search for:** `react-native-url-polyfill`
4. **Click "Install"** or **"Add"**
5. **Save** → Snack will reload

---

## ✅ **SOLUTION 2: Add to package.json (If Snack Uses It)**

**In Snack, if there's a `package.json` file:**

1. **Find or create `package.json`**
2. **Add to dependencies:**
```json
{
  "dependencies": {
    "react-native-url-polyfill": "^2.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@react-native-async-storage/async-storage": "1.21.0"
  }
}
```

3. **Save** → Snack installs packages

---

## ✅ **SOLUTION 3: Create Snack-Compatible Supabase Service**

**If Snack doesn't support the polyfill, create a version that works:**

**Create new file: `src/services/supabase-snack.ts`:**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// For Expo Snack - keys should be in Secrets/Environment
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**Then update imports in your files to use `supabase-snack` instead of `supabase`.**

---

## ✅ **SOLUTION 4: Modify Existing File (Temporary)**

**Edit `src/services/supabase.ts` in Snack:**

**Remove the polyfill import:**

```typescript
// Remove this line:
// import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 
                   process.env.EXPO_PUBLIC_SUPABASE_URL || 
                   ''; // Add your URL here temporarily

const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 
                       process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       ''; // Add your key here temporarily

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**Note:** This might cause some Supabase features to not work, but basic auth should work.

---

## 🎯 **RECOMMENDED: Try Solutions in Order**

1. ✅ **First:** Install `react-native-url-polyfill` via Snack's package manager
2. ✅ **If that fails:** Remove the polyfill import (Solution 4)
3. ✅ **Then add Supabase keys** in Secrets tab

---

## 📋 **QUICK CHECKLIST:**

- [ ] Install `react-native-url-polyfill` in Snack packages
- [ ] Add Supabase keys in Secrets tab
- [ ] Save and reload
- [ ] Error should disappear!

---

**Try installing the package in Snack first - that's the cleanest fix!** 📦✅
