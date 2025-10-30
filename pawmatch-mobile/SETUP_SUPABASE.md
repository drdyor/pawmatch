# 🔑 Setup Supabase for Full Features

## Current Status:
- ✅ App installed
- ✅ Demo mode works
- ⏳ Need Supabase for real data

---

## Quick Setup (10 minutes):

### **Step 1: Create Supabase Project**

1. Go to: https://supabase.com
2. Click "New Project"
3. Name: `pawmatch`
4. Password: (choose strong password)
5. Region: **Europe West (Ireland)** ← Closest to Malta!
6. Wait 2 minutes...

---

### **Step 2: Get Your Keys**

1. In Supabase → **Settings** → **API**
2. Copy these:
   - **URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOi...`

---

### **Step 3: Update .env File**

Open `/workspace/pawmatch-mobile/.env` and replace:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **Step 4: Run Database Setup**

1. In Supabase → **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open file: `SAFE_DATABASE_SETUP.sql`
4. **Copy ALL** (Ctrl+A, Ctrl+C)
5. **Paste** in Supabase (Ctrl+V)
6. Click **"Run"** (green button)
7. Should see: "Success. No rows returned"

✅ **Database ready!**

---

### **Step 5: Restart App**

```bash
# Stop the running app (Ctrl+C)
npm start
```

Now all features work:
- ✅ Real database
- ✅ Photo uploads
- ✅ Real-time messaging
- ✅ Push notifications
- ✅ All user roles

---

## 🧪 Test With Demo Data:

After database setup, run:

```bash
# Seed demo users and pets
cd /workspace/pawmatch-mobile
node scripts/seed.js
```

This creates:
- 4 demo users (Breeder, Buyer, Shelter, Vet)
- 10 demo pets
- 3 litters
- Sample messages

---

## 🎯 What Each Screen Does:

| Screen | Demo Mode | With Supabase |
|--------|-----------|---------------|
| Swipe | Mock data | Real pets |
| Heat Calendar | Local only | Syncs to cloud |
| Messaging | Offline | Real-time chat |
| Photos | No upload | Full upload |
| Payments | Fake | Real Stripe |

---

## 🐛 Troubleshooting:

### "Invalid API Key"
- Double-check you copied **anon/public** key, not service_role
- Make sure no extra spaces in .env

### "Table does not exist"
- Run SAFE_DATABASE_SETUP.sql again
- Check SQL ran successfully (no red errors)

### "Auth error"
- Go to Supabase → Authentication → Settings
- Enable **Email provider**
- Disable **Confirm email** (for testing)

---

## 🚀 You're All Set!

Without Supabase: **App works in demo mode**  
With Supabase: **All features unlocked** 🎉

