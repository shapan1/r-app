-- Run this in Supabase SQL Editor to create the reservations table

-- Reservations table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(date, time_slot, patient_name)
);

-- Indexes for fast lookups
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_date_slot ON reservations(date, time_slot);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (open access)
CREATE POLICY "Allow all" ON reservations FOR ALL USING (true);

-- Enable real-time for this table
-- Go to Database > Replication > Enable for 'reservations' table
-- Or run: ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
