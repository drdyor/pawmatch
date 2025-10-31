# PawMatch Malta - Complete User Journey Breakdown

## 🔐 Initial Authentication Flow (All Users)

1. **Welcome Screen** → User sees app landing
2. **Sign In / Sign Up** → User authenticates via Supabase
3. **Role Selection Screen** → User selects their role

---

## 1. 🏠 **BREEDER** (Professional or Independent)

### Onboarding Flow

#### Step 1: Role Selection
- **What they see:** Malta flag header, gradient background, role cards
- **What they select:** "Breeder" (🏠 Professional breeder offering services)
- **What happens:** Alert shows "Welcome, Breeder!"

#### Step 2: Breeder Onboarding Intro (`BreederOnboardingIntro.tsx`)
**What they fill in:**
- **Breeder Type:** 
  - Independent / First-time
  - Registered Kennel (if selected, requires kennel name)
- **Breeds I work with:**
  - Toggle Dogs/Cats
  - Select from preset breeds (Golden Retriever, Maltese, Persian, etc.)
  - Add custom breed with text input
- **Kennel Size:** 1-3 animals, 4-10 animals, 10+ animals
- **Breeding Experience:** First litter, 1-3 years, 3-5 years, 5+ years

#### Step 3: Breeder Intent Selection (`BreederOnboardingIntent.tsx`)
**What they select (multiple options):**
- 📅 Track heat cycles
- 🔗 Find a stud for my female
- 🐕 Advertise stud services
- 🐾 Announce litters
- 🏠 Sell puppies ethically
- 💬 Connect with other breeders
- 🧬 Share DNA or health results
- 🩺 Collaborate with vets

#### Step 4: Add Pets (`BreederOnboardingPets.tsx`)
**What they upload/fill in for EACH pet:**
- **Name:** Text input
- **Breed:** Selected from previous step
- **Date of Birth:** Date picker
- **Sex:** Male or Female
- **In Heat Now:** Toggle (if female)
- **Enable Heat Reminders:** Toggle (if female)
- **Photos:** Upload pet photos
- **Health Records:** Upload certificates

**Can add multiple pets** → Shows list of added pets

#### Step 5: Complete Onboarding
- Saves all data to Supabase
- Creates user profile with `role: breeder_registered` or `breeder_independent`
- Creates pet records
- Sets up heat cycle tracking (if applicable)

### Main Interface (After Onboarding)

**Bottom Tab Navigation (4 tabs):**

1. **🏠 Home Tab** (`BreederHomeScreen.tsx`)
   - **Dashboard Stats:**
     - Total Pets count
     - Active Listings count
     - Pets in Heat count
   - **Quick Actions:**
     - Add Pet button
     - Create Litter Announcement
     - Track Heat Cycles
     - View Matches

2. **🐕 My Pets Tab** (`BreederPetsScreen.tsx`)
   - List of all their pets
   - Each pet shows:
     - Photo, name, breed
     - Sex, age
     - Status (available, stud_available, in_heat)
     - Health badges
   - **Actions:**
     - Tap pet → Edit pet details
     - "Add Pet" button → Navigate to `BreederAddPetScreen`

3. **💞 Matches Tab** (`BreederMatchesScreen.tsx`)
   - Potential breeding matches
   - Stud requests for their females
   - Litter inquiries
   - Messages from buyers

4. **👤 Profile Tab** (`BreederProfileScreen.tsx`)
   - Personal info
   - Kennel name
   - Breeding experience
   - Settings

### Additional Screens (Accessed from Home)

- **Create Litter** (`BreederCreateLitterScreen.tsx`):
  - Select dam (female pet)
  - Add sire info
  - Set expected birth date
  - Set price per puppy
  - Upload photos
  - Set deposit amount

- **Heat Tracking** (`BreederHeatTrackingScreen.tsx`):
  - Calendar view of heat cycles
  - Current cycle day
  - Fertile window indicators
  - Notifications setup

