/*
  # Fix articles table structure

  1. Changes
    - Add missing columns if they don't exist
    - Ensure all required columns are present
*/

DO $$ 
BEGIN
  -- Add video_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'video_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN video_id text;
  END IF;

  -- Add thumbnail_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE articles ADD COLUMN thumbnail_url text;
  END IF;

  -- Add transcript column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'transcript'
  ) THEN
    ALTER TABLE articles ADD COLUMN transcript text;
  END IF;
END $$;