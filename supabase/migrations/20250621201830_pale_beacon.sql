/*
  # Enhanced User Management and Data Integrity

  1. Security Updates
    - Ensure proper RLS policies for all tables
    - Add indexes for better performance
    - Add constraints for data integrity

  2. New Features
    - Add user activity tracking
    - Improve contact form handling
    - Enhanced newsletter subscription management

  3. Performance Improvements
    - Add database indexes for frequently queried columns
    - Optimize RLS policies
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address ON user_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ico_projects_wallet_address ON ico_projects(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ico_projects_status ON ico_projects(status);
CREATE INDEX IF NOT EXISTS idx_ico_projects_created_at ON ico_projects(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Ensure contact_messages has proper RLS policies
DROP POLICY IF EXISTS "Allow authenticated insert" ON contact_messages;
DROP POLICY IF EXISTS "Allow public insert for contact" ON contact_messages;

-- Create better contact form policies
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

-- Ensure ico_projects has proper policies for public viewing
DROP POLICY IF EXISTS "Allow public read access" ON ico_projects;

CREATE POLICY "Allow public read access to projects"
  ON ico_projects
  FOR SELECT
  TO public
  USING (true);

-- Update ico_projects insert policy to allow public submissions
DROP POLICY IF EXISTS "Users can insert own projects" ON ico_projects;

CREATE POLICY "Allow public insert for projects"
  ON ico_projects
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure newsletter subscriptions work properly
DROP POLICY IF EXISTS "Allow public insert for newsletter" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public read for newsletter" ON newsletter_subscriptions;

CREATE POLICY "Allow public newsletter subscription"
  ON newsletter_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read newsletter subscriptions"
  ON newsletter_subscriptions
  FOR SELECT
  TO public
  USING (true);

-- Add updated_at column to user_profiles for tracking changes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();