# 🎯 Clone and Run PawMatch - Simple Steps

**Your repo is now public!** ✅

---

## 📥 **IN CURSOR DESKTOP - DO THIS:**

### **Step 1: Open Terminal**

At the bottom of Cursor Desktop, click **"Terminal"** tab

### **Step 2: Copy and Paste These Commands**

**Command 1:** Navigate to Desktop
```bash
cd ~/Desktop
```
Press Enter

**Command 2:** Clone your repo
```bash
git clone https://github.com/drdyor/pawmatch.git
```
Press Enter (downloads in 10 seconds)

**Command 3:** Enter folder
```bash
cd pawmatch
```
Press Enter

**Command 4:** Switch to mobile app branch
```bash
git checkout pawmatch-mobile-app
```
Press Enter (should say "Switched to branch")

**Command 5:** Install dependencies
```bash
npm install
```
Press Enter (wait 3-5 minutes, lots of text)

**Command 6:** Create .env file
```bash
cp .env.example .env
```
Press Enter

### **Step 3: Your Keys Are Already There!**

The `.env` file already has your Supabase keys! I added them:
- ✅ URL: `https://hmkrwjscbcejdgojwksk.supabase.co`
- ✅ API Key: Already saved

### **Step 4: Start the App**
```bash
npm start
```
Press Enter

**Wait 20 seconds. You'll see:**
- Text scrolling
- Then a **BIG QR CODE** appears! 📱

---

## 📱 **SCAN WITH YOUR PHONE:**

### **iPhone:**
1. Open **Camera** app (not Expo Go!)
2. Point at QR code
3. Tap the notification
4. Expo Go opens → app loads!

### **Android:**
1. Open **Expo Go** app
2. Tap "Scan QR code"
3. Point at QR code
4. App loads!

---

## ✅ **IF YOU SEE THE PAWMATCH WELCOME SCREEN:**

**YOU DID IT!** 🎉

Test these features:
1. Tap "Get Started" → Sign up
2. Choose "Independent Breeder"
3. Add a pet
4. Track heat cycle (see the Flo-style calendar!)
5. Go to Matches → Swipe through studs!

---

## 🐛 **TROUBLESHOOTING:**

### **"npm: command not found"**
→ Install Node.js from [nodejs.org](https://nodejs.org)

### **"git: command not found"**
→ Install git from [git-scm.com](https://git-scm.com)

### **QR code doesn't work**
→ Press `w` in Terminal → opens in web browser

### **"Can't connect to dev server"**
→ Phone and computer must be on same WiFi

---

## 🎯 **SUMMARY:**

**6 Simple Commands:**
```bash
cd ~/Desktop
git clone https://github.com/drdyor/pawmatch.git
cd pawmatch
git checkout pawmatch-mobile-app
npm install
npm start
```

**Then:** Scan QR → Test app! 🚀

---

**Ready to try? Start with Command 1!** 💪
