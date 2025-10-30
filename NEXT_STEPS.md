# PawMatch - Next Steps & Roadmap

**Status:** ✅ Foundation Complete - Ready for Feature Development

## What's Built

### ✅ Phase 1: Foundation (COMPLETE)

- [x] Expo project structure with TypeScript
- [x] Navigation system (role-based tabs)
- [x] Authentication flow (sign up, sign in, role selection)
- [x] Supabase database schema (8 tables + storage)
- [x] User roles (Breeder, Buyer, Shelter, Vet)
- [x] Theme system (PawMatch yellow & blue)
- [x] All screen placeholders (15 screens)
- [x] Row-level security policies
- [x] Environment configuration

## Priority Features to Build

### 🚀 Phase 2: Core Buyer Experience (Week 1-2)

**Goal:** Let buyers discover and contact about pets

1. **Pet Discovery Feed** (`src/screens/buyer/BuyerHomeScreen.tsx`)
   - Card-based layout showing available pets
   - Filter by species, breed, location
   - Heart button to favorite
   - View pet details
   - Contact breeder/shelter button

2. **Pet Detail Screen** (`src/screens/shared/PetDetailScreen.tsx`)
   - Photo gallery/carousel
   - Pet info (breed, age, health records)
   - Owner information
   - "Contact" button → navigate to messages
   - "Add to Favorites" button

3. **Basic Messaging** (`src/screens/shared/MessagesScreen.tsx`)
   - Conversation list
   - Simple chat interface
   - Real-time updates (Supabase Realtime)
   - Send text messages

**User Story:** "As a buyer, I can browse available pets, see their details, and message the breeder/shelter."

### 📅 Phase 3: Breeder Tools (Week 3-4)

**Goal:** Give breeders free management tools to attract them to platform

4. **Add Pet Form** (`src/screens/breeder/BreederPetsScreen.tsx`)
   - Form to add pet (name, breed, DOB, sex)
   - Photo upload (Supabase Storage)
   - Health records input
   - Save to database

5. **Heat Cycle Tracker** (`src/screens/breeder/BreederHomeScreen.tsx`)
   - Calendar view (Flo-style horizontal dates)
   - Mark heat start date
   - Auto-calculate fertile window (days 8-14)
   - Visual progress ring showing cycle day
   - Push reminders for progesterone tests

6. **Create Stud Listing** (`src/screens/breeder/BreederHomeScreen.tsx`)
   - Form to create stud listing
   - Select pet from "My Pets"
   - Set price (EUR)
   - Add description
   - Publish to marketplace

**User Story:** "As a breeder, I can track my female dog's heat cycles and list my stud for breeding services."

### 💛 Phase 4: Tinder-Style Matching (Week 5)

**Goal:** Unique feature that differentiates PawMatch

7. **Swipeable Stud Cards** (`src/screens/breeder/BreederMatchesScreen.tsx`)
   - Show available studs
   - Swipe right to express interest
   - Swipe left to pass
   - Filter by breed, location, health clearances
   - When both swipe right → Match!
   - Match leads to direct messaging

**User Story:** "As a breeder with a female in heat, I can swipe through available studs and match with breeders."

### 🏠 Phase 5: Shelter Features (Week 6)

**Goal:** Free tools for shelters = social good + initial content

8. **Animal Intake Form** (`src/screens/shelter/ShelterAnimalsScreen.tsx`)
   - Quick form to add rescued animal
   - Mark euthanasia risk (yes/no)
   - Auto-calculate 72-hour countdown
   - Photo upload

9. **Adoption Listing** (`src/screens/shelter/ShelterListingsScreen.tsx`)
   - Create adoption post
   - Link to animal in system
   - Set adoption fee (or €0)
   - Publish to buyer discovery feed

10. **Urgent Alerts** (`src/screens/shelter/ShelterHomeScreen.tsx`)
    - Red banner for at-risk animals
    - "Send urgent alert" button
    - Push notification to all Malta users
    - Countdown timer (72h, 48h, 24h)

**User Story:** "As a shelter, I can quickly post adoptable animals and send urgent alerts for at-risk pets."

