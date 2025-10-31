# 📋 Simple Steps (No Password Needed!)

---

## 🎯 **EASIEST WAY: Use Your Phone's Hotspot**

**No sudo password needed!**

### **Step 1: Turn on Phone Hotspot**

**iPhone:**
- Settings → Personal Hotspot → Toggle ON
- Note the WiFi password shown

**Android:**
- Settings → Network & Internet → Hotspot & Tethering
- Toggle ON
- Note the password

---

### **Step 2: Connect Mac to Phone**

1. **On Mac:** Click **WiFi icon** (top right)
2. **See your phone's name** in the list
3. **Click it** → Enter password
4. **Wait for "Connected"**

---

### **Step 3: Test It Works**

**In Terminal:**
```bash
ping -c 3 google.com
```

**Should see:**
```
64 bytes from 142.250.xxx.xxx...
```

**NOT:**
```
Request timeout
```

---

### **Step 4: Install Dependencies**

**Once internet works:**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile

# Test npm can reach registry
npm ping

# Set timeouts for slow connection
npm config set fetch-timeout 600000
npm config set fetch-retries 10

# Install (this will take 10-20 minutes on slow connection)
npm install
```

---

### **Step 5: Start the App**

**After npm install finishes:**

```bash
npm start
```

**You'll see a QR code! 📱**

---

## ✅ **That's It!**

**No sudo password needed - just use your phone's hotspot!**

**Share what happens when you try `npm ping` after connecting to hotspot!** 🚀
