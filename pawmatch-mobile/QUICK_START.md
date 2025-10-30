# 📱 MOBILE APP - QUICK START

## 🚀 Start the App (3 Steps):

### **Step 1: Open Terminal**

In Cursor, open the terminal (bottom panel) or use your system terminal.

### **Step 2: Navigate and Start**

```bash
cd /workspace/pawmatch-mobile
npx expo start --clear
```

**Expected Output:**
```
Starting Metro Bundler...
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go

› Press commands:
  › Press a │ open Android
  › Press i │ open iOS simulator  
  › Press w │ open web
```

### **Step 3: Open on Your Phone**

**Option A: Expo Go App (Easiest)**
1. Download **Expo Go** from:
   - iOS: App Store
   - Android: Play Store

2. **iPhone:** Open Camera → Scan QR → Tap notification
3. **Android:** Open Expo Go → "Scan QR Code" → Scan

**Option B: Web Browser (Quick Test)**
```bash
# After npm start, press:
w
```
Opens at: `http://localhost:19006`

---

## 🎉 Demo Mode Enabled!

The app is configured to run in **DEMO MODE** - no Supabase needed!

You can:
- ✅ See all screens
- ✅ Test navigation
- ✅ View UI/UX
- ✅ Try swipe gestures

---

## 🐛 Troubleshooting:

### **Issue: "Couldn't start project"**

```bash
# Clear cache and restart
cd /workspace/pawmatch-mobile
rm -rf .expo node_modules
npm install
npx expo start --clear
```

### **Issue: "Port already in use"**

```bash
# Kill existing processes
npx kill-port 8081 19000 19001
npx expo start
```

### **Issue: "Can't scan QR code"**

**Try tunnel mode:**
```bash
npx expo start --tunnel
```

This creates a public URL that works across different networks.

### **Issue: "Expo Go can't open this"**

1. Make sure Expo Go is updated (latest version)
2. Try:
```bash
npx expo start --clear --reset-cache
```

### **Issue: "Network response timed out"**

Make sure:
- Phone and computer on **same WiFi**
- Or use `--tunnel` mode
- Firewall isn't blocking ports 19000-19006

---

## 📱 What You'll See:

### **1. Welcome Screen**
- PawMatch logo
- "Get Started" button
- Beautiful gradient background

### **2. Sign Up / Sign In**
- Email + Password fields
- "Create Account" button
- Demo mode: Enter any email/password

### **3. Role Selection**
- Choose your role:
  - 🏠 Buyer/Adopter
  - 🐕 Breeder
  - 🏥 Shelter
  - 💉 Vet

### **4. Main App** (varies by role)

**Buyer/Adopter:**
- 🎴 Swipe on pets
- ⭐ View favorites
- 💬 Messages
- 🔔 Alerts

**Breeder:**
- 📅 Heat tracking calendar
- 🎴 Swipe on studs
- 🐕 My pets
- 📢 Create litter announcement

**Shelter:**
- 🏠 Animals list
- 📝 Intake form
- 🆘 Urgent alerts

---

## 🎬 Demo Experience:

Since we're in demo mode:
- Sign up with **any email** (test@example.com)
- Password: **any password** (test123)
- Choose any role
- Explore all screens!

---

## 🔑 Want Real Features?

To enable real database, auth, photos:

1. **Create Supabase account:** https://supabase.com
2. **Create project:** "pawmatch"
3. **Get keys:** Settings → API
4. **Update .env:**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```
5. **Run database setup:** Copy `SAFE_DATABASE_SETUP.sql` to Supabase SQL Editor
6. **Restart app:**
```bash
npx expo start --clear
```

---

## ✅ Success Checklist:

- [ ] Terminal shows "Metro waiting on..."
- [ ] QR code appears
- [ ] Expo Go app installed on phone
- [ ] QR code scans successfully
- [ ] App loads on phone
- [ ] Welcome screen appears
- [ ] Can sign up with test credentials
- [ ] Can navigate between screens

---

## 🎯 Quick Commands:

```bash
# Start normally
npx expo start

# Start with clear cache
npx expo start --clear

# Start in tunnel mode (different networks)
npx expo start --tunnel

# Open in web browser
npx expo start --web

# Open Android emulator (if installed)
npx expo start --android

# Open iOS simulator (if on Mac)
npx expo start --ios
```

---

## 📊 What's Working:

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ | Demo mode |
| Navigation | ✅ | All screens |
| Swipe Cards | ✅ | Full gestures |
| Heat Calendar | ✅ | UI ready |
| Messaging | ✅ | UI ready |
| Role Selection | ✅ | 5 roles |
| Profile | ✅ | Forms work |

---

## 🎨 Screens Available:

**31 Complete Screens:**
- auth/ (4 screens)
- buyer/ (7 screens)
- breeder/ (8 screens)
- shelter/ (3 screens)
- vet/ (3 screens)
- shared/ (3 screens)
- onboarding/ (3 screens)

---

**Just run `npx expo start --clear` and scan the QR!** 📱✨
