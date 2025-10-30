# 🔍 Code Audit Checklist for PawMatch Vercel Issue

## Current Problem
**Error**: `can't access property "headers", c.global is undefined`
**Location**: axios interceptor trying to access config.headers
**Status**: Black screen on Vercel, works in development

---

## ✅ Audit Steps

### **1. Check Deployed Build Output**

Open in browser:
- https://pawmatch-virid.vercel.app/assets/index-9398162c.js

Search for (Ctrl+F):
- `global`
- `window.global`
- `config.headers`

This shows the actual compiled code running in production.

---

### **2. Compare Local vs Production**

**Test locally:**
```bash
cd /workspace
npm install --legacy-peer-deps
npm run build
npm run preview
```

Then visit: http://localhost:4173

**Does it work locally?**
- ✅ YES → Problem is Vercel-specific
- ❌ NO → Problem is in the build process

---

### **3. Check Axios Version & Configuration**

Run:
```bash
cd /workspace
npm list axios
```

Known issue: Axios 1.x has issues with Vite global polyfill.

**Solution:** Downgrade to axios 0.27.x

---

### **4. Inspect Network Tab**

In browser:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Reload page
4. Check **all failed requests**

Look for:
- Failed API calls
- 404 errors
- CORS errors

---

### **5. Check Build Logs Detail**

Go to: https://vercel.com/drdyors-projects/pawmatch

Click on latest deployment → **Build Logs**

Search for:
- `warning`
- `error`
- `failed`
- `deprecated`

---

## 🐛 Most Likely Issues

### **Issue 1: Axios + Vite Compatibility**

**Symptoms:** `c.global is undefined`

**Root cause:** Axios trying to detect Node.js environment

**Solutions:**
1. ✅ Add polyfill in index.html (DONE)
2. Downgrade axios to 0.27.2
3. Use fetch API instead of axios

### **Issue 2: Build Optimization**

**Symptoms:** Works in dev, fails in production

**Root cause:** Vite minification breaking code

**Solutions:**
```js
// vite.config.ts
export default defineConfig({
  build: {
    minify: false, // Disable for testing
    sourcemap: true, // Enable debugging
  }
})
```

### **Issue 3: Environment Variables**

**Check if these exist in Vercel:**
- `VITE_DEMO_MODE`
- `VITE_HOST`

---

## 🔧 Quick Fixes to Try

### **Fix 1: Remove Axios Interceptors**

The error is IN the axios interceptor. Try removing it:

**File:** `src/api/axiosInstance.tsx`

Comment out ALL interceptors temporarily:

```typescript
// axios.interceptors.request.use(...)
// axios.interceptors.response.use(...)
```

### **Fix 2: Use Fetch Instead**

Replace axios with fetch in `src/api/pet.ts`:

```typescript
export const getPets = async (...) => {
  if (isDemoMode()) {
    return mockPets;
  }
  
  // Use fetch instead of axios
  const response = await fetch(`/api/v1/pets?...`);
  return response.json();
}
```

### **Fix 3: Force Axios to Use Browser Mode**

Add to `vite.config.ts`:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      // Force axios to use browser version
      'axios': 'axios/dist/axios.js',
    }
  }
})
```

---

## 📊 Diagnostic Tests

### **Test 1: Can JavaScript Run?**

Add to `src/main.tsx` at the very top:

```typescript
console.log('🚀 App starting...');
alert('App loaded!');
```

If alert shows → React is loading
If not → Build/script issue

### **Test 2: Is It Axios?**

Comment out this line in `src/App.tsx`:

```typescript
// import './api/axiosInstance'
```

If app loads → Axios is the problem

### **Test 3: Check Demo Mode**

Add to `src/pages/SwipeDiscoverPage/index.tsx`:

```typescript
console.log('VITE_DEMO_MODE:', import.meta.env.VITE_DEMO_MODE);
console.log('isDemoMode:', import.meta.env.VITE_DEMO_MODE !== 'false');
```

---

## 🎯 Recommended Action Plan

**Priority 1: Remove axios interceptors** (simplest fix)
1. Comment out interceptors in `src/api/axiosInstance.tsx`
2. Deploy
3. Test

**Priority 2: If still broken, replace axios with fetch**
1. Create new file `src/api/fetchInstance.ts`
2. Use native fetch API
3. Update all API calls

**Priority 3: Debugging build**
1. Add `sourcemap: true` to vite config
2. Check exact line causing error
3. Fix that specific line

---

## 📝 Info to Collect

Please share:
1. **Axios version**: Run `npm list axios` in /workspace
2. **Vite version**: Run `npm list vite` in /workspace
3. **Node version**: Run `node --version`
4. **Does `/debug` route work?** Try https://pawmatch-virid.vercel.app/debug

---

## 🆘 Nuclear Option: Fresh Start

If nothing works:

1. **Remove axios completely**
2. **Use fetch for all API calls**
3. **Remove google-maps-react** (has peer dep issues)
4. **Simplify to minimal working app**

---

## ✅ Next Steps

Try these in order:
1. Visit https://pawmatch-virid.vercel.app/debug
2. Check if /debug loads (proves React works)
3. If /debug fails → Problem is in main.tsx or earlier
4. If /debug works → Problem is in SwipeDiscoverPage or axios

Let me know what you find!
