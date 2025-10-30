-- ============================================
-- COMPREHENSIVE BREEDS DATABASE
-- Dog breeds with size variants + temperament tags
-- Cat breeds with personality traits
-- Run this in Supabase after main schema
-- ============================================

-- Create breeds table
CREATE TABLE IF NOT EXISTS breeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat')),
  base_name TEXT NOT NULL,
  size_variant TEXT CHECK (size_variant IN ('teacup', 'toy', 'miniature', 'small', 'medium', 'large', 'giant')),
  full_name TEXT NOT NULL,
  weight_min DECIMAL(5,2),
  weight_max DECIMAL(5,2),
  height_min INTEGER,
  height_max INTEGER,
  temperament_tags TEXT[],
  energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  care_level TEXT CHECK (care_level IN ('low', 'medium', 'high')),
  hypoallergenic BOOLEAN DEFAULT FALSE,
  good_with_kids BOOLEAN DEFAULT TRUE,
  good_with_pets BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast searching
CREATE INDEX idx_breeds_species ON breeds(species);
CREATE INDEX idx_breeds_full_name ON breeds(full_name);
CREATE INDEX idx_breeds_base_name ON breeds(base_name);
CREATE INDEX idx_breeds_size_variant ON breeds(size_variant);

-- ============================================
-- DOG BREEDS - TEACUP (≤ 4 lbs)
-- ============================================
INSERT INTO breeds (species, base_name, size_variant, full_name, weight_min, weight_max, height_min, height_max, temperament_tags, energy_level, hypoallergenic) VALUES
('dog', 'Chihuahua', 'teacup', 'Teacup Chihuahua', 1.5, 4, 6, 9, ARRAY['Affectionate', 'Alert', 'Feisty'], 'medium', false),
('dog', 'Poodle', 'teacup', 'Teacup Poodle', 2, 4, 7, 9, ARRAY['Intelligent', 'Trainable', 'Friendly'], 'medium', true),
('dog', 'Yorkshire Terrier', 'teacup', 'Teacup Yorkie', 2, 4, 6, 9, ARRAY['Bold', 'Loyal', 'Energetic'], 'high', false),
('dog', 'Pug', 'teacup', 'Teacup Pug', 2, 4, 8, 10, ARRAY['Calm', 'Loving', 'Low-energy'], 'low', false),
('dog', 'Maltese', 'teacup', 'Teacup Maltese', 2, 4, 7, 9, ARRAY['Gentle', 'Playful', 'Affectionate'], 'medium', true);

-- ============================================
-- DOG BREEDS - TOY (≤ 10 lbs)
-- ============================================
INSERT INTO breeds (species, base_name, size_variant, full_name, weight_min, weight_max, height_min, height_max, temperament_tags, energy_level, hypoallergenic) VALUES
('dog', 'Chihuahua', 'toy', 'Chihuahua', 4, 10, 9, 12, ARRAY['Alert', 'Feisty', 'Loyal'], 'medium', false),
('dog', 'Pomeranian', 'toy', 'Pomeranian', 4, 8, 8, 12, ARRAY['Bold', 'Energetic', 'Fluffy'], 'high', false),
('dog', 'Yorkshire Terrier', 'toy', 'Yorkshire Terrier', 4, 7, 8, 12, ARRAY['Confident', 'Affectionate', 'Feisty'], 'high', false),
('dog', 'Shih Tzu', 'toy', 'Shih Tzu', 9, 16, 9, 12, ARRAY['Loving', 'Friendly', 'Low-exercise'], 'low', false),
('dog', 'Maltese', 'toy', 'Maltese', 4, 7, 8, 10, ARRAY['Gentle', 'Playful', 'Lap dog'], 'medium', true),
('dog', 'Papillon', 'toy', 'Papillon', 5, 10, 8, 11, ARRAY['Smart', 'Alert', 'Trainable'], 'high', false),
('dog', 'Poodle', 'toy', 'Toy Poodle', 6, 9, 9, 11, ARRAY['Intelligent', 'Hypoallergenic', 'Active'], 'high', true);

-- ============================================
-- DOG BREEDS - MINIATURE (10-20 lbs)
-- ============================================
INSERT INTO breeds (species, base_name, size_variant, full_name, weight_min, weight_max, height_min, height_max, temperament_tags, energy_level, hypoallergenic, good_with_kids) VALUES
('dog', 'Dachshund', 'miniature', 'Miniature Dachshund', 8, 11, 5, 7, ARRAY['Curious', 'Stubborn', 'Brave'], 'medium', false, true),
('dog', 'Poodle', 'miniature', 'Miniature Poodle', 15, 17, 11, 15, ARRAY['Smart', 'Active', 'Hypoallergenic'], 'high', true, true),
('dog', 'Schnauzer', 'miniature', 'Miniature Schnauzer', 11, 20, 12, 14, ARRAY['Alert', 'Friendly', 'Trainable'], 'high', true, true),
('dog', 'Pinscher', 'miniature', 'Miniature Pinscher', 8, 10, 10, 13, ARRAY['Bold', 'Energetic', 'Confident'], 'high', false, false),
('dog', 'Cavalier King Charles Spaniel', NULL, 'Cavalier King Charles Spaniel', 13, 18, 12, 13, ARRAY['Affectionate', 'Gentle', 'Family-friendly'], 'medium', false, true),
('dog', 'Bichon Frise', NULL, 'Bichon Frise', 12, 18, 9, 12, ARRAY['Cheerful', 'Playful', 'Hypoallergenic'], 'medium', true, true);

