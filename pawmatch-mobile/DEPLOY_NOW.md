# 🚀 DEPLOY NOW - Quick Commands

Copy and paste these commands **one at a time** in your terminal.

## Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

## Step 2: Login
```bash
eas login
```
(Opens browser - login with Expo account)

## Step 3: Navigate to Project
```bash
cd pawmatch-mobile
```

## Step 4: Configure Project
```bash
eas build:configure
```

## Step 5: Build for Production
```bash
eas build --platform all --profile production
```

**Wait 15-30 minutes for builds to complete**

## Step 6: Submit to Stores
```bash
# iOS
eas submit --platform ios --profile production

# Android  
eas submit --platform android --profile production
```

---

✅ **Configuration files ready:**
- `eas.json` - Build config with Supabase credentials
- `.env` - Local development env vars
- All dependencies installed

🎯 **You're ready to deploy!**
