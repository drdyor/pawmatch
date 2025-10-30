# 🔥 Firebase Setup for PawMatch Web App

## Quick Setup (5 minutes)

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Name it: `pawmatch` (or whatever you like)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Authentication

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Enable **"Google"**:
   - Toggle it on
   - Enter your support email
   - Click **"Save"**

### 3. Create Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add rules later)
4. Choose location closest to you (e.g., `europe-west1`)
5. Click **"Enable"**

### 4. Get Your Web Config

1. In Firebase Console, click the **⚙️ gear icon** > **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **web icon** `</>`
4. Register app:
   - Nickname: `pawmatch-web`
   - Skip Firebase Hosting
   - Click **"Register app"**
5. **Copy the config** - it looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "pawmatch-xxx.firebaseapp.com",
  projectId: "pawmatch-xxx",
  storageBucket: "pawmatch-xxx.appspot.com",
  messagingSenderId: "123456",
  appId: "1:123456:web:abc123"
};
```

### 5. Add Config to Your App

Create `.env.local` in your project root:

```bash
# Copy from .env.local.example
cp .env.local.example .env.local
```

Then edit `.env.local` with your Firebase values:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=pawmatch-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pawmatch-xxx
VITE_FIREBASE_STORAGE_BUCKET=pawmatch-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456
VITE_FIREBASE_APP_ID=1:123456:web:abc123
```

### 6. Configure Google OAuth for Production

1. Go to https://console.cloud.google.com/
2. Select your Firebase project
3. Go to **"APIs & Services"** > **"Credentials"**
4. Find the **"Web client"** auto-created by Firebase
5. Click **"Edit OAuth client"**
6. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://pawmatch-psi.vercel.app
   ```
7. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/__/auth/handler
   https://pawmatch-psi.vercel.app/__/auth/handler
   ```
8. Click **"Save"**

### 7. Set Up Firestore Rules

In Firebase Console > Firestore Database > Rules, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users can read all profiles, but only edit their own
    match /users/{userId} {
      allow read: if true;
      allow write: if isAuthenticated() && isOwner(userId);
    }
    
    // Anyone can browse pets, owners can edit their pets
    match /pets/{petId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        isOwner(resource.data.ownerId);
    }
    
    // Likes/favorites
    match /likes/{likeId} {
      allow read, write: if isAuthenticated();
    }
    
    // Messages between users
    match /messages/{messageId} {
      allow read: if isAuthenticated() && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.recipientId);
      allow create: if isAuthenticated();
    }
  }
}
```

Click **"Publish"**

### 8. Seed Demo Data

Run in your terminal:

```bash
yarn dev
```

Then open browser console and run:

```javascript
// Import the seed function
import { seedFirestore } from './src/config/seedData'

// Run it
await seedFirestore()
// ✅ Firestore seeded successfully!
```

Or create a temporary page at `/seed` that calls it with a button.

### 9. Deploy to Vercel

Add Firebase env vars to Vercel:

```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

Or in Vercel Dashboard:
1. Go to your project
2. **Settings** > **Environment Variables**
3. Add each variable
4. Redeploy

---

## What You Get

✅ **Google Sign In** - One-click authentication  
✅ **User Profiles** - Stored in Firestore  
✅ **Pet Listings** - Real-time database  
✅ **Role-based Access** - Breeder, Buyer, Shelter, Vet  
✅ **Demo Data** - 4 users + 3 pets to test with  
✅ **Production Ready** - Proper security rules  
✅ **Free Tier** - 50K reads/day, 20K writes/day  

---

## Testing Locally

1. **Start dev server:**
   ```bash
   yarn dev
   ```

2. **Go to:** http://localhost:3000

3. **Click "Continue with Google"**

4. **Select your Google account**

5. **You're in!** 🎉

---

## Firestore Collections Structure

```
/users/{userId}
  - uid: string
  - role: 'breeder' | 'buyer' | 'shelter' | 'vet'
  - name: string
  - email: string
  - city: string
  - photoURL?: string
  - createdAt: timestamp

/pets/{petId}
  - id: string
  - ownerId: string (ref to user)
  - name: string
  - species: 'Dog' | 'Cat'
  - breed: string
  - age: string
  - photos: string[]
  - status: 'available' | 'pending' | 'adopted'
  - createdAt: timestamp

/likes/{likeId}
  - userId: string
  - petId: string
  - createdAt: timestamp

/messages/{messageId}
  - senderId: string
  - recipientId: string
  - text: string
  - read: boolean
  - createdAt: timestamp
```

---

## Troubleshooting

### "Firebase not configured"
- Check `.env.local` exists and has all variables
- Restart dev server: `yarn dev`

### Google sign-in popup blocked
- Allow popups in browser
- Or click the button again

### "Auth domain not authorized"
- Add your domain to Firebase Console > Authentication > Settings > Authorized domains

### Firestore permission denied
- Check your security rules
- Make sure user is authenticated

---

## Next Steps

1. ✅ Set up Firebase (you're here!)
2. 📱 Test Google login
3. 🎴 Try the swipe interface
4. 👤 Add user role selection
5. 🐕 Upload real pet photos
6. 💬 Build messaging feature
7. 🚀 Launch!

---

**Need help?** Open an issue or check Firebase docs: https://firebase.google.com/docs/web/setup
