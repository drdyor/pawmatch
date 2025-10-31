# 📋 Copy & Paste: Fix DNS Issue

**Your DNS isn't working. Run these commands:**

---

## 🔧 **STEP 1: Flush DNS Cache**

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

(Enter your password when prompted)

---

## ✅ **STEP 2: Test DNS**

```bash
nslookup google.com
```

**Should show:**
```
Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	google.com
Address: 142.250.xxx.xxx
```

**If you see "cannot resolve" → DNS still broken**

---

## 📱 **STEP 3: Switch to Phone Hotspot (BETTER OPTION)**

**PDA net seems unreliable. Use your phone:**

1. **On phone:** Settings → Personal Hotspot → Turn ON
2. **On Mac:** 
   - Disconnect PDA net
   - WiFi → Connect to your phone
   - Enter password

3. **Test:**
   ```bash
   ping -c 3 google.com
   nslookup google.com
   ```

---

## 🎯 **STEP 4: Configure DNS in System Preferences**

**If still broken, set DNS manually:**

1. **System Preferences** → **Network**
2. **Click your connection** (PDA net or WiFi)
3. **Click "Advanced"** → **"DNS" tab**
4. **Click "+"** → Add: `8.8.8.8`
5. **Click "+"** → Add: `8.8.4.4`
6. **Click "OK"** → **"Apply"**
7. **Reconnect** your network

---

## ✅ **STEP 5: Once DNS Works**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile

# Test npm registry
npm ping

# Should show: "Ping successful"

# Then install
npm config set registry https://registry.npmjs.org
npm config set fetch-timeout 600000
npm install
```

---

**Try flushing DNS first, then switch to phone hotspot - that's the most reliable!** 📡
