-- KK Traders / KK Steels PostgreSQL schema
-- Run this once against the target database.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(254),
  subject VARCHAR(180),
  product VARCHAR(120),
  message TEXT NOT NULL,
  source VARCHAR(40) NOT NULL DEFAULT 'website',
  status VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'closed', 'spam')),
  ip_hash CHAR(64),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx
  ON enquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS enquiries_status_idx
  ON enquiries (status);

CREATE OR REPLACE FUNCTION set_enquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enquiries_updated_at ON enquiries;

CREATE TRIGGER enquiries_updated_at
BEFORE UPDATE ON enquiries
FOR EACH ROW
EXECUTE FUNCTION set_enquiries_updated_at();
