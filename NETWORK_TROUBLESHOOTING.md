# 🔧 Network Troubleshooting - Install Dependencies Offline/With Issues

**Your Situation:**
- ❌ Network blocking npm registry
- ❌ Expo not installed
- ❌ Dependencies not installed (`node_modules` missing)
- ✅ You have the code in `/Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile`

---

## 🎯 **SOLUTION 1: Fix Network & Install (BEST)**

### **Step 1: Check Your Internet Connection**

In Terminal:
```bash
ping -c 3 google.com
```

**If it fails:**
- Check WiFi/Ethernet connection
- Disable VPN if active
- Check firewall settings

### **Step 2: Configure npm Registry/Proxy**

**If you're behind a corporate proxy:**

```bash
# Set proxy (if needed)
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Or use a mirror (faster in some regions)
npm config set registry https://registry.npmjs.org/
```

**Try installing again:**
```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
npm install
```

### **Step 3: Use Alternative Registry (If npmjs.org is blocked)**

Try using a mirror:
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

Or Yarn (if you have it):
```bash
yarn install
```

---

## 🌐 **SOLUTION 2: Use Mobile Hotspot**

If your WiFi network blocks npm:

1. **Turn on mobile hotspot** on your phone
2. **Connect your computer** to the hotspot
3. **Run:**
   ```bash
   cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
   npm install
   ```

---

## 📦 **SOLUTION 3: Copy node_modules from Another Computer**

If you have the project on another computer with internet:

1. **On the working computer:**
   ```bash
   cd pawmatch-mobile
   npm install
   # This creates node_modules/
   ```

2. **Copy the `node_modules` folder** to your current computer:
   - Use USB drive, cloud storage, or network share
   - Place it in: `/Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile/node_modules`

3. **On your current computer:**
   ```bash
   cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
   npm start
   ```

⚠️ **Note:** `node_modules` is large (~500MB-1GB). Make sure you have space!

---

## 💾 **SOLUTION 4: Pre-download Dependencies (Offline Install)**

If you have intermittent internet:

1. **Download when you have internet:**
   ```bash
   npm install --cache .npm-cache
   ```

2. **Use cache later when offline:**
   ```bash
   npm install --offline --cache .npm-cache
   ```

---

## 🔄 **SOLUTION 5: Use Expo Go Without Local Server**

**If you can't install dependencies locally:**

1. **Option A: Use Expo Snack (Web Editor)**
   - Go to: https://snack.expo.dev
   - Upload your code
   - Get QR code from there
   - ⚠️ Limited features, but works for testing

2. **Option B: Use Another Machine**
   - Copy code to laptop/desktop with internet
   - Install there
   - Run `npm start`
   - Scan QR code with your phone

---

## 🔍 **SOLUTION 6: Diagnose the Exact Network Issue**

**Run these in Terminal to diagnose:**

```bash
# 1. Check npm configuration
npm config list

# 2. Test npm registry access
npm ping

# 3. Check DNS
nslookup registry.npmjs.org

# 4. Test HTTPS connection
curl -I https://registry.npmjs.org/

# 5. Check if npm is working at all
npm --version
node --version
```

**Share the output** - this helps identify the exact problem!

---

## ✅ **SOLUTION 7: Minimal Install (If Full Install Fails)**

Try installing just Expo first:

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile

# Install only Expo CLI globally
npm install -g expo-cli

# Then try starting (might work if some deps are cached)
npx expo start --offline
```

---

## 📱 **SOLUTION 8: Build & Test on Expo Cloud**

If local development is blocked:

1. **Install EAS CLI** (when you have internet):
   ```bash
   npm install -g eas-cli
   ```

2. **Build in cloud:**
   ```bash
   eas build --profile development
   ```

3. **Get install link** for your phone (no QR needed!)

---

## 🆘 **QUICK CHECKLIST:**

**Before trying solutions, verify:**

- [ ] You're in the right directory: `/Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile`
- [ ] Node.js is installed: `node --version` (should show v18+ or v20+)
- [ ] npm is installed: `npm --version` (should show v9+ or v10+)
- [ ] Internet works: `ping google.com` succeeds
- [ ] No firewall blocking npm

**Run these commands in Terminal:**

```bash
# 1. Verify location
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile && pwd

# 2. Check Node/npm
node --version
npm --version

# 3. Test internet
ping -c 2 google.com

# 4. Test npm registry
npm ping
```

---

## 🎯 **RECOMMENDED APPROACH:**

**If you have ANY internet access:**

1. **Try Solution 1** (Fix Network)
2. **If that fails, try Solution 2** (Mobile Hotspot)
3. **If still blocked, use Solution 5B** (Another Machine)

**If you have NO internet:**

1. **Solution 3** (Copy node_modules)
2. **Solution 5A** (Expo Snack web)

---

## 📋 **AFTER DEPENDENCIES ARE INSTALLED:**

Once `npm install` succeeds:

```bash
# Verify node_modules exists
ls -d node_modules

# Start Expo
npm start

# You should see a QR code! 📱
```

---

## 🤔 **WHAT'S YOUR SITUATION?**

Tell me:
1. **Do you have ANY internet?** (even slow/intermittent)
2. **Are you on corporate/restricted network?**
3. **Can you use mobile hotspot?**
4. **Do you have another computer with internet?**
5. **What error do you see when running `npm install`?**

With this info, I can give you the exact steps! 🚀
