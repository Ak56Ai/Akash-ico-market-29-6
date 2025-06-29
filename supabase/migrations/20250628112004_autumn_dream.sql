/*
  # Create Stats Counter and Hero Ads Tables

  1. New Tables
    - `platform_stats`
      - `id` (uuid, primary key)
      - `stat_name` (text, unique)
      - `stat_value` (integer)
      - `description` (text)
      - `updated_at` (timestamp)
    - `hero_ads`
      - `id` (uuid, primary key)
      - `image_url` (text)
      - `title` (text)
      - `tagline` (text)
      - `is_active` (boolean)
      - `display_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin management

  3. Initial Data
    - Insert default stats (networks, projects, buyers, years)
    - Insert 3 hero ads with mock data
*/

-- Create platform_stats table
CREATE TABLE IF NOT EXISTS platform_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_name text UNIQUE NOT NULL,
  stat_value integer NOT NULL DEFAULT 0,
  description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;

-- Create hero_ads table
CREATE TABLE IF NOT EXISTS hero_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text NOT NULL,
  tagline text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_ads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platform_stats
CREATE POLICY "Allow public read access to stats"
  ON platform_stats
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated admin to manage stats"
  ON platform_stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for hero_ads
CREATE POLICY "Allow public read access to hero ads"
  ON hero_ads
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Allow authenticated admin to manage hero ads"
  ON hero_ads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_platform_stats_name ON platform_stats(stat_name);
CREATE INDEX IF NOT EXISTS idx_hero_ads_active ON hero_ads(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_ads_display_order ON hero_ads(display_order);

-- Create triggers for updated_at
CREATE TRIGGER update_platform_stats_updated_at
    BEFORE UPDATE ON platform_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_ads_updated_at
    BEFORE UPDATE ON hero_ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial stats data
INSERT INTO platform_stats (stat_name, stat_value, description) VALUES
  ('networks', 7, 'Number of supported blockchain networks'),
  ('projects', 0, 'Total number of ICO projects listed'),
  ('buyers', 188, 'Total number of registered buyers'),
  ('years_experience', 1, 'Years of platform experience')
ON CONFLICT (stat_name) DO NOTHING;

-- Insert mock hero ads data
INSERT INTO hero_ads (image_url, title, tagline, display_order) VALUES
  (
    'https://kufggdtvwplpngdlirpt.supabase.co/storage/v1/object/sign/hero/Under%20the%20Lake.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xM2E2NzY1Yy0xNGM1LTRjZWUtYjU4ZC0wMWEzYTNlOTdmODAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoZXJvL1VuZGVyIHRoZSBMYWtlLmpwZyIsImlhdCI6MTc1MDMyMTg0MiwiZXhwIjoxNzgxODU3ODQyfQ.LLUCYFFLx-M_Vm9Aw6O6X9P3EMAsiDfZcsxyMQfoOvc',
    'Unlock the Future of Crypto Investing in ICO!',
    'Discover, invest, and grow with exclusive ICO opportunities on all L1 and L2 networks. Fast, secure, and rewarding – join the next wave of blockchain innovation.',
    1
  ),
  (
    'https://kufggdtvwplpngdlirpt.supabase.co/storage/v1/object/sign/hero/Mauve.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xM2E2NzY1Yy0xNGM1LTRjZWUtYjU4ZC0wMWEzYTNlOTdmODAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoZXJvL01hdXZlLmpwZyIsImlhdCI6MTc1MDMyMTk1NywiZXhwIjoxNzgxODU3OTU3fQ.Qp5zxnPOj8yC6TBb61ybBBISZHSnZ15YWySX-sBNEt0',
    'Launch Your Next Big Idea on Any EVM Chain!',
    'Seamlessly create, manage, and participate in ICOs across all EVM-compatible blockchains like Ethereum, Polygon, Binance Smart Chain, and more.',
    2
  ),
  (
    'https://kufggdtvwplpngdlirpt.supabase.co/storage/v1/object/sign/hero/Under%20the%20Lake.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xM2E2NzY1Yy0xNGM1LTRjZWUtYjU4ZC0wMWEzYTNlOTdmODAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoZXJvL1VuZGVyIHRoZSBMYWtlLmpwZyIsImlhdCI6MTc1MDMyMTk3NiwiZXhwIjoxNzgxODU3OTc2fQ.raKCH04eqBLJq8Ff89s5WjrC1TupBM7bFiMz1DPucPc',
    'Your Gateway to ICOs Across All EVM Chains!',
    'Build, launch, and invest in ICOs effortlessly on Ethereum, Binance Smart Chain, Polygon, and beyond. One platform. Unlimited possibilities.',
    3
  );

-- Function to update project count in stats
CREATE OR REPLACE FUNCTION update_project_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the projects count in platform_stats
  UPDATE platform_stats 
  SET stat_value = (SELECT COUNT(*) FROM ico_projects),
      updated_at = now()
  WHERE stat_name = 'projects';
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update project count
DROP TRIGGER IF EXISTS trigger_update_project_count ON ico_projects;
CREATE TRIGGER trigger_update_project_count
  AFTER INSERT OR DELETE ON ico_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_project_count();