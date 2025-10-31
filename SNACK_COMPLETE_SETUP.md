# ✅ Complete Expo Snack Setup - All Steps

---

## 🔧 **FIX 1: Remove Polyfill Error**

**In Expo Snack, edit `src/services/supabase.ts`:**

**Find:**
```typescript
import 'react-native-url-polyfill/auto';
```

**Replace with:**
```typescript
// Removed for Snack compatibility
// try { require('react-native-url-polyfill/auto'); } catch(e) {}
```

---

## 🔑 **FIX 2: Add Supabase Keys**

### **Get Keys from Supabase:**

1. **Go to:** https://supabase.com
2. **Your project** → **Settings** → **API**
3. **Copy:**
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJ...` (long string)

### **Add to Snack:**

**Option A: Secrets Tab**
- Top menu → **"Secrets"** or **"⚙️"**
- Add: `EXPO_PUBLIC_SUPABASE_URL` = (your URL)
- Add: `EXPO_PUBLIC_SUPABASE_ANON_KEY` = (your key)

**Option B: Hardcode (Quick)**
- Edit `src/services/supabase.ts`
- Replace empty strings with your actual keys

---

## 📦 **FIX 3: Install Missing Packages**

**In Snack's Packages tab, install:**
- `@supabase/supabase-js`
- `@react-native-async-storage/async-storage`
- `expo-linear-gradient`
- `react-native-modal` (if using new components)

---

## ✅ **THAT'S IT!**

**After these 3 fixes:**
1. ✅ No polyfill error
2. ✅ Supabase keys configured
3. ✅ Packages installed
4. ✅ App should work!

**Save in Snack → Scan QR code → Test your app!** 📱🎉

---

## 🆘 **If Still Not Working:**

**Share the error message and I'll help fix it!**