- **Add Pet** (`BreederAddPetScreen.tsx`):
  - Full pet form (same as onboarding)

---

## 2. 💝 **PET SEEKER / BUYER**

### Onboarding Flow

#### Step 1: Role Selection
- **What they see:** Same Malta flag header
- **What they select:** "Pet Seeker" (💝 Looking to adopt, foster, or buy a pet)
- **What happens:** Alert shows "Welcome, Pet Seeker!"

#### Step 2: Quick Pet Add (Optional - `PetQuickAddScreen.tsx`)
**If they have existing pets:**
- Name, Species (Dog/Cat), Breed
- Age, Temperament tags
- Health badges (Vaccinated, DNA tested, FIV/FeLV for cats)

#### Step 3: Cat Health Gate (If they have cats - `CatHealthGateScreen.tsx`)
**Only if cat doesn't have FIV/FeLV badge:**
- Option 1: Connect with Vet (get certificate)
- Option 2: Upload existing certificate
- **Purpose:** Ensure cat health before breeding/adoption

#### Step 4: Heat Tracker Setup (`HeatTrackerScreen.tsx`)
**If they added female pets:**
- Enable heat cycle tracking?
- Set reminder preferences
- Connect with breeders for breeding

#### Step 5: Swipe Preview (`SwipePreviewScreen.tsx`)
- Shows how the Tinder-style swipe works
- Demo of card swiping

#### Step 6: Dashboard (`DashboardScreen.tsx`)
- Main app interface

### Main Interface (After Onboarding)

**Bottom Tab Navigation (4 tabs):**

1. **🔍 Discover Tab** (`BuyerHomeScreen` → `BuyerSwipeDiscoverScreen.tsx`)
   - **Malta Flag Header** with gradient background
   - **10 Filter Chips** (scrollable):
     - All Pets, Dogs, Cats, Breeding, Adoption, Verified, Puppies, Pharaoh Hounds, Maltese Dogs, Local Breeders
   - **Tinder-Style Swipe Cards:**
     - Pet photo (or placeholder)
     - Location badge (city, country)
     - Breeding indicator (if applicable)
     - Breed name, price
     - Health badges
     - Reputation score
   - **Action Buttons:**
     - ✕ Pass (swipe left)
     - ⭐ Super Like (swipe right)
     - ♥ Like (swipe right)
   - **Recent Matches Section:**
     - Shows matched pets as avatars
   - **Malta Pet Statistics:**
     - 96K+ Registered Dogs
     - 85K+ Pet Owners
     - 50+ Vet Clinics

2. **❤️ Favorites Tab** (`BuyerFavoritesScreen.tsx`)
   - List of all liked/saved pets
   - Filter by species, breed
   - Tap to view pet details

3. **🔔 Alerts Tab** (`BuyerAlertsScreen.tsx`)
   - Price alerts (when favorite pets drop price)
   - New litters from followed breeders
   - Shelter urgent adoption alerts
   - Heat notifications

4. **👤 Profile Tab** (`BuyerProfileScreen.tsx`)
   - Preferences (link to `BuyerPreferencesScreen`)
   - My pets (if any)
   - Settings

### Preferences Screen (`BuyerPreferencesScreen.tsx`)

**What they can set:**
- **Species:** Dogs, Cats, or Both
- **Dog Size (if Dogs/Both selected):**
  - Small (< 10kg)
  - Medium (10-25kg)
  - Large (> 25kg)
  - Any Size
- **Age Preference:**
  - Young (< 2 years)
  - Adult (2-7 years)
  - Senior (> 7 years)
  - Any Age

**Result:** Discovery feed filters based on preferences

---

## 3. 🏢 **SHELTER**

### Onboarding Flow

#### Step 1: Role Selection
- **What they see:** Same Malta flag header
- **What they select:** "Shelter" (🏢 Animal shelter with pets for adoption)
- **What happens:** Alert shows "Welcome, Shelter!"

