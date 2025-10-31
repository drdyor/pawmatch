# ⚡ Quick Fix for Expo Snack Supabase Keys

---

## 🎯 **FASTEST WAY:**

### **Option 1: Use "Secrets" Tab (Best)**

**In Expo Snack:**

1. **Top menu:** Look for **"Secrets"** or **"⚙️"** (Settings)
2. **Click it** → You'll see environment variables
3. **Add:**
   - Key: `EXPO_PUBLIC_SUPABASE_URL`
     Value: `https://your-project.supabase.co`
   
   - Key: `EXPO_PUBLIC_SUPABASE_ANON_KEY`
     Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key)

4. **Save** → App reloads

---

### **Option 2: Hardcode Temporarily (Quick Test)**

**Edit `src/services/supabase.ts`:**

**Replace:**
```typescript
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
```

**With:**
```typescript
// For Snack testing - replace with your actual keys!
const supabaseUrl = 'https://hmkrwjscbcejdgojwksk.supabase.co'; // Your URL from .env
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE'; // Your key from .env
```

**Then save and test!**

---

## 📍 **Where to Find Your Keys:**

**Check your `.env` file locally:**

```bash
cat /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile/.env
```

**Or in Supabase Dashboard:**
- https://supabase.com → Your Project
- Settings → API
- Copy "Project URL" and "anon public" key

---

**Add keys → Save → Error disappears!** ✅
