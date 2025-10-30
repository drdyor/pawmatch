# PawMatch Database Setup (Supabase)

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Name: `PawMatch`
4. Database Password: Choose a strong password (save it!)
5. Region: Choose **Europe (Frankfurt)** or closest to Malta
6. Click "Create new project" (takes ~2 minutes)

## 2. Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values to your `.env` file:
   - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
   - `anon public` key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 3. Run Database SQL

In Supabase dashboard, go to **SQL Editor** → **New query**, paste and run this:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('breeder_registered', 'breeder_independent', 'buyer', 'shelter', 'vet')),
  full_name TEXT NOT NULL,
  phone_number TEXT,
  city TEXT,
  country TEXT DEFAULT 'Malta',
  kennel_name TEXT,
  shelter_name TEXT,
  clinic_name TEXT,
  is_first_time_breeder BOOLEAN DEFAULT FALSE,
  profile_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_role TEXT NOT NULL,
  name TEXT NOT NULL,
  species TEXT CHECK (species IN ('dog', 'cat', 'other')),
  breed TEXT NOT NULL,
  sex TEXT CHECK (sex IN ('male', 'female')),
  date_of_birth DATE,
  weight DECIMAL(5,2),
  photos TEXT[],
  status TEXT CHECK (status IN ('available', 'reserved', 'adopted', 'stud_available', 'in_heat')),
  city TEXT,
  country TEXT DEFAULT 'Malta',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Records table
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('vaccination', 'test', 'certificate', 'checkup')),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  vet_name TEXT,
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Heat Cycles table
CREATE TABLE heat_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  cycle_day INTEGER DEFAULT 1,
  cycle_length INTEGER DEFAULT 21,
  fertile_window_start DATE,
  fertile_window_end DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_role TEXT NOT NULL,
  type TEXT CHECK (type IN ('adoption', 'stud', 'litter_announcement')),
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER DEFAULT 0, -- in EUR cents
  deposit INTEGER, -- in EUR cents
  status TEXT CHECK (status IN ('draft', 'live', 'reserved', 'closed')),
  city TEXT,
  country TEXT DEFAULT 'Malta',
  photos TEXT[],
  available_date DATE,
  pups_available INTEGER,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('litter_alert', 'price_alert', 'shelter_urgent', 'vet_reminder', 'message', 'match')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contracts table
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  litter_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  breeder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('draft', 'sent', 'signed', 'completed')),
  price_eur INTEGER NOT NULL, -- in cents
  deposit_eur INTEGER NOT NULL, -- in cents
  health_guarantee_days INTEGER DEFAULT 14,
  delivery_city TEXT,
  pdf_url TEXT,
  breeder_signature_name TEXT,
  breeder_signature_date TIMESTAMP WITH TIME ZONE,
  buyer_signature_name TEXT,
  buyer_signature_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_health_records_pet ON health_records(pet_id);
CREATE INDEX idx_heat_cycles_pet ON heat_cycles(pet_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE heat_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view other profiles (public data)" ON users FOR SELECT USING (TRUE);

-- RLS Policies for pets table
CREATE POLICY "Anyone can view pets" ON pets FOR SELECT USING (TRUE);
CREATE POLICY "Owners can insert pets" ON pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update pets" ON pets FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete pets" ON pets FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for listings table
CREATE POLICY "Anyone can view live listings" ON listings FOR SELECT USING (status = 'live' OR owner_id = auth.uid());
CREATE POLICY "Owners can insert listings" ON listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update listings" ON listings FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete listings" ON listings FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for messages table
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Storage bucket for pet photos
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-photos', 'pet-photos', TRUE);
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', FALSE);
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', FALSE);

-- Storage policies
CREATE POLICY "Anyone can view pet photos" ON storage.objects FOR SELECT USING (bucket_id = 'pet-photos');
CREATE POLICY "Authenticated users can upload pet photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pet-photos' AND auth.role() = 'authenticated');
```

## 4. Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Turn **OFF** "Confirm email" for testing (turn it back ON for production)

## 5. Test Data (Optional)

You can add test data by running this SQL:

```sql
-- This will be available after you create your first user through the app
-- You can manually insert test listings, pets, etc. here
```

## Done!

Your database is ready! Now add your API keys to `.env` and start the app.
