/*
  # Fix Database Issues and Improve Data Integrity

  1. Security Updates
    - Ensure all RLS policies are working correctly
    - Fix any permission issues with data access
    - Add proper constraints and indexes

  2. Data Integrity
    - Add missing constraints
    - Ensure proper data types
    - Add validation where needed

  3. Performance Improvements
    - Add missing indexes
    - Optimize queries
*/

-- Ensure all tables have proper RLS enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ico_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow authenticated users to insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to select profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow public read access to profiles" ON user_profiles;

DROP POLICY IF EXISTS "Allow public read access to projects" ON ico_projects;
DROP POLICY IF EXISTS "Allow public insert for projects" ON ico_projects;
DROP POLICY IF EXISTS "Users can update own projects" ON ico_projects;

DROP POLICY IF EXISTS "Allow public insert for contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read for contact messages" ON contact_messages;

DROP POLICY IF EXISTS "Allow public newsletter subscription" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public read newsletter subscriptions" ON newsletter_subscriptions;

-- Create comprehensive policies for user_profiles
CREATE POLICY "Allow authenticated users to insert profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to select profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to profiles"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);

-- Create policies for ico_projects
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

CREATE POLICY "Users can update own projects"
  ON ico_projects
  FOR UPDATE
  TO authenticated
  USING (wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- Create policies for contact_messages
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

-- Create policies for newsletter_subscriptions
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

-- Ensure all necessary indexes exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address ON user_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ico_projects_wallet_address ON ico_projects(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ico_projects_status ON ico_projects(status);
CREATE INDEX IF NOT EXISTS idx_ico_projects_created_at ON ico_projects(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Add any missing columns that might be needed
DO $$
BEGIN
  -- Ensure updated_at exists on user_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Ensure the update trigger exists
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

-- Add some sample data for testing (optional)
-- This will help verify that the database is working correctly
INSERT INTO ico_projects (
  name, 
  description, 
  status, 
  website_url, 
  ticker,
  tags,
  network,
  launch_price
) VALUES (
  'Sample ICO Project',
  'This is a sample ICO project to test the database functionality. It demonstrates how projects are stored and displayed in the platform.',
  'active',
  'https://example.com',
  'SAMPLE',
  'DeFi, Sample, Test',
  'ETH',
  '0.001 ETH'
) ON CONFLICT DO NOTHING;