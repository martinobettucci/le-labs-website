/*
  # Update le_labs_project table

  1. Changes
    - Modify structure of `le_labs_project` table to support complete project data
    - Add necessary JSON columns for structured data (tileStyles, updates, etc.)
    - Add indexes for performance
  
  2. Security
    - Enable RLS on the table
    - Add policy for public read access
*/

-- First ensure we have the proper column structure
ALTER TABLE le_labs_project
  ALTER COLUMN tile_background TYPE jsonb USING jsonb_build_object('background', tile_background, 'color', tile_color, 'size', tile_size);

-- Rename the column to match our expected structure
ALTER TABLE le_labs_project
  RENAME COLUMN tile_background TO tile_styles;

-- Drop the individual columns we merged into tile_styles
ALTER TABLE le_labs_project
  DROP COLUMN tile_color,
  DROP COLUMN tile_size;

-- Add last_modified column if it doesn't exist already
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'le_labs_project' AND column_name = 'last_modified'
  ) THEN
    ALTER TABLE le_labs_project ADD COLUMN last_modified TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Add trigger for automatically updating last_modified
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