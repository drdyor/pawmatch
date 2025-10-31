# 🔧 Fix Slow Connection / Timeout Issues

**Your Problem:**
- ❌ `ETIMEDOUT` errors when downloading packages
- ❌ Phone tethering (PDA net) is slow/unstable
- ❌ npm registry connection timing out

**Solution:** Increase npm timeouts and use retry strategy

---

## ✅ **QUICK FIX - Copy & Paste This:**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile

# Increase npm timeouts (handles slow connections)
npm config set fetch-timeout 600000
npm config set fetch-retries 10
npm config set fetch-retry-factor 2
npm config set fetch-retry-mintimeout 10000
npm config set fetch-retry-maxtimeout 60000

# Now try installing again (will be slower but should work)
npm install
```

**This gives npm 10 minutes per package and will retry automatically!**

---

## 🚀 **ALTERNATIVE: Use Faster Registry Mirror**

If the above is still too slow, try a faster mirror:

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile

# Use npmmirror (often faster in some regions)
npm config set registry https://registry.npmmirror.com

# Set timeouts
npm config set fetch-timeout 600000
npm config set fetch-retries 10

# Install
npm install
```

---

## 📱 **BETTER SOLUTION: Use WiFi or Better Connection**

**If you have access to:**
- **WiFi network** → Switch to it (much faster!)
- **Better phone data** → Use that instead of PDA net
- **Ethernet** → Most reliable

**Then run:**
```bash
npm install
```

---

## 🔄 **IF IT STILL FAILS: Install in Smaller Batches**

If timeouts continue, install critical packages first:

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile

# Install Expo and core packages first
npm install expo@~50.0.0 react@18.2.0 react-native@0.73.0

# Then install the rest
npm install
```

---

## 💡 **PRO TIP: Resume Failed Downloads**

If npm stops partway through, just run `npm install` again - it will continue from where it stopped!

---

## ⏱️ **EXPECTED TIME:**

With slow tethering:
- **Normal install:** 5-10 minutes
- **With slow connection:** 15-30 minutes ⏳

**Be patient - let it run!** Don't cancel unless it fails completely.

---

## 📊 **MONITOR PROGRESS:**

You can see what it's doing:
```bash
npm install --verbose
```

This shows each package being downloaded.

---

## ✅ **AFTER INSTALL SUCCEEDS:**

Once you see "added 1211 packages", you're done! Then:

```bash
npm start
```

**You'll get your QR code! 📱**

---

**Try the timeout fix first - it should work with your PDA net connection!** 🚀
