# 🚀 How to Run PawMatch in Expo Snack

## 📍 Where Everything is Stored

**GitHub Repository:**
- **Branch**: `cursor/adapt-web-app-design-to-react-native-4170`
- **URL**: `https://github.com/drdyor/pawmatch/tree/cursor/adapt-web-app-design-to-react-native-4170`
- **Main Directory**: `/workspace/pawmatch-mobile/`

---

## 🎯 Quick Start: Run in Expo Snack

### Option 1: Import from GitHub (Recommended)

1. **Go to Expo Snack**: https://snack.expo.dev

2. **Click "New Project"** → **"Import from GitHub"**

3. **Enter your repository URL**:
   ```
   https://github.com/drdyor/pawmatch
   ```

4. **Select the branch**:
   - Branch: `cursor/adapt-web-app-design-to-react-native-4170`

5. **Set the project path** (if needed):
   - Project path: `pawmatch-mobile`

6. **Configure Environment Variables** (Important!):
   - Click the **⚙️ Settings** icon
   - Go to **"Secrets"** or **"Environment Variables"**
   - Add these two variables:
     ```
     EXPO_PUBLIC_SUPABASE_URL=https://oyrsmfrpcegtrxrbadlu.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMxODIsImV4cCI6MjA3NzQyOTE4Mn0.e8jRrE-8EonGzIif_mRPBtc8fn9mefu122eo5f2ZaRE
     ```

7. **Click "Save"** and wait for Snack to import

---

### Option 2: Manual Setup in Snack

If GitHub import doesn't work:

1. **Create New Snack**: https://snack.expo.dev → "New Project"

2. **Copy these files** (from `/workspace/pawmatch-mobile/`):

   **Entry Point:**
   - `App.tsx` → Copy to Snack root

   **Key Directories:**
   ```
   src/
     ├── components/        (All component files)
     ├── screens/          (All screen files)
     ├── navigation/       (AppNavigator.tsx)
     ├── services/        (supabase.ts)
     ├── theme.ts         (Colors & fonts)
     ├── types/           (index.ts)
     └── constants/       (shelterTags.ts)
   ```

3. **Copy package.json dependencies**:
   - Open `package.json` from the repo
   - Copy all dependencies to Snack's `package.json`

---

## 📦 Key Files Structure

```
pawmatch-mobile/
├── App.tsx                          ← Entry point
├── package.json                     ← Dependencies
├── app.json                         ← Expo config
│
├── src/
│   ├── App.tsx                      (if different from root)
│   ├── theme.ts                     ← Colors & fonts
│   │
│   ├── components/                  ← Reusable components
│   │   ├── DiscoveryCard.tsx
│   │   ├── NewLitterCard.tsx
│   │   ├── FilterChip.tsx
│   │   ├── BreedPicker.tsx
│   │   ├── IntentBadge.tsx
│   │   ├── VoteCarousel.tsx
│   │   └── ...
│   │
│   ├── screens/                     ← All screens
│   │   ├── auth/
│   │   │   └── RoleSelectionScreen.tsx
│   │   ├── breeder/
│   │   │   ├── BreedingDiscoveryScreen.tsx
│   │   │   ├── NewLittersScreen.tsx
│   │   │   ├── BreederHomeScreen.tsx
│   │   │   └── ...
│   │   ├── buyer/
│   │   │   ├── AdoptionDiscoveryScreen.tsx
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx         ← Main navigation
│   │
│   ├── services/
│   │   └── supabase.ts              ← Supabase client
│   │
│   ├── types/
│   │   └── index.ts                 ← TypeScript types
│   │
│   └── config/
│       └── supabase.ts              ← Supabase config
```

---

## ✅ Required Environment Variables in Snack

In Snack Settings → Secrets/Environment Variables:

```
EXPO_PUBLIC_SUPABASE_URL=https://oyrsmfrpcegtrxrbadlu.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMxODIsImV4cCI6MjA3NzQyOTE4Mn0.e8jRrE-8EonGzIif_mRPBtc8fn9mefu122eo5f2ZaRE
```

