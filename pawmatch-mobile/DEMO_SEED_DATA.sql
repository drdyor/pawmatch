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

-- DEMO 4: Anna Grech - Independent Breeder (Labradors)
INSERT INTO users (id, email, role, full_name, city, country, is_first_time_breeder, phone_number)
VALUES (
  'REPLACE_WITH_ANNA_UUID',
  'anna.breeder@demo.com',
  'breeder_independent',
  'Anna Grech',
  'Mdina',
  'Malta',
  false,
  '+35621345678'
) ON CONFLICT (id) DO NOTHING;

-- DEMO 5: Mark Spiteri - Independent Breeder (German Shepherds)
INSERT INTO users (id, email, role, full_name, city, country, is_first_time_breeder, phone_number)
VALUES (
  'REPLACE_WITH_MARK_UUID',
  'mark.breeder@demo.com',
  'breeder_independent',
  'Mark Spiteri',
  'Rabat',
  'Malta',
  false,
  '+35621456789'
) ON CONFLICT (id) DO NOTHING;

-- DEMO 6: Claire Muscat - Independent Breeder (French Bulldogs)
INSERT INTO users (id, email, role, full_name, city, country, is_first_time_breeder, phone_number)
VALUES (
  'REPLACE_WITH_CLAIRE_UUID',
  'claire.breeder@demo.com',
  'breeder_independent',
  'Claire Muscat',
  'Naxxar',
  'Malta',
  true,
  '+35621567890'
) ON CONFLICT (id) DO NOTHING;

-- DEMO 7: Robert Vella - Independent Breeder (Yorkshire Terriers)
INSERT INTO users (id, email, role, full_name, city, country, is_first_time_breeder, phone_number)
VALUES (
  'REPLACE_WITH_ROBERT_UUID',
  'robert.breeder@demo.com',
  'breeder_independent',
  'Robert Vella',
  'Mosta',
  'Malta',
  false,
  '+35621678901'
) ON CONFLICT (id) DO NOTHING;

-- DEMO 8: Animal Welfare Malta - Shelter
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

-- DEMO 9: Dr. Borg - Vet
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

-- DEMO 10: Sarah - Buyer
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
-- DEMO PETS - TOTAL: 25 dogs across 6 breeders
-- ============================================

-- ============================================
-- MARIA'S GOLDEN RETRIEVERS (4 dogs)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_MARIA_UUID', 'breeder_registered', 'Luna', 'dog', 'Golden Retriever', 'female', '2021-03-15', 28.5, 'large', 'in_heat', 'Valletta', 'Malta', 'Beautiful golden with excellent temperament. Hip scored, DNA clear.', ARRAY['/assets/demo/golden-retriever-1.jpg']),
  ('REPLACE_WITH_MARIA_UUID', 'breeder_registered', 'Max', 'dog', 'Golden Retriever', 'male', '2019-07-22', 32.0, 'large', 'stud_available', 'Valletta', 'Malta', 'Champion bloodline. Proven stud with 5 successful litters.', ARRAY['/assets/demo/golden-retriever-2.jpg']),
  ('REPLACE_WITH_MARIA_UUID', 'breeder_registered', 'Sunny', 'dog', 'Golden Retriever', 'female', '2022-01-10', 26.0, 'large', 'available', 'Valletta', 'Malta', 'Young show quality bitch. Ready for breeding at 18 months.', ARRAY['/assets/demo/golden-retriever-3.jpg']),
  ('REPLACE_WITH_MARIA_UUID', 'breeder_registered', 'Rex', 'dog', 'Golden Retriever', 'male', '2020-08-15', 30.5, 'large', 'stud_available', 'Valletta', 'Malta', 'AKC champion. Excellent working line pedigree.', ARRAY['/assets/demo/golden-retriever-4.jpg']);