#### Steps 2-6: Same as Buyer flow
- Add pets (animals in shelter)
- Cat health gate (if applicable)
- Heat tracker (if breeding program)
- Swipe preview

### Main Interface

**Bottom Tab Navigation (4 tabs):**

1. **🏠 Home Tab** (`ShelterHomeScreen.tsx`)
   - **Dashboard Stats:**
     - Total Animals
     - At-Risk Animals (urgent adoption needed)
     - Adopted This Month
     - Capacity (e.g., 40 animals)
   - **Quick Actions:**
     - "Send Urgent Alert" button (notifies all users in Malta)
     - Add Animal
     - View Applications
   - **Upcoming Events:**
     - Adoption appointments
     - Vet checkups

2. **🐕 Animals Tab** (`ShelterAnimalsScreen.tsx`)
   - List of all animals in shelter
   - Status filters: Available, Reserved, Adopted, At-Risk
   - Each animal shows:
     - Photo, name, breed
     - Age, gender
     - Status badge
     - Health status
   - **Actions:**
     - Add new animal
     - Edit animal details
     - Mark as adopted/reserved

3. **📋 Listings Tab** (`ShelterListingsScreen.tsx`)
   - Active adoption listings
   - Create new listing
   - Edit listing (price, availability)
   - View applications per listing

4. **👤 Profile Tab** (`ShelterProfileScreen.tsx`)
   - Shelter name, address
   - Contact info
   - Operating hours
   - Settings

---

## 4. ✅ **VETERINARIAN**

### Onboarding Flow

#### Step 1: Role Selection
- **What they see:** Same Malta flag header
- **What they select:** "Veterinarian" (✅ Vet offering verification services)
- **What happens:** Alert shows "Welcome, Veterinarian!"

#### Step 2: Vet Intro Screen (`VetIntroScreen.tsx`)
**What they fill in:**
- Clinic name
- License number
- Specialization
- Location

#### Step 3: Vet Dashboard (`VetDashboardScreen.tsx`)
- Patient management interface

### Main Interface

**Bottom Tab Navigation (3 tabs):**

1. **🏠 Home Tab** (`VetHomeScreen.tsx`)
   - **Current Status:** Placeholder screen
   - **Coming Soon Features:**
     - Patient management
     - Health certificates
     - Appointment requests
     - Vaccination reminders

2. **👨‍⚕️ Patients Tab** (`VetPatientsScreen.tsx`)
   - List of pets under their care
   - Health records
   - Certificate requests
   - Upcoming appointments

3. **👤 Profile Tab** (`VetProfileScreen.tsx`)
   - Clinic information
   - License details
   - Settings

---

## 5. 💝 **PET OWNER** (Independent)

### Onboarding Flow
**Same as Buyer/Seeker flow:**
- Role selection → "Pet Owner" (Looking for companion for your pet)
- Add pets
- Heat tracker setup (if female)
- Swipe preview

### Main Interface
**Same as Buyer interface:**
- Discover (swipe screen)
- Favorites
- Alerts
- Profile

**Key Difference:** They're primarily looking for breeding partners for their pet, not adoption.

---

## 🔄 Shared Features (All Roles)

### Navigation
- **Stack Navigation:** Handles screen transitions
- **Tab Navigation:** Bottom tabs for role-specific main screens
- **Back Navigation:** Swipe back or back button

### Common Screens
- **Pet Detail Screen** (`PetDetailScreen.tsx`):
  - Full pet information
  - Photo gallery
  - Health records
  - Contact owner button
  - Save to favorites

- **Messages Screen** (`MessagesScreen.tsx`):
  - All conversations
  - Filter by role (breeder, buyer, shelter)
  - Unread badges

- **Chat Thread Screen** (`ChatThreadScreen.tsx`):
  - Individual conversation
  - Real-time messaging
  - Image sharing
  - Mark as read

---

