# PawMatch Architecture

## Technology Stack

### Frontend (Mobile)
- **Expo 50** - React Native framework
- **React Native** - Mobile UI framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation between screens
- **Expo modules** - Camera, notifications, image picker, location

### Backend
- **Supabase** - PostgreSQL database + auth + storage + realtime
- **Row Level Security** - Data protection at database level
- **Supabase Storage** - Pet photos, certificates, contracts
- **Supabase Realtime** - Live messaging and notifications

### Payments
- **Stripe** - EUR payments, SEPA direct debit
- **Escrow** - Hold deposits until contract signed

### Notifications
- **Expo Push Notifications** - Litter alerts, urgent shelter alerts

### Monetization
- **Google AdMob** - Banner ads, interstitial ads, rewarded video

## Project Structure

```
pawmatch-mobile/
├── App.tsx                 # Entry point, auth state management
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── .env                   # Environment variables (API keys)
│
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Navigation config (role-based routing)
│   │
│   ├── screens/
│   │   ├── auth/               # Welcome, SignIn, SignUp, RoleSelection
│   │   ├── buyer/              # BuyerHome, Favorites, Alerts, Profile
│   │   ├── breeder/            # BreederHome, Pets, Matches, Profile
│   │   ├── shelter/            # ShelterHome, Animals, Listings, Profile
│   │   ├── vet/                # VetHome, Patients, Profile
│   │   └── shared/             # Messages, PetDetail (shared across roles)
│   │
│   ├── components/
│   │   ├── PetCard.tsx         # Reusable pet display card
│   │   ├── HeatRing.tsx        # Heat cycle progress indicator
│   │   ├── ListingCard.tsx     # Breeding/adoption listing card
│   │   └── [more components]
│   │
│   ├── services/
│   │   ├── supabase.ts         # Supabase client configuration
│   │   ├── auth.ts             # Authentication functions
│   │   ├── pets.ts             # Pet CRUD operations
│   │   ├── listings.ts         # Listing CRUD operations
│   │   ├── messages.ts         # Messaging functions
│   │   └── notifications.ts    # Push notification handling
│   │
│   ├── hooks/
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── usePets.ts          # Fetch/manage pets
│   │   ├── useListings.ts      # Fetch/manage listings
│   │   └── useMessages.ts      # Real-time messaging
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript types (User, Pet, Listing, etc.)
│   │
│   └── theme/
│       └── colors.ts           # Brand colors (yellow/blue)
│
└── assets/
    ├── icon.png               # App icon
    ├── splash.png             # Splash screen
    └── adaptive-icon.png      # Android adaptive icon
```

## Data Flow

### Authentication Flow
```
1. User opens app
2. App.tsx checks for existing session (Supabase)
3. If no session → Show Welcome screen
4. User signs up → Create auth user + user profile in DB
5. User selects role → Update user profile with role
6. AppNavigator routes to role-specific tabs
```

### Pet Discovery Flow (Buyer)
```
1. Buyer opens app → BuyerHomeScreen
2. Fetch active listings from Supabase (where status = 'live')
3. Display in card layout with photo, breed, price
4. User taps pet → Navigate to PetDetailScreen
5. User taps "Contact" → Navigate to MessagesScreen
6. Real-time messages via Supabase Realtime
```

### Heat Tracking Flow (Breeder)
```
1. Breeder adds female pet → Save to pets table
2. Breeder marks heat start → Create heat_cycles record
3. App calculates fertile window (days 8-14 of 21-day cycle)
4. HeatRing component shows progress
5. Push reminder sent on day 8 for progesterone test
```

### Stud Matching Flow (Tinder-style)
```
1. Breeder opens Matches tab
2. Fetch available studs (where status = 'stud_available')
3. Filter by breed, location, health clearances
4. Display swipeable cards
5. Swipe right → Create "interest" record
6. When both interested → Create match
7. Match opens messaging
```

## Database Schema

### Tables
- `users` - User profiles with role
- `pets` - Individual animals (owned by users)
- `health_records` - Vaccination, test results, certificates
- `heat_cycles` - Female dog heat tracking
- `listings` - Adoption, stud, litter announcements
- `messages` - Chat between users
- `notifications` - Push notifications
- `contracts` - Breeding agreements

### Storage Buckets
- `pet-photos` - Public pet images
- `certificates` - Private health documents
- `contracts` - Private breeding contracts

## Security

### Row Level Security (RLS)
- Users can only edit their own profile
- Pet owners can edit their pets
- Everyone can view public listings
- Messages only visible to sender/receiver
- Certificates only visible to owner + vets

### Authentication
- Email/password via Supabase Auth
- Session stored in AsyncStorage (encrypted on device)
- Automatic token refresh
- Secure logout clears all local data

## Deployment

### Development
```bash
npm start          # Start Expo dev server
# Scan QR code with Expo Go app
# Changes appear instantly (hot reload)
```

### Production Build

**iOS (App Store)**
```bash
eas build --platform ios
# Generates .ipa file
# Submit to App Store via eas submit
```

**Android (Play Store)**
```bash
eas build --platform android
# Generates .aab file
# Submit to Play Store via eas submit
```

### Environment Variables

**Development** (`.env`)
```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-...
```

**Production** (EAS Secrets)
```bash
eas secret:create --scope project --name SUPABASE_URL
eas secret:create --scope project --name SUPABASE_ANON_KEY
# etc.
```

## Performance

### Optimization Strategies
- Lazy load images with `expo-image`
- Infinite scroll for pet feeds
- Cache Supabase queries with React Query
- Compress images before upload
- Paginate database queries (20 items at a time)

### Bundle Size
- Tree-shake unused code
- Use `expo-optimize` for production builds
- Lazy load heavy screens
- Use native modules when possible (faster than JS)

## Monitoring

### Planned Integrations
- **Sentry** - Crash reporting
- **PostHog** - Analytics (screen views, button clicks)
- **Supabase Logs** - Database query performance
- **Google Analytics** - User behavior

## Scalability

### Current Capacity (Supabase Free Tier)
- 500 MB database storage
- 1 GB file storage
- 2 GB bandwidth/month
- Unlimited API requests

### When to Upgrade
- 1000+ users → Supabase Pro ($25/month)
- 10,000+ users → Dedicated infrastructure
- High file uploads → Cloudinary/CDN

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/buyer-discovery
   ```

2. **Edit screen files**
   - Open relevant screen in `src/screens/`
   - Add UI components
   - Connect to Supabase
   - Test on phone (live reload)

3. **Test on physical device**
   - Changes appear instantly
   - Test gestures, camera, etc.

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add buyer discovery feed"
   git push origin feature/buyer-discovery
   ```

5. **Merge to main**
   - Create PR on GitHub
   - Review code
   - Merge and deploy

---

**This architecture is designed for Malta launch and scales to 100,000+ users across EU.**
