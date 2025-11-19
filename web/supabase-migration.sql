-- EtsyGuard Pro - Supabase Database Schema
-- Run this SQL in the Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id TEXT UNIQUE NOT NULL,
  shop_name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  last_scan_at TIMESTAMPTZ,
  compliance_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  scan_type TEXT NOT NULL,
  total_listings INTEGER DEFAULT 0,
  violations_found INTEGER DEFAULT 0,
  compliance_score INTEGER DEFAULT 0,
  scan_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Violations table
CREATE TABLE IF NOT EXISTS violations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL,
  listing_title TEXT,
  violation_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  field TEXT NOT NULL,
  issue TEXT NOT NULL,
  suggestion TEXT,
  auto_fixable BOOLEAN DEFAULT false,
  fixed BOOLEAN DEFAULT false,
  fixed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral codes table
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  uses_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id),
  referred_id UUID REFERENCES auth.users(id),
  code TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  credit_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  email_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent'
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_shop_id ON shops(shop_id);
CREATE INDEX IF NOT EXISTS idx_scans_shop_id ON scans(shop_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at);
CREATE INDEX IF NOT EXISTS idx_violations_shop_id ON violations(shop_id);
CREATE INDEX IF NOT EXISTS idx_violations_scan_id ON violations(scan_id);
CREATE INDEX IF NOT EXISTS idx_violations_severity ON violations(severity);
CREATE INDEX IF NOT EXISTS idx_violations_fixed ON violations(fixed);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - Shops
-- =============================================

CREATE POLICY "Users can view own shops" ON shops
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shops" ON shops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shops" ON shops
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shops" ON shops
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - Scans
-- =============================================

CREATE POLICY "Users can view scans for own shops" ON scans
  FOR SELECT USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert scans for own shops" ON scans
  FOR INSERT WITH CHECK (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

-- =============================================
-- RLS POLICIES - Violations
-- =============================================

CREATE POLICY "Users can view violations for own shops" ON violations
  FOR SELECT USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert violations for own shops" ON violations
  FOR INSERT WITH CHECK (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update violations for own shops" ON violations
  FOR UPDATE USING (
    shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
  );

-- =============================================
-- RLS POLICIES - Subscriptions
-- =============================================

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES - Referral Codes
-- =============================================

CREATE POLICY "Users can view own referral codes" ON referral_codes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own referral codes" ON referral_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read for applying referral codes
CREATE POLICY "Anyone can read referral codes by code" ON referral_codes
  FOR SELECT USING (true);

-- =============================================
-- RLS POLICIES - Referrals
-- =============================================

CREATE POLICY "Users can view referrals they made" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Anyone can insert referrals" ON referrals
  FOR INSERT WITH CHECK (true);

-- =============================================
-- RLS POLICIES - Email Logs
-- =============================================

CREATE POLICY "Users can view own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for shops table
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for subscriptions table
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Uncomment to insert sample data for testing

/*
-- Insert a test shop (replace user_id with actual user ID from auth.users)
INSERT INTO shops (user_id, shop_id, shop_name, access_token, compliance_score)
VALUES (
  'your-user-id-here',
  'test-shop-123',
  'Test Etsy Shop',
  'test-token',
  85
);

-- Insert a test scan
INSERT INTO scans (shop_id, scan_type, total_listings, violations_found, compliance_score)
SELECT id, 'manual', 50, 5, 85
FROM shops WHERE shop_id = 'test-shop-123';

-- Insert test violations
INSERT INTO violations (
  scan_id,
  shop_id,
  listing_id,
  listing_title,
  violation_type,
  severity,
  field,
  issue,
  suggestion,
  auto_fixable
)
SELECT
  s.id,
  sh.id,
  'listing-123',
  'Test Product',
  'Prohibited Claims',
  'critical',
  'description',
  'Contains word "guaranteed"',
  'Remove guarantee language',
  true
FROM scans s
JOIN shops sh ON s.shop_id = sh.id
WHERE sh.shop_id = 'test-shop-123';
*/

-- =============================================
-- VERIFICATION
-- =============================================

-- Check that all tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- =============================================
-- NOTES
-- =============================================

/*
After running this migration:

1. Verify all tables exist
2. Check that RLS is enabled on all tables
3. Test policies with a test user
4. Insert sample data to verify relationships
5. Create a service role key for backend operations
6. Keep the anon key for frontend operations

Security Notes:
- service_role key bypasses RLS - keep it secret!
- anon key respects RLS - safe for frontend
- Never expose service_role key in client code
- Use service_role only in API routes/server functions
*/
