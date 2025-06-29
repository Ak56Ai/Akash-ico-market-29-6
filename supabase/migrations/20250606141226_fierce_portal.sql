/*
  # Extended Schema for Project Listings and User Profiles

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `wallet_address` (text, unique)
      - `name` (text)
      - `email` (text)
      - `location` (text)
      - `created_at` (timestamp)

  2. Extended ico_projects table
    - Add additional fields for comprehensive project data
    - Add wallet_address for project ownership
    - Add all form fields from the listing modal

  3. Security
    - Enable RLS on user_profiles table
    - Add policies for authenticated users to manage their own data
    - Update ico_projects policies for wallet-based access
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  name text,
  email text,
  location text,
  created_at timestamptz DEFAULT now()
);

-- Add additional columns to ico_projects table
DO $$
BEGIN
  -- Add wallet_address column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'wallet_address'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN wallet_address text;
  END IF;

  -- Add listing_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'listing_type'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN listing_type text DEFAULT 'Free';
  END IF;

  -- Add email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'email'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN email text;
  END IF;

  -- Add project_details column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'project_details'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN project_details text;
  END IF;

  -- Add relationship column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'relationship'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN relationship text;
  END IF;

  -- Add launch_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'launch_date'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN launch_date date;
  END IF;

  -- Add country column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'country'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN country text;
  END IF;

  -- Add ticker column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'ticker'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN ticker text;
  END IF;

  -- Add tags column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'tags'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN tags text;
  END IF;

  -- Add key_points column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'key_points'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN key_points text;
  END IF;

  -- Add network column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'network'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN network text DEFAULT 'ETH';
  END IF;

  -- Add decimals column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'decimals'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN decimals integer DEFAULT 18;
  END IF;

  -- Add block_explorer column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'block_explorer'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN block_explorer text;
  END IF;

  -- Add social media columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'twitter'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN twitter text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'telegram'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN telegram text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'facebook'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN facebook text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'linkedin'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN linkedin text;
  END IF;

  -- Add ICO date columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'ico_start_date'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN ico_start_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'ico_end_date'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN ico_end_date date;
  END IF;

  -- Add launch_price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'launch_price'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN launch_price text;
  END IF;

  -- Add comments column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'comments'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN comments text;
  END IF;
END $$;

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Update ico_projects policies
CREATE POLICY "Users can insert own projects"
  ON ico_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own projects"
  ON ico_projects
  FOR UPDATE
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Allow public read access to user profiles (for displaying project creators)
CREATE POLICY "Allow public read access to profiles"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);