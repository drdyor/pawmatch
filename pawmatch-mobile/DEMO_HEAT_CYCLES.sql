-- Demo Heat Cycle Data for Testing
-- This creates realistic heat cycle data for female dogs with breed-specific variations

-- Insert demo heat cycles for existing female pets
-- Note: Replace pet IDs with actual IDs from your pets table

-- Small breeds (tend to have cycles every 4-6 months, earlier first heat)
INSERT INTO heat_cycles (
  id,
  pet_id,
  heat_start_date,
  estimated_ovulation,
  fertile_window_start,
  fertile_window_end,
  notes,
  created_at,
  updated_at
) VALUES 
-- Maltese (small breed - cycles every 4-5 months)
('demo-heat-1', 'demo-pet-maltese-1', '2024-09-15', '2024-09-24', '2024-09-22', '2024-09-28', 'First heat cycle, light bleeding', NOW(), NOW()),
('demo-heat-2', 'demo-pet-maltese-1', '2024-05-10', '2024-05-19', '2024-05-17', '2024-05-23', 'Regular cycle, good appetite', NOW(), NOW()),

-- Yorkshire Terrier (small breed - cycles every 4-6 months)
('demo-heat-3', 'demo-pet-yorkie-1', '2024-10-01', '2024-10-10', '2024-10-08', '2024-10-14', 'Active during heat, normal behavior', NOW(), NOW()),
('demo-heat-4', 'demo-pet-yorkie-2', '2024-08-20', '2024-08-29', '2024-08-27', '2024-09-02', 'Second heat cycle, more pronounced', NOW(), NOW()),

-- Medium breeds (cycles every 5-7 months)
-- Border Collie (medium breed - cycles every 6 months typically)
('demo-heat-5', 'demo-pet-collie-1', '2024-09-05', '2024-09-14', '2024-09-12', '2024-09-18', 'Very active breed, high energy during heat', NOW(), NOW()),
('demo-heat-6', 'demo-pet-collie-1', '2024-03-05', '2024-03-14', '2024-03-12', '2024-03-18', 'Previous cycle, bred successfully', NOW(), NOW()),

-- Australian Shepherd (medium breed)
('demo-heat-7', 'demo-pet-aussie-1', '2024-10-10', '2024-10-19', '2024-10-17', '2024-10-23', 'Working breed, maintained activity level', NOW(), NOW()),

-- Large breeds (cycles every 6-8 months, later first heat)
-- German Shepherd (large breed - cycles every 6-8 months)
('demo-heat-8', 'demo-pet-gsd-1', '2024-08-01', '2024-08-10', '2024-08-08', '2024-08-14', 'Large breed, mature at 18 months', NOW(), NOW()),
('demo-heat-9', 'demo-pet-gsd-2', '2024-09-20', '2024-09-29', '2024-09-27', '2024-10-03', 'Strong heat signs, good breeding candidate', NOW(), NOW()),

-- Golden Retriever (large breed)
('demo-heat-10', 'demo-pet-golden-1', '2024-07-15', '2024-07-24', '2024-07-22', '2024-07-28', 'Gentle temperament, easy heat cycle', NOW(), NOW()),
('demo-heat-11', 'demo-pet-golden-2', '2024-10-05', '2024-10-14', '2024-10-12', '2024-10-18', 'Third heat cycle, very regular', NOW(), NOW()),

-- Labrador (large breed)
('demo-heat-12', 'demo-pet-lab-1', '2024-09-01', '2024-09-10', '2024-09-08', '2024-09-14', 'Active breed, swimming during heat', NOW(), NOW()),
('demo-heat-13', 'demo-pet-lab-2', '2024-08-10', '2024-08-19', '2024-08-17', '2024-08-23', 'Chocolate lab, regular 6-month cycle', NOW(), NOW()),

-- Giant breeds (cycles every 8-12 months, very late first heat)
-- Great Dane would cycle every 8-10 months
-- Saint Bernard would cycle every 10-12 months

