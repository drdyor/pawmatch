# 👋 Help Test PawMatch Mobile App

**From:** PawMatch Owner  
**To:** Developer Helper  
**Time Needed:** 15 minutes  

---

## 📋 **What You're Helping With:**

Testing a **mobile app** (Expo/React Native) that's **60% complete** (8 working features).

**App:** PawMatch - Tinder-style pet breeding/adoption platform for Malta

---

## ✅ **Quick Start (15 minutes):**

### **1. Get the Code**

You have the Cursor Agent workspace link. Download or clone the `pawmatch-mobile` folder.

**OR** if you have git access:
```bash
# Clone the workspace repo
cd pawmatch-mobile
```

---

### **2. Install Dependencies** (3-5 min)

```bash
npm install
```

Wait for it to finish (downloads ~1500 packages).

---

### **3. Verify Environment**

Check that the `.env` file exists and has:
```
EXPO_PUBLIC_SUPABASE_URL=https://hmkrwjscbcejdgojwksk.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ... (long key)
```

If the API key says `PASTE_YOUR_API_KEY_HERE`, ask the owner for the real key.

---

### **4. Start the App**

```bash
npm start
```

You'll see:
- Metro bundler starts
- QR code appears
- Message: "Metro waiting on exp://..."

---

### **5. Test on Phone**

**Option A: Share QR Code**
- Screenshot the QR code
- Send to the owner
- They scan with Expo Go app

**Option B: Test Yourself**
- Install Expo Go on your phone
- Scan the QR code
- App loads in 10-20 seconds

**Option C: Web Preview**
- Press `w` in Terminal
- Opens in web browser
- Not as good as phone, but works!

---

## 🧪 **What to Test (10 minutes):**

### **Test 1: Authentication**
1. Tap "Get Started"
2. Create account (any email)
3. Choose role: "Independent Breeder"
4. Should load Breeder Dashboard ✅

### **Test 2: Add Pet**
1. Tap "My Pets" tab
2. Tap "+ Add"
3. Fill form (Luna, Dog, Border Collie, Female)
4. Save
5. Prompt appears for heat tracking ✅

### **Test 3: Heat Tracking (Unique feature!)**
1. Tap "Track Heat"
2. Tap today's date
3. See calendar turn colors (red → orange → blue)
4. See progress ring "Day 1 of 21" ✅

### **Test 4: Tinder-Style Matching (Unique!)**
1. Sign out
2. Create 2nd account as breeder
3. Add male dog, mark "Available for Stud"
4. Sign in as first account
5. Go to "Matches" tab
6. **Swipe the cards!** (Right = interested, Left = pass) ✅

### **Test 5: Litter Announcement**
1. Tap "Home"
2. Tap "Announce New Litter"
3. Fill form
4. Check "Send push notification"
5. Submit ✅

### **Test 6: Shelter Urgent Alerts**
1. Sign out
2. Create account as "Shelter"
3. Tap "Animals" → "+ Intake"
4. Add animal, check "At Risk"
5. See urgent red banner
6. Tap banner → "Send Alert" ✅

---

## 📊 **What Works:**

- ✅ Authentication (sign up, login, 5 roles)
- ✅ Buyer discovery (browse pets with smart filtering)
- ✅ Heat tracking (Flo-style calendar)
- ✅ Tinder matching (swipeable stud cards)
- ✅ Litter announcements (auto-notify buyers)
- ✅ Shelter management (intake + urgent alerts)
- ✅ Add pet form
- ✅ Pet detail screen

**8 features fully functional!**

---

## 🐛 **Known Limitations:**

- ❌ No photo upload yet (uses emoji placeholders)
- ❌ Messaging shows "Coming soon"
- ❌ Push notifications structure ready, not fully integrated
- ❌ No Stripe payments yet

---

## 🎯 **Report Back:**

Tell the owner:
- ✅ What works well
- 🐛 Any bugs you found
- 💡 Suggestions for improvements

---

## 🆘 **Troubleshooting:**

### "Can't connect to dev server"
→ Make sure phone and computer on same Wi-Fi
→ Or press `t` in Terminal for tunnel mode

### "Module not found" errors
→ Run `npm install` again

### App crashes on load
→ Check `.env` has correct Supabase keys

### "npm: command not found"
→ Need to install Node.js from [nodejs.org](https://nodejs.org)

---

**Questions? Check `WHAT_WE_BUILT.md` for full feature documentation!**

---

**Total time:** 15 minutes to test all 8 features ✅
