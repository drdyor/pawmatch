# EAS Build Setup Guide

Your Expo app is now configured for building installable binaries with EAS Build.

## Quick Start

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to EAS

```bash
eas login
```

### 3. Configure EAS Project

From the `pawmatch-mobile` directory:

```bash
cd pawmatch-mobile
eas build:configure
```

This will:
- Create/update your `eas.json` (already created)
- Generate a project ID and add it to `app.json`

### 4. Local Development (Test First)

Before building, test locally with Expo Go:

```bash
npm start
# or
npx expo start
```

Scan the QR code with Expo Go app on your phone. Fix any issues before building.

### 5. Build for Internal Testing

**iOS (Development Build - installable on simulator or device):**
```bash
npm run dev:client:ios
# or
eas build -p ios --profile development
```

**Android (Preview Build - APK for easy install):**
```bash
npm run build:android:preview
# or
eas build -p android --profile preview
```

The build will:
- Run on EAS servers (cloud build)
- Take 10-20 minutes
- Provide a download link when complete

### 6. Production Builds (Store Submission)

When ready to submit to app stores:

**iOS (for App Store):**
```bash
npm run build:ios
# Then submit:
npm run submit:ios
```

**Android (for Google Play):**
```bash
npm run build:android
# Then submit:
npm run submit:android
```

## Important Notes

### Bundle Identifiers
- iOS: `com.pawmatch.app`
- Android: `com.pawmatch.app`

These are already set in `app.json`. Make sure they match your App Store Connect / Google Play Console app settings.

### Assets Required
Make sure these files exist in `pawmatch-mobile/assets/`:
- `icon.png` (1024x1024)
- `splash.png` (recommended 2732x2732)
- `adaptive-icon.png` (for Android, 1024x1024)

If missing, create them or EAS will warn during build.

### Environment Variables
If you need Supabase keys or other secrets:
1. Create `app.config.ts` (or use `eas secret:create`)
2. Access via `expo-constants` or `expo-secure-store`

Example:
```bash
eas secret:create --scope project --name SUPABASE_URL --value your-url
eas secret:create --scope project --name SUPABASE_ANON_KEY --value your-key
```

Then reference in your code via `process.env.EXPO_PUBLIC_*` or EAS secrets.

### Apple Developer Account
For iOS production builds, you'll need:
- Apple Developer Account ($99/year)
- EAS can auto-manage certificates, or you can provide your own

### Google Play Account
For Android production builds:
- Google Play Developer Account ($25 one-time)
- Service account JSON key for automated submission (optional)

## Troubleshooting

### "node_modules not found"
Run from `pawmatch-mobile` directory:
```bash
cd pawmatch-mobile
npm install
```

### Build fails with "Missing assets"
Create the required asset files in `pawmatch-mobile/assets/` or use Expo's asset generation tools.

### Bundle identifier conflicts
If `com.pawmatch.app` is taken, change it in `app.json`:
- `ios.bundleIdentifier`
- `android.package`

### Check Expo SDK compatibility
```bash
npx expo-doctor
```

This will warn about version mismatches.

## Next Steps

1. **Test locally first**: `npm start` → scan QR with Expo Go
2. **Build preview**: `npm run build:android:preview` (easiest to test)
3. **Install on device**: Download the APK/IPA from EAS dashboard
4. **Fix issues**: Iterate locally, rebuild
5. **Production**: Build and submit when ready

## Useful Commands Reference

```bash
# Development
npm start                    # Start Expo dev server
npm run android              # Start Android emulator
npm run ios                  # Start iOS simulator

# Builds
npm run dev:client:ios       # iOS dev build
npm run dev:client:android   # Android dev build
npm run build:ios:preview    # iOS preview build
npm run build:android:preview # Android preview (APK)
npm run build:ios            # iOS production
npm run build:android        # Android production (AAB)

# Submission
npm run submit:ios           # Submit to App Store
npm run submit:android       # Submit to Google Play

# Utilities
npx expo-doctor              # Check for issues
eas build:list               # List your builds
eas build:view [build-id]    # View build details
```

## EAS Dashboard

Visit [expo.dev](https://expo.dev) to:
- View build history
- Download build artifacts
- Manage project settings
- View logs and errors

---

**Remember**: Always work from the `pawmatch-mobile` directory for Expo/EAS commands!
