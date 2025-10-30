# 🔧 Fix Blank Screen on Vercel

## Problem
Your app is showing a blank screen because:
1. ❌ Backend API not deployed (app tries to call `/api/auth/login/`)
2. ❌ Environment variables not configured in Vercel

---

## ✅ Quick Fix (Option A): Enable Demo Mode

Add environment variables in Vercel:

1. **Go to Vercel Dashboard**: https://vercel.com/drdyors-projects/pawmatch/settings/environment-variables

2. **Add these variables** (click "Add" for each):

| Name | Value |
|------|-------|
| `VITE_DEMO_MODE` | `true` |
| `VITE_HOST` | `https://pawmatch-ckc8gclct-drdyors-projects.vercel.app` |
| `VITE_API_URL` | `https://your-backend.com` (dummy for now) |

3. **Redeploy**: Go to Deployments → Click ⋯ → Redeploy

**Result**: App will work in demo mode (no backend needed)

---

## ✅ Better Fix (Option B): Deploy Backend + Configure Firebase

### Step 1: Add Environment Variables in Vercel

Go to: https://vercel.com/drdyors-projects/pawmatch/settings/environment-variables

**Add ALL these:**

```bash
# Backend API
VITE_API_URL=https://your-actual-backend-url.com
VITE_HOST=https://pawmatch-ckc8gclct-drdyors-projects.vercel.app

# Firebase (if using Firebase)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Google Maps (optional)
VITE_GOOGLE_MAPS_API_KEY=your_maps_key

# Storage
VITE_BUCKET_NAME=https://your-bucket.com/

# Demo mode
VITE_DEMO_MODE=false
```

### Step 2: Deploy Backend API

Your app expects a backend at `/api/*`. You need to:

**Option 2A: Deploy Backend Separately**
- Do you have backend code in this repo?
- Where is your backend API that handles `/api/auth/login/`?

**Option 2B: Use Vercel Serverless Functions**
- Create API routes in `/api/` folder
- Vercel will automatically deploy them

---

## 🚨 Current Issue in Code

The app hangs here (src/main.tsx line 72):

```typescript
const { data } = await axios.get('/api/auth/login/', {
  withCredentials: true,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

This call fails because `/api/auth/login/` doesn't exist on Vercel.

---

## 📝 How to Add Environment Variables in Vercel

### Via Web Interface:

1. Go to: https://vercel.com/drdyors-projects/pawmatch
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in left menu
4. For each variable:
   - Click **"Add New"**
   - Enter **Key** (e.g., `VITE_DEMO_MODE`)
   - Enter **Value** (e.g., `true`)
   - Select **All** (Production, Preview, Development)
   - Click **"Save"**
5. After adding all variables, go to **"Deployments"**
6. Click the **⋯** menu on latest deployment
7. Click **"Redeploy"**

### Via CLI (Alternative):

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add variables
vercel env add VITE_DEMO_MODE
# Enter value: true

vercel env add VITE_HOST
# Enter value: https://pawmatch-ckc8gclct-drdyors-projects.vercel.app

# Redeploy
vercel --prod
```

---

## ✅ Recommended: Start with Demo Mode

**Fastest path to working app:**

1. Add only these 2 variables in Vercel:
   ```
   VITE_DEMO_MODE=true
   VITE_HOST=https://pawmatch-ckc8gclct-drdyors-projects.vercel.app
   ```

2. Redeploy

3. App will load with demo data!

4. Later, set up backend and change `VITE_DEMO_MODE=false`

---

## 🧪 Test Locally First (Optional)

Create `.env.local` in `/workspace/`:

```bash
VITE_DEMO_MODE=true
VITE_HOST=http://localhost:3000
VITE_API_URL=http://localhost:3011
```

Then test:
```bash
npm run dev
```

---

## Need Help?

Questions to answer:
1. Do you have a backend API server?
2. Where is it hosted?
3. Should we enable demo mode for now?

Let me know and I'll help you set it up! 🚀
