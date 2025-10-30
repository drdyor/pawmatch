-- ============================================
-- PAWMATCH DEMO SEED DATA
-- Creates demo users, pets, listings for testing
-- Run AFTER main database setup
-- ============================================

-- Note: You need to create auth users first through Supabase Dashboard or Auth API
-- These UUIDs should match real auth.users IDs
-- For testing, replace with actual UUIDs from your auth.users table

-- ============================================
-- DEMO USERS
-- ============================================
-- You'll need to create these via Supabase Auth first, then insert profiles

-- Example: Create auth users via Supabase Dashboard → Authentication → Add User
-- Email: maria.breeder@demo.com, Password: Demo123!
-- Then use the generated UUID below

-- DEMO 1: Maria - Registered Breeder (Valletta)
INSERT INTO users (id, email, role, full_name, city, country, kennel_name, phone_number)
VALUES (
  'REPLACE_WITH_MARIA_UUID',
  'maria.breeder@demo.com',
  'breeder_registered',
  'Maria Azzopardi',
  'Valletta',
  'Malta',
  'Golden Paws Malta',
  '+35621234567'
) ON CONFLICT (id) DO NOTHING;

-- DEMO 2: John - Independent Breeder (Sliema)
INSERT INTO users (id, email, role, full_name, city, country, is_first_time_breeder)
VALUES (
  'REPLACE_WITH_JOHN_UUID',
  'john.breeder@demo.com',
  'breeder_independent',
  'John Camilleri',
  'Sliema',
  'Malta',
  true
) ON CONFLICT (id) DO NOTHING;

-- DEMO 3: Sophie - International Breeder (UK)
INSERT INTO users (id, email, role, full_name, city, country, kennel_name)
VALUES (
  'REPLACE_WITH_SOPHIE_UUID',
  'sophie.breeder@demo.com',
  'breeder_registered',
  'Sophie Thompson',
  'London',
  'United Kingdom',
  'British Poodle Haven'
) ON CONFLICT (id) DO NOTHING;

-- DEMO 4: Animal Welfare Malta - Shelter
INSERT INTO users (id, email, role, full_name, city, country, shelter_name, phone_number)
VALUES (
  'REPLACE_WITH_SHELTER_UUID',
  'shelter@demo.com',
  'shelter',
  'Animal Welfare Malta',
  'Marsa',
  'Malta',
  'Animal Welfare Malta',
  '+35621999888'
) ON CONFLICT (id) DO NOTHING;

-- DEMO 5: Dr. Borg - Vet
INSERT INTO users (id, email, role, full_name, city, country, clinic_name, phone_number)
VALUES (
  'REPLACE_WITH_VET_UUID',
  'vet@demo.com',
  'vet',
  'Dr. Joseph Borg',
  'St Julians',
  'Malta',
  'PetCare Clinic Malta',
  '+35621777666'
) ON CONFLICT (id) DO NOTHING;

