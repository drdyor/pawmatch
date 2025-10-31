# 🚀 How to Deploy Your Mobile App (Correct Way)

---

## 📱 **FOR MOBILE APP (iOS/Android):**

### **Step 1: Install EAS CLI**

```bash
npm install -g eas-cli
```

### **Step 2: Login to Expo**

```bash
eas login
```

(Create account at https://expo.dev if needed)

### **Step 3: Configure Build**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
eas build:configure
```

### **Step 4: Build for Your Phone**

**iOS:**
```bash
eas build --platform ios --profile development
```

**Android:**
```bash
eas build --platform android --profile development
```

### **Step 5: Get Install Link**

- ✅ Build runs in cloud (20-30 minutes)
- ✅ You get email with download link
- ✅ Install directly on your phone
- ✅ No App Store needed for testing!

---

## 🏪 **FOR APP STORES (Production):**

### **iOS (App Store):**

```bash
eas build --platform ios --profile production
```

**Then:**
1. Download `.ipa` file
2. Upload to App Store Connect
3. Submit for review

### **Android (Play Store):**

```bash
eas build --platform android --profile production
```

**Then:**
1. Download `.aab` file
2. Upload to Google Play Console
3. Submit for review

---

## 🌐 **IF YOU ALSO WANT WEB VERSION:**

### **Build Web Export:**

```bash
npm install
npx expo export --platform web --output-dir dist
```

### **Then Deploy to Vercel:**

1. **Connect GitHub repo to Vercel**
2. **Settings:**
   - Build command: `expo export --platform web`
   - Output directory: `dist`
   - Install command: `npm install`
3. **Deploy!**

**But this is SEPARATE from your mobile app!**

---

## ✅ **SUMMARY:**

- 📱 **Mobile app** → Use **Expo EAS Build**
- 🌐 **Web version** → Use **Vercel** (after `expo export --platform web`)
- ❌ **Don't deploy mobile app to Vercel** - won't work!

---

**Use EAS Build for mobile - it's built for Expo apps!** 🚀
