# 📱 Manual Upload to Expo Snack (If GitHub Import Fails)

## ✅ Verified: All Code is React Native (Not Web)

We're using:
- ✅ `View`, `Text`, `TouchableOpacity` (React Native)
- ✅ `StyleSheet.create` (React Native)
- ✅ `Animated`, `PanResponder` (React Native)
- ✅ `Image` from `react-native`
- ❌ NO `div`, `span`, or web components

---

## 🚀 Manual Upload Steps

### Step 1: Create New Snack
1. Go to: **https://snack.expo.dev**
2. Click **"New Project"** or **"Create Snack"**

### Step 2: Copy Entry Point

Copy `App.tsx` from the repo and paste into Snack's main editor (replace everything).

**Or use this direct link to copy:**
```
https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/App.tsx
```

### Step 3: Add Dependencies

Click **"Add Dependency"** button and add these one by one:

```
@react-navigation/native
@react-navigation/stack
@react-navigation/bottom-tabs
@react-navigation/native-stack
@supabase/supabase-js
@react-native-async-storage/async-storage
expo-constants
expo-image-picker
expo-image-manipulator
expo-notifications
react-native-url-polyfill
react-native-safe-area-context
react-native-screens
react-native-svg
```

**OR** copy the `dependencies` section from `package.json`:
```
https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/package.json
```

### Step 4: Create Folder Structure

In Snack, create these folders and copy files:

**Folder: `src/theme.ts`**
- Raw URL: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/theme.ts`

**Folder: `src/services/supabase.ts`**
- Raw URL: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/services/supabase.ts`

**Folder: `src/navigation/AppNavigator.tsx`**
- Raw URL: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/navigation/AppNavigator.tsx`

**Folder: `src/components/`** - Copy all component files
**Folder: `src/screens/`** - Copy all screen files
**Folder: `src/types/index.ts`**
**Folder: `src/config/supabase.ts`** (if exists)

### Step 5: Set Environment Variables

1. Click **⚙️ Settings** → **"Secrets"**
2. Add:
   - Name: `EXPO_PUBLIC_SUPABASE_URL`
   - Value: `https://oyrsmfrpcegtrxrbadlu.supabase.co`
3. Add:
   - Name: `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnNtZnJwY2VndHJ4cmJhZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMxODIsImV4cCI6MjA3NzQyOTE4Mn0.e8jRrE-8EonGzIif_mRPBtc8fn9mefu122eo5f2ZaRE`

---

## 🔗 Quick Copy Links (GitHub Raw URLs)

### Core Files:
- **App.tsx**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/App.tsx`
- **package.json**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/package.json`
- **app.json**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/app.json`

### Theme:
- **theme.ts**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/theme.ts`

### Services:
- **supabase.ts**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/services/supabase.ts`

### Navigation:
- **AppNavigator.tsx**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/navigation/AppNavigator.tsx`

### Components (Key Ones):
- **DiscoveryCard.tsx**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/components/DiscoveryCard.tsx`
- **FilterChip.tsx**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/components/FilterChip.tsx`
- **NewLitterCard.tsx**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/components/NewLitterCard.tsx`

### Screens (Key Ones):
- **BreedingDiscoveryScreen.tsx**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/screens/breeder/BreedingDiscoveryScreen.tsx`
- **AdoptionDiscoveryScreen.tsx**: `https://raw.githubusercontent.com/drdyor/pawmatch/cursor/adapt-web-app-design-to-react-native-4170/pawmatch-mobile/src/screens/buyer/AdoptionDiscoveryScreen.tsx`

---

## ⚡ Faster Method: Download ZIP

1. Go to: `https://github.com/drdyor/pawmatch/archive/refs/heads/cursor/adapt-web-app-design-to-react-native-4170.zip`
2. Download the ZIP
3. Extract `pawmatch-mobile` folder
4. In Snack, click **"Upload Files"** or drag & drop the `src/` folder

---

## ✅ Verify It's React Native

All files use:
```typescript
import { View, Text, TouchableOpacity } from 'react-native';
```

NOT:
```typescript
// ❌ These are NOT used anywhere:
import { div, span } from 'react-native-web';
```

---

## 🎯 Minimum Files to Start

If you just want to test quickly, copy these files in order:

1. `App.tsx` (entry point)
2. `src/theme.ts` (colors)
3. `src/services/supabase.ts` (backend)
4. `src/navigation/AppNavigator.tsx` (navigation)
5. One screen file to test (e.g., `BreedingDiscoveryScreen.tsx`)

Then add dependencies and environment variables.

---

**All code is 100% React Native! ✅**
