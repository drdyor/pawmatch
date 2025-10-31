# 🔑 Get Your Supabase Keys from .env File

---

## ✅ **STEP 1: Find Your .env File**

**On your Mac, open Terminal and run:**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
cat .env
```

**This will show your Supabase keys!**

---

## 📋 **STEP 2: Copy Your Keys**

**You should see something like:**

```
EXPO_PUBLIC_SUPABASE_URL=https://hmkrwjscbcejdgojwksk.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhta3J3anNjYmNlamRnb2p3a3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAxMjM0NTYsImV4cCI6MjAyNTY5OTQ1Nn0.xxxxx
```

**Copy both values:**
1. The URL (starts with `https://`)
2. The ANON_KEY (very long, starts with `eyJ`)

---

## 🔧 **STEP 3: Add to Expo Snack**

**In Expo Snack:**

### **Option A: Use Secrets Tab (Best)**

1. **Top menu** → Look for **"Secrets"** or **"⚙️"** (Settings/Config)
2. **Click it**
3. **Add two environment variables:**
   - **Name:** `EXPO_PUBLIC_SUPABASE_URL`
     **Value:** `https://hmkrwjscbcejdgojwksk.supabase.co` (paste your URL)
   
   - **Name:** `EXPO_PUBLIC_SUPABASE_ANON_KEY`
     **Value:** `eyJ...` (paste your full key)
4. **Save**

### **Option B: Hardcode in Code (Quick Test)**

**Edit `src/services/supabase.ts` in Snack:**

**Find these lines:**
```typescript
const supabaseUrl = ... || '';
const supabaseAnonKey = ... || '';
```

**Replace with:**
```typescript
// Hardcoded for Snack testing
const supabaseUrl = 'https://hmkrwjscbcejdgojwksk.supabase.co'; // Your URL from .env
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your key from .env
```

**Paste your actual values from the `.env` file!**

---

## 🎯 **QUICK COMMAND:**

**Run this in Terminal to see your keys:**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile && cat .env
```

**Copy the two values, then paste them in Expo Snack!**

---

## ✅ **After Adding Keys:**

1. **Save** in Snack
2. **App reloads**
3. **Error should disappear!**
4. **You can test sign up/login**

---

**Get your keys from `.env` → Add to Snack → Done!** 🔑✅
