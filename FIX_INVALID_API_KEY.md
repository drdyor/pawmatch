# 🔧 Fix "Invalid API Key" Error

**Error:** "Invalid API key" when trying to sign up

**Common causes:**
1. Key has extra spaces/newlines
2. Key is incomplete (cut off)
3. Wrong key (using service_role instead of anon)
4. Key in Snack doesn't match what you think it is

---

## ✅ **FIX: Check Key in Snack**

**In Expo Snack, open `src/services/supabase.ts`:**

**Make sure the key is:**
- ✅ **Complete** (very long, doesn't end abruptly)
- ✅ **No spaces** around it
- ✅ **No line breaks** in the middle
- ✅ **Starts with:** `eyJ`
- ✅ **Three parts** separated by `.`

---

## 🔍 **VERIFY YOUR KEY:**

**The key should be:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMxODIsImV4cCI6MjA3NzQyOTE4Mn0.e8jRrE-8EonGzIif_mRPBtc8fn9mefu122eo5f2ZaRE
```

**Check in Snack:**
- Is it exactly this?
- No extra characters?
- No spaces?

---

## ✅ **CORRECTED VERSION FOR SNACK:**

**Copy this EXACTLY into `src/services/supabase.ts` in Snack:**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oyrsmfrpcegtrxrbadlu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMxODIsImV4cCI6MjA3NzQyOTE4Mn0.e8jRrE-8EonGzIif_mRPBtc8fn9mefu122eo5f2ZaRE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## 🔍 **DOUBLE-CHECK IN SUPABASE:**

1. **Go to:** https://supabase.com
2. **Your project:** oyrsmfrpcegtrxrbadlu
3. **Settings** → **API**
4. **Copy "anon public" key** again
5. **Compare** with what's in Snack

**Make sure:**
- ✅ You're using **"anon public"** (not service_role!)
- ✅ Key matches exactly
- ✅ No extra characters copied

---

## 🎯 **COMMON ISSUES:**

### **Issue 1: Key Cut Off**
- Key should be ~200+ characters
- If shorter, it's incomplete

### **Issue 2: Extra Characters**
- Copy from Supabase dashboard
- Paste directly, don't edit

### **Issue 3: Wrong Key Type**
- Use **"anon public"** (safe for frontend)
- NOT "service_role" (secret!)

---

**Copy the key EXACTLY from Supabase dashboard into Snack - no edits!** ✅