-- Recent/Current heat cycles for testing notifications
('demo-heat-current-1', 'demo-pet-collie-2', '2024-11-01', '2024-11-10', '2024-11-08', '2024-11-14', 'Currently in fertile window!', NOW(), NOW()),
('demo-heat-current-2', 'demo-pet-golden-3', '2024-10-28', '2024-11-06', '2024-11-04', '2024-11-10', 'Peak fertility this week', NOW(), NOW());

-- Breed-specific heat cycle information
CREATE TABLE IF NOT EXISTS breed_heat_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breed_name VARCHAR(100) NOT NULL,
  size_category VARCHAR(20) NOT NULL, -- small, medium, large, giant
  first_heat_age_months_min INTEGER NOT NULL,
  first_heat_age_months_max INTEGER NOT NULL,
  cycle_frequency_months_min INTEGER NOT NULL,
  cycle_frequency_months_max INTEGER NOT NULL,
  heat_duration_days_min INTEGER NOT NULL,
  heat_duration_days_max INTEGER NOT NULL,
  fertile_window_start_day INTEGER NOT NULL, -- Days after heat start
  fertile_window_duration_days INTEGER NOT NULL,
  breeding_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert breed-specific heat information
INSERT INTO breed_heat_info (
  breed_name, size_category, 
  first_heat_age_months_min, first_heat_age_months_max,
  cycle_frequency_months_min, cycle_frequency_months_max,
  heat_duration_days_min, heat_duration_days_max,
  fertile_window_start_day, fertile_window_duration_days,
  breeding_notes
) VALUES 
-- Small breeds (6-25 lbs)
('Maltese', 'small', 4, 8, 4, 6, 18, 24, 9, 6, 'Small breeds mature early. Watch for silent heats. May need assistance during breeding.'),
('Yorkshire Terrier', 'small', 4, 8, 4, 6, 18, 24, 9, 6, 'Toy breeds can have irregular cycles. Monitor weight during pregnancy.'),
('Chihuahua', 'small', 4, 8, 4, 6, 18, 24, 9, 6, 'Smallest breed. C-sections often needed. Breed only mature females.'),
('Pomeranian', 'small', 4, 8, 4, 6, 18, 24, 9, 6, 'Spitz breed. Double coat affects heat detection. Regular grooming important.'),

-- Medium breeds (25-60 lbs)
('Border Collie', 'medium', 6, 12, 5, 7, 18, 24, 9, 6, 'Highly intelligent working breed. Maintain mental stimulation during heat.'),
('Australian Shepherd', 'medium', 6, 12, 5, 7, 18, 24, 9, 6, 'Herding breed. May show nesting behavior. Good mothers typically.'),
('Cocker Spaniel', 'medium', 6, 12, 5, 7, 18, 24, 9, 6, 'Sporting breed. Regular ear cleaning important during heat cycles.'),
('Beagle', 'medium', 6, 12, 5, 7, 18, 24, 9, 6, 'Hound breed. May be more vocal during heat. Pack animals, social.'),

-- Large breeds (60-90 lbs)
('German Shepherd', 'large', 8, 14, 6, 8, 21, 28, 10, 7, 'Working breed. Hip/elbow screening before breeding. Strong protective instincts.'),
('Golden Retriever', 'large', 8, 14, 6, 8, 21, 28, 10, 7, 'Sporting breed. Gentle temperament. Screen for hip dysplasia and eye issues.'),
('Labrador Retriever', 'large', 8, 14, 6, 8, 21, 28, 10, 7, 'Most popular breed. High energy. Screen for hip/elbow dysplasia, eye issues.'),
('Rottweiler', 'large', 8, 14, 6, 8, 21, 28, 10, 7, 'Guardian breed. Strong, protective. Careful socialization of puppies important.'),

-- Giant breeds (90+ lbs)
('Great Dane', 'giant', 12, 18, 8, 12, 21, 28, 11, 7, 'Giant breed. Very late maturity. Bloat risk. Short lifespan - breed early.'),
('Saint Bernard', 'giant', 12, 18, 10, 12, 21, 28, 11, 7, 'Giant breed. Cold weather adapted. Large litters common. Hip screening essential.'),
('Mastiff', 'giant', 12, 18, 8, 12, 21, 28, 11, 7, 'Ancient breed. Gentle giants. Short muzzle - monitor breathing during heat.'),

