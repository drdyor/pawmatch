-- PawMatch Firebase/Supabase Schema
-- Optimized for Independent Owner breeding matches

-- ==========================================
-- USERS & PROFILES
-- ==========================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  location TEXT, -- "Valletta", "Sliema", "Gozo", etc.
  avatar_url TEXT,
  
  -- Role (emphasized: independent_owner)
  role TEXT NOT NULL CHECK (role IN (
    'independent_owner',  -- ⭐ NEW! Casual pet owner wanting to breed once
    'breeder_professional', -- Registered kennel
    'buyer',              -- Looking to adopt/buy
    'shelter',            -- Animal rescue
    'vet'                 -- Veterinarian
  )),
  
  -- Independent Owner specific
  breeding_intent TEXT CHECK (breeding_intent IN (
    'one_time',      -- Just want puppies once
    'occasional',    -- Maybe 2-3 litters
    'experienced'    -- Have bred before
  )),
  
  -- Breeder specific
  kennel_name TEXT,
  registration_number TEXT,
  years_experience INTEGER,
  
  -- Preferences
  preferred_arrangement TEXT CHECK (preferred_arrangement IN (
    'share_puppies',  -- Split the litter
    'pick_of_litter', -- You get first pick
    'stud_fee',       -- Pay/receive fee
    'flexible'        -- Open to discussion
  )),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PETS
-- ==========================================

CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat')),
  breed TEXT NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female')),
  date_of_birth DATE,
  
  -- Physical traits
  size TEXT CHECK (size IN ('small', 'medium', 'large', 'giant')),
  weight_kg DECIMAL(5,2),
  color TEXT,
  
  -- Temperament (multiple chips)
  temperament TEXT[], -- ['friendly', 'energetic', 'calm', 'playful', 'protective']
  
  -- Health
  health_status TEXT DEFAULT 'healthy',
  vaccinated BOOLEAN DEFAULT false,
  spayed_neutered BOOLEAN DEFAULT false,
  health_issues TEXT[],
  vet_verified BOOLEAN DEFAULT false,
  
  -- Health certifications
  dna_tested BOOLEAN DEFAULT false,
  hip_score TEXT, -- 'A', 'B', 'C', etc.
  genetic_conditions TEXT[],
  
  -- Breeding status
  available_for_breeding BOOLEAN DEFAULT false,
  breeding_history INTEGER DEFAULT 0, -- Number of previous litters
  proven_parent BOOLEAN DEFAULT false,
  
  -- For studs
  stud_fee_eur DECIMAL(10,2),
  stud_terms TEXT,
  
  -- Photos
  photos TEXT[], -- Array of URLs
  primary_photo TEXT,
  
  -- Bio
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast breeding searches
CREATE INDEX idx_pets_breeding ON pets(species, breed, sex, available_for_breeding)
WHERE available_for_breeding = true;

-- ==========================================
-- HEAT TRACKING (Flo for Dogs!)
-- ==========================================

CREATE TABLE heat_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  
  -- Cycle dates
  start_date DATE NOT NULL,
  end_date DATE, -- Usually ~21 days after start
  
  -- Fertile window (typically days 8-14)
  fertile_start DATE, -- Auto-calculated: start_date + 7 days
  fertile_end DATE,   -- Auto-calculated: start_date + 14 days
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  
  -- Matchmaking
  matchmaking_enabled BOOLEAN DEFAULT false,
  looking_for_breeds TEXT[], -- Preferred breeds for matching
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to auto-calculate fertile window
CREATE OR REPLACE FUNCTION calculate_fertile_window()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fertile_start := NEW.start_date + INTERVAL '7 days';
  NEW.fertile_end := NEW.start_date + INTERVAL '14 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_fertile_window
BEFORE INSERT OR UPDATE ON heat_cycles
FOR EACH ROW
EXECUTE FUNCTION calculate_fertile_window();

-- ==========================================
-- MATCHING & SWIPING
-- ==========================================

CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swiper_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right', 'up')),
  -- left = pass
  -- right = interested
  -- up = super interested
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(swiper_id, swiped_pet_id)
);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- The two pets that matched
  pet_a_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  pet_b_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  
  -- Their owners
  owner_a_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  owner_b_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Match details
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Just matched
    'chatting',     -- Discussing arrangements
    'arranged',     -- Terms agreed
    'breeding',     -- In process
    'pregnant',     -- Expecting puppies
    'completed',    -- Puppies born
    'cancelled'     -- Didn't work out
  )),
  
  -- Arrangement (agreed terms)
  arrangement_type TEXT CHECK (arrangement_type IN (
    'share_puppies',  -- Split litter 50/50
    'pick_of_litter', -- One owner gets first pick
    'stud_fee',       -- Payment involved
    'custom'          -- Custom arrangement
  )),
  arrangement_details TEXT,
  stud_fee_agreed_eur DECIMAL(10,2),
  
  -- Expected outcome
  expected_puppies INTEGER,
  expected_birth_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(pet_a_id, pet_b_id)
);

-- ==========================================
-- LITTERS & PUPPIES
-- ==========================================

CREATE TABLE litters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  
  -- Parents
  mother_id UUID REFERENCES pets(id),
  father_id UUID REFERENCES pets(id),
  
  -- Litter details
  birth_date DATE,
  number_of_puppies INTEGER,
  puppies_available INTEGER,
  
  -- Status
  status TEXT DEFAULT 'expected' CHECK (status IN (
    'expected',   -- Pregnant
    'born',       -- Puppies born
    'ready',      -- Ready for homes (8+ weeks)
    'all_placed'  -- All puppies placed
  )),
  
  -- Pricing (if selling extras)
  price_per_puppy_eur DECIMAL(10,2),
  deposit_eur DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE puppies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  litter_id UUID REFERENCES litters(id) ON DELETE CASCADE,
  
  -- Puppy info
  name TEXT,
  sex TEXT CHECK (sex IN ('male', 'female')),
  color TEXT,
  weight_kg DECIMAL(5,2),
  
  -- Status
  status TEXT DEFAULT 'available' CHECK (status IN (
    'available',    -- Looking for home
    'reserved',     -- Deposit paid
    'allocated',    -- Going to owner A or B per arrangement
    'placed'        -- Has new home
  )),
  
  -- Who gets this puppy
  allocated_to UUID REFERENCES profiles(id),
  
  photos TEXT[],
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- MESSAGES
-- ==========================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  
  participant_a_id UUID REFERENCES profiles(id),
  participant_b_id UUID REFERENCES profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(participant_a_id, participant_b_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  
  content TEXT NOT NULL,
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast message retrieval
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);

