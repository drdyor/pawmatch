# 📱 Quick Guide: Test App on Expo Snack

**Test your app in 5 minutes without npm install!**

---

## 🎯 **STEP-BY-STEP:**

### **Step 1: Prepare Your Supabase Keys**

**You'll need these in Snack:**

1. **Open your `.env` file** (or `.env.example`)
2. **Copy:**
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

**Keep these ready!**

---

### **Step 2: Go to Expo Snack**

**Open in browser:** https://snack.expo.dev

---

### **Step 3: Sign In**

- **Click "Sign in"**
- **Use GitHub account** (or create Expo account)

---

### **Step 4: Import Your Code**

**Option A: From GitHub (if your repo is public):**
1. **Click "Import from GitHub"**
2. **Enter your repo URL**
3. **Select branch:** `pawmatch-mobile-app`
4. **Click "Import"**

**Option B: Manual (copy files):**
1. **Click "New Snack"**
2. **Delete default code**
3. **Create folders:**
   - `src/`
   - `src/screens/`
   - `src/components/`
   - `src/services/`
   - etc.
4. **Copy-paste your code files** one by one

---

### **Step 5: Add Environment Variables**

**In Snack:**

1. **Click "Environment Variables"** (or look for settings)
2. **Add:**
   ```
   EXPO_PUBLIC_SUPABASE_URL = your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY = your_supabase_key
   ```
3. **Save**

---

### **Step 6: Fix App Entry**

**Snack needs `App.js` or `App.tsx` in root:**

**Create/Update `App.tsx` in Snack:**
```typescript
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator userRole={null} />;
}
```

---

### **Step 7: Get QR Code!**

1. **Click "Save"** (top right)
2. **Wait for Snack to process**
3. **QR code appears!** 📱

---

### **Step 8: Test on Phone**

1. **Open Expo Go app** on your phone
2. **Scan the QR code**
3. **App loads!** 🎉

---

## ⚠️ **LIMITATIONS:**

- Some native modules might not work
- Real-time subscriptions might be limited
- File uploads might need adjustment

**But you can see and test the UI!**

---

## 🎯 **ALTERNATIVE: Upload Key Files Only**

**If full import is too complex, just test the UI:**

1. **Create minimal version in Snack:**
   - `App.tsx` (your main app)
   - `src/navigation/AppNavigator.tsx`
   - `src/screens/auth/WelcomeScreen.tsx`

2. **Test navigation and UI**
3. **Add more screens gradually**

---

## ✅ **That's It!**

**No npm install, no network issues - just works in browser!**

**Go to https://snack.expo.dev and try it!** 🚀