-- Mixed breeds (estimate based on size)
('Mixed Breed', 'medium', 6, 12, 5, 8, 18, 28, 9, 7, 'Varies by mix. Hybrid vigor often present. Assess based on dominant breed characteristics.');

-- Demo breeding matches and messages
CREATE TABLE IF NOT EXISTS demo_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  female_pet_id VARCHAR(50) NOT NULL,
  male_pet_id VARCHAR(50) NOT NULL,
  match_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, bred
  arrangement VARCHAR(50), -- pick_of_litter, split_puppies, stud_fee
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert demo matches for testing messaging
INSERT INTO demo_matches (female_pet_id, male_pet_id, status, arrangement) VALUES
('demo-pet-collie-2', 'demo-pet-collie-male-1', 'accepted', 'pick_of_litter'),
('demo-pet-golden-3', 'demo-pet-golden-male-1', 'pending', 'stud_fee'),
('demo-pet-gsd-1', 'demo-pet-gsd-male-1', 'accepted', 'split_puppies');

-- Demo chat messages
CREATE TABLE IF NOT EXISTS demo_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES demo_matches(id),
  sender_type VARCHAR(20) NOT NULL, -- female_owner, male_owner
  message_text TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Insert demo chat messages
INSERT INTO demo_messages (match_id, sender_type, message_text, sent_at) VALUES
-- Conversation 1: Border Collie match
((SELECT id FROM demo_matches WHERE female_pet_id = 'demo-pet-collie-2' LIMIT 1), 'male_owner', 'Hi! I saw your beautiful Border Collie Luna is in heat. My Max would be a great match!', NOW() - INTERVAL '2 hours'),
((SELECT id FROM demo_matches WHERE female_pet_id = 'demo-pet-collie-2' LIMIT 1), 'female_owner', 'Hello! Max looks wonderful. Could you tell me about his health clearances?', NOW() - INTERVAL '1 hour 45 minutes'),
((SELECT id FROM demo_matches WHERE female_pet_collie-2' LIMIT 1), 'male_owner', 'Absolutely! Max has clear hip/elbow scores and recent eye clearance. DNA tested too. What arrangement works for you?', NOW() - INTERVAL '1 hour 30 minutes'),
((SELECT id FROM demo_matches WHERE female_pet_id = 'demo-pet-collie-2' LIMIT 1), 'female_owner', 'Perfect! I prefer pick of litter if that works? Luna has excellent bloodlines too.', NOW() - INTERVAL '1 hour 15 minutes'),
((SELECT id FROM demo_matches WHERE female_pet_id = 'demo-pet-collie-2' LIMIT 1), 'male_owner', 'Pick of litter sounds great! When would be best for breeding? Her fertile window is Nov 8-14 right?', NOW() - INTERVAL '1 hour'),

-- Conversation 2: Golden Retriever match  
((SELECT id FROM demo_matches WHERE female_pet_id = 'demo-pet-golden-3' LIMIT 1), 'male_owner', 'Your Golden Bella is gorgeous! Charlie is available for stud. $800 fee.', NOW() - INTERVAL '3 hours'),
((SELECT id FROM demo_matches WHERE female_pet_id = 'demo-pet-golden-3' LIMIT 1), 'female_owner', 'Thank you! Could I see Charlie''s pedigree and health testing?', NOW() - INTERVAL '2 hours 30 minutes'),

-- Conversation 3: German Shepherd match
((SELECT id FROM demo_matches WHERE female_pet_id = 'demo-pet-gsd-1' LIMIT 1), 'female_owner', 'Hi! Interested in your male for my GSD Kira. She''s day 8 of heat cycle.', NOW() - INTERVAL '4 hours'),
((SELECT id FROM demo_matches WHERE female_pet_id = 'demo-pet-gsd-1' LIMIT 1), 'male_owner', 'Great timing! Rex is proven and has excellent temperament. Split litter 50/50?', NOW() - INTERVAL '3 hours 45 minutes'),
((SELECT id FROM demo_matches WHERE female_pet_id = 'demo-pet-gsd-1' LIMIT 1), 'female_owner', 'That works perfectly! Can we meet this weekend?', NOW() - INTERVAL '3 hours 30 minutes');
