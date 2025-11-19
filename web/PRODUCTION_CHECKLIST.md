# EtsyGuard Pro - Production Launch Checklist

Complete this checklist before launching to production.

## 📋 Pre-Launch Checklist

### 1. Etsy Integration

- [ ] **Etsy OAuth App Created**
  - App created at https://www.etsy.com/developers/your-apps
  - App name: EtsyGuard Pro
  - Redirect URI configured: `https://yourdomain.com/api/auth/etsy/callback`

- [ ] **Etsy App Credentials Added**
  - `ETSY_API_KEY` added to Vercel env vars
  - `ETSY_SHARED_SECRET` added to Vercel env vars
  - `ETSY_CALLBACK_URL` set correctly

- [ ] **Etsy OAuth Scopes Configured**
  - `shops_r` - Read shop data ✓
  - `listings_r` - Read listings ✓
  - `listings_w` - Update listings (for auto-fix) ✓

- [ ] **Etsy App Approved**
  - App submitted for production approval
  - Approval received from Etsy
  - App status: Live

### 2. Database Setup (Supabase)

- [ ] **Supabase Project Created**
  - Project name: etsyguard-pro
  - Region selected (closest to users)
  - Database password saved securely

- [ ] **Database Schema Migrated**
  - All tables created (shops, scans, violations, subscriptions, referral_codes, referrals, email_logs)
  - Indexes created
  - Row Level Security (RLS) enabled
  - RLS policies configured

- [ ] **Supabase Credentials Added**
  - `NEXT_PUBLIC_SUPABASE_URL` in Vercel
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
  - `SUPABASE_SERVICE_ROLE_KEY` in Vercel (secret!)

- [ ] **Supabase Auth Configured**
  - Email provider enabled
  - OAuth providers configured (optional)
  - Email templates customized

### 3. Payment System (Stripe)

- [ ] **Stripe Products Created**
  - Pro Plan: $29/month
    - Price ID: `STRIPE_PRO_PRICE_ID`
    - Features: Unlimited scans, auto-fix, email alerts
  - Enterprise Plan: $99/month
    - Price ID: `STRIPE_ENTERPRISE_PRICE_ID`
    - Features: Multi-shop, priority support, custom integrations

- [ ] **Stripe Credentials Added**
  - `STRIPE_SECRET_KEY` in Vercel
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in Vercel
  - `STRIPE_WEBHOOK_SECRET` in Vercel

- [ ] **Stripe Webhook Configured**
  - Endpoint: `https://yourdomain.com/api/webhooks/stripe`
  - Events: checkout.session.completed, customer.subscription.*
  - Secret saved as `STRIPE_WEBHOOK_SECRET`
  - Webhook tested successfully

- [ ] **Test Payment Flow**
  - Test card payment successful
  - Subscription created in Supabase
  - User upgraded to Pro
  - Features unlocked correctly

### 4. Email Service (Resend)

- [ ] **Resend Account Created**
  - API key generated
  - `RESEND_API_KEY` added to Vercel

- [ ] **Domain Verified**
  - Domain added to Resend
  - DNS records configured (SPF, DKIM)
  - Domain verified
  - `RESEND_FROM_EMAIL` set (e.g., hello@yourdomain.com)

- [ ] **Email Templates Tested**
  - Welcome email sends correctly
  - Scan complete email renders properly
  - Violation alert email works
  - Weekly digest email tested
  - Upgrade prompt email functional

### 5. Background Jobs (Trigger.dev)

- [ ] **Trigger.dev Project Created**
  - Project: etsyguard-pro
  - `TRIGGER_API_KEY` added to Vercel

- [ ] **Jobs Deployed**
  - Daily scan job deployed
  - Email notification job deployed
  - Weekly digest job deployed
  - Referral processing job deployed

- [ ] **Cron Jobs Configured in Vercel**
  - Daily scans: 9am UTC (`0 9 * * *`)
  - Weekly digest: Mondays 9am UTC (`0 9 * * 1`)
  - `CRON_SECRET` environment variable set

- [ ] **Test Automated Scans**
  - Manual trigger of daily scan works
  - Email alerts sent correctly
  - Scan results saved to database
  - Compliance scores updated

### 6. Analytics (PostHog)

- [ ] **PostHog Project Created**
  - Project: EtsyGuard Pro
  - `NEXT_PUBLIC_POSTHOG_KEY` added to Vercel

- [ ] **Events Tracked**
  - user_signed_up
  - shop_connected
  - first_scan_completed
  - violation_detected
  - violation_fixed
  - upgrade_to_pro
  - referral_sent
  - All custom events configured

- [ ] **Dashboards Created**
  - User acquisition funnel
  - Conversion tracking (Free → Pro)
  - Feature usage analytics
  - Violation trends

