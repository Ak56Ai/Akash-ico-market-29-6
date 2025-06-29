/*
  # Fix User Profiles for Email Authentication

  1. Changes
    - Drop existing user_profiles table and recreate for email auth
    - Remove wallet_address dependency from ico_projects
    - Update all policies to work with email-based authentication
    - Add proper indexes and constraints

  2. Security
    - Enable RLS on user_profiles table
    - Add policies for authenticated users to manage their own data
    - Update ico_projects policies for email-based access
*/

-- First, drop all policies that depend on wallet_address
DROP POLICY IF EXISTS "Users can update own projects" ON ico_projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON ico_projects;

-- Drop existing user_profiles table if it exists
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

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Now safely remove wallet_address column from ico_projects
DO $$
BEGIN
  -- Remove wallet_address column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'wallet_address'
  ) THEN
    ALTER TABLE ico_projects DROP COLUMN wallet_address CASCADE;
  END IF;
END $$;

-- Recreate ico_projects policies to work with email-based authentication
CREATE POLICY "Users can insert own projects"
  ON ico_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own projects"
  ON ico_projects
  FOR UPDATE
  TO authenticated
  USING (email = auth.email());

-- Ensure all existing policies are properly set
DROP POLICY IF EXISTS "Allow public read access to projects" ON ico_projects;
DROP POLICY IF EXISTS "Allow public insert for projects" ON ico_projects;

CREATE POLICY "Allow public read access to projects"
  ON ico_projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert for projects"
  ON ico_projects
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure contact_messages policies are correct
DROP POLICY IF EXISTS "Allow public insert for contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read for contact messages" ON contact_messages;

CREATE POLICY "Allow public insert for contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read for contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure newsletter_subscriptions policies are correct
DROP POLICY IF EXISTS "Allow public insert for newsletter" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public read newsletter subscriptions" ON newsletter_subscriptions;

CREATE POLICY "Allow public insert for newsletter"
  ON newsletter_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read newsletter subscriptions"
  ON newsletter_subscriptions
  FOR SELECT
  TO public
  USING (true);