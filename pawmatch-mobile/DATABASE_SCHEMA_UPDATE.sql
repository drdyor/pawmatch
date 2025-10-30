-- Add columns for buyer preferences to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_species TEXT CHECK (preferred_species IN ('dog', 'cat', 'both'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_dog_size TEXT CHECK (preferred_dog_size IN ('small', 'medium', 'large', 'any'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_age TEXT CHECK (preferred_age IN ('young', 'adult', 'senior', 'any'));

-- Add size column to pets table for filtering
ALTER TABLE pets ADD COLUMN IF NOT EXISTS size TEXT CHECK (size IN ('small', 'medium', 'large'));

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_preferences ON users(preferred_species, preferred_dog_size, preferred_age);
CREATE INDEX IF NOT EXISTS idx_pets_size ON pets(size);

-- Add notifications_sent flag to heat_cycles
ALTER TABLE heat_cycles ADD COLUMN IF NOT EXISTS notifications_sent BOOLEAN DEFAULT FALSE;

-- Create stud_interests table for tracking stud notifications
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

CREATE INDEX IF NOT EXISTS idx_stud_interests_heat_cycle ON stud_interests(heat_cycle_id);
CREATE INDEX IF NOT EXISTS idx_stud_interests_stud_owner ON stud_interests(stud_owner_id);

-- RLS for stud_interests
ALTER TABLE stud_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their stud interests" ON stud_interests
  FOR SELECT USING (auth.uid() = stud_owner_id OR auth.uid() IN (
    SELECT owner_id FROM pets WHERE id = female_pet_id
  ));

CREATE POLICY "Female owners can create stud interests" ON stud_interests
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT owner_id FROM pets WHERE id = female_pet_id
  ));

CREATE POLICY "Stud owners can update their interests" ON stud_interests
  FOR UPDATE USING (auth.uid() = stud_owner_id);
