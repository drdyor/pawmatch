# 🔧 Fix "Incompatible SDK Version" Error

**Error:** `java.lang exception: incompatible sdk version`

**Problem:** Your project uses Expo SDK 50, but your Expo Go app might be older or newer.

---

## ✅ **SOLUTION 1: Update Expo Go App (Easiest)**

### **On Your Phone:**

1. **Go to App Store (iPhone) or Play Store (Android)**
2. **Search: "Expo Go"**
3. **Update the app** to the latest version
4. **Try scanning QR code again**

**This usually fixes it!**

---

## ✅ **SOLUTION 2: Downgrade Project SDK (If Expo Go is Old)**

**If your Expo Go is old and can't update:**

**In Expo Snack:**
- Look for **"SDK Version"** in settings
- Change to **SDK 49** or **SDK 48** (older versions)
- Save and get new QR code

---

## ✅ **SOLUTION 3: Use Development Build (Best Long-term)**

**Instead of Expo Go, build your own development version:**

### **Option A: EAS Build (Cloud Build)**

1. **Install EAS CLI** (when you have internet):
   ```bash
   npm install -g eas-cli
   ```

2. **Login:**
   ```bash
   eas login
   ```

3. **Build:**
   ```bash
   cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
   eas build:configure
   eas build --platform ios --profile development
   ```

4. **You'll get a download link** - install directly on phone (no QR needed!)

### **Option B: Expo Snack Development Build**

**In Snack:**
- Click **"Build"** or **"Device"** menu
- Select **"Development Build"**
- Follow instructions to install on phone

---

## ✅ **SOLUTION 4: Check SDK Compatibility**

**Your project uses:**
- Expo SDK 50 (from `package.json`)

**Expo Go versions:**
- Latest Expo Go supports SDK 50+
- Older versions support SDK 49 or lower

**Match them:**
- ✅ Update Expo Go app → Supports SDK 50
- OR Downgrade project to SDK 49 → Works with older Expo Go

---

## 🔍 **How to Check Your Expo Go Version**

**In Expo Go app:**
1. **Open Expo Go**
2. **Settings** or **Profile**
3. **Look for version number** (e.g., "2.28.0")

**Match with:**
- Expo Go 2.28+ → Supports SDK 50 ✅
- Expo Go 2.25-2.27 → Supports SDK 49
- Expo Go 2.20-2.24 → Supports SDK 48

---

## 🎯 **RECOMMENDED FIX:**

### **Try This First:**

1. **Update Expo Go app** on your phone (App Store/Play Store)
2. **Close Expo Go completely**
3. **Reopen Expo Go**
4. **Scan QR code again**

**90% of the time, this fixes it!**

---

## 📱 **If Update Doesn't Work:**

**In Expo Snack:**

1. **Look for SDK version setting**
2. **Change to SDK 49** (older, more compatible)
3. **Save** → Get new QR code
4. **Scan again**

---

## ✅ **QUICK FIX SUMMARY:**

1. ✅ **Update Expo Go app** (first try!)
2. ✅ **Or change SDK to 49 in Snack**
3. ✅ **Or use EAS Build** (development build)

**Update Expo Go first - that's usually all you need!** 📱✅
