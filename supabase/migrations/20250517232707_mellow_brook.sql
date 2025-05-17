/*
  # Create LE Labs Project table
  
  1. New Tables
    - `le_labs_project` 
      - Complete table for storing project data
      - Includes JSON columns for complex data structures
      - Automatically tracks modification dates
      
  2. Security
    - Enable RLS on the table
    - Allow public read access
*/

-- Check if the table exists, and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename='le_labs_project') THEN
    CREATE TABLE le_labs_project (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL,
      featured BOOLEAN DEFAULT FALSE NOT NULL,
      hash TEXT NOT NULL,
      description TEXT NOT NULL,
      summary TEXT NOT NULL,
      tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
      last_updated TIMESTAMPTZ NOT NULL,
      image TEXT,
      tile_styles JSONB DEFAULT '{}'::JSONB NOT NULL,
      links JSONB DEFAULT '{}'::JSONB NOT NULL,
      updates JSONB DEFAULT '[]'::JSONB NOT NULL,
      last_modified TIMESTAMPTZ DEFAULT now() NOT NULL
    );
  END IF;
END $$;

-- Create or replace function for automatically updating last_modified
CREATE OR REPLACE FUNCTION update_last_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist already
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_update_le_labs_project_last_modified'
  ) THEN
    CREATE TRIGGER trigger_update_le_labs_project_last_modified
    BEFORE UPDATE ON le_labs_project
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified_column();
  END IF;
END $$;

-- Enable row level security if not already enabled
ALTER TABLE le_labs_project ENABLE ROW LEVEL SECURITY;

-- Create public read access policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'le_labs_project' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" 
      ON le_labs_project
      FOR SELECT 
      TO public 
      USING (true);
  END IF;
END $$;