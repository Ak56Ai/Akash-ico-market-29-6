/*
  # Add token_address field to ico_projects table

  1. Changes
    - Add token_address column to ico_projects table
    - This will store the ERC-20 contract address for token analytics

  2. Security
    - No changes to RLS policies needed
*/

-- Add token_address column to ico_projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ico_projects' AND column_name = 'token_address'
  ) THEN
    ALTER TABLE ico_projects ADD COLUMN token_address text;
  END IF;
END $$;

-- Add index for better performance when querying by token address
CREATE INDEX IF NOT EXISTS idx_ico_projects_token_address ON ico_projects(token_address);

-- Update existing projects with sample token addresses for testing
UPDATE ico_projects 
SET token_address = '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e'
WHERE token_address IS NULL AND name = 'Sample ICO Project';