/*
  # Fix User Profiles for Email Authentication

  1. Changes
    - Update user_profiles table to work with Supabase Auth
    - Remove wallet_address requirement
    - Add proper RLS policies for email-based authentication
    - Add plan_type field for user subscription management

  2. Security
    - Enable RLS on user_profiles table
    - Add policies for authenticated users to manage their own data
    - Allow users to view their own profiles and update them
*/

-- Drop existing user_profiles table if it exists with wallet_address
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table for email authentication
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  location text,
  plan_type text DEFAULT 'free' CHECK (plan_type IN ('free', 'silver', 'gold')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Update ico_projects table to use email instead of wallet_address for user identification
DO $$
BEGIN
  -- Remove wallet_address column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'wallet_address'
  ) THEN
    ALTER TABLE ico_projects DROP COLUMN wallet_address;
  END IF;
END $$;

-- Update ico_projects policies to work with email-based authentication
DROP POLICY IF EXISTS "Users can update own projects" ON ico_projects;

CREATE POLICY "Users can update own projects"
  ON ico_projects
  FOR UPDATE
  TO authenticated
  USING (email = auth.email());