### 💰 Phase 6: Payments (Week 7)

**Goal:** Enable deposits for litter reservations

11. **Stripe Integration**
    - EUR payment setup
    - SEPA direct debit
    - Deposit flow (hold until contract signed)
    - Receipt generation
    - Refund capability

12. **Litter Announcements**
    - Breeder announces upcoming litter
    - Set price, expected date, # of pups
    - Buyers can join waitlist
    - Pay deposit to secure spot

**User Story:** "As a buyer, I can reserve a puppy from an upcoming litter by paying a deposit."

### 🔔 Phase 7: Notifications (Week 8)

**Goal:** Keep users engaged

13. **Push Notifications**
    - Litter alerts (when favorite breeder posts)
    - Price alerts (when price drops below watch threshold)
    - Shelter urgent alerts
    - New message notifications
    - Match notifications

14. **Alert Subscriptions**
    - Subscribe to specific breeds
    - Set price watch threshold
    - Set location radius
    - Manage subscriptions in profile

### 💵 Phase 8: Revenue (Week 9)

**Goal:** Ad integration for sustainability

15. **Google AdMob**
    - Banner ads on browse screens
    - Interstitial ads between major flows
    - Rewarded video ads for "boost listing"
    - Analytics tracking
    - Ad-free option (future premium tier)

### ⚕️ Phase 9: Vet Integration (Week 10)

**Goal:** Complete the ecosystem

16. **Vet Tools**
    - View linked patient pets
    - Upload health certificates to pet profiles
    - Send vaccination reminders
    - Appointment request system
    - Accept/decline appointment proposals

### 📄 Phase 10: Contracts (Week 11-12)

**Goal:** Legal protection for breeding transactions

17. **Contract Generation**
    - EU-compliant breeding contract template
    - Fill-in fields (price, delivery, health guarantee)
    - Generate PDF
    - E-signature (typed name + date)
    - Email to both parties
    - Store in app + database

## Development Priorities

### Must-Have for MVP (Malta Launch)
- ✅ Authentication
- 🎯 Pet discovery (Buyer)
- 🎯 Add pets (Breeder)
- 🎯 Basic messaging
- 🎯 Create listings (Breeder & Shelter)
- 🎯 Heat tracking (Breeder)

### Nice-to-Have for MVP
- Tinder-style matching
- Litter announcements
- Push notifications
- Urgent shelter alerts

### Post-Launch (Iterate Based on Feedback)
- Stripe payments
- Contract generation
- Vet integration
- AdMob
- Advanced filters
- Photo editing
- Reviews/ratings

## Tech Debt to Address

- [ ] Add proper error boundaries
- [ ] Add loading states to all data fetches
- [ ] Add image optimization/compression
- [ ] Add offline mode for viewing cached data
- [ ] Add analytics (PostHog or similar)
- [ ] Add crash reporting (Sentry)
- [ ] Add proper TypeScript types for navigation
- [ ] Add unit tests for critical functions
- [ ] Add E2E tests for main flows

## Performance Optimizations

- [ ] Implement infinite scroll for pet feed
- [ ] Add image lazy loading
- [ ] Cache Supabase queries with React Query
- [ ] Optimize bundle size
- [ ] Add app icons for all sizes
- [ ] Add splash screen animation

## Malta Launch Checklist

- [ ] Partner with 1 Malta shelter
- [ ] Onboard 5-10 test breeders
- [ ] Create demo accounts for each role
- [ ] Test on both iOS and Android
- [ ] Set up error monitoring
- [ ] Create social media accounts
- [ ] Design marketing materials
- [ ] Submit to App Store
- [ ] Submit to Play Store
- [ ] Plan launch event at shelter

## How to Contribute

Each feature above can be built independently. To add a feature:

1. Pick a screen from the list above
2. Open the placeholder file (e.g., `src/screens/buyer/BuyerHomeScreen.tsx`)
3. Replace the placeholder content with real functionality
4. Connect to Supabase for data
5. Test on your phone
6. Commit and push!

The foundation is solid - now it's time to build! 🚀
