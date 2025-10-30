# Getting Started with PawMatch Mobile

## Prerequisites

- Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- A smartphone (iPhone or Android)
- **Expo Go** app installed on your phone:
  - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step 1: Install Dependencies

Open Terminal and navigate to the project folder:

```bash
cd pawmatch-mobile
npm install
```

This will take 2-3 minutes to download all required packages.

## Step 2: Set Up Supabase Database

1. Follow the instructions in [`DATABASE_SETUP.md`](./DATABASE_SETUP.md)
2. Create a free Supabase account
3. Run the SQL schema
4. Copy your API keys

## Step 3: Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in a text editor and add your keys:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Start the App

```bash
npm start
```

You should see a QR code in the terminal. This is your app!

## Step 5: Open on Your Phone

### iPhone:
1. Open the **Camera** app
2. Point it at the QR code
3. Tap the notification that appears
4. The app will open in Expo Go

### Android:
1. Open the **Expo Go** app
2. Tap "Scan QR code"
3. Point your camera at the QR code
4. The app will load

## Step 6: Test the App

1. On the Welcome screen, tap **Get Started**
2. Fill in your details and create an account
3. Choose a role (try **Buyer** first)
4. You're in! 🎉

## Troubleshooting

### "Couldn't connect to development server"
- Make sure your phone and computer are on the **same Wi-Fi network**
- Try pressing `w` in the terminal to open in a web browser instead
- Or press `t` to try tunnel mode

### "Something went wrong"
- Close Expo Go completely and reopen it
- In terminal, press `r` to reload
- Check that your `.env` file has the correct Supabase keys

### Changes not showing up
- Press `r` in the terminal to reload
- Shake your phone and tap "Reload"

## Development Commands

```bash
npm start        # Start development server
npm run android  # Open Android emulator (requires Android Studio)
npm run ios      # Open iOS simulator (requires Xcode, Mac only)
npm run web      # Open in web browser
```

## Next Steps

- **Add pets**: Switch to Breeder role and add your first pet
- **Create listings**: Try creating a stud or adoption listing
- **Test buyer flow**: Switch to Buyer role and browse pets
- **Check messages**: Test the messaging between users

## Building Features

The app is set up with placeholder screens. To build out features:

1. **Buyer discovery**: Edit `src/screens/buyer/BuyerHomeScreen.tsx`
2. **Heat tracking**: Edit `src/screens/breeder/BreederHomeScreen.tsx`
3. **Tinder-style matching**: Edit `src/screens/breeder/BreederMatchesScreen.tsx`

All screens are in the `src/screens/` folder, organized by role.

## Need Help?

- Check the main [`README.md`](./README.md) for project overview
- Review [`DATABASE_SETUP.md`](./DATABASE_SETUP.md) for database issues
- Check [Expo docs](https://docs.expo.dev) for mobile development help
- Check [Supabase docs](https://supabase.com/docs) for backend help

---

**You're ready to build PawMatch! 🐾**
