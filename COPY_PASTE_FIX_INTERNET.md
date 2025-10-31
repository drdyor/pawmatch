# 📋 Quick Fix - Internet Connection

**Your internet is not working!** Fix this first:

---

## 🔧 **STEP 1: Check Your Connection**

**In Terminal, run:**

```bash
# Check what network interfaces are active
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**This shows if you have ANY network connection.**

---

## 📱 **STEP 2: Fix PDA Net OR Switch to WiFi/Hotspot**

### **Option A: Reconnect PDA Net**

1. **Disconnect** PDA net
2. **Wait 10 seconds**
3. **Reconnect** PDA net
4. **Wait for "Connected"**

### **Option B: Use Phone Hotspot (RECOMMENDED)**

1. **On your phone:** Settings → Personal Hotspot → Turn ON
2. **On your Mac:** WiFi menu → Connect to your phone's hotspot
3. **Enter password** from your phone

### **Option C: Use WiFi**

1. **Disconnect** PDA net
2. **Connect** to available WiFi network

---

## ✅ **STEP 3: Test Internet**

```bash
ping -c 3 google.com
```

**Should show:**
```
PING google.com (142.250.xxx.xxx): 56 data bytes
64 bytes from 142.250.xxx.xxx: icmp_seq=0 ttl=xxx time=xxx ms
64 bytes from 142.250.xxx.xxx: icmp_seq=1 ttl=xxx time=xxx ms
```

**NOT:**
```
Request timeout
ping: cannot resolve google.com
```

---

## 🎯 **STEP 4: Once Internet Works**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile

# Set timeouts for slow connection
npm config set fetch-timeout 600000
npm config set fetch-retries 10

# Test npm can reach registry
npm ping

# If that works, install
npm install
```

---

## 🆘 **IF INTERNET STILL DOESN'T WORK:**

**Try these:**

```bash
# Release and renew network settings
sudo ifconfig en0 down
sudo ifconfig en0 up

# Or flush DNS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Then test again
ping google.com
```

---

**Once `ping google.com` works, we can install packages!** 📡
