# 🚀 Complete Supabase Setup Guide for PawMatch

## Current Situation
- **Web App** → Uses Firebase
- **Mobile App** → Uses Supabase (needs setup)
- **Issue**: Mobile app needs Supabase database configured

---

## ✅ Step-by-Step Setup (15 minutes)

### **Step 1: Create Supabase Account & Project**

1. Go to: **https://supabase.com**
2. Click **"Start your project"** (Sign up with GitHub)
3. Click **"New project"**
4. Fill in:
   - **Name**: `pawmatch`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: `Europe West (Ireland)` (closest to Malta)
   - **Pricing Plan**: Free
5. Click **"Create new project"**
6. ⏱️ Wait 2-3 minutes for setup to complete

---

### **Step 2: Get Your API Keys**

1. Once project is ready, go to **Settings** (gear icon in sidebar)
2. Click **"API"** in the left menu
3. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (this is what you need ✅)
     - `service_role` key (don't use this one ⚠️)

4. **Copy these values** - you'll need them next!

---

### **Step 3: Configure Your Mobile App**

1. Open the file: `/workspace/pawmatch-mobile/.env`
2. Replace the placeholder values with your actual keys:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key_here...
```

**⚠️ Important**: 
- Use the **anon/public** key (NOT the service_role key)
- No quotes needed around the values
- Make sure there are no extra spaces

---

### **Step 4: Create Database Tables**

1. In Supabase Dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open this file in your workspace: `/workspace/pawmatch-mobile/SAFE_DATABASE_SETUP.sql`
4. **Copy ALL the content** (Ctrl+A, Ctrl+C)
5. **Paste it** into the Supabase SQL Editor (Ctrl+V)
6. Click the **"Run"** button (or press Ctrl+Enter)
7. Wait for completion - you should see: ✅ **"Success. No rows returned"**

This creates:
- ✅ Users table
- ✅ Pets table
- ✅ Listings table
- ✅ Messages table
- ✅ Health records table
- ✅ Heat cycles table
- ✅ Notifications table
- ✅ Contracts table
- ✅ Storage buckets for photos
- ✅ Security policies (Row Level Security)
- ✅ All indexes for performance

---

### **Step 5: Enable Email Authentication**

1. In Supabase, go to **"Authentication"** in sidebar
2. Click **"Providers"**
3. Find **"Email"** and make sure it's enabled
4. Click **"Email"** to configure:
   - ✅ Enable **"Enable Email provider"**
   - ⚠️ **Disable** "Confirm email" (for testing - enable later in production)
   - Click **"Save"**

---

### **Step 6: Test the Connection**

1. In your terminal, navigate to the mobile app:
   ```bash
   cd /workspace/pawmatch-mobile
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   npm start
   ```

4. The app should now connect to Supabase! 🎉

---

## 🧪 Optional: Add Demo Data

To test with sample data, you can manually add a user and pet in Supabase:

1. Go to **"Table Editor"** in Supabase
2. Click on **"users"** table
3. Click **"Insert row"**
4. Add sample data:
   ```
   id: (auto-generated)
   email: test@example.com
   role: breeder_registered
   full_name: Test Breeder
   city: Valletta
   country: Malta
   ```

---

## ✅ What You Now Have

| Feature | Status |
|---------|--------|
| Authentication | ✅ Email/password sign-up |
| User Profiles | ✅ Full CRUD operations |
| Pet Listings | ✅ Browse, create, update |
| Photo Uploads | ✅ Cloud storage ready |
| Real-time Messaging | ✅ Live chat system |
| Heat Calendar | ✅ Breeding cycle tracking |
| Health Records | ✅ Vet certificates |
| Security | ✅ Row-level security enabled |

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- ✅ Double-check you copied the **anon/public** key (not service_role)
- ✅ Make sure no extra spaces in `.env` file
- ✅ Restart the app after changing `.env`

### Error: "Table does not exist"
- ✅ Run `SAFE_DATABASE_SETUP.sql` again in Supabase SQL Editor
- ✅ Check for any red error messages when running the SQL

### Error: "Auth error" or "User not found"
- ✅ Make sure Email provider is enabled in Authentication settings
- ✅ Disable "Confirm email" for testing

### App still in demo mode
- ✅ Check that `.env` file has real values (not `your_supabase_url_here`)
- ✅ Restart Metro bundler: Stop the app and run `npm start` again
- ✅ Clear cache: `npm start -- --clear`

---

## 🔒 Security Notes (For Production)

Before launching:

1. **Enable Email Confirmation**:
   - Go to Authentication → Providers → Email
   - Enable "Confirm email"

2. **Review RLS Policies**:
   - The `SAFE_DATABASE_SETUP.sql` includes secure Row Level Security
   - Users can only edit their own data
   - All sensitive data is protected

3. **Storage Security**:
   - Pet photos are public (anyone can view)
   - Certificates & contracts are private (owner-only)

4. **Environment Variables**:
   - Never commit `.env` to git (already in `.gitignore`)
   - Use separate Supabase projects for dev/staging/production

---

## 📱 Next Steps

1. ✅ Test user sign-up/login
2. ✅ Create a test pet profile
3. ✅ Upload a photo
4. ✅ Test the swipe feature
5. ✅ Try sending a message
6. 🚀 Launch to users!

---

## 🆘 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **PawMatch Setup Docs**: Check `/workspace/pawmatch-mobile/SETUP_SUPABASE.md`
- **Database Schema**: See `/workspace/pawmatch-mobile/COMPLETE_DATABASE_SETUP.sql`

---

## Summary: Firebase vs Supabase in Your Project

| Component | Backend | Purpose |
|-----------|---------|---------|
| **Web App** (`/workspace/src`) | Firebase | Vet clinic management system |
| **Mobile App** (`/workspace/pawmatch-mobile`) | Supabase | Pet adoption/breeding marketplace |

These are **separate apps** with **separate databases**. They don't need to communicate with each other.

**You're all set!** 🎉
