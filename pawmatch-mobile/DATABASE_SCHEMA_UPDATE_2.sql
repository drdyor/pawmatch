-- Add 'at_risk' status to pets table
ALTER TABLE pets DROP CONSTRAINT IF EXISTS pets_status_check;
ALTER TABLE pets ADD CONSTRAINT pets_status_check 
  CHECK (status IN ('available', 'reserved', 'adopted', 'stud_available', 'in_heat', 'at_risk'));

-- Add 'adopted' status tracking
ALTER TABLE pets ADD COLUMN IF NOT EXISTS adopted_at TIMESTAMP WITH TIME ZONE;

-- Create trigger to set adopted_at when status changes to 'adopted'
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
  FOR EACH ROW
  EXECUTE FUNCTION set_adopted_timestamp();

-- Index for at-risk animals (faster queries)
CREATE INDEX IF NOT EXISTS idx_pets_at_risk ON pets(status) WHERE status = 'at_risk';
CREATE INDEX IF NOT EXISTS idx_pets_adopted ON pets(adopted_at);
