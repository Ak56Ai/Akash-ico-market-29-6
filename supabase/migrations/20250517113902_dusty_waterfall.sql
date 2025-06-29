/*
  # Create ICO Projects Schema

  1. New Tables
    - `ico_projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `status` (text)
      - `website_url` (text)
      - `whitepaper_url` (text)
      - `created_at` (timestamp)
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access on ico_projects
    - Add policies for authenticated insert on contact_messages
*/

-- Create ico_projects table
CREATE TABLE IF NOT EXISTS ico_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  status text CHECK (status IN ('active', 'upcoming', 'completed')) DEFAULT 'upcoming',
  website_url text,
  whitepaper_url text,
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ico_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON ico_projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated insert"
  ON contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);