# 🚀 Step-by-Step Deployment Guide

Follow these commands **in order**. Copy and paste each command into your terminal.

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

**If you get permission errors:**
```bash
sudo npm install -g eas-cli
```

**Verify installation:**
```bash
eas --version
```

## Step 2: Login to Expo

```bash
eas login
```

This will:
- Open your browser
- Ask you to log in to Expo (create account at expo.dev if needed)
- Link your terminal to your Expo account

## Step 3: Navigate to Project

```bash
cd pawmatch-mobile
```

## Step 4: Configure EAS Build

```bash
eas build:configure
```

This will:
- Create a project link
- Generate a project ID
- Update `app.json` automatically

**Note:** The `projectId` in `app.json` will be filled automatically after this step.

## Step 5: Build for Production

### Option A: Build Both Platforms (Recommended)
```bash
eas build --platform all --profile production
```

### Option B: Build Separately
```bash
# iOS only
eas build --platform ios --profile production

# Android only
eas build --platform android --profile production
```

**Build Time:** 10-20 minutes per platform

**Monitor Progress:**
- Watch terminal output
- Visit: https://expo.dev/builds
- You'll get email when complete

## Step 6: Submit to App Stores

**Wait for builds to complete first!**

### iOS (App Store)
```bash
eas submit --platform ios --profile production
```

**First time only:** You'll need:
- Apple ID credentials
- 2FA code if enabled

### Android (Google Play)
```bash
eas submit --platform android --profile production
```

**First time only:** You'll need:
- Google Play service account JSON key
- See full guide for setup details

## Environment Variables

Your Supabase credentials are already in `eas.json`:
- ✅ `EXPO_PUBLIC_SUPABASE_URL` is set
- ✅ `EXPO_PUBLIC_SUPABASE_ANON_KEY` is set

Production builds will automatically use these values.

## Quick Commands Reference

```bash
# Check build status
eas build:list

# View specific build
eas build:view <build-id>

# Download build
eas build:download --id <build-id>

# Check submission status
eas submit:list
```

## Troubleshooting

### "eas: command not found"
- Run: `npm install -g eas-cli` again
- Or use: `npx eas-cli` instead of `eas`

### "Not logged in"
- Run: `eas login`

### Build fails
- Check: `eas build:view <build-id>` for logs
- Verify `app.json` is valid JSON
- Check all dependencies are in `package.json`

### Environment variables not working
- Verify they're in `eas.json` under `production.env`
- Or set via: `eas secret:create --scope project --name KEY --value VALUE`

## Next Steps After Submission

1. **iOS:** Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Complete app listing (screenshots, description)
   - Submit for review

2. **Android:** Go to [Google Play Console](https://play.google.com/console)
   - Complete app listing
   - Submit for review

## Need Help?

- Full guide with details: See project docs
- Expo docs: https://docs.expo.dev/build/introduction/
- EAS Support: https://expo.dev/help

Good luck! 🎉
