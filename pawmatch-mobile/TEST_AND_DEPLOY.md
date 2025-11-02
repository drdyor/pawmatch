# 🚀 Test & Deploy Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Setup ✓
- [x] `.env` file created with Supabase credentials
- [x] Dependencies installed
- [x] `app.json` configured with permissions
- [x] Supabase client updated

### 2. Local Testing

**Start Expo development server:**
```bash
cd pawmatch-mobile
npx expo start --clear
```

**Test on device:**
- Scan QR code with Expo Go app (iOS/Android)
- Or press `i` for iOS simulator / `a` for Android emulator

**Verify:**
- ✅ App loads without errors
- ✅ Can connect to Supabase (no demo mode warning)
- ✅ Auth flow works (sign up/login)
- ✅ Navigation between screens works
- ✅ Camera/photo picker permissions requested correctly

### 3. Fix Common Issues

**If Expo won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules .expo
npm install
npx expo start --clear
```

**If Supabase connection fails:**
- Check `.env` file has correct credentials
- Verify `EXPO_PUBLIC_` prefix on env vars
- Restart Expo after changing `.env`

**TypeScript errors:**
```bash
npx tsc --noEmit
```

### 4. Build for Production

**Install EAS CLI (if not already):**
```bash
npm install -g eas-cli
eas login
```

**Configure EAS:**
```bash
eas build:configure
```

**Update `app.json` EAS project ID:**
- Get project ID from `eas.json` or EAS dashboard
- Replace `YOUR-EAS-PROJECT-ID` in `app.json` → `extra.eas.projectId`

**Build for iOS:**
```bash
eas build --platform ios
```

**Build for Android:**
```bash
eas build --platform android
```

**Or build both:**
```bash
eas build --platform all
```

### 5. Deploy to App Stores

**iOS (App Store):**
```bash
eas submit --platform ios
```

**Android (Google Play):**
```bash
eas submit --platform android
```

### 6. Continuous Deployment (Optional)

Set up EAS Update for OTA updates:
```bash
eas update:configure
```

Then push updates without rebuilding:
```bash
eas update --branch production --message "Bug fixes"
```

## 📱 Quick Test Commands

```bash
# Start dev server
npm start

# Check TypeScript
npx tsc --noEmit

# Lint (if configured)
npm run lint

# Test on specific platform
npm run ios
npm run android
```

## 🔍 Verification Steps

1. **Environment Variables:**
   ```bash
   # Check .env exists and has values
   cat .env | grep EXPO_PUBLIC
   ```

2. **Supabase Connection:**
   - Open app → Check console for Supabase warnings
   - Should see your project URL, not placeholder

3. **Permissions:**
   - Test camera: Should request permission on first use
   - Test photo picker: Should show permission dialog
   - Test notifications: Check device settings

4. **Core Features:**
   - Sign up new account
   - Navigate to role selection
   - Test buyer discovery swipe
   - Test breeder pet add
   - Test photo upload

## ⚠️ Production Checklist

Before submitting to stores:
- [ ] Remove console.log statements (or use logging service)
- [ ] Test on real devices (not just simulators)
- [ ] Verify all API endpoints are production-ready
- [ ] Check Supabase RLS policies are correct
- [ ] Test offline behavior
- [ ] Review app icons and splash screens
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure app store listings
- [ ] Prepare screenshots and descriptions

## 🐛 Troubleshooting

**Build fails:**
- Check Expo SDK version matches dependencies
- Verify all native modules are properly installed
- Check `app.json` for syntax errors

**Runtime errors:**
- Check Metro bundler logs
- Verify environment variables are loaded
- Check Supabase RLS policies allow operations

**Permission issues:**
- Verify `app.json` has correct permission strings
- Check iOS Info.plist entries
- Verify Android manifest permissions
