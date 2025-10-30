# 🔑 How to Add Your API Keys

## ⚠️ IMPORTANT: Security Warning

**NEVER share your API keys in:**
- Public chat messages
- Screenshots
- GitHub public repos
- Social media

API keys = passwords to your database!

---

## ✅ **What You Need to Do:**

### **Step 1: Open the .env file**

In Cursor web browser (left sidebar):
1. Navigate to: `pawmatch-mobile/`
2. Find the file: `.env`
3. Open it

You'll see:
```
EXPO_PUBLIC_SUPABASE_URL=https://hmkrwjscbcejdgojwksk.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=PASTE_YOUR_API_KEY_HERE
```

---

### **Step 2: Add Your API Key**

1. Go to your Supabase project: [https://supabase.com](https://supabase.com)
2. Click **"Settings"** → **"API"**
3. Find **"anon public"** key (long string starting with `eyJ...`)
4. **Copy it**
5. **Go back to Cursor** → `.env` file
6. **Replace** `PASTE_YOUR_API_KEY_HERE` with your actual key
7. **Save** the file (Ctrl+S or Cmd+S)

Your `.env` should now look like:
```
EXPO_PUBLIC_SUPABASE_URL=https://hmkrwjscbcejdgojwksk.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
```

✅ **Configuration complete!**

---

## 🎯 **Next Step: Actually Run the App**

Since you're in **web browser Cursor**, you can't run Terminal commands.

**You need to:**

### **Option 1: Download the Code**
1. Right-click `pawmatch-mobile` folder
2. Click "Download" (if available)
3. Run on your computer

### **Option 2: Use Cursor Desktop**
1. Download from [cursor.sh](https://cursor.sh)
2. Open this workspace
3. Run from there

### **Option 3: Get Help**
Ask someone technical to:
- Access this Cursor Agent workspace
- Run `npm install` and `npm start`
- Share the QR code with you

---

## 📱 **When Someone Runs It:**

They'll type in Terminal:
```bash
cd /workspace/pawmatch-mobile
npm install
npm start
```

A QR code appears → Scan with Expo Go → **App opens on phone!**

---

## 🤔 **What Can You Do?**

**Right now in web Cursor:**
- ✅ Add your API key to `.env` file
- ✅ Read all the code I built
- ✅ Review `WHAT_WE_BUILT.md` to see features
- ❌ Can't run/test the app (need Terminal)

**To actually test:**
- Need Cursor Desktop OR
- Someone with Terminal access OR
- Developer to help

---

**Have you added your API key to the `.env` file yet?** 

And **do you have access to Cursor Desktop, or need help getting the app running?** 🤔