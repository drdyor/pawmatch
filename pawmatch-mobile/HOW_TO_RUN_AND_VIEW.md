# 📱 How to Run & View PawMatch Mobile App

## ✅ What You've Done So Far:
- ✅ Supabase credentials configured in `.env`
- ✅ Database tables created (ran FRESH_DATABASE_SETUP.sql)
- ✅ App code ready

---

## 🚀 How to Run the App

### **Method 1: Expo Go on Your Phone (Recommended)**

**You Need:**
1. ✅ A smartphone (iPhone or Android)
2. ✅ Someone with a computer to run the commands
3. ✅ Both on the same Wi-Fi network

**Steps:**

#### **On Your Phone:**
1. **Download Expo Go app:**
   - **iOS**: https://apps.apple.com/app/expo-go/id982107779
   - **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Open the Expo Go app** (don't need to create account)

#### **On Computer (Terminal):**

```bash
# 1. Navigate to mobile app folder
cd /workspace/pawmatch-mobile

# 2. Install dependencies (first time only)
npm install

# 3. Start the app
npm start
```

#### **What You'll See:**

The terminal will show:
```
› Metro waiting on exp://192.168.x.x:8081

› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

#### **Connect Your Phone:**

**On iPhone:**
1. Open regular **Camera app**
2. Point at the QR code on the computer screen
3. Tap the notification that appears
4. App will open in Expo Go!

**On Android:**
1. Open **Expo Go app**
2. Tap **"Scan QR Code"**
3. Point at the QR code
4. App will load!

---

### **Method 2: iOS Simulator (Mac Only)**

**Requirements:**
- Mac computer
- Xcode installed

**Steps:**
```bash
cd /workspace/pawmatch-mobile
npm install
npm start

# Press 'i' when Metro shows
# iOS Simulator will open automatically
```

---

### **Method 3: Android Emulator (Any OS)**

**Requirements:**
- Android Studio installed
- Android Virtual Device (AVD) set up

**Steps:**
```bash
cd /workspace/pawmatch-mobile
npm install

# Start Android Emulator first (from Android Studio)
# Then:
npm start

# Press 'a' when Metro shows
# App will install on emulator
```

---

## 🧪 What You Should See

### **1. Welcome Screen** 
- 🐾 Big paw emoji logo
- "PawMatch" title
- "Connecting Malta's Pet Community" subtitle
- 3 feature cards:
  - 🏠 Shelters
  - 🐕 Breeders  
  - ❤️ Find Pets
- Yellow "Get Started" button
- "Sign In" button

### **2. Sign Up Screen**
- Email input
- Password input  
- Confirm password
- Yellow "Sign Up" button
- Clean, modern design

### **3. Role Selection Screen**
- "I am a..." title
- 5 role cards:
  - 🏠 Animal Shelter
  - 🐕 Independent Breeder
  - 📋 Registered Breeder
  - ❤️ Looking for a Pet
  - ⚕️ Veterinarian
- Each card has checkbox when selected
- Yellow "Continue" button

### **4. After Onboarding:**
- **Home screen** with personalized stats and quick actions
- **Bottom tabs** for navigation
- **Swipe discovery** for finding pets
- **Messages** for communication

---

## 🎨 What Makes It Look Good

**Yellow & Blue Theme:**
- Primary: #FFC700 (Warm yellow - Malta sun ☀️)
- Secondary: #2F80ED (Blue - Mediterranean sea 🌊)
- Clean white cards
- Professional spacing

**Key Features:**
- ✨ Smooth animations
- 📱 Native feel
- 🎯 Role-specific experiences
- 💛 Malta-themed design

---

## 🐛 Troubleshooting

### **"Can't connect to Metro"**
- Make sure phone and computer are on **same Wi-Fi**
- Try entering URL manually in Expo Go:
  - Look for `exp://192.168.x.x:8081` in terminal
  - Type this into Expo Go

### **"Network response timed out"**
- Restart Metro: Close terminal, run `npm start` again
- Check firewall isn't blocking port 8081

### **"Build failed" or errors**
```bash
# Clear cache and reinstall
cd /workspace/pawmatch-mobile
rm -rf node_modules
npm install
npm start -- --clear
```

### **QR code doesn't scan**
- Make sure QR code is fully visible on screen
- Try increasing screen brightness
- Manually type the `exp://` URL into Expo Go

---

## 📋 Quick Test Checklist

Once app loads:
- [ ] See welcome screen with yellow theme
- [ ] Tap "Get Started"
- [ ] Fill in signup form
- [ ] Create account
- [ ] Select a role (try "Looking for a Pet")
- [ ] Complete profile
- [ ] Land on home screen with stats
- [ ] Tap "Discover" tab at bottom
- [ ] See swipe interface (if there's demo data)
- [ ] Test swiping left/right

---

## 🔧 For Web Cursor Users

**Since you can't run commands yourself:**

1. **Share this guide** with someone who can run the app locally
2. **Or use GitHub Codespaces:**
   - Go to https://github.com/drdyor/pawmatch
   - Click "Code" → "Codespaces" → "Create codespace"
   - Run commands in the terminal
   - Scan QR with your phone

3. **Or use Expo Snack** (web-based):
   - Go to https://snack.expo.dev/
   - Upload your code
   - View on phone via QR

---

## 📞 Alternative: Ask for Help

**Can't run it yourself?**

Options:
1. Ask a developer friend to run it
2. Use GitHub Codespaces (free 60 hours/month)
3. Set up local Node.js environment
4. Use Expo online editor

---

## 🎯 Expected Result

**After running `npm start` and scanning QR:**

Your phone will show:
```
🐾 PawMatch
Connecting Malta's Pet Community

[Yellow button: Get Started]
[White button: Sign In]
```

Beautiful, professional, Malta-themed! 🇲🇹✨

---

**Need help getting it running? Let me know what setup you have access to!**