-- ============================================
-- JOHN'S MALTESE (4 dogs)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_JOHN_UUID', 'breeder_independent', 'Bella', 'dog', 'Maltese', 'female', '2020-05-10', 3.5, 'small', 'available', 'Sliema', 'Malta', 'First-time breeding. Sweet temperament, hypoallergenic.', ARRAY['/assets/demo/maltese-1.jpg']),
  ('REPLACE_WITH_JOHN_UUID', 'breeder_independent', 'Charlie', 'dog', 'Maltese', 'male', '2019-12-01', 4.0, 'small', 'stud_available', 'Sliema', 'Malta', 'Beautiful white coat, excellent health.', ARRAY['/assets/demo/maltese-2.jpg']),
  ('REPLACE_WITH_JOHN_UUID', 'breeder_independent', 'Coco', 'dog', 'Maltese', 'female', '2021-07-20', 3.8, 'small', 'available', 'Sliema', 'Malta', 'Toy size, perfect for shows. Bichon-type coat.', ARRAY['/assets/demo/maltese-3.jpg']),
  ('REPLACE_WITH_JOHN_UUID', 'breeder_independent', 'Prince', 'dog', 'Maltese', 'male', '2020-03-12', 3.9, 'small', 'stud_available', 'Sliema', 'Malta', 'Champion quality. Multiple best in show wins.', ARRAY['/assets/demo/maltese-4.jpg']);

-- ============================================
-- SOPHIE'S POODLES (3 dogs - International)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_SOPHIE_UUID', 'breeder_registered', 'Princess', 'dog', 'Miniature Poodle', 'female', '2020-08-20', 7.0, 'miniature', 'available', 'London', 'United Kingdom', 'KC registered, health tested, hypoallergenic.', ARRAY['/assets/demo/poodle-1.jpg']),
  ('REPLACE_WITH_SOPHIE_UUID', 'breeder_registered', 'Dior', 'dog', 'Miniature Poodle', 'male', '2019-11-05', 7.5, 'miniature', 'stud_available', 'London', 'United Kingdom', 'AKC champion. Perfect grooming and temperament.', ARRAY['/assets/demo/poodle-2.jpg']),
  ('REPLACE_WITH_SOPHIE_UUID', 'breeder_registered', 'Chanel', 'dog', 'Miniature Poodle', 'female', '2021-04-18', 6.8, 'miniature', 'available', 'London', 'United Kingdom', 'Toy/miniature cross. Excellent show quality.', ARRAY['/assets/demo/poodle-3.jpg']);

-- ============================================
-- ANNA'S LABRADORS (4 dogs)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_ANNA_UUID', 'breeder_independent', 'Buddy', 'dog', 'Labrador Retriever', 'male', '2020-06-15', 29.5, 'large', 'stud_available', 'Mdina', 'Malta', 'Working line Labrador. Excellent hunting companion.', ARRAY['/assets/demo/labrador-1.jpg']),
  ('REPLACE_WITH_ANNA_UUID', 'breeder_independent', 'Daisy', 'dog', 'Labrador Retriever', 'female', '2021-02-28', 27.0, 'large', 'available', 'Mdina', 'Malta', 'Show line with champion pedigree. Golden coat.', ARRAY['/assets/demo/labrador-2.jpg']),
  ('REPLACE_WITH_ANNA_UUID', 'breeder_independent', 'Max', 'dog', 'Labrador Retriever', 'male', '2019-09-10', 31.0, 'large', 'stud_available', 'Mdina', 'Malta', 'Field champion. Proven hunting and show dog.', ARRAY['/assets/demo/labrador-3.jpg']),
  ('REPLACE_WITH_ANNA_UUID', 'breeder_independent', 'Lucy', 'dog', 'Labrador Retriever', 'female', '2022-01-05', 26.5, 'large', 'available', 'Mdina', 'Malta', 'Young bitch ready for training. Black coat.', ARRAY['/assets/demo/labrador-4.jpg']);

