# PawMatch - 15 Minute Quick Start

**For non-developers:** This guide will get your app running in 15 minutes! ⏱️

## What You'll Need

1. A computer (Mac or Windows)
2. Your smartphone
3. 15 minutes
4. Internet connection

## Step 1: Install Node.js (2 minutes)

1. Go to [nodejs.org](https://nodejs.org)
2. Click the big green button "Download Node.js (LTS)"
3. Run the installer
4. Click "Next" through all screens (use defaults)
5. Restart your computer if prompted

**Test it worked:**
- Open Terminal (Mac) or Command Prompt (Windows)
- Type: `node --version`
- You should see something like `v20.11.0`

## Step 2: Install Expo Go on Your Phone (1 minute)

- **iPhone**: Search "Expo Go" in App Store, install it
- **Android**: Search "Expo Go" in Play Store, install it

## Step 3: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (it's free!)
3. Sign up with your email or GitHub
4. Click "New Project"
   - Name: `PawMatch`
   - Password: Make up a strong password (save it!)
   - Region: Choose **Europe (Frankfurt)**
   - Click "Create new project" - wait 2 minutes while it sets up

5. While waiting, open `DATABASE_SETUP.md` in this folder
6. Once project is ready, click **SQL Editor** (in left sidebar)
7. Click "New query"
8. Copy the entire SQL code from `DATABASE_SETUP.md` (Section 3)
9. Paste it and click "Run"
10. You should see "Success. No rows returned"

6. Go to **Settings** → **API** (in left sidebar)
7. Keep this tab open - you'll need these keys next!

## Step 4: Configure the App (2 minutes)

1. Open Terminal/Command Prompt
2. Navigate to the project:
   ```bash
   cd pawmatch-mobile
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   (This takes 2-3 minutes)

4. Create your environment file:
   ```bash
   cp .env.example .env
   ```

5. Open the `.env` file in any text editor (Notepad, TextEdit, VS Code)

6. Go back to your Supabase tab (Settings → API)
7. Copy the **Project URL** and paste it after `EXPO_PUBLIC_SUPABASE_URL=`
8. Copy the **anon public key** and paste it after `EXPO_PUBLIC_SUPABASE_ANON_KEY=`

9. Save the file

Your `.env` should look like:
```
EXPO_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...
```

## Step 5: Start the App! (1 minute)

1. In Terminal/Command Prompt, type:
   ```bash
   npm start
   ```

2. Wait 10-20 seconds. You'll see a QR code appear! 📱

3. **On iPhone:**
   - Open Camera app
   - Point at the QR code
   - Tap the notification
   - Expo Go will open with your app!

4. **On Android:**
   - Open Expo Go app
   - Tap "Scan QR code"
   - Point at the QR code
   - Your app will load!

## Step 6: Create Your Account (2 minutes)

1. On the Welcome screen, tap **Get Started**
2. Enter your name, email, and password
3. Tap **Create Account**
4. Choose your role:
   - **Buyer** - to browse and adopt pets
   - **Independent Breeder** - for first-time breeders
   - **Registered Breeder** - for professional kennels
   - **Shelter** - for rescue organizations
   - **Vet** - for veterinarians

5. Tap **Continue**

## 🎉 You're Done!

Your PawMatch app is now running on your phone!

## What's Working Now?

✅ Full authentication (sign up, sign in, sign out)
✅ Role-based navigation (different screens for each role)
✅ Database connected and ready
✅ All user profiles saving to database

## What's Next?

The app has placeholder screens for:
- 🐾 Pet discovery feed (Tinder-style swiping)
- 📅 Heat cycle tracking (Flo-style calendar)
- 💛 Breeder matching
- 🏠 Shelter management
- ⚕️ Vet tools
- 💬 Messaging

Each feature will be built one by one. The foundation is ready!

## Common Issues

### "Command not found: npm"
→ Node.js didn't install. Go back to Step 1.

### "Can't connect to development server"
→ Make sure your phone and computer are on the same Wi-Fi network.

### QR code not working?
→ Press `w` in the terminal to open in your web browser instead.

### App shows error screen?
→ Check your `.env` file has the correct Supabase keys (no spaces, no quotes).

### Want to test on a different role?
→ Tap the profile tab, sign out, and create a new account with a different role.

## Need Help?

Open an issue on GitHub or check:
- `GETTING_STARTED.md` - detailed developer guide
- `DATABASE_SETUP.md` - database troubleshooting
- `README.md` - project overview

---

**Welcome to PawMatch! Let's build something amazing for Malta's pets! 🐕🇲🇹**
