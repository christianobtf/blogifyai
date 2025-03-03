/*
  # Create articles and WordPress sites tables

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `status` (text)
      - `youtube_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `wordpress_sites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  content text,
  status text NOT NULL DEFAULT 'draft',
  youtube_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policies for articles
CREATE POLICY "Users can create their own articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create wordpress_sites table
CREATE TABLE IF NOT EXISTS wordpress_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for wordpress_sites
ALTER TABLE wordpress_sites ENABLE ROW LEVEL SECURITY;

-- Policies for wordpress_sites
CREATE POLICY "Users can create their own WordPress sites"
  ON wordpress_sites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own WordPress sites"
  ON wordpress_sites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own WordPress sites"
  ON wordpress_sites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own WordPress sites"
  ON wordpress_sites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger for articles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE
  ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();