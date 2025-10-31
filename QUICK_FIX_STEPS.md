# ⚡ QUICK FIX - Run These Commands in Terminal

**You're in:** `/Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile/`

---

## 🎯 **THE ONE COMMAND THAT FIXES MOST ERRORS:**

```bash
cd /Users/dreva/Desktop/cursor/pawmatch/pawmatch-mobile && npm install
```

**Wait 3-5 minutes.** This installs all dependencies and creates `node_modules`.

---

## ✅ **THEN RESTART TYPESCRIPT:**

1. In Cursor Desktop: Press **`Cmd+Shift+P`** (or `Ctrl+Shift+P`)
2. Type: **`TypeScript: Restart TS Server`**
3. Press Enter

**Errors should disappear!** 🎉

---

## 🚀 **THEN START THE APP:**

```bash
npm start
```

---

## ❓ **IF YOU STILL SEE ERRORS:**

### **Error about OnboardingFlow or VotesContext:**

Your `App.tsx` might have old imports. The correct one should be:

```typescript
import AppNavigator from './src/navigation/AppNavigator';
```

Not:
```typescript
import OnboardingFlow from './src/screens/onboarding/OnboardingFlow';
```

**Quick check:** Open `App.tsx` and make sure it matches the workspace version (which uses `AppNavigator`).

---

**Just run `npm install` first - that fixes 90% of these errors!** ✅
