-- ============================================
-- PAWMATCH COMPLETE DATABASE SETUP
-- Copy this entire file and run in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
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
  
  -- Buyer adoption preferences
  preferred_species TEXT CHECK (preferred_species IN ('dog', 'cat', 'both')),
  preferred_dog_size TEXT CHECK (preferred_dog_size IN ('small', 'medium', 'large', 'any')),
  preferred_age TEXT CHECK (preferred_age IN ('young', 'adult', 'senior', 'any')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PETS TABLE
-- ============================================
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

-- ============================================
-- HEALTH RECORDS TABLE
-- ============================================
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

-- ============================================
-- HEAT CYCLES TABLE
-- ============================================
CREATE TABLE heat_cycles (
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

-- ============================================
-- LISTINGS TABLE
-- ============================================
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

-- ============================================
-- MESSAGES TABLE
-- ============================================
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

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('litter_alert', 'price_alert', 'shelter_urgent', 'vet_reminder', 'message', 'match', 'heat_notification')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONTRACTS TABLE
-- ============================================
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

-- ============================================
-- STUD INTERESTS TABLE
-- ============================================
CREATE TABLE stud_interests (
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
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_size ON pets(size);
CREATE INDEX idx_pets_at_risk ON pets(status) WHERE status = 'at_risk';
CREATE INDEX idx_pets_adopted ON pets(adopted_at);

CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_type ON listings(type);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);

CREATE INDEX idx_health_records_pet ON health_records(pet_id);

CREATE INDEX idx_heat_cycles_pet ON heat_cycles(pet_id);

CREATE INDEX idx_stud_interests_heat_cycle ON stud_interests(heat_cycle_id);
CREATE INDEX idx_stud_interests_stud_owner ON stud_interests(stud_owner_id);

CREATE INDEX idx_users_preferences ON users(preferred_species, preferred_dog_size, preferred_age);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
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
-- RLS POLICIES - USERS
-- ============================================
CREATE POLICY "Users can view their own profile" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view other profiles (public data)" ON users 
  FOR SELECT USING (TRUE);

-- ============================================
-- RLS POLICIES - PETS
-- ============================================
CREATE POLICY "Anyone can view pets" ON pets 
  FOR SELECT USING (TRUE);

CREATE POLICY "Owners can insert pets" ON pets 
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update pets" ON pets 
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete pets" ON pets 
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================
-- RLS POLICIES - LISTINGS
-- ============================================
CREATE POLICY "Anyone can view live listings" ON listings 
  FOR SELECT USING (status = 'live' OR owner_id = auth.uid());

CREATE POLICY "Owners can insert listings" ON listings 
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update listings" ON listings 
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete listings" ON listings 
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================
-- RLS POLICIES - MESSAGES
-- ============================================
CREATE POLICY "Users can view their messages" ON messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- RLS POLICIES - NOTIFICATIONS
-- ============================================
CREATE POLICY "Users can view their notifications" ON notifications 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications 
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES - HEAT CYCLES
-- ============================================
CREATE POLICY "Owners can manage heat cycles" ON heat_cycles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = heat_cycles.pet_id
      AND pets.owner_id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - STUD INTERESTS
-- ============================================
CREATE POLICY "Users can view their stud interests" ON stud_interests
  FOR SELECT USING (
    auth.uid() = stud_owner_id OR 
    auth.uid() IN (SELECT owner_id FROM pets WHERE id = female_pet_id)
  );

CREATE POLICY "Female owners can create stud interests" ON stud_interests
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT owner_id FROM pets WHERE id = female_pet_id)
  );

CREATE POLICY "Stud owners can update their interests" ON stud_interests
  FOR UPDATE USING (auth.uid() = stud_owner_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pet-photos', 'pet-photos', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts', 'contracts', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================
CREATE POLICY "Anyone can view pet photos" ON storage.objects 
  FOR SELECT USING (bucket_id = 'pet-photos');

CREATE POLICY "Authenticated users can upload pet photos" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'pet-photos' AND auth.role() = 'authenticated');

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set adopted_at when status changes to adopted
CREATE OR REPLACE FUNCTION set_adopted_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'adopted' AND OLD.status != 'adopted' THEN
    NEW.adopted_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pets_adopted_trigger
  BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION set_adopted_timestamp();

-- ============================================
-- DONE! Database is ready for PawMatch
-- ============================================
