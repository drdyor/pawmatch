-- PawMatch Community Voting Feature
-- "Vote for studs/dams you'd like to see bred!"

-- ==========================================
-- PET VOTES (Individual Pets)
-- ==========================================

CREATE TABLE pet_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Vote type
  vote_type TEXT DEFAULT 'want_puppies' CHECK (vote_type IN (
    'want_puppies',     -- "I'd love puppies from this pet!"
    'beautiful',        -- "Beautiful pet!"
    'great_temperament' -- "Amazing temperament!"
  )),
  
  -- Optional message
  message TEXT, -- "I'd love a puppy with this temperament!"
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(pet_id, voter_id, vote_type)
);

-- ==========================================
-- BREEDING PAIR VOTES
-- ==========================================

CREATE TABLE pair_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- The pair
  pet_a_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  pet_b_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  
  -- Voter
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Why they want this pair
  reason TEXT, -- "These two would make amazing puppies!"
  
  -- Commitment level
  commitment TEXT CHECK (commitment IN (
    'interested',       -- Just interested
    'very_interested',  -- Would definitely consider
    'pre_order'         -- Want to reserve a puppy NOW
  )),
  
  -- How much they'd pay
  max_price_eur DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(pet_a_id, pet_b_id, voter_id),
  CHECK(pet_a_id < pet_b_id) -- Prevent duplicates (A,B) vs (B,A)
);

-- ==========================================
-- VOTE AGGREGATES (Materialized View for Performance)
-- ==========================================

CREATE MATERIALIZED VIEW pet_vote_counts AS
SELECT 
  pet_id,
  COUNT(*) as total_votes,
  COUNT(*) FILTER (WHERE vote_type = 'want_puppies') as want_puppies_count,
  COUNT(*) FILTER (WHERE vote_type = 'beautiful') as beautiful_count,
  COUNT(*) FILTER (WHERE vote_type = 'great_temperament') as temperament_count,
  COUNT(DISTINCT voter_id) as unique_voters
FROM pet_votes
GROUP BY pet_id;

CREATE UNIQUE INDEX ON pet_vote_counts(pet_id);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_vote_counts()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY pet_vote_counts;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PAIR VOTE AGGREGATES
-- ==========================================

CREATE MATERIALIZED VIEW pair_vote_counts AS
SELECT 
  pet_a_id,
  pet_b_id,
  COUNT(*) as total_votes,
  COUNT(*) FILTER (WHERE commitment = 'pre_order') as pre_orders,
  AVG(max_price_eur) as avg_price,
  MAX(max_price_eur) as max_price
FROM pair_votes
GROUP BY pet_a_id, pet_b_id;

CREATE UNIQUE INDEX ON pair_vote_counts(pet_a_id, pet_b_id);

-- ==========================================
-- VOTE NOTIFICATIONS
-- ==========================================

-- Function to notify owner when their pet gets voted
CREATE OR REPLACE FUNCTION notify_pet_voted()
RETURNS TRIGGER AS $$
DECLARE
  pet_owner_id UUID;
  pet_name TEXT;
  vote_count INTEGER;
BEGIN
  -- Get pet owner and name
  SELECT owner_id, name INTO pet_owner_id, pet_name
  FROM pets WHERE id = NEW.pet_id;
  
  -- Get current vote count
  SELECT COUNT(*) INTO vote_count
  FROM pet_votes WHERE pet_id = NEW.pet_id;
  
  -- Notify owner at milestones (10, 50, 100, 250, 500, 1000)
  IF vote_count IN (10, 50, 100, 250, 500, 1000) THEN
    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
      pet_owner_id,
      'pet_popular',
      format('%s is popular! 🔥', pet_name),
      format('%s people want puppies from %s!', vote_count, pet_name),
      jsonb_build_object('pet_id', NEW.pet_id, 'vote_count', vote_count)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_pet_vote
AFTER INSERT ON pet_votes
FOR EACH ROW
EXECUTE FUNCTION notify_pet_voted();

-- Function to notify BOTH owners when pair is voted
CREATE OR REPLACE FUNCTION notify_pair_voted()
RETURNS TRIGGER AS $$
DECLARE
  owner_a_id UUID;
  owner_b_id UUID;
  pet_a_name TEXT;
  pet_b_name TEXT;
  vote_count INTEGER;
