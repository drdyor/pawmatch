# ⚡ Fix Expo Snack Right Now

---

## 🎯 **IMMEDIATE FIX (2 Steps):**

### **STEP 1: Remove Polyfill Import**

**In Expo Snack, edit `src/services/supabase.ts`:**

**Find this line:**
```typescript
import 'react-native-url-polyfill/auto';
```

**Replace with:**
```typescript
// Polyfill removed for Snack compatibility
// try {
//   require('react-native-url-polyfill/auto');
// } catch (e) {
//   // Not available in Snack
// }
```

**OR just delete/comment it out entirely.**

---

### **STEP 2: Add Your Supabase Keys**

**In the same file, find:**
```typescript
const supabaseUrl = ... || '';
const supabaseAnonKey = ... || '';
```

**Replace with (temporarily for testing):**
```typescript
// TEMPORARY: Hardcode keys for Snack testing
const supabaseUrl = 'https://hmkrwjscbcejdgojwksk.supabase.co'; // Your URL from .env
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE'; // Paste your key from .env file
```

**Get your keys from:**
- Your local `.env` file
- OR Supabase Dashboard → Settings → API

---

## ✅ **THAT'S IT!**

**Save in Snack → Error should disappear!**

---

## 🔑 **Where to Get Keys:**

**If you have `.env` file locally:**
```bash
cat /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile/.env
```

**Or in Supabase:**
1. Go to https://supabase.com
2. Your project → Settings → API
3. Copy "Project URL" and "anon public" key

---

**Just remove the polyfill import and add your keys - done!** ✅
