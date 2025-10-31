# ? Auth Bypass - Skip Login to Test App

**I've updated `App.tsx` to bypass authentication!**

---

## ?? **WHAT CHANGED:**

**The app now automatically logs you in as a test user** - no sign up/sign in needed!

**Test User:**
- Email: test@pawmatch.com
- Role: `buyer` (you can change this)
- Automatically logged in

---

## ?? **IN EXPO SNACK:**

**1. Replace `App.tsx` with the bypass version:**

**Copy the entire `App.tsx` file I just updated** (or use the one in workspace).

**2. Save in Snack**

**3. Scan QR code again**

**4. App opens directly to Buyer Home screen!** ?

---

## ?? **TEST DIFFERENT ROLES:**

**In `App.tsx`, change this line:**

```typescript
role: 'buyer', // Change this!
```

**To test:**
- `'buyer'` ? Buyer screens
- `'breeder_independent'` ? Breeder screens  
- `'breeder_registered'` ? Breeder screens
- `'shelter'` ? Shelter screens
- `'vet'` ? Vet screens

**Save ? Reload ? See different app!**

---

## ? **WHAT YOU CAN NOW TEST:**

- ? All screens load
- ? Navigation works
- ? UI components
- ? Different roles

**Note:** Features that need real Supabase data (saving pets, messages, etc.) won't work, but you can see all the screens!

---

## ?? **WHEN SUPABASE AUTH WORKS:**

**To re-enable real auth:**

In `App.tsx`, change:
```typescript
const BYPASS_AUTH = true;  // Change to false
```

**Then real sign up/login will work!**

---

**Copy the new App.tsx to Snack ? Scan QR ? You're in the app!** ???
