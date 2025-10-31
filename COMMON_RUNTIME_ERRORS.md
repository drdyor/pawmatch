# 🔍 Common Runtime Errors & Quick Fixes

---

## ❌ **ERROR 1: "Malformed anonymous key" or "Invalid API key"**

**Fix:** Add your Supabase keys in `src/services/supabase.ts`

```typescript
const supabaseUrl = 'https://hmkrwjscbcejdgojwksk.supabase.co'; // Your URL
const supabaseAnonKey = 'eyJ...'; // Your full anon key
```

---

## ❌ **ERROR 2: Red Screen with Component Error**

**Example:** "Cannot read property 'map' of undefined"

**Fix:** Usually means data is null/undefined. Share the exact error and I'll fix it.

---

## ❌ **ERROR 3: "Module not found"**

**Example:** "Cannot resolve module '@react-navigation/...'"

**Fix:** Install missing package in Snack's package manager.

---

## ❌ **ERROR 4: Blank White Screen**

**Possible causes:**
- App crashing on startup
- Navigation not configured
- Missing screen component

**Fix:** Check Expo Go dev menu for errors.

---

## 📸 **TO GET BETTER HELP:**

**In Expo Go:**
1. **Shake your phone**
2. **Tap "Show Dev Menu"**
3. **Tap "Debug Remote JS"** (if available)
4. **Look at error messages**

**OR:**

**Take a screenshot** of the error screen and share it!

---

**Tell me the EXACT error message and I'll fix it right away!** 🎯
