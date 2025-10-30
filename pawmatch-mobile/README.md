# PawMatch Mobile

**Tinder-style pet breeding and adoption platform for Malta**

## Features

- 🐾 **Multi-Role Platform**: Breeders, Buyers, Shelters, Vets
- 💛 **Tinder-Style Matching**: Swipe to find stud matches
- 📅 **Heat Tracking**: Flo-style cycle calendar for breeders
- 💰 **EUR Payments**: Stripe integration with SEPA support
- 📱 **Push Notifications**: Litter alerts, urgent shelter notifications
- 📄 **Contract Generation**: EU-compliant breeding contracts
- 💵 **Ad Revenue**: Google AdMob integration

## Getting Started

1. **Install dependencies**:
   ```bash
   cd pawmatch-mobile
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Add your Supabase, Stripe, and AdMob keys
   ```

3. **Start the app**:
   ```bash
   npm start
   ```

4. **Run on device**:
   - Scan QR code with Expo Go app
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## Project Structure

```
pawmatch-mobile/
├── src/
│   ├── screens/        # All app screens
│   ├── components/     # Reusable components
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API and database services
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript types
│   └── theme/          # Colors and styling
├── assets/             # Images and icons
└── App.tsx            # Entry point
```

## Malta Launch Strategy

1. Partner with local shelter (free management tools)
2. Onboard independent breeders (free heat tracking)
3. Attract buyers through pet discovery
4. Revenue through ads (AdMob)

## Tech Stack

- **Expo** - React Native framework
- **TypeScript** - Type safety
- **Supabase** - Backend database and auth
- **React Navigation** - Navigation
- **Stripe** - EUR payments
- **Google AdMob** - Ad revenue
