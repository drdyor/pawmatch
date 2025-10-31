# 🔧 Fix DNS/Network Resolution Error

**Your Error:**
```
getaddrinfo ENOTFOUND registry.npmjs.org
getaddrinfo ENOTFOUND registry.npmmirror.com
```

**Problem:** DNS can't resolve domain names → Internet connection not properly configured

---

## ✅ **SOLUTION 1: Fix DNS (Quick Fix)**

**Run these commands to flush DNS and reset network:**

```bash
# Flush DNS cache
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Test if DNS works now
nslookup google.com
```

**If `nslookup` works, try npm again:**
```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
npm ping
```

---

## ✅ **SOLUTION 2: Reconfigure PDA Net Connection**

**Your PDA net might not be giving you proper DNS servers.**

**On Mac:**

1. **System Preferences** → **Network**
2. **Select your PDA net connection** (USB/Ethernet)
3. **Click "Advanced"**
4. **Go to "DNS" tab**
5. **Add DNS servers:**
   - Click **"+"** button
   - Add: `8.8.8.8` (Google DNS)
   - Add: `8.8.4.4` (Google DNS backup)
   - Click **"OK"**

6. **Apply** changes
7. **Disconnect and reconnect** PDA net

**Then test:**
```bash
ping -c 3 google.com
nslookup google.com
```

---

## ✅ **SOLUTION 3: Use Phone Hotspot Instead**

**PDA net seems unreliable. Use your phone's hotspot:**

1. **On iPhone/Android:**
   - Settings → Personal Hotspot / Mobile Hotspot
   - Turn ON
   - Note WiFi name and password

2. **On Mac:**
   - Disconnect PDA net
   - WiFi menu → Connect to phone's hotspot
   - Enter password

3. **Test:**
   ```bash
   ping -c 3 google.com
   nslookup google.com
   npm ping
   ```

**Phone hotspot usually works better!**

---

## ✅ **SOLUTION 4: Check Network Interface**

**See what network interfaces are active:**

```bash
# List all network interfaces
ifconfig

# Check default gateway
netstat -rn | grep default

# Test DNS resolution
nslookup registry.npmjs.org
```

**You should see:**
- An interface with an IP address (not 127.0.0.1)
- A default gateway
- DNS resolving successfully

---

## ✅ **SOLUTION 5: Manual DNS Configuration (If Above Fails)**

**Set DNS servers manually in Terminal:**

```bash
# Check your network interface name (usually en0, en1, or en2)
ifconfig | grep "inet " | grep -v 127.0.0.1

# Set DNS (replace 'en0' with your interface name)
networksetup -setdnsservers "Wi-Fi" 8.8.8.8 8.8.4.4

# Or if using USB/Ethernet:
networksetup -listallnetworkservices
# Find your PDA net service name, then:
networksetup -setdnsservers "YOUR_SERVICE_NAME" 8.8.8.8 8.8.4.4
```

---

## 🎯 **STEP-BY-STEP FIX:**

**Copy and paste this entire block:**

```bash
# 1. Flush DNS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# 2. Test DNS
nslookup google.com

# 3. If that works, test npm
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile
npm ping
```

**Share the output!**

---

## 🆘 **IF STILL NOT WORKING:**

**Your PDA net connection might not be working properly. Try:**

1. **Disconnect PDA net completely**
2. **Restart your Mac** (sometimes helps reset network)
3. **After restart, connect to WiFi or phone hotspot**
4. **Then try npm install**

---

## 📋 **CHECKLIST:**

- [ ] DNS flush completed
- [ ] `nslookup google.com` works (shows IP address)
- [ ] `ping google.com` works (packets received)
- [ ] `npm ping` works (shows "Ping successful")
- [ ] Then `npm install` will work!

---

**Try Solution 1 first (DNS flush), then Solution 3 (phone hotspot) - that usually fixes it!** 🚀