-- ============================================
-- MARK'S GERMAN SHEPHERDS (4 dogs)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_MARK_UUID', 'breeder_independent', 'Zeus', 'dog', 'German Shepherd Dog', 'male', '2020-04-12', 35.0, 'large', 'stud_available', 'Rabat', 'Malta', 'Working line GSD. Schutzhund trained.', ARRAY['/assets/demo/german-shepherd-1.jpg']),
  ('REPLACE_WITH_MARK_UUID', 'breeder_independent', 'Athena', 'dog', 'German Shepherd Dog', 'female', '2021-07-08', 32.0, 'large', 'available', 'Rabat', 'Malta', 'Show line with excellent conformation.', ARRAY['/assets/demo/german-shepherd-2.jpg']),
  ('REPLACE_WITH_MARK_UUID', 'breeder_independent', 'Bruno', 'dog', 'German Shepherd Dog', 'male', '2019-11-20', 36.5, 'large', 'stud_available', 'Rabat', 'Malta', 'Multiple champion titles. Police dog line.', ARRAY['/assets/demo/german-shepherd-3.jpg']),
  ('REPLACE_WITH_MARK_UUID', 'breeder_independent', 'Luna', 'dog', 'German Shepherd Dog', 'female', '2022-03-15', 31.0, 'large', 'available', 'Rabat', 'Malta', 'Young bitch with promising show potential.', ARRAY['/assets/demo/german-shepherd-4.jpg']);

-- ============================================
-- CLAIRE'S FRENCH BULLDOGS (3 dogs)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_CLAIRE_UUID', 'breeder_independent', 'Pierre', 'dog', 'French Bulldog', 'male', '2021-05-22', 10.5, 'small', 'stud_available', 'Naxxar', 'Malta', 'First-time breeder. Beautiful brindle coat.', ARRAY['/assets/demo/french-bulldog-1.jpg']),
  ('REPLACE_WITH_CLAIRE_UUID', 'breeder_independent', 'Coco', 'dog', 'French Bulldog', 'female', '2020-12-10', 11.0, 'small', 'available', 'Naxxar', 'Malta', 'Cream coat, perfect companion dog.', ARRAY['/assets/demo/french-bulldog-2.jpg']),
  ('REPLACE_WITH_CLAIRE_UUID', 'breeder_independent', 'Rex', 'dog', 'French Bulldog', 'male', '2022-08-30', 9.8, 'small', 'available', 'Naxxar', 'Malta', 'Young puppy. Fawn coat with white markings.', ARRAY['/assets/demo/french-bulldog-3.jpg']);

-- ============================================
-- ROBERT'S YORKSHIRE TERRIERS (3 dogs)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_ROBERT_UUID', 'breeder_independent', 'Teddy', 'dog', 'Yorkshire Terrier', 'male', '2021-09-14', 2.8, 'small', 'stud_available', 'Mosta', 'Malta', 'AKC champion. Perfect silky coat.', ARRAY['/assets/demo/yorkshire-terrier-1.jpg']),
  ('REPLACE_WITH_ROBERT_UUID', 'breeder_independent', 'Bella', 'dog', 'Yorkshire Terrier', 'female', '2020-11-25', 3.0, 'small', 'available', 'Mosta', 'Malta', 'Bichon-type coat. Excellent temperament.', ARRAY['/assets/demo/yorkshire-terrier-2.jpg']),
  ('REPLACE_WITH_ROBERT_UUID', 'breeder_independent', 'Max', 'dog', 'Yorkshire Terrier', 'male', '2022-06-18', 2.5, 'small', 'available', 'Mosta', 'Malta', 'Young puppy. Golden coat, very playful.', ARRAY['/assets/demo/yorkshire-terrier-3.jpg']);

