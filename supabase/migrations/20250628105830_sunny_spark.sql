/*
  # Create featured projects table

  1. New Tables
    - `featured_projects`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to ico_projects)
      - `display_order` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `featured_projects` table
    - Add policy for public read access
    - Add policy for authenticated admin management
*/

CREATE TABLE IF NOT EXISTS featured_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES ico_projects(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE featured_projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active featured projects
CREATE POLICY "Allow public read access to featured projects"
  ON featured_projects
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow authenticated users to manage featured projects (admin functionality)
CREATE POLICY "Allow authenticated admin to manage featured projects"
  ON featured_projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_featured_projects_project_id ON featured_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_featured_projects_display_order ON featured_projects(display_order);
CREATE INDEX IF NOT EXISTS idx_featured_projects_active ON featured_projects(is_active);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_featured_projects_updated_at
    BEFORE UPDATE ON featured_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();