BEGIN
  -- Get owners and names
  SELECT owner_id, name INTO owner_a_id, pet_a_name
  FROM pets WHERE id = NEW.pet_a_id;
  
  SELECT owner_id, name INTO owner_b_id, pet_b_name
  FROM pets WHERE id = NEW.pet_b_id;
  
  -- Get current vote count
  SELECT COUNT(*) INTO vote_count
  FROM pair_votes WHERE pet_a_id = NEW.pet_a_id AND pet_b_id = NEW.pet_b_id;
  
  -- Notify both owners at milestones
  IF vote_count IN (10, 50, 100, 250) THEN
    -- Notify owner A
    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
      owner_a_id,
      'pair_popular',
      'People want this pairing! 💛',
      format('%s people want %s x %s puppies!', vote_count, pet_a_name, pet_b_name),
      jsonb_build_object('pet_a_id', NEW.pet_a_id, 'pet_b_id', NEW.pet_b_id, 'vote_count', vote_count)
    );
    
    -- Notify owner B
    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
      owner_b_id,
      'pair_popular',
      'People want this pairing! 💛',
      format('%s people want %s x %s puppies!', vote_count, pet_a_name, pet_b_name),
      jsonb_build_object('pet_a_id', NEW.pet_a_id, 'pet_b_id', NEW.pet_b_id, 'vote_count', vote_count)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_pair_vote
AFTER INSERT ON pair_votes
FOR EACH ROW
EXECUTE FUNCTION notify_pair_voted();

-- ==========================================
-- QUERIES
-- ==========================================

-- Get most voted pets
CREATE OR REPLACE VIEW popular_pets AS
SELECT 
  p.*,
  COALESCE(v.total_votes, 0) as vote_count,
  COALESCE(v.want_puppies_count, 0) as puppy_demand
FROM pets p
LEFT JOIN pet_vote_counts v ON p.id = v.pet_id
WHERE p.available_for_breeding = true
ORDER BY COALESCE(v.total_votes, 0) DESC;

-- Get most demanded breeding pairs
CREATE OR REPLACE VIEW trending_pairs AS
SELECT 
  pa.id as pet_a_id,
  pa.name as pet_a_name,
  pa.breed as pet_a_breed,
  pa.owner_id as owner_a_id,
  pb.id as pet_b_id,
  pb.name as pet_b_name,
  pb.breed as pet_b_breed,
  pb.owner_id as owner_b_id,
  v.total_votes,
  v.pre_orders,
  v.avg_price,
  v.max_price
FROM pair_vote_counts v
JOIN pets pa ON v.pet_a_id = pa.id
JOIN pets pb ON v.pet_b_id = pb.id
ORDER BY v.total_votes DESC, v.pre_orders DESC;

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_pet_votes_pet ON pet_votes(pet_id);
CREATE INDEX idx_pet_votes_voter ON pet_votes(voter_id);
CREATE INDEX idx_pair_votes_pets ON pair_votes(pet_a_id, pet_b_id);
CREATE INDEX idx_pair_votes_voter ON pair_votes(voter_id);
CREATE INDEX idx_pair_votes_commitment ON pair_votes(commitment);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE pet_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pair_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can view votes
CREATE POLICY "Anyone can view pet votes" ON pet_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can view pair votes" ON pair_votes FOR SELECT USING (true);

-- Users can vote
CREATE POLICY "Users can vote on pets" ON pet_votes FOR INSERT 
WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Users can vote on pairs" ON pair_votes FOR INSERT 
WITH CHECK (auth.uid() = voter_id);

-- Users can remove their votes
CREATE POLICY "Users can remove own pet votes" ON pet_votes FOR DELETE 
USING (auth.uid() = voter_id);

CREATE POLICY "Users can remove own pair votes" ON pair_votes FOR DELETE 
USING (auth.uid() = voter_id);

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE pet_votes IS 'Community votes on individual pets (I want puppies from this pet!)';
COMMENT ON TABLE pair_votes IS 'Community votes on specific breeding pairs (These two should breed!)';
COMMENT ON COLUMN pair_votes.commitment IS 'How serious is the voter? interested | very_interested | pre_order';
COMMENT ON COLUMN pair_votes.max_price_eur IS 'Maximum price voter would pay for a puppy from this pair';