-- ============================================
-- SHELTER ANIMALS (3 mixed breeds)
-- ============================================
INSERT INTO pets (owner_id, owner_role, name, species, breed, sex, date_of_birth, weight, size, status, city, country, description, photos)
VALUES
  ('REPLACE_WITH_SHELTER_UUID', 'shelter', 'Rocky', 'dog', 'Mixed Breed', 'male', '2022-01-15', 15.0, 'medium', 'available', 'Marsa', 'Malta', 'Friendly rescue dog, great with kids. Neutered and vaccinated.', ARRAY['/assets/demo/mixed-breed-1.jpg']),
  ('REPLACE_WITH_SHELTER_UUID', 'shelter', 'Mia', 'cat', 'Mixed Breed Cat', 'female', '2021-06-10', 4.5, NULL, 'available', 'Marsa', 'Malta', 'Sweet tabby cat, indoor only. Spayed and up to date on vaccines.', ARRAY['/assets/demo/cat-1.jpg']),
  ('REPLACE_WITH_SHELTER_UUID', 'shelter', 'Duke', 'dog', 'Large Mixed Breed', 'male', '2020-11-20', 25.0, 'large', 'at_risk', 'Marsa', 'Malta', 'Urgent: Needs home within 72 hours. Gentle giant, loves people.', ARRAY['/assets/demo/mixed-breed-2.jpg']);

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
-- DEMO LISTINGS FOR NEW BREEDERS
-- ============================================

-- Anna's Labrador Stud Service
INSERT INTO listings (owner_id, pet_id, owner_role, type, title, description, price, status, city, country, photos)
SELECT
  'REPLACE_WITH_ANNA_UUID',
  id,
  'breeder_independent',
  'stud',
  'Labrador Stud - Buddy',
  'Working line Labrador available for stud service. Proven hunting dog with excellent temperament.',
  75000, -- €750
  'live',
  'Mdina',
  'Malta',
  ARRAY['/assets/demo/labrador-1.jpg']
FROM pets WHERE name = 'Buddy';

-- Mark's German Shepherd Stud
INSERT INTO listings (owner_id, pet_id, owner_role, type, title, description, price, status, city, country, photos)
SELECT
  'REPLACE_WITH_MARK_UUID',
  id,
  'breeder_independent',
  'stud',
  'German Shepherd Stud - Zeus',
  'Working line GSD, Schutzhund trained. Excellent pedigree for working or show dogs.',
  100000, -- €1000
  'live',
  'Rabat',
  'Malta',
  ARRAY['/assets/demo/german-shepherd-1.jpg']
FROM pets WHERE name = 'Zeus';

-- Claire's French Bulldog Puppies
INSERT INTO listings (owner_id, pet_id, owner_role, type, title, description, price, deposit, status, city, country, available_date, pups_available, photos)
SELECT
  'REPLACE_WITH_CLAIRE_UUID',
  id,
  'breeder_independent',
  'litter_announcement',
  'French Bulldog Puppies Available Soon',
  'First litter from Pierre and Coco. Brindle and fawn colors available. Health guaranteed.',
  200000, -- €2000
  50000,  -- €500 deposit
  'live',
  'Naxxar',
  'Malta',
  CURRENT_DATE + INTERVAL '60 days',
  4,
  ARRAY['/assets/demo/french-bulldog-1.jpg']
FROM pets WHERE name = 'Pierre';

-- ============================================
-- COMPLETE! Expanded demo data ready for testing
-- ============================================
-- TOTAL: 25 dogs across 6 breeders + shelter animals
--
-- REGISTERED BREEDERS (2):
-- maria.breeder@demo.com / Demo123! - Golden Retrievers (4 dogs)
-- sophie.breeder@demo.com / Demo123! - Poodles (3 dogs)
--
-- INDEPENDENT BREEDERS (4):
-- john.breeder@demo.com / Demo123! - Maltese (4 dogs)
-- anna.breeder@demo.com / Demo123! - Labradors (4 dogs)
-- mark.breeder@demo.com / Demo123! - German Shepherds (4 dogs)
-- claire.breeder@demo.com / Demo123! - French Bulldogs (3 dogs)
-- robert.breeder@demo.com / Demo123! - Yorkshire Terriers (3 dogs)
--
-- OTHER ACCOUNTS:
-- shelter@demo.com / Demo123! - Animal Welfare Malta
-- vet@demo.com / Demo123! - Dr. Joseph Borg
-- buyer@demo.com / Demo123! - Sarah Farrugia