### 7. Application Deployment

- [ ] **Vercel Project Setup**
  - Repository connected
  - Framework: Next.js
  - Root directory: `web`
  - Build command: `npm run build`
  - Output directory: `.next`

- [ ] **Environment Variables**
  - All production env vars added to Vercel
  - No .env.local in git
  - Secrets properly secured
  - `NODE_ENV=production`

- [ ] **Domain Configuration**
  - Custom domain added to Vercel
  - DNS configured correctly
  - SSL certificate active
  - `NEXT_PUBLIC_APP_URL` set to production domain

- [ ] **Build Successful**
  - Production build completes without errors
  - No TypeScript errors
  - No ESLint errors
  - Bundle size optimized

### 8. Security & Privacy

- [ ] **Legal Pages Created**
  - Privacy Policy at `/privacy`
  - Terms of Service at `/terms`
  - Refund Policy at `/refund`
  - Contact page at `/contact`

- [ ] **Security Headers**
  - CSP (Content Security Policy) configured
  - CORS properly configured
  - Rate limiting implemented
  - SQL injection protection (via Supabase)

- [ ] **Admin Access**
  - `ADMIN_EMAILS` environment variable set
  - Admin routes protected
  - Admin dashboard accessible only to admins

- [ ] **API Security**
  - All API routes protected
  - Authentication required where needed
  - Rate limiting on public endpoints
  - Webhook signature verification

### 9. Testing

- [ ] **User Flow Testing**
  - Sign up → Email verification → Dashboard
  - Connect Etsy shop via OAuth
  - Run first scan
  - View violations
  - Fix violations manually
  - Upgrade to Pro
  - Use auto-fix feature
  - Generate referral code
  - Receive email notifications

- [ ] **Cross-Browser Testing**
  - Chrome ✓
  - Firefox ✓
  - Safari ✓
  - Edge ✓

- [ ] **Mobile Responsive**
  - Dashboard responsive on mobile
  - Forms work on mobile
  - Navigation works on mobile
  - Charts visible on mobile

- [ ] **Performance**
  - Lighthouse score > 90
  - Page load < 3 seconds
  - Time to interactive < 5 seconds
  - Images optimized

### 10. CLI Tool Compatibility

- [ ] **Verify CLI Still Works**
  - `/src` folder untouched
  - CLI can be run independently
  - CLI commands functional:
    - `npm run scan`
    - `npm run check`
    - `npm run list-violations`

- [ ] **Integration Points**
  - CLI can use same rules.json
  - CLI scans compatible with web dashboard
  - No conflicts between CLI and web versions

### 11. Monitoring & Support

- [ ] **Error Tracking**
  - Sentry or similar error tracking setup
  - Error notifications configured
  - Source maps uploaded

- [ ] **Uptime Monitoring**
  - UptimeRobot or similar configured
  - Alert email set up
  - Status page created (optional)

- [ ] **Customer Support**
  - Support email configured (support@yourdomain.com)
  - Help documentation created
  - FAQ page published
  - Intercom/Crisp chat widget (optional)

## 🚀 Launch Day Checklist

- [ ] **Final Deployment**
  - All features tested in production
  - No breaking bugs
  - Performance acceptable

- [ ] **Marketing Ready**
  - Landing page live
  - Blog post ready
  - Social media posts scheduled
  - Product Hunt launch prepared (optional)

- [ ] **Support Ready**
  - Support team briefed
  - Onboarding emails tested
  - Help docs published

- [ ] **Monitoring Active**
  - All monitoring tools active
  - Alerts configured
  - Team ready to respond

## 📊 Post-Launch (Week 1)

- [ ] Monitor first user signups
- [ ] Check for errors in logs
- [ ] Verify all automated jobs running
- [ ] Track conversion rates
- [ ] Gather user feedback
- [ ] Fix critical bugs immediately
- [ ] Respond to support tickets within 24h

## 📈 Post-Launch (Month 1)

- [ ] Analyze user behavior in PostHog
- [ ] Review feature usage
- [ ] Iterate based on feedback
- [ ] Optimize conversion funnel
- [ ] Add requested features
- [ ] Scale infrastructure if needed

---

## 🆘 Emergency Contacts

**Vercel Support:** https://vercel.com/support
**Supabase Support:** https://supabase.com/support
**Stripe Support:** https://support.stripe.com
**Etsy Developer Support:** https://developers.etsy.com/support

---

## ✅ Sign-Off

Launch approved by:

- [ ] Technical Lead: _________________ Date: _________
- [ ] Product Manager: ________________ Date: _________
- [ ] QA Lead: _______________________ Date: _________

**Ready for production:** YES / NO

**Launch Date:** _______________

---

Good luck with your launch! 🚀
