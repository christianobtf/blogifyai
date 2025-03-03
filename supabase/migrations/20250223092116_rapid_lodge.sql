/*
  # Add missing columns to articles table

  1. Changes
    - Add `thumbnail_url` column to store video thumbnail URLs
    - Add `transcript` column to store video transcripts
*/

DO $$ 
BEGIN
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