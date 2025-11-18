-- Supabase Database Schema for Etsy Compliance Checker

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shops table (connected Etsy shops)
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shop_id TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  etsy_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shop_id, user_id)
);

-- Scan history table
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id TEXT NOT NULL,
  scan_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_listings INTEGER NOT NULL,
  scanned_listings INTEGER NOT NULL,
  critical_count INTEGER DEFAULT 0,
  warning_count INTEGER DEFAULT 0,
  info_count INTEGER DEFAULT 0,
  compliance_score INTEGER NOT NULL,
  violations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitoring schedules table
CREATE TABLE IF NOT EXISTS public.monitoring_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  enabled BOOLEAN DEFAULT true,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email alerts table
CREATE TABLE IF NOT EXISTS public.email_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shop_id TEXT NOT NULL,
  scan_id UUID REFERENCES public.scan_history(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('critical', 'warning', 'info')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  violations_count INTEGER NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON public.shops(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_shop_id ON public.shops(shop_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_shop_id ON public.scan_history(shop_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON public.scan_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_monitoring_schedules_shop_id ON public.monitoring_schedules(shop_id);
CREATE INDEX IF NOT EXISTS idx_email_alerts_user_id ON public.email_alerts(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_alerts ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Shops policies
CREATE POLICY "Users can view own shops" ON public.shops
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shops" ON public.shops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shops" ON public.shops
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shops" ON public.shops
  FOR DELETE USING (auth.uid() = user_id);

-- Scan history policies
CREATE POLICY "Users can view own scan history" ON public.scan_history
  FOR SELECT USING (
    shop_id IN (SELECT shop_id FROM public.shops WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own scan history" ON public.scan_history
  FOR INSERT WITH CHECK (
    shop_id IN (SELECT shop_id FROM public.shops WHERE user_id = auth.uid())
  );

-- Monitoring schedules policies
CREATE POLICY "Users can view own schedules" ON public.monitoring_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules" ON public.monitoring_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules" ON public.monitoring_schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules" ON public.monitoring_schedules
  FOR DELETE USING (auth.uid() = user_id);

-- Email alerts policies
CREATE POLICY "Users can view own alerts" ON public.email_alerts
  FOR SELECT USING (auth.uid() = user_id);