-- ============================================
-- DOG BREEDS - SMALL (20-30 lbs)
-- ============================================
INSERT INTO breeds (species, base_name, size_variant, full_name, weight_min, weight_max, height_min, height_max, temperament_tags, energy_level, good_with_kids, good_with_pets) VALUES
('dog', 'Beagle', 'small', 'Beagle', 20, 30, 13, 16, ARRAY['Friendly', 'Curious', 'Vocal'], 'high', true, true),
('dog', 'French Bulldog', 'small', 'French Bulldog', 20, 28, 11, 13, ARRAY['Calm', 'Affectionate', 'Low-energy'], 'low', true, true),
('dog', 'Boston Terrier', 'small', 'Boston Terrier', 12, 25, 15, 17, ARRAY['Friendly', 'Smart', 'Goofy'], 'medium', true, true),
('dog', 'Cocker Spaniel', 'small', 'Cocker Spaniel', 20, 30, 13, 16, ARRAY['Gentle', 'Playful', 'Trainable'], 'medium', true, true),
('dog', 'Shetland Sheepdog', 'small', 'Shetland Sheepdog', 15, 25, 13, 16, ARRAY['Smart', 'Loyal', 'Energetic'], 'high', true, true),
('dog', 'Scottish Terrier', 'small', 'Scottish Terrier', 18, 22, 10, 11, ARRAY['Independent', 'Bold', 'Dignified'], 'medium', true, false);

-- ============================================
-- DOG BREEDS - MEDIUM (30-60 lbs)
-- ============================================
INSERT INTO breeds (species, base_name, size_variant, full_name, weight_min, weight_max, height_min, height_max, temperament_tags, energy_level, care_level, good_with_kids) VALUES
('dog', 'Border Collie', 'medium', 'Border Collie', 30, 55, 18, 22, ARRAY['Brilliant', 'Energetic', 'Work-driven'], 'high', 'medium', true),
('dog', 'Australian Shepherd', 'medium', 'Australian Shepherd', 40, 65, 18, 23, ARRAY['Loyal', 'Smart', 'High-energy'], 'high', 'medium', true),
('dog', 'Bulldog', 'medium', 'Bulldog', 40, 50, 14, 15, ARRAY['Calm', 'Stubborn', 'Affectionate'], 'low', 'medium', true),
('dog', 'Chow Chow', 'medium', 'Chow Chow', 45, 70, 17, 20, ARRAY['Aloof', 'Loyal', 'Independent'], 'medium', 'high', false),
('dog', 'Dalmatian', 'medium', 'Dalmatian', 45, 70, 19, 24, ARRAY['Energetic', 'Playful', 'Needs exercise'], 'high', 'low', true),
('dog', 'Standard Schnauzer', 'medium', 'Standard Schnauzer', 35, 50, 17, 20, ARRAY['Alert', 'Trainable', 'Protective'], 'high', 'medium', true),
('dog', 'Portuguese Water Dog', 'medium', 'Portuguese Water Dog', 35, 60, 17, 23, ARRAY['Active', 'Smart', 'Hypoallergenic'], 'high', 'high', true);

-- ============================================
-- DOG BREEDS - LARGE (60-100 lbs)
-- ============================================
INSERT INTO breeds (species, base_name, size_variant, full_name, weight_min, weight_max, height_min, height_max, temperament_tags, energy_level, good_with_kids, good_with_pets) VALUES
('dog', 'Labrador Retriever', 'large', 'Labrador Retriever', 55, 80, 21, 25, ARRAY['Friendly', 'Loyal', 'Trainable'], 'high', true, true),
('dog', 'German Shepherd', 'large', 'German Shepherd', 50, 90, 22, 26, ARRAY['Protective', 'Smart', 'Loyal'], 'high', true, true),
('dog', 'Golden Retriever', 'large', 'Golden Retriever', 55, 75, 21, 24, ARRAY['Gentle', 'Friendly', 'Family dog'], 'high', true, true),
('dog', 'Rottweiler', 'large', 'Rottweiler', 80, 135, 22, 27, ARRAY['Protective', 'Confident', 'Calm'], 'medium', true, false),
('dog', 'Doberman', 'large', 'Doberman', 60, 100, 24, 28, ARRAY['Alert', 'Loyal', 'Fast'], 'high', true, false),
('dog', 'Siberian Husky', 'large', 'Siberian Husky', 35, 60, 20, 24, ARRAY['Independent', 'Energetic', 'Vocal'], 'high', false, false),
('dog', 'Alaskan Malamute', 'large', 'Alaskan Malamute', 75, 100, 23, 26, ARRAY['Strong', 'Independent', 'Pack-oriented'], 'high', true, false);

