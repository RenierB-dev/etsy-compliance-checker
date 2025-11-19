# EtsyGuard Pro - Deployment Guide

Complete guide to deploying the EtsyGuard Pro dashboard to production.

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier works)
- Supabase account
- Etsy Developer account
- Stripe account
- Resend account
- Trigger.dev account
- PostHog account (optional but recommended)

---

## 1. Supabase Setup (15 minutes)

### Create Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Name: `etsyguard-pro`
4. Database Password: Generate strong password
5. Region: Choose closest to your users
6. Click "Create new project"

### Run Database Migrations

Execute these SQL commands in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shops table
CREATE TABLE shops (
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
CREATE TABLE scans (
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
CREATE TABLE violations (
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
CREATE TABLE subscriptions (
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
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  uses_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id),
  referred_id UUID REFERENCES auth.users(id),
  code TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  credit_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  email_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent'
);

-- Create indexes
CREATE INDEX idx_shops_user_id ON shops(user_id);
CREATE INDEX idx_scans_shop_id ON scans(shop_id);
CREATE INDEX idx_violations_shop_id ON violations(shop_id);
CREATE INDEX idx_violations_scan_id ON violations(scan_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);

-- Row Level Security (RLS)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Policies for shops
CREATE POLICY "Users can view own shops" ON shops
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shops" ON shops
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shops" ON shops
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for scans
CREATE POLICY "Users can view own scans" ON scans
  FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

-- Policies for violations
CREATE POLICY "Users can view own violations" ON violations
  FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()));

-- Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for referral codes
CREATE POLICY "Users can view own referral codes" ON referral_codes
  FOR SELECT USING (auth.uid() = user_id);
```

### Get API Keys

1. Go to Settings → API
2. Copy `Project URL` → Save as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role secret` key → Save as `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

---

## 2. Etsy App Setup (20 minutes)

### Create Etsy App

1. Go to [Etsy Developers](https://www.etsy.com/developers/your-apps)
2. Click "Create a New App"
3. Fill in:
   - App Name: `EtsyGuard Pro`
   - App Description: `Automated Etsy compliance monitoring`
   - Will you sell on Etsy Platform: No
   - What will your app do: `Monitor shop listings for policy compliance`
4. Click "Read Terms and Create App"

### Configure OAuth

1. In your app dashboard, go to "App Details"
2. Add Redirect URI: `https://yourdomain.com/api/auth/etsy/callback`
3. Scopes needed:
   - `shops_r` (Read shop data)
   - `listings_r` (Read listings)
   - `listings_w` (Update listings - for auto-fix)
4. Save changes

### Get Credentials

1. Copy `Keystring` → Save as `ETSY_API_KEY`
2. Click "Show Shared Secret" → Save as `ETSY_SHARED_SECRET`

---

## 3. Stripe Setup (15 minutes)

### Create Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Products → Add Product

**Pro Plan:**
- Name: `EtsyGuard Pro`
- Description: `Automated compliance monitoring with one-click fixes`
- Price: `$29.00 USD/month`
- Recurring: Monthly
- Copy Price ID → Save as `STRIPE_PRO_PRICE_ID`

**Enterprise Plan:**
- Name: `EtsyGuard Enterprise`
- Description: `Multi-shop monitoring with priority support`
- Price: `$99.00 USD/month`
- Recurring: Monthly
- Copy Price ID → Save as `STRIPE_ENTERPRISE_PRICE_ID`

### Get API Keys

1. Developers → API Keys
2. Copy `Publishable key` → Save as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy `Secret key` → Save as `STRIPE_SECRET_KEY`

### Setup Webhook

1. Developers → Webhooks
2. Add Endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Listen to events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy `Signing secret` → Save as `STRIPE_WEBHOOK_SECRET`

---

## 4. Resend Email Setup (5 minutes)