**How to add in Snack:**
1. Click **⚙️ Settings** (gear icon)
2. Go to **"Secrets"** tab
3. Click **"+ New Secret"**
4. Add each variable with its value
5. Save

---

## 📱 Running in Snack

1. **After importing/setting up:**
   - Snack will automatically install dependencies
   - Wait for build to complete (shows "Ready" status)

2. **Preview:**
   - Click **"Preview"** button (or press `Cmd/Ctrl + P`)
   - Choose: **"My Device"** (Expo Go app) or **"Web"**

3. **On Your Phone:**
   - Install **Expo Go** app (iOS/Android)
   - Scan QR code from Snack
   - App loads on your device

---

## 🔄 Syncing with GitHub

**Snack can auto-sync with GitHub:**

1. In Snack, go to **Settings** → **GitHub**
2. Connect your GitHub account
3. Enable **"Auto-sync"**
4. Select: `drdyor/pawmatch` repo
5. Branch: `cursor/adapt-web-app-design-to-react-native-4170`

**Now:**
- Changes in Snack → Auto-commits to GitHub
- Changes in GitHub → Auto-pulls to Snack (on refresh)

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"
- **Solution**: Make sure all files from `src/` are copied
- Check that `package.json` has all dependencies

### Issue: "Supabase connection error"
- **Solution**: Verify environment variables are set correctly
- Check `src/config/supabase.ts` or `src/services/supabase.ts`

### Issue: "Navigation error"
- **Solution**: Ensure `@react-navigation/stack` and `@react-navigation/bottom-tabs` are in dependencies

### Issue: "Module not found"
- **Solution**: Check Snack's package.json includes:
  - `expo-constants`
  - `react-native-url-polyfill`
  - `@react-native-async-storage/async-storage`
  - All other dependencies from `package.json`

---

## 📝 Latest Updates (What's New)

✅ **Separated Discovery Screens:**
- `AdoptionDiscoveryScreen.tsx` - For seekers/adopters
- `BreedingDiscoveryScreen.tsx` - For breeders/owners (Tinder-style)

✅ **New Litters Feature:**
- `NewLittersScreen.tsx` - Shows upcoming litters
- `NewLitterCard.tsx` - Fused parent photos (male + female)

✅ **Enhanced Components:**
- `DiscoveryCard.tsx` - Improved UI with gender indicators
- `FilterChip.tsx` - Chip-style filters
- `BreedPicker.tsx` - Typo-proof breed selection
- `IntentBadge.tsx` - Shows breeding/adoption/sale intent

✅ **Navigation Updates:**
- Role-based tabs (Breeder, Seeker, Shelter, Vet)
- Separate stacks for each role

---

## 🔗 Important Links

- **GitHub Repo**: https://github.com/drdyor/pawmatch
- **Branch**: `cursor/adapt-web-app-design-to-react-native-4170`
- **Expo Snack**: https://snack.expo.dev
- **Supabase Dashboard**: https://supabase.com/dashboard/project/oyrsmfrpcegtrxrbadlu

---

## ✨ Quick Test Checklist

After setting up in Snack:

- [ ] App loads without errors
- [ ] Role selection screen appears
- [ ] Can select a role (Breeder, Seeker, etc.)
- [ ] Navigation tabs appear for selected role
- [ ] Discovery screen loads (shows pets/listings)
- [ ] Supabase connection works (no auth errors)
- [ ] New Litters tab visible (for breeders)

---

## 🚀 Deploy from Snack

**Option 1: Build for App Stores**
1. In Snack → **"Export"** → **"Download"**
2. Follow Expo's build instructions
3. Submit to App Store / Google Play

**Option 2: Web Build**
1. In Snack → **"Publish"**
2. Get shareable URL
3. Deploy to web hosting

**Option 3: EAS Build (Recommended)**
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Build: `eas build --platform ios/android`

---

**All code is stored in GitHub and ready for Snack! 🎉**
