# 🔐 Add Google & Apple Sign-In to PawMatch

## Why This Matters
- ✅ 80% of users prefer social login
- ✅ Faster onboarding (no password to remember)
- ✅ More professional and trustworthy
- ✅ **Required by Apple** for App Store (if you offer any social login)

---

## 🎯 What We'll Add

| Provider | Platform | User Benefit |
|----------|----------|--------------|
| **Apple Sign In** | iOS/Android | Required by Apple, most private |
| **Google Sign In** | iOS/Android | Most popular, syncs across devices |
| **Email** | All | Already working ✅ |

---

## 📦 Step 1: Install Required Packages

Run these commands in your mobile app folder:

```bash
cd /workspace/pawmatch-mobile

# Install Apple Sign In
npx expo install expo-apple-authentication

# Install Google Sign In  
npx expo install expo-auth-session expo-crypto expo-web-browser

# Update app.json with required config
```

---

## ⚙️ Step 2: Configure Supabase Dashboard

### **Enable Google Sign-In:**

1. Go to: https://supabase.com/dashboard/project/oyrsmfrpcegtrxrbadlu/auth/providers
2. Find **"Google"** in the list
3. Click to expand
4. **Enable** the toggle
5. You'll need Google OAuth credentials (see Step 3)

### **Enable Apple Sign-In:**

1. Same page: https://supabase.com/dashboard/project/oyrsmfrpcegtrxrbadlu/auth/providers
2. Find **"Apple"** in the list
3. Click to expand
4. **Enable** the toggle
5. You'll need Apple Developer credentials (see Step 4)

---

## 🔑 Step 3: Get Google OAuth Credentials

### **Option A: Use Supabase's Google OAuth (Easiest)**

Supabase can handle this for you in dev mode! Just enable Google in auth providers and it works.

### **Option B: Use Your Own Google OAuth (Production)**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a Project** (or select existing)
3. **Enable APIs**: 
   - Search for "Google+ API"
   - Click Enable
4. **Create OAuth Credentials**:
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: **Web application**
   - Name: `PawMatch Mobile`
   - Authorized redirect URIs:
     ```
     https://oyrsmfrpcegtrxrbadlu.supabase.co/auth/v1/callback
     ```
5. **Copy the credentials**:
   - Client ID
   - Client Secret
6. **Paste into Supabase**:
   - Supabase Dashboard → Authentication → Providers → Google
   - Paste Client ID and Client Secret
   - Save

---

## 🍎 Step 4: Get Apple Sign-In Credentials

### **Requirements:**
- ✅ Apple Developer Account ($99/year)
- ✅ App registered in App Store Connect
- ✅ Bundle Identifier (e.g., `com.pawmatch.app`)

### **Setup Steps:**

1. **Go to Apple Developer**: https://developer.apple.com/account/resources/identifiers/list
2. **Register an App ID**:
   - Click **+** to create new identifier
   - Select "App IDs" → Continue
   - Description: `PawMatch`
   - Bundle ID: `com.pawmatch.app` (or your choice)
   - Capabilities: Check **Sign In with Apple**
   - Register

3. **Create a Service ID**:
   - Identifiers → **+** → "Services IDs"
   - Description: `PawMatch Web Auth`
   - Identifier: `com.pawmatch.app.service`
   - Enable **Sign In with Apple**
   - Configure:
     - Primary App ID: Select your app
     - Domains: `oyrsmfrpcegtrxrbadlu.supabase.co`
     - Return URLs: `https://oyrsmfrpcegtrxrbadlu.supabase.co/auth/v1/callback`
   - Save

4. **Create a Key**:
   - Keys → **+**
   - Key Name: `PawMatch Auth Key`
   - Enable **Sign In with Apple**
   - Configure → Select your Primary App ID
   - Register
   - **Download the .p8 file** (you can only download once!)
   - Note the **Key ID**

5. **Get Team ID**:
   - Go to: https://developer.apple.com/account
   - Top right: Your team name
   - Copy the Team ID (looks like: `AB12CD3456`)

6. **Configure Supabase**:
   - Supabase Dashboard → Authentication → Providers → Apple
   - **Bundle ID**: `com.pawmatch.app`
   - **Team ID**: Your 10-character team ID
   - **Key ID**: From step 4
   - **Private Key**: Paste contents of .p8 file
   - Save

---

## 🎨 Step 5: Update app.json

Add this to your `app.json`:

```json
{
  "expo": {
    "name": "PawMatch",
    "slug": "pawmatch",
    "scheme": "pawmatch",
    "ios": {
      "bundleIdentifier": "com.pawmatch.app",
      "usesAppleSignIn": true
    },
    "android": {
      "package": "com.pawmatch.app"
    },
    "plugins": [
      "expo-apple-authentication"
    ]
  }
}
```

---

## 💻 Step 6: I'll Update the Code

I'll create updated auth screens with Google and Apple buttons. The code will:

✅ Show "Continue with Apple" button (iOS only)
✅ Show "Continue with Google" button (all platforms)
✅ Keep "Continue with Email" as fallback
✅ Handle all OAuth flows via Supabase
✅ Auto-create user profile on first sign-in

---

## 🧪 Testing After Setup

### **Test Google Sign-In:**
1. Run: `npm start`
2. Press `i` (iOS) or `a` (Android)
3. Tap "Continue with Google"
4. Select Google account
5. Should redirect back to app ✅

### **Test Apple Sign-In:**
1. Only works on **real iOS device** (not simulator)
2. Or in TestFlight
3. Tap "Continue with Apple"
4. Face ID / Touch ID
5. Choose to share/hide email
6. Redirects back ✅

---

## 🎯 Quick Start (TL;DR)

**For Development (No credentials needed):**
1. Run: `npx expo install expo-apple-authentication expo-auth-session expo-crypto expo-web-browser`
2. Enable Google + Apple in Supabase dashboard
3. I'll update the code
4. Test in app

**For Production:**
1. Get Google OAuth credentials (Step 3)
2. Get Apple credentials (Step 4) - **required $99/year**
3. Configure both in Supabase
4. Submit to App Stores

---

## 💡 What Happens Behind the Scenes

1. User taps "Continue with Google"
2. Opens Google login in secure browser
3. User signs in with Google
4. Google sends OAuth token to Supabase
5. Supabase creates user account
6. Supabase sends auth token to app
7. App creates user profile in database
8. User is logged in! ✅

---

## 📱 App Store Requirements

**Apple's Rules:**
- If you offer ANY social login (Google, Facebook, etc.)
- You MUST also offer Apple Sign In
- Otherwise: App rejected ⛔

**Solution:** 
- We're adding BOTH Google and Apple ✅
- Problem solved!

---

## 🆘 Common Issues

### "Apple Sign In not working in simulator"
- **Fix**: Only works on real devices. Use email auth to test in simulator.

### "Google Sign In stuck at loading"
- **Fix**: Check redirect URI in Google Console matches Supabase exactly

### "Unable to get bundle identifier"
- **Fix**: Make sure `ios.bundleIdentifier` is set in `app.json`

---

## 🚀 Ready?

Want me to update the auth code now? I'll add beautiful Google and Apple sign-in buttons!

Just say "yes" and I'll:
1. Update `SignInScreen.tsx` with social buttons
2. Update `SignUpScreen.tsx` with social buttons  
3. Create helper functions for OAuth
4. Add icons/styling
5. Handle user profile creation

**Installation command to run first:**
```bash
cd /workspace/pawmatch-mobile
npx expo install expo-apple-authentication expo-auth-session expo-crypto expo-web-browser
```
