# 🚀 EAS Deployment Guide

Complete guide for building and deploying PawMatch to iOS and Android app stores.

## Prerequisites

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev) (free tier works)
2. **Apple Developer Account**: Required for iOS ($99/year)
3. **Google Play Developer Account**: Required for Android ($25 one-time)
4. **Node.js & npm**: Already installed

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

Verify installation:
```bash
eas --version
```

## Step 2: Login to Expo

```bash
eas login
```

This will open a browser window to authenticate. Use your Expo account credentials.

## Step 3: Configure EAS Build

```bash
cd pawmatch-mobile
eas build:configure
```

This will:
- Create/link your project to Expo
- Generate a `projectId` and update `app.json`
- Set up build profiles in `eas.json`

**Important:** After this step, check `app.json` - the `projectId` should now be filled in automatically.

## Step 4: Set Environment Variables

EAS needs your Supabase credentials for production builds. You have two options:

### Option A: Set in eas.json (Recommended)
Update `eas.json` production build env:
```json
"production": {
  "env": {
    "EXPO_PUBLIC_SUPABASE_URL": "https://bdpbjsciaekgcdpvqomr.supabase.co",
    "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key-here"
  }
}
```

### Option B: Use EAS Secrets (More Secure)
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value https://bdpbjsciaekgcdpvqomr.supabase.co
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your-anon-key-here
```

## Step 5: Build for Production

### Build Both Platforms (Recommended)
```bash
eas build --platform all --profile production
```

### Build Individual Platforms
```bash
# iOS only
eas build --platform ios --profile production

# Android only
eas build --platform android --profile production
```

### Build Types

**Production Build** (for app stores):
```bash
eas build --platform all --profile production
```

**Preview Build** (for testing):
```bash
eas build --platform all --profile preview
```

**Development Build** (for development):
```bash
eas build --platform all --profile development
```

## Step 6: Monitor Build Progress

Builds take 10-20 minutes. You can:
- Watch progress in terminal
- Visit [expo.dev/builds](https://expo.dev/builds) to see status
- Get email notifications when complete

## Step 7: Download Builds

After build completes:
```bash
# Download latest build
eas build:list

# Download specific build
eas build:download --id <build-id>
```

Or download from the Expo dashboard.

## Step 8: Submit to App Stores

### iOS (App Store)

**First Time Setup:**
1. Get your Apple ID credentials ready
2. Update `eas.json` submit.production.ios with:
   - `appleId`: Your Apple ID email
   - `appleTeamId`: Found in [Apple Developer Portal](https://developer.apple.com/account)
   - `ascAppId`: App Store Connect App ID (created when submitting)

**Submit:**
```bash
eas submit --platform ios --profile production
```

This will:
- Upload your app to App Store Connect
- Prompt for Apple ID credentials (first time)
- May require 2FA code

**After Submission:**
- Go to [App Store Connect](https://appstoreconnect.apple.com)
- Complete app information (screenshots, description, etc.)
- Submit for review

### Android (Google Play)

**First Time Setup:**
1. Go to [Google Play Console](https://play.google.com/console)
2. Create service account:
   - Settings → API access → Create service account
   - Download JSON key file
3. Update `eas.json`:
```json
"android": {
  "serviceAccountKeyPath": "./path/to/service-account-key.json"
}
```

**Submit:**
```bash
eas submit --platform android --profile production
```

**After Submission:**
- Go to [Google Play Console](https://play.google.com/console)
- Complete app listing (screenshots, description, etc.)
- Submit for review

## Quick Reference Commands

```bash
# Login
eas login

# Configure
eas build:configure

# Build
eas build --platform all --profile production

# Check build status
eas build:list

# Submit
eas submit --platform ios --profile production
eas submit --platform android --profile production

# View builds
eas build:list

# Set secrets
eas secret:create --scope project --name KEY_NAME --value VALUE
```

## Troubleshooting

### Build Fails
1. Check build logs: `eas build:view <build-id>`
2. Verify environment variables are set
3. Ensure all dependencies are in `package.json`
4. Check `app.json` for syntax errors

### Missing Credentials
- iOS: Ensure Apple Developer account is active
- Android: Verify service account key is correct
- Check `eas.json` has correct configuration

### Environment Variables Not Working
- Use `eas secret:list` to verify secrets are set
- Or set directly in `eas.json` production profile
- Restart build after changing env vars

### Submission Errors
- iOS: Verify `ascAppId` matches App Store Connect
- Android: Check service account has correct permissions
- Ensure app listing is complete in store consoles

## Pre-Submission Checklist

- [ ] App builds successfully
- [ ] Tested on physical devices (not just simulators)
- [ ] All features work correctly
- [ ] Environment variables configured
- [ ] App icons and splash screens are set
- [ ] App Store listings prepared (screenshots, descriptions)
- [ ] Privacy policy URL added (if required)
- [ ] Terms of service URL added (if required)

## Cost Estimates

- **EAS Build**: Free tier includes 30 builds/month
- **Apple Developer**: $99/year
- **Google Play**: $25 one-time
- **Total First Year**: ~$124

## Next Steps After Deployment

1. **Set up EAS Update** for over-the-air updates:
   ```bash
   eas update:configure
   eas update --branch production --message "Initial release"
   ```

2. **Monitor Analytics**: Set up crash reporting (Sentry, etc.)

3. **Plan Updates**: Regular releases every 2-4 weeks

## Support Resources

- [EAS Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Expo Discord](https://chat.expo.dev)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

Good luck with your deployment! 🎉
