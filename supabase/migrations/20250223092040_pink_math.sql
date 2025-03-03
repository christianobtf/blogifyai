/*
  # Add video_id field to articles table

  1. Changes
    - Add `video_id` column to `articles` table to store YouTube video IDs
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'articles' AND column_name = 'video_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN video_id text;
  END IF;
END $$;