-- ============================================
-- DOG BREEDS - GIANT (100+ lbs)
-- ============================================
INSERT INTO breeds (species, base_name, size_variant, full_name, weight_min, weight_max, height_min, height_max, temperament_tags, energy_level, care_level, good_with_kids) VALUES
('dog', 'Great Dane', 'giant', 'Great Dane', 110, 175, 28, 34, ARRAY['Gentle', 'Calm', 'Friendly'], 'medium', 'low', true),
('dog', 'Saint Bernard', 'giant', 'Saint Bernard', 120, 180, 26, 30, ARRAY['Gentle', 'Patient', 'Rescue instinct'], 'low', 'high', true),
('dog', 'Mastiff', 'giant', 'Mastiff', 120, 230, 27, 36, ARRAY['Calm', 'Protective', 'Low-energy'], 'low', 'low', true),
('dog', 'Newfoundland', 'giant', 'Newfoundland', 100, 150, 26, 28, ARRAY['Sweet', 'Water-loving', 'Gentle'], 'medium', 'high', true),
('dog', 'Irish Wolfhound', 'giant', 'Irish Wolfhound', 105, 180, 30, 35, ARRAY['Quiet', 'Gentle', 'Dignified'], 'medium', 'low', true),
('dog', 'Leonberger', 'giant', 'Leonberger', 90, 170, 26, 32, ARRAY['Playful', 'Loyal', 'Family-oriented'], 'medium', 'high', true);

-- ============================================
-- CAT BREEDS
-- ============================================
INSERT INTO breeds (species, base_name, size_variant, full_name, weight_min, weight_max, temperament_tags, energy_level, care_level, hypoallergenic) VALUES
('cat', 'Persian', NULL, 'Persian', 7, 12, ARRAY['Calm', 'Affectionate', 'Quiet'], 'low', 'high', false),
('cat', 'Maine Coon', NULL, 'Maine Coon', 10, 25, ARRAY['Friendly', 'Playful', 'Gentle giant'], 'medium', 'medium', false),
('cat', 'British Shorthair', NULL, 'British Shorthair', 9, 18, ARRAY['Calm', 'Independent', 'Easygoing'], 'low', 'low', false),
('cat', 'Siamese', NULL, 'Siamese', 8, 15, ARRAY['Vocal', 'Social', 'Intelligent'], 'high', 'low', false),
('cat', 'Ragdoll', NULL, 'Ragdoll', 10, 20, ARRAY['Docile', 'Affectionate', 'Lap cat'], 'low', 'medium', false),
('cat', 'Bengal', NULL, 'Bengal', 8, 15, ARRAY['Energetic', 'Playful', 'Athletic'], 'high', 'low', false),
('cat', 'Sphynx', NULL, 'Sphynx', 6, 12, ARRAY['Affectionate', 'Energetic', 'Warm-seeking'], 'high', 'high', true),
('cat', 'Russian Blue', NULL, 'Russian Blue', 7, 15, ARRAY['Quiet', 'Gentle', 'Reserved'], 'low', 'low', false);

-- ============================================
-- MIXED BREEDS
-- ============================================
INSERT INTO breeds (species, base_name, size_variant, full_name, weight_min, weight_max, temperament_tags, energy_level) VALUES
('dog', 'Mixed Breed', 'small', 'Small Mixed Breed', 10, 30, ARRAY['Varies'], 'medium'),
('dog', 'Mixed Breed', 'medium', 'Medium Mixed Breed', 30, 60, ARRAY['Varies'], 'medium'),
('dog', 'Mixed Breed', 'large', 'Large Mixed Breed', 60, 100, ARRAY['Varies'], 'medium'),
('cat', 'Mixed Breed', NULL, 'Mixed Breed Cat', 6, 15, ARRAY['Varies'], 'medium');

-- ============================================
-- ENABLE PUBLIC READ
-- ============================================
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view breeds" ON breeds
  FOR SELECT USING (TRUE);

-- ============================================
-- COMPLETE! 50+ breed variants ready
-- ============================================
-- Summary:
-- - 7 Teacup variants
-- - 8 Toy breeds
-- - 6 Miniature breeds
-- - 6 Small breeds
-- - 7 Medium breeds
-- - 7 Large breeds
-- - 6 Giant breeds
-- - 8 Cat breeds
-- - 4 Mixed breeds
-- Total: 55+ breed entries with variants