-- ==========================================
-- COMMUNITY FEATURES
-- ==========================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  photos TEXT[],
  
  post_type TEXT CHECK (post_type IN (
    'general',      -- General discussion
    'advice',       -- Asking for advice
    'success',      -- Success story
    'announcement'  -- Litter announcement
  )),
  
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN (
    'match',              -- New match!
    'message',            -- New message
    'heat_fertile',       -- Your pet entered fertile window
    'litter_announced',   -- New litter matching preferences
    'arrangement_update', -- Match status changed
    'puppy_ready'        -- Puppies ready for pickup
  )),
  
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  
  data JSONB, -- Extra data (pet_id, match_id, etc.)
  
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_pets_species_breed ON pets(species, breed);
CREATE INDEX idx_heat_cycles_pet ON heat_cycles(pet_id);
CREATE INDEX idx_heat_cycles_fertile ON heat_cycles(start_date, fertile_start, fertile_end)
WHERE matchmaking_enabled = true;
CREATE INDEX idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX idx_matches_owners ON matches(owner_a_id, owner_b_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE heat_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update their own
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Pets: Public read, owner write
CREATE POLICY "Anyone can view pets" ON pets FOR SELECT USING (true);
CREATE POLICY "Owners can manage their pets" ON pets FOR ALL USING (auth.uid() = owner_id);

-- Heat cycles: Owner only
CREATE POLICY "Owners can manage heat cycles" ON heat_cycles FOR ALL 
USING (auth.uid() = (SELECT owner_id FROM pets WHERE id = pet_id));

-- Swipes: Own swipes only
CREATE POLICY "Users can manage own swipes" ON swipes FOR ALL USING (auth.uid() = swiper_id);

-- Matches: Participants can view/update
CREATE POLICY "Participants can view matches" ON matches FOR SELECT 
USING (auth.uid() IN (owner_a_id, owner_b_id));

-- Messages: Conversation participants only
CREATE POLICY "Participants can view messages" ON messages FOR SELECT
USING (auth.uid() IN (
  SELECT participant_a_id FROM conversations WHERE id = conversation_id
  UNION
  SELECT participant_b_id FROM conversations WHERE id = conversation_id
));

-- Notifications: Own notifications only
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT 
USING (auth.uid() = user_id);

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function to create a match when mutual swipe
CREATE OR REPLACE FUNCTION check_for_match()
RETURNS TRIGGER AS $$
DECLARE
  other_pet_owner_id UUID;
  mutual_swipe_exists BOOLEAN;
BEGIN
  -- Only for right swipes
  IF NEW.direction != 'right' THEN
    RETURN NEW;
  END IF;
  
  -- Get the owner of the swiped pet
  SELECT owner_id INTO other_pet_owner_id FROM pets WHERE id = NEW.swiped_pet_id;
  
  -- Check if other owner also swiped right on our pet
  SELECT EXISTS(
    SELECT 1 FROM swipes s
    JOIN pets p ON s.swiper_id = p.owner_id
    WHERE s.swiper_id = other_pet_owner_id
    AND s.swiped_pet_id IN (SELECT id FROM pets WHERE owner_id = NEW.swiper_id)
    AND s.direction = 'right'
  ) INTO mutual_swipe_exists;
  
  -- Create match if mutual
  IF mutual_swipe_exists THEN
    INSERT INTO matches (pet_a_id, pet_b_id, owner_a_id, owner_b_id)
    VALUES (
      (SELECT id FROM pets WHERE owner_id = NEW.swiper_id LIMIT 1),
      NEW.swiped_pet_id,
      NEW.swiper_id,
      other_pet_owner_id
    )
    ON CONFLICT DO NOTHING;
    
    -- Send notifications to both users
    INSERT INTO notifications (user_id, type, title, body)
    VALUES 
      (NEW.swiper_id, 'match', 'It''s a Match! 🎉', 'You matched with a breeding partner!'),
      (other_pet_owner_id, 'match', 'It''s a Match! 🎉', 'You matched with a breeding partner!');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_match_on_swipe
AFTER INSERT ON swipes
FOR EACH ROW
EXECUTE FUNCTION check_for_match();

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE profiles IS 'User profiles with role and breeding preferences';
COMMENT ON TABLE pets IS 'Pet profiles with breeding availability';
COMMENT ON TABLE heat_cycles IS 'Heat cycle tracking (Flo for dogs)';
COMMENT ON TABLE matches IS 'Breeding matches between pets';
COMMENT ON TABLE swipes IS 'Tinder-style swipes on pet profiles';
COMMENT ON TABLE litters IS 'Expected and born litters';
COMMENT ON TABLE puppies IS 'Individual puppies from litters';

COMMENT ON COLUMN profiles.role IS 'independent_owner = casual pet owner (emphasized!)';
COMMENT ON COLUMN profiles.preferred_arrangement IS 'Default arrangement preference';
COMMENT ON COLUMN matches.arrangement_type IS 'Agreed breeding arrangement';
COMMENT ON COLUMN heat_cycles.matchmaking_enabled IS 'Enable auto-matching during fertile window';