## 📊 Database Schema Impact

### User Table (`users`)
**Fields populated per role:**
- **Breeder:** `role`, `kennel_name`, `full_name`, `city`, `country`
- **Buyer/Seeker:** `role`, `preferred_species`, `preferred_dog_size`, `preferred_age`, `full_name`
- **Shelter:** `role`, `shelter_name`, `full_name`, `city`, `country`
- **Vet:** `role`, `clinic_name`, `full_name`, `city`, `country`

### Pets Table (`pets`)
- Created during onboarding or via "Add Pet"
- Linked to owner via `owner_id`
- Status: `available`, `stud_available`, `in_heat`, `adopted`, `at_risk`

### Listings Table (`listings`)
- Created by breeders (litter announcements)
- Created by shelters (adoption listings)
- Type: `litter_announcement`, `adoption`, `stud`

### Heat Cycles Table (`heat_cycles`)
- Created when female pet in heat
- Tracked via `BreederHeatTrackingScreen`
- Used for breeding matchmaking

---

## 🎯 Key Workflows

### Breeding Workflow (Breeder)
1. Add female pet → Set heat status
2. System notifies nearby stud owners
3. Stud owner responds → Breeder accepts
4. Breeding happens → Litter announced
5. Buyer swipes on litter → Saves to favorites
6. Buyer contacts breeder → Purchase

### Adoption Workflow (Shelter → Buyer)
1. Shelter adds animal → Creates listing
2. Buyer swipes → Likes animal
3. Buyer views details → Contacts shelter
4. Shelter reviews application → Approves
5. Adoption completed → Status updated

### Verification Workflow (Vet)
1. Owner requests health certificate
2. Vet examines pet → Issues certificate
3. Certificate uploaded → Pet gets health badge
4. Pet becomes more attractive to buyers

---

## 🔐 Authentication Flow Summary

1. **New User:**
   - Sign Up → Email/Password
   - Role Selection Screen (shown automatically)
   - Onboarding Flow (role-specific)
   - Main App

2. **Returning User:**
   - Sign In → Supabase checks session
   - If role exists → Skip onboarding → Main App
   - If no role → Show Role Selection → Onboarding

3. **Demo Mode:**
   - If Supabase keys missing → Show onboarding flow
   - No database connection required

---

## 📱 Screen Hierarchy

```
App.tsx
├── OnboardingFlow (if no role)
│   ├── RoleSelectScreen
│   ├── PetQuickAddScreen
│   ├── CatHealthGateScreen (if cats)
│   ├── HeatTrackerScreen
│   ├── SwipePreviewScreen
│   └── DashboardScreen
│
└── AppNavigator (if has role)
    ├── BuyerTabs (if buyer/seeker)
    │   ├── Discover (BuyerSwipeDiscoverScreen)
    │   ├── Favorites
    │   ├── Alerts
    │   └── Profile
    │
    ├── BreederTabs (if breeder)
    │   ├── Home
    │   ├── My Pets
    │   ├── Matches
    │   └── Profile
    │
    ├── ShelterTabs (if shelter)
    │   ├── Home
    │   ├── Animals
    │   ├── Listings
    │   └── Profile
    │
    └── VetTabs (if vet)
        ├── Home
        ├── Patients
        └── Profile
```

---

## 🎨 Design Elements

### Color Schemes Per Role
- **Buyer/Seeker:** Yellow/Primary (#FFC700)
- **Breeder:** Blue (#2F80ED)
- **Shelter:** Green (#34C759)
- **Vet:** Purple (#8E44AD)

### Common UI Elements
- Malta flag header (🇲🇹) on main screens
- Gradient backgrounds (purple-blue)
- Filter chips (horizontal scrollable)
- Health badges (✅ Vet-Verified, 🧬 DNA, etc.)
- Location badges (city, country)
- Breeding indicators
- Reputation scores

---

This is the complete user journey breakdown for PawMatch Malta!
