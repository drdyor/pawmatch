# ✅ Verify Supabase Key Format

**Your key should be EXACTLY:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMxODIsImV4cCI6MjA3NzQyOTE4Mn0.e8jRrE-8EonGzIif_mRPBtc8fn9mefu122eo5f2ZaRE
```

**Format check:**
- ✅ Starts with: `eyJ`
- ✅ Has 3 parts separated by `.`
- ✅ Total length: ~210 characters
- ✅ No spaces
- ✅ No line breaks

---

## 🔍 **IF KEY IS WRONG IN SNACK:**

**Go to Supabase and get fresh key:**

1. **https://supabase.com**
2. **Project:** oyrsmfrpcegtrxrbadlu
3. **Settings** → **API**
4. **"anon public"** key (NOT service_role!)
5. **Copy the ENTIRE key**
6. **Paste into Snack** (don't edit it!)

---

## ✅ **CLEAN VERSION FOR SNACK:**

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

**Copy this EXACTLY - no changes!**
