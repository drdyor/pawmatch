# ⚡ Quick Deployment Commands

Run these commands **one at a time** in your terminal:

## Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

If you get permission errors, use:
```bash
sudo npm install -g eas-cli
```

## Step 2: Login to Expo
```bash
eas login
```
This will open your browser to authenticate.

## Step 3: Configure EAS
```bash
cd pawmatch-mobile
eas build:configure
```
This creates the project link and updates `app.json` with your project ID.

## Step 4: Set Environment Variables (Important!)

**Option A: Edit eas.json directly**
Open `eas.json` and update the production profile:
```json
"production": {
  "env": {
    "EXPO_PUBLIC_SUPABASE_URL": "https://bdpbjsciaekgcdpvqomr.supabase.co",
    "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkcGJqc2NpYWVrZ2NkcHZxb21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjA0NDQsImV4cCI6MjA3NzU5NjQ0NH0.MvurqAkzprNUa3JFYnfWLh1jiUMJZhfltct8VCYIO4A"
  }
}
```

**Option B: Use EAS Secrets (more secure)**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value https://bdpbjsciaekgcdpvqomr.supabase.co
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkcGJqc2NpYWVrZ2NkcHZxb21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjA0NDQsImV4cCI6MjA3NzU5NjQ0NH0.MvurqAkzprNUa3JFYnfWLh1jiUMJZhfltct8VCYIO4A
```

## Step 5: Build
```bash
# Build for both platforms
npm run build:all

# Or build individually
npm run build:ios
npm run build:android
```

## Step 6: Submit (after builds complete)
```bash
npm run submit:ios
npm run submit:android
```

## Troubleshooting

**"command not found" errors:**
- Make sure you're in the `pawmatch-mobile` directory
- Check npm is installed: `npm --version`
- Verify EAS installed: `eas --version`

**Permission denied:**
- Use `sudo` for global installs (macOS/Linux)
- Or install locally: `npm install eas-cli` then use `npx eas`

**Need help?**
- Full guide: See `DEPLOYMENT_GUIDE.md`
- Expo docs: https://docs.expo.dev/build/introduction/
