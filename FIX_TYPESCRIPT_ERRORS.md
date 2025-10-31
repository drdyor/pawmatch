# 🔧 Fix TypeScript Errors - Step by Step

**Your Location:** `/Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile/`

---

## 🚨 **THE PROBLEM**

TypeScript can't find modules because:
1. ❌ `node_modules` folder is missing (dependencies not installed)
2. ❌ TypeScript types not resolved
3. ⚠️ Some files might be missing or have wrong paths

---

## ✅ **SOLUTION: Step-by-Step**

### **STEP 1: Open Terminal in Cursor Desktop**

1. In Cursor Desktop, click the **Terminal** tab at the bottom (or press `` Ctrl+` ``)
2. Make sure you're in the right folder:
   ```bash
   pwd
   ```
   Should show: `/Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile`

   If not, navigate there:
   ```bash
   cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
   ```

---

### **STEP 2: Install Dependencies**

**This is the MAIN fix!** Run:

```bash
npm install
```

**Wait 3-5 minutes** for all packages to download. You'll see lots of text scrolling.

**Expected output:**
```
added 1211 packages, and audited 1212 packages in 28s
```

✅ **This creates the `node_modules` folder with all dependencies!**

---

### **STEP 3: Check if .env File Exists**

You need your Supabase keys. Check if `.env` exists:

```bash
ls -la | grep .env
```

**If `.env` doesn't exist**, create it:

```bash
cp .env.example .env
```

Then edit `.env` and add your Supabase keys (see `SETUP_YOUR_KEYS.md`).

---

### **STEP 4: Fix TypeScript Configuration**

Your `tsconfig.json` might need a small fix. Run:

```bash
npx expo-doctor
```

This checks for common issues and suggests fixes.

---

### **STEP 5: Restart TypeScript Server**

After installing dependencies:

1. In Cursor Desktop, press **`Cmd+Shift+P`** (Mac) or **`Ctrl+Shift+P`** (Windows)
2. Type: **"TypeScript: Restart TS Server"**
3. Press Enter

This reloads TypeScript with the new `node_modules`.

---

### **STEP 6: Verify It Worked**

**Check for `node_modules` folder:**
```bash
ls -d node_modules
```

Should show: `node_modules` (directory exists)

**If errors persist**, check:
```bash
npm list react
```

Should show: `react@18.2.0`

---

## 🐛 **IF ERRORS STILL APPEAR**

### **Error: "Cannot find module 'react'"**

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

---

### **Error: "File 'expo/tsconfig.base' not found"**

**Solution:**
```bash
# Make sure Expo is installed
npm list expo

# If missing, install it
npm install expo@~50.0.0
```

Then restart TypeScript server (Step 5).

---

### **Error: "Cannot find OnboardingFlow"**

**This file might not exist yet.** Check:
```bash
ls src/screens/onboarding/
```

If `OnboardingFlow.tsx` is missing, the app might be using a different structure. Check `App.tsx` - it should import `AppNavigator` from `./src/navigation/AppNavigator`, not `OnboardingFlow`.

---

### **Error: "Cannot find VotesContext"**

Similar - check if this file exists:
```bash
find . -name "VotesContext.tsx"
```

If it doesn't exist, it might be an old import. The current `App.tsx` shouldn't need it.

---

## 🚀 **ONCE ERRORS ARE FIXED**

**Start the app:**

```bash
npm start
```

**Wait 20 seconds**, then you'll see:
- Terminal output
- **A QR CODE** 📱

**Scan with Expo Go app on your phone!**

---

## 📋 **QUICK CHECKLIST**

- [ ] Opened Terminal in Cursor Desktop
- [ ] Navigated to `/Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile`
- [ ] Ran `npm install` (wait for completion)
- [ ] Created `.env` file from `.env.example`
- [ ] Added Supabase keys to `.env`
- [ ] Restarted TypeScript server (`Cmd+Shift+P` → "Restart TS Server")
- [ ] Errors should be gone!
- [ ] Run `npm start` to launch app

---

## 🆘 **STILL STUCK?**

**Share the output of:**
```bash
node --version
npm --version
pwd
ls -la | head -20
```

This helps diagnose the issue!

---

**Most likely fix: Just run `npm install` in your terminal!** 🎯
