# 🚨 Vercel Blank Screen - Quick Fix

## Issue:
Site loads but shows blank screen: https://pawmatchdrdyor.vercel.app/

## Root Cause:
Build is working, but Vercel settings might be wrong.

---

## ✅ EXACT Vercel Settings (Copy These):

### **1. Go to Vercel Dashboard:**
https://vercel.com/dashboard

### **2. Click your "pawmatchdrdyor" project**

### **3. Go to Settings → General**

**Framework Preset:** `Vite`

**Root Directory:** `.` (leave blank/empty)

**Build & Development Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### **4. Go to Settings → Environment Variables**

Check if any are required. For now, none needed for basic voting page.

### **5. Redeploy:**

Go to **Deployments** → Click latest → **"Redeploy"**

---

## 🔍 Check Build Logs:

In Vercel → Deployments → Click latest deployment

**Look for:**
1. ✅ Build succeeded
2. ✅ Output written to `dist/`
3. ❌ Any errors in logs

**Common errors:**
- Missing dependencies
- TypeScript errors
- Memory limit

---

## 🎯 Quick Test Commands:

Run these locally to confirm build works:

```bash
cd /workspace

# Clean build
rm -rf dist node_modules
npm install
npm run build

# Check output
ls -la dist/
cat dist/index.html

# Should see bundled JS files!
```

---

## 📊 Expected Build Output:

```
dist/
  ├── index.html          ← Entry point
  ├── assets/
  │   ├── index-HASH.js   ← Your app bundle
  │   ├── index-HASH.css  ← Styles
  │   └── ...
  └── favicon.ico
```

---

## 🐛 If Still Blank:

### **Check Browser Console:**

1. Open site: https://pawmatchdrdyor.vercel.app/
2. Press F12 (Dev Tools)
3. Go to **Console** tab
4. Look for errors:
   - ❌ `Failed to load module`
   - ❌ `404` errors
   - ❌ CORS errors

### **Check Network Tab:**

1. Press F12
2. Go to **Network** tab
3. Refresh page
4. Look for:
   - ✅ `index.html` (status 200)
   - ✅ `index-HASH.js` (status 200)
   - ❌ Any 404s

---

## 💡 Most Common Fix:

### **Output Directory Wrong:**

In Vercel Settings:
- **Output Directory:** Must be `dist` (NOT `build` or `.`)

### **Base URL Wrong:**

Check `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/', // Should be '/' for root domain
  // ...
})
```

---

## 🚀 Alternative: Deploy from Vercel CLI

If dashboard doesn't work:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /workspace
vercel --prod

# Follow prompts:
# - Framework: Vite
# - Build Command: npm run build
# - Output Directory: dist
```

---

## ✅ Working Example:

Your build IS working locally:
```
✓ 2775 modules transformed
dist/index.html                 0.47 kB
dist/assets/index-662153b5.js   2,089.38 kB
```

So it's just Vercel configuration!

---

## 🎯 Next Steps:

1. **Check Vercel build logs** (Deployments → latest → View logs)
2. **Verify settings** (Framework = Vite, Output = dist)
3. **Redeploy**
4. **Check browser console** for errors
5. **Share error logs** if still blank

---

**Most likely: Output Directory needs to be `dist`!**