1. Go to [Resend](https://resend.com)
2. Create account / Log in
3. API Keys → Create API Key
4. Copy key → Save as `RESEND_API_KEY`
5. Domains → Add Domain
6. Follow DNS verification steps
7. Set `RESEND_FROM_EMAIL` to `hello@yourdomain.com`

---

## 5. Trigger.dev Setup (10 minutes)

### Create Project

1. Go to [Trigger.dev](https://cloud.trigger.dev)
2. Create New Project: `etsyguard-pro`
3. Copy API Key → Save as `TRIGGER_API_KEY`

### Deploy Jobs

```bash
cd web
npx trigger.dev@latest init
npx trigger.dev@latest deploy
```

Jobs to deploy:
- Daily shop scans
- Email alerts
- Weekly digest
- Violation detection

---

## 6. PostHog Analytics Setup (5 minutes)

1. Go to [PostHog](https://posthog.com)
2. Create project: `EtsyGuard Pro`
3. Copy Project API Key → Save as `NEXT_PUBLIC_POSTHOG_KEY`
4. Set `NEXT_PUBLIC_POSTHOG_HOST` to `https://app.posthog.com`

---

## 7. Deploy to Vercel (10 minutes)

### Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import Project
3. Select your GitHub repository
4. Framework Preset: `Next.js`
5. Root Directory: `web`
6. Build Command: `npm run build`
7. Output Directory: `.next`

### Add Environment Variables

Go to Settings → Environment Variables and add all variables from `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ETSY_API_KEY`
- `ETSY_SHARED_SECRET`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_ENTERPRISE_PRICE_ID`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `TRIGGER_API_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_APP_URL` (your production URL)
- `ADMIN_EMAILS` (your admin email)

### Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Copy production URL
4. Update Etsy OAuth redirect URL to production domain
5. Update Stripe webhook URL to production domain

---

## 8. Post-Deployment Checklist

```
□ Supabase database tables created
□ Supabase RLS policies enabled
□ Etsy OAuth app created and approved
□ Etsy redirect URL updated to production
□ Stripe products created (Pro & Enterprise)
□ Stripe webhook configured and tested
□ Resend domain verified
□ Trigger.dev jobs deployed
□ All environment variables added to Vercel
□ Application deployed successfully
□ Test Etsy OAuth flow end-to-end
□ Test Stripe subscription flow
□ Test email delivery
□ Test daily scan cron job
□ Add privacy policy at /privacy
□ Add terms of service at /terms
□ Verify CLI tool in /src still works
```

---

## 9. Testing in Production

### Test OAuth Flow
1. Visit your production URL
2. Click "Connect Etsy Shop"
3. Authorize with your test Etsy shop
4. Verify shop data is saved to Supabase

### Test Compliance Scan
1. Run first scan
2. Check violations are detected
3. Verify email alert is sent
4. Check data appears in admin dashboard

### Test Subscription
1. Upgrade to Pro plan
2. Complete Stripe checkout
3. Verify subscription in Supabase
4. Test subscription features

### Test Referral System
1. Generate referral code
2. Use code in new account
3. Verify credits applied

---

## 10. Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployment logs
- Check function execution times
- Review error rates

### Supabase Dashboard
- Monitor database size
- Check query performance
- Review auth logs

### Stripe Dashboard
- Track MRR and subscriptions
- Monitor failed payments
- Review customer activity

### PostHog
- Track user journeys
- Monitor conversion funnels
- Analyze feature usage

---

## Support

For deployment issues:
- Check Vercel build logs
- Review Supabase database logs
- Test API endpoints manually
- Verify all environment variables are set

For Etsy API issues:
- Ensure OAuth scopes are correct
- Check token expiration
- Review Etsy API status page

---

## Cost Estimate (Monthly)

- Vercel: Free (Hobby) or $20/mo (Pro)
- Supabase: Free up to 500MB database
- Stripe: 2.9% + $0.30 per transaction
- Resend: Free up to 3,000 emails/month
- Trigger.dev: Free up to 100,000 runs/month
- PostHog: Free up to 1M events/month

**Total**: ~$0-20/mo until you scale

---

## Next Steps

After deployment:
1. Submit Etsy app for production approval
2. Create marketing landing page
3. Set up customer support (Intercom/Crisp)
4. Monitor first user signups
5. Iterate based on feedback

Good luck with your launch! 🚀
