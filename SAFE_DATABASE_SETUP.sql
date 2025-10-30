-- ============================================
-- PAWMATCH SAFE DATABASE SETUP
-- This version won't error if tables already exist
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADD COLUMNS TO EXISTING USERS TABLE
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Malta';
ALTER TABLE users ADD COLUMN IF NOT EXISTS kennel_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS shelter_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS clinic_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_first_time_breeder BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_species TEXT CHECK (preferred_species IN ('dog', 'cat', 'both'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_dog_size TEXT CHECK (preferred_dog_size IN ('small', 'medium', 'large', 'any'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_age TEXT CHECK (preferred_age IN ('young', 'adult', 'senior', 'any'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add role column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
    ALTER TABLE users ADD COLUMN role TEXT CHECK (role IN ('breeder_registered', 'breeder_independent', 'buyer', 'shelter', 'vet'));
  END IF;
END $$;

-- ============================================
-- CREATE OTHER TABLES (IF NOT EXISTS)
-- ============================================

CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_role TEXT NOT NULL,
  name TEXT NOT NULL,
  species TEXT CHECK (species IN ('dog', 'cat', 'other')),
  breed TEXT NOT NULL,
  sex TEXT CHECK (sex IN ('male', 'female')),
  date_of_birth DATE,
  weight DECIMAL(5,2),
  size TEXT CHECK (size IN ('small', 'medium', 'large')),
  photos TEXT[],
  status TEXT CHECK (status IN ('available', 'reserved', 'adopted', 'stud_available', 'in_heat', 'at_risk')),
  city TEXT,
  country TEXT DEFAULT 'Malta',
  description TEXT,
  adopted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_records (
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

CREATE TABLE IF NOT EXISTS heat_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  cycle_day INTEGER DEFAULT 1,
  cycle_length INTEGER DEFAULT 21,
  fertile_window_start DATE,
  fertile_window_end DATE,
  notes TEXT,
  notifications_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_role TEXT NOT NULL,
  type TEXT CHECK (type IN ('adoption', 'stud', 'litter_announcement')),
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER DEFAULT 0,
  deposit INTEGER,
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

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('litter_alert', 'price_alert', 'shelter_urgent', 'vet_reminder', 'message', 'match', 'heat_notification')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  litter_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  breeder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('draft', 'sent', 'signed', 'completed')),
  price_eur INTEGER NOT NULL,
  deposit_eur INTEGER NOT NULL,
  health_guarantee_days INTEGER DEFAULT 14,
  delivery_city TEXT,
  pdf_url TEXT,
  breeder_signature_name TEXT,
  breeder_signature_date TIMESTAMP WITH TIME ZONE,
  buyer_signature_name TEXT,
  buyer_signature_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stud_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heat_cycle_id UUID REFERENCES heat_cycles(id) ON DELETE CASCADE,
  female_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  stud_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  stud_owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'interested', 'declined')) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES (IF NOT EXISTS)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pets_owner ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_pets_status ON pets(status);
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_size ON pets(size);
CREATE INDEX IF NOT EXISTS idx_pets_at_risk ON pets(status) WHERE status = 'at_risk';
CREATE INDEX IF NOT EXISTS idx_listings_owner ON listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_pet ON health_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_heat_cycles_pet ON heat_cycles(pet_id);
CREATE INDEX IF NOT EXISTS idx_stud_interests_heat_cycle ON stud_interests(heat_cycle_id);
CREATE INDEX IF NOT EXISTS idx_users_preferences ON users(preferred_species, preferred_dog_size, preferred_age);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE heat_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stud_interests ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (DROP IF EXISTS, THEN CREATE)
-- ============================================

-- Users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view other profiles" ON users;
CREATE POLICY "Users can view other profiles" ON users FOR SELECT USING (TRUE);

-- Pets policies
DROP POLICY IF EXISTS "Anyone can view pets" ON pets;
CREATE POLICY "Anyone can view pets" ON pets FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Owners can insert pets" ON pets;
CREATE POLICY "Owners can insert pets" ON pets FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can update pets" ON pets;
CREATE POLICY "Owners can update pets" ON pets FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete pets" ON pets;
CREATE POLICY "Owners can delete pets" ON pets FOR DELETE USING (auth.uid() = owner_id);

-- Listings policies
DROP POLICY IF EXISTS "Anyone can view live listings" ON listings;
CREATE POLICY "Anyone can view live listings" ON listings FOR SELECT USING (status = 'live' OR owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can manage listings" ON listings;
CREATE POLICY "Owners can manage listings" ON listings FOR ALL USING (auth.uid() = owner_id);

-- Messages policies
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update notifications" ON notifications;
CREATE POLICY "Users can update notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Heat cycles policies
DROP POLICY IF EXISTS "Owners can manage heat cycles" ON heat_cycles;
CREATE POLICY "Owners can manage heat cycles" ON heat_cycles FOR ALL USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = heat_cycles.pet_id AND pets.owner_id = auth.uid())
);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-photos', 'pet-photos', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', FALSE) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', FALSE) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pets_updated_at ON pets;
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUCCESS! Database is ready
-- ============================================
