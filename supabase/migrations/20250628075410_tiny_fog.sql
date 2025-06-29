/*
  # Payment System Database Schema

  1. New Tables
    - `accepted_currencies`
      - `id` (uuid, primary key)
      - `symbol` (text, unique)
      - `name` (text)
      - `rate` (decimal) - Rate in terms of MeCoin
      - `icon` (text)
      - `logo_url` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `plan_purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan_type` (text)
      - `currency_symbol` (text)
      - `amount_paid` (decimal)
      - `mecoin_equivalent` (decimal)
      - `transaction_hash` (text)
      - `payment_address` (text)
      - `status` (text) - pending, confirmed, failed
      - `confirmed_by` (uuid, references auth.users)
      - `confirmed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add appropriate policies for data access
    - Add indexes for performance

  3. Sample Data
    - Insert default currency rates
*/

-- Create accepted_currencies table
CREATE TABLE IF NOT EXISTS accepted_currencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  name text NOT NULL,
  rate decimal(18,8) NOT NULL, -- Rate in terms of MeCoin (1 MeCoin = rate * currency)
  icon text,
  logo_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create plan_purchases table
CREATE TABLE IF NOT EXISTS plan_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type text NOT NULL CHECK (plan_type IN ('silver', 'gold')),
  currency_symbol text NOT NULL,
  amount_paid decimal(18,8) NOT NULL,
  mecoin_equivalent decimal(18,8) NOT NULL,
  transaction_hash text,
  payment_address text DEFAULT '0x008EE20B704DfDD5019E4C115683b691b4587FEb',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  confirmed_by uuid REFERENCES auth.users(id),
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE accepted_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for accepted_currencies
CREATE POLICY "Allow public read access to currencies"
  ON accepted_currencies
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Allow authenticated admin to manage currencies"
  ON accepted_currencies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for plan_purchases
CREATE POLICY "Users can view own purchases"
  ON plan_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON plan_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases"
  ON plan_purchases
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update purchase status"
  ON plan_purchases
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accepted_currencies_symbol ON accepted_currencies(symbol);
CREATE INDEX IF NOT EXISTS idx_accepted_currencies_active ON accepted_currencies(is_active);
CREATE INDEX IF NOT EXISTS idx_plan_purchases_user_id ON plan_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_plan_purchases_status ON plan_purchases(status);
CREATE INDEX IF NOT EXISTS idx_plan_purchases_created_at ON plan_purchases(created_at);

-- Create trigger for updating updated_at timestamp on accepted_currencies
DROP TRIGGER IF EXISTS update_accepted_currencies_updated_at ON accepted_currencies;
CREATE TRIGGER update_accepted_currencies_updated_at
    BEFORE UPDATE ON accepted_currencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default currency rates
INSERT INTO accepted_currencies (symbol, name, rate, icon, logo_url, is_active) VALUES
  ('MECOIN', 'MeCoin', 1.0, '🪙', 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', true),
  ('USDT', 'Tether USD', 0.022, '₮', 'https://cryptologos.cc/logos/tether-usdt-logo.png', true),
  ('USDC', 'USD Coin', 0.022, '💵', 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', true)
ON CONFLICT (symbol) DO UPDATE SET
  name = EXCLUDED.name,
  rate = EXCLUDED.rate,
  icon = EXCLUDED.icon,
  logo_url = EXCLUDED.logo_url,
  is_active = EXCLUDED.is_active,
  updated_at = now();