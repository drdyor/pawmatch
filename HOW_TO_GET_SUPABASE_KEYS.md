# 🔑 How to Get Your Supabase Keys

**Your `.env` file has placeholders - you need real keys!**

---

## 🎯 **STEP 1: Go to Supabase Dashboard**

1. **Open:** https://supabase.com
2. **Sign in** to your account
3. **Click on your "PawMatch" project** (or create one if you don't have it)

---

## 📋 **STEP 2: Get Your Keys**

**In Supabase Dashboard:**

1. **Left sidebar** → Click **"Settings"** (gear icon)
2. **Click "API"** (under Project Settings)
3. **Find these two values:**

### **A. Project URL:**
- **Label:** "Project URL"
- **Value:** `https://xxxxx.supabase.co`
- **Copy this!**

### **B. Anon Public Key:**
- **Label:** "anon public" (under "Project API keys")
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)
- **Copy this!** (Click the "eye" icon to reveal it)

---

## ✅ **STEP 3: Add Keys to Your Local .env**

**On your Mac:**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
nano .env
```

**Or open `.env` in Cursor Desktop editor**

**Replace the placeholders:**

```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Paste your actual values from Supabase!**

**Save the file.**

---

## 📱 **STEP 4: Add Keys to Expo Snack**

**Now that you have the keys, add them to Snack:**

### **Option A: Secrets Tab (Best)**

1. **In Snack:** Top menu → **"Secrets"** or **"⚙️ Settings"**
2. **Add:**
   - `EXPO_PUBLIC_SUPABASE_URL` = (paste your URL)
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = (paste your key)
3. **Save**

### **Option B: Hardcode in Code**

**Edit `src/services/supabase.ts` in Snack:**

```typescript
const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co'; // Paste your URL
const supabaseAnonKey = 'eyJ...'; // Paste your full key
```

---

## 🔍 **If You Don't Have a Supabase Project Yet:**

**Create one:**

1. Go to https://supabase.com
2. Click **"New Project"**
3. **Fill in:**
   - Name: `PawMatch`
   - Database Password: (create a strong password)
   - Region: Choose closest (e.g., Europe)
4. **Wait 2 minutes** for project to create
5. **Go to Settings → API** to get keys

---

## 📋 **QUICK CHECKLIST:**

- [ ] Go to https://supabase.com
- [ ] Sign in / Create account
- [ ] Open your PawMatch project
- [ ] Settings → API
- [ ] Copy "Project URL"
- [ ] Copy "anon public" key
- [ ] Add to local `.env` file
- [ ] Add to Expo Snack (Secrets or code)
- [ ] Save → Test!

---

**Get your keys from Supabase Dashboard → Add to Snack → App works!** 🚀
