-- ============================================
-- PAWMATCH FRESH DATABASE SETUP
-- For brand new Supabase projects
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE USERS TABLE (from scratch)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
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
-- CREATE PETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
-- CREATE HEALTH RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('vaccination', 'test', 'certificate', 'checkup')),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  vet_name TEXT,
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE HEAT CYCLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.heat_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
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
-- CREATE LISTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- ============================================
-- CREATE MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('litter_alert', 'price_alert', 'shelter_urgent', 'vet_reminder', 'message', 'match', 'heat_notification')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE CONTRACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  litter_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  breeder_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- ============================================
-- CREATE STUD INTERESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.stud_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heat_cycle_id UUID REFERENCES public.heat_cycles(id) ON DELETE CASCADE,
  female_pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  stud_pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  stud_owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'interested', 'declined')) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pets_owner ON public.pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_pets_status ON public.pets(status);
CREATE INDEX IF NOT EXISTS idx_pets_species ON public.pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_size ON public.pets(size);
CREATE INDEX IF NOT EXISTS idx_pets_at_risk ON public.pets(status) WHERE status = 'at_risk';
CREATE INDEX IF NOT EXISTS idx_listings_owner ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_type ON public.listings(type);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_pet ON public.health_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_heat_cycles_pet ON public.heat_cycles(pet_id);
CREATE INDEX IF NOT EXISTS idx_stud_interests_heat_cycle ON public.stud_interests(heat_cycle_id);
CREATE INDEX IF NOT EXISTS idx_users_preferences ON public.users(preferred_species, preferred_dog_size, preferred_age);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heat_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stud_interests ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES (if any)
-- ============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view other profiles" ON public.users;
DROP POLICY IF EXISTS "Anyone can view pets" ON public.pets;
DROP POLICY IF EXISTS "Owners can insert pets" ON public.pets;
DROP POLICY IF EXISTS "Owners can update pets" ON public.pets;
DROP POLICY IF EXISTS "Owners can delete pets" ON public.pets;
DROP POLICY IF EXISTS "Anyone can view live listings" ON public.listings;
DROP POLICY IF EXISTS "Owners can manage listings" ON public.listings;
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update notifications" ON public.notifications;
DROP POLICY IF EXISTS "Owners can manage heat cycles" ON public.heat_cycles;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view other profiles" ON public.users 
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Pets policies
CREATE POLICY "Anyone can view pets" ON public.pets 
  FOR SELECT USING (TRUE);

CREATE POLICY "Owners can insert pets" ON public.pets 
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update pets" ON public.pets 
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete pets" ON public.pets 
  FOR DELETE USING (auth.uid() = owner_id);

-- Listings policies
CREATE POLICY "Anyone can view live listings" ON public.listings 
  FOR SELECT USING (status = 'live' OR owner_id = auth.uid());

CREATE POLICY "Owners can insert listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update listings" ON public.listings
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete listings" ON public.listings
  FOR DELETE USING (auth.uid() = owner_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON public.messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON public.notifications 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update notifications" ON public.notifications 
  FOR UPDATE USING (auth.uid() = user_id);

-- Heat cycles policies
CREATE POLICY "Owners can manage heat cycles" ON public.heat_cycles 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = heat_cycles.pet_id 
      AND pets.owner_id = auth.uid()
    )
  );

-- Health records policies
CREATE POLICY "Owners can view health records" ON public.health_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE pets.id = health_records.pet_id
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage health records" ON public.health_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE pets.id = health_records.pet_id
      AND pets.owner_id = auth.uid()
    )
  );

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
DROP POLICY IF EXISTS "Anyone can view pet photos" ON storage.objects;
CREATE POLICY "Anyone can view pet photos" ON storage.objects 
  FOR SELECT USING (bucket_id = 'pet-photos');

DROP POLICY IF EXISTS "Authenticated users can upload pet photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload pet photos" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'pet-photos' 
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
CREATE POLICY "Users can update their own photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'pet-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'pet-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

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

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pets_updated_at ON public.pets;
CREATE TRIGGER update_pets_updated_at 
  BEFORE UPDATE ON public.pets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_listings_updated_at ON public.listings;
CREATE TRIGGER update_listings_updated_at 
  BEFORE UPDATE ON public.listings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set adopted_at when status changes to adopted
CREATE OR REPLACE FUNCTION set_adopted_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'adopted' AND (OLD.status IS NULL OR OLD.status != 'adopted') THEN
    NEW.adopted_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pets_adopted_trigger ON public.pets;
CREATE TRIGGER pets_adopted_trigger
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION set_adopted_timestamp();

-- ============================================
-- SUCCESS! Database is ready 🎉
-- ============================================

-- Verify tables were created
SELECT 
  schemaname,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