-- DEMO 6: Sarah - Buyer
INSERT INTO users (id, email, role, full_name, city, country, preferred_species, preferred_dog_size, preferred_age)
VALUES (
  'REPLACE_WITH_BUYER_UUID',
  'buyer@demo.com',
  'buyer',
  'Sarah Farrugia',
  'Valletta',
  'Malta',
  'dog',
  'medium',
  'young'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO PETS (Maria's Golden Retrievers)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_MARIA_UUID', 'breeder_registered', 'Luna', 'dog', 'Golden Retriever', 'female', '2021-03-15', 28.5, 'large', 'in_heat', 'Valletta', 'Malta', 'Beautiful golden with excellent temperament. Hip scored, DNA clear.', ARRAY['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800']),
  ('REPLACE_WITH_MARIA_UUID', 'breeder_registered', 'Max', 'dog', 'Golden Retriever', 'male', '2019-07-22', 32.0, 'large', 'stud_available', 'Valletta', 'Malta', 'Champion bloodline. Proven stud with 5 successful litters.', ARRAY['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800']);

-- ============================================
-- DEMO PETS (John's Maltese)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_JOHN_UUID', 'breeder_independent', 'Bella', 'dog', 'Maltese', 'female', '2020-05-10', 3.5, 'small', 'available', 'Sliema', 'Malta', 'First-time breeding. Sweet temperament, hypoallergenic.', ARRAY['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800']),
  ('REPLACE_WITH_JOHN_UUID', 'breeder_independent', 'Charlie', 'dog', 'Maltese', 'male', '2019-12-01', 4.0, 'small', 'stud_available', 'Sliema', 'Malta', 'Beautiful white coat, excellent health.', ARRAY['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800']);

-- ============================================
-- DEMO PETS (Sophie's Poodles - International)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_SOPHIE_UUID', 'breeder_registered', 'Princess', 'dog', 'Miniature Poodle', 'female', '2020-08-20', 7.0, 'miniature', 'available', 'London', 'United Kingdom', 'KC registered, health tested, hypoallergenic.', ARRAY['https://images.unsplash.com/photo-1629043463587-640d6b71281d?w=800']);

-- ============================================
-- DEMO PETS (Shelter Animals)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_SHELTER_UUID', 'shelter', 'Rocky', 'dog', 'Mixed Breed', 'male', '2022-01-15', 15.0, 'medium', 'available', 'Marsa', 'Malta', 'Friendly rescue dog, great with kids. Neutered and vaccinated.', ARRAY['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800']),
  ('REPLACE_WITH_SHELTER_UUID', 'shelter', 'Mia', 'cat', 'Mixed Breed Cat', 'female', '2021-06-10', 4.5, NULL, 'available', 'Marsa', 'Malta', 'Sweet tabby cat, indoor only. Spayed and up to date on vaccines.', ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800']),
  ('REPLACE_WITH_SHELTER_UUID', 'shelter', 'Duke', 'dog', 'Large Mixed Breed', 'male', '2020-11-20', 25.0, 'large', 'at_risk', 'Marsa', 'Malta', 'Urgent: Needs home within 72 hours. Gentle giant, loves people.', ARRAY['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800']);

-- ============================================
-- DEMO HEAT CYCLES
-- ============================================
INSERT INTO heat_cycles (pet_id, start_date, cycle_day, cycle_length, fertile_window_start, fertile_window_end)
SELECT id, CURRENT_DATE, 1, 21, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '13 days'
FROM pets WHERE name = 'Luna' AND owner_role = 'breeder_registered';

-- ============================================
-- DEMO LISTINGS
-- ============================================

-- Litter Announcement from Maria
INSERT INTO listings (owner_id, pet_id, owner_role, type, title, description, price, deposit, status, city, country, available_date, pups_available, photos)
SELECT 
  'REPLACE_WITH_MARIA_UUID',
  id,
  'breeder_registered',
  'litter_announcement',
  'Golden Retriever Puppies - Champion Bloodline',
  'Luna x Max litter. Both parents hip scored, DNA clear. Puppies will be ready for homes at 8 weeks with first vaccinations and microchip. Deposit secures your pick.',
  120000, -- €1200
  30000,  -- €300 deposit
  'live',
  'Valletta',
  'Malta',
  CURRENT_DATE + INTERVAL '45 days',
  6,
  ARRAY['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800']
FROM pets WHERE name = 'Luna';

-- Stud Listing from John
INSERT INTO listings (owner_id, pet_id, owner_role, type, title, description, price, status, city, country, photos)
SELECT 
  'REPLACE_WITH_JOHN_UUID',
  id,
  'breeder_independent',
  'stud',
  'Maltese Stud - Charlie',
  'Beautiful white Maltese available for stud service. Proven breeder, excellent temperament. Stud fee includes return service if needed.',
  50000, -- €500
  'live',
  'Sliema',
  'Malta',
  ARRAY['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800']
FROM pets WHERE name = 'Charlie';

-- Shelter Adoption
INSERT INTO listings (owner_id, pet_id, owner_role, type, title, description, price, status, city, country, photos)
SELECT 
  'REPLACE_WITH_SHELTER_UUID',
  id,
  'shelter',
  'adoption',
  'Rocky - Loving Mixed Breed Looking for Forever Home',
  'Rocky is a wonderful dog who deserves a loving family. He's great with children, house-trained, and loves walks. Adoption fee covers neutering and vaccinations.',
  5000, -- €50 adoption fee
  'live',
  'Marsa',
  'Malta',
  ARRAY['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800']
FROM pets WHERE name = 'Rocky';

-- Urgent Shelter Adoption
INSERT INTO listings (owner_id, pet_id, owner_role, type, title, description, price, status, city, country, photos)
SELECT 
  'REPLACE_WITH_SHELTER_UUID',
  id,
  'shelter',
  'adoption',
  '🚨 URGENT: Duke Needs Home Within 72 Hours',
  'Duke is at risk due to shelter overcapacity. He's a gentle, loving dog who deserves a second chance. Adoption fee waived for qualified home.',
  0, -- Free adoption
  'live',
  'Marsa',
  'Malta',
  ARRAY['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800']
FROM pets WHERE name = 'Duke';

-- ============================================
-- DEMO HEALTH RECORDS
-- ============================================
INSERT INTO health_records (pet_id, type, title, date, vet_name)
SELECT id, 'vaccination', 'Rabies Vaccine', CURRENT_DATE - INTERVAL '6 months', 'Dr. Joseph Borg'
FROM pets WHERE name IN ('Luna', 'Max', 'Bella', 'Charlie', 'Rocky', 'Mia');

INSERT INTO health_records (pet_id, type, title, date, notes)
SELECT id, 'test', 'Hip Dysplasia Score: A/A', CURRENT_DATE - INTERVAL '3 months', 'Excellent hip health'
FROM pets WHERE name IN ('Luna', 'Max');

-- ============================================
-- COMPLETE! Demo data ready for testing
-- ============================================
-- Now you can log in with:
-- maria.breeder@demo.com / Demo123!
-- john.breeder@demo.com / Demo123!
-- sophie.breeder@demo.com / Demo123!
-- shelter@demo.com / Demo123!
-- vet@demo.com / Demo123!
-- buyer@demo.com / Demo123!
