# 🔑 How to Add Supabase Keys in Expo Snack

**Your Error:** "Malformed anonymous key" = Supabase keys not configured or wrong format

---

## ✅ **SOLUTION: Add Keys in Expo Snack**

### **Step 1: Find "Secrets" or "Environment Variables"**

**In Expo Snack:**

1. **Look at the top menu bar** - there should be:
   - "Code" | "Components" | **"Secrets"** or **"Config"** or **"Environment"**
   - OR click the **⚙️ Settings** icon (gear)

2. **Click "Secrets"** or **"Environment Variables"** tab

3. **You should see fields for:**
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

### **Step 2: Get Your Supabase Keys**

**From your `.env` file or Supabase dashboard:**

1. **Go to:** https://supabase.com
2. **Open your PawMatch project**
3. **Settings** → **API**
4. **Find:**
   - **Project URL** → Copy this (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** → Copy this (starts with `eyJ...`)

---

### **Step 3: Add Keys in Snack**

**In Expo Snack's "Secrets" section:**

**Add these two variables:**

```
EXPO_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
```

```
EXPO_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
```

**Make sure:**
- ✅ No quotes around the values
- ✅ No spaces before/after
- ✅ Full URL for SUPABASE_URL
- ✅ Complete key for ANON_KEY (very long, starts with `eyJ`)

---

### **Step 4: Save and Reload**

1. **Click "Save"** in Snack
2. **The app should reload automatically**
3. **Error should disappear!**

---

## 🔍 **ALTERNATIVE: Add Keys in Code (Temporary)**

**If you can't find "Secrets" tab, add them directly in code:**

**Edit `src/services/supabase.ts`:**

```typescript
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Add your keys here temporarily (for Snack testing)
const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**Replace:**
- `YOUR_PROJECT_ID` with your actual Supabase project ID
- `eyJ...` with your full anon key

---

## ✅ **VERIFY YOUR KEYS ARE CORRECT**

**Check your keys format:**

**URL should be:**
```
https://xxxxx.supabase.co
```
✅ Starts with `https://`
✅ Ends with `.supabase.co`
✅ No trailing slash

**Anon Key should be:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYnhzYnhzYnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwNjY2NjYsImV4cCI6MjAxNDY0MjY2Nn0.xxxxx
```
✅ Very long string
✅ Starts with `eyJ`
✅ Multiple parts separated by `.`
✅ From Supabase Dashboard → Settings → API → anon public

---

## 🆘 **IF STILL NOT WORKING**

**Check:**

1. **Is your Supabase project active?**
   - Go to Supabase dashboard
   - Check project status

2. **Are you using the correct keys?**
   - Don't use `service_role` key (secret!)
   - Use `anon` key (public, safe)

3. **Check Snack console:**
   - Look at bottom of Snack for error messages
   - See what URL/key it's trying to use

---

**Find the "Secrets" tab in Snack and add your keys there!** 🔑✅
