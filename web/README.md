# EtsyGuard Pro - Web Dashboard

Professional compliance monitoring dashboard for Etsy sellers.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Etsy Developer account
- Stripe account
- Resend account

### Installation

```bash
cd web
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in all environment variables (see Configuration section below)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
web/
├── app/                          # Next.js 14 App Router
│   ├── admin/                    # Admin dashboard
│   │   ├── page.tsx             # Main admin overview
│   │   ├── users/page.tsx       # User management
│   │   └── shops/page.tsx       # Shop management
│   ├── api/                      # API routes
│   │   ├── emails/              # Email sending endpoints
│   │   │   ├── welcome/
│   │   │   ├── alert/
│   │   │   └── digest/
│   │   ├── cron/                # Scheduled jobs
│   │   │   ├── daily-scans/
│   │   │   └── weekly-digest/
│   │   └── referrals/           # Referral system
│   ├── referral/                # Referral page
│   ├── providers.tsx            # App providers (PostHog, etc)
│   └── layout.tsx               # Root layout
├── components/
│   ├── onboarding/              # Onboarding components
│   │   ├── ProductTour.tsx      # Interactive tour
│   │   ├── WelcomeModal.tsx     # Welcome modal
│   │   └── QuickStartChecklist.tsx
│   └── admin/                   # Admin components
├── lib/
│   ├── email/                   # Email system
│   │   ├── templates/           # React Email templates
│   │   ├── send.ts              # Email sending logic
│   │   └── schedule.ts          # Email scheduling
│   ├── referrals/               # Referral system
│   └── analytics/               # PostHog analytics
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── DEPLOYMENT.md                # Deployment guide
├── PRODUCTION_CHECKLIST.md      # Pre-launch checklist
└── vercel.json                  # Vercel configuration
```

---

## ⚙️ Configuration

### Required Environment Variables

#### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Etsy API
```env
ETSY_API_KEY=your-etsy-api-key
ETSY_SHARED_SECRET=your-etsy-shared-secret
ETSY_CALLBACK_URL=https://yourdomain.com/api/auth/etsy/callback
```

#### Stripe
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

#### Resend (Email)
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@yourdomain.com
```

#### PostHog (Analytics)
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

#### Other
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAILS=admin@yourdomain.com
```

---

## 🎯 Features

### ✅ Deployment Automation
- Vercel configuration with cron jobs
- Environment variable management
- Automated builds and deployments

### 📧 Email Marketing System
- **5 Email Templates:**
  - Welcome email for new users
  - Scan complete notifications
  - Violation alerts (critical issues)
  - Weekly compliance digest
  - Upgrade prompts (conversion emails)
- Resend integration for reliable delivery
- Email scheduling and automation
- Email logs tracked in Supabase

### 🎓 Onboarding Flow
- Interactive product tour (react-joyride)
- Welcome modal for new users
- Quick start checklist with progress tracking
- 5-step onboarding:
  1. Connect Etsy shop
  2. Run first scan
  3. Fix one violation
  4. Enable email alerts
  5. Upgrade to Pro (optional)

### 🎁 Referral System
- Generate unique referral codes
- Track referral statistics
- Automatic credit application
- Social media sharing
- "Refer & Earn" reward program
- 1 month free for both referrer and referred

### 📊 Analytics (PostHog)
- **User Events:**
  - user_signed_up
  - shop_connected
  - first_scan_completed
- **Violation Events:**
  - violation_detected
  - violation_fixed (manual/auto)
- **Subscription Events:**
  - upgrade_to_pro
  - referral_sent
- **Automation Events:**
  - daily_scan_triggered
  - auto_fix_used

### 🎛️ Admin Dashboard
- **Overview Page:**
  - Total shops monitored
  - Pro subscribers & MRR
  - Violations detected
  - Average compliance score
  - Growth charts (shops, revenue)
  - Violations by category (pie chart)
- **User Management:**
  - List all users
  - Filter by plan (Free/Pro/Enterprise)
  - View user activity
  - Email users directly
- **Shop Management:**
  - Monitor all shops
  - Compliance scores
  - Violation counts
  - Health status (Healthy/Warning/Critical)
  - Filter by status

---

## 🔧 Development

### Running Email Templates in Dev Mode

```bash
npm run email:dev
```

This opens the React Email development server at http://localhost:3001

### Testing Cron Jobs Locally

To test cron jobs, you'll need to manually trigger the API routes:

```bash
# Daily scans
curl -X GET http://localhost:3000/api/cron/daily-scans \
  -H "Authorization: Bearer your-cron-secret"

# Weekly digest
curl -X GET http://localhost:3000/api/cron/weekly-digest \
  -H "Authorization: Bearer your-cron-secret"
```

### Database Migrations

Run the SQL from `DEPLOYMENT.md` section 1 (Supabase Setup) in the Supabase SQL Editor.

---

## 🚀 Deployment

### Deploy to Vercel

1. **Connect Repository:**
   ```bash
   vercel
   ```

2. **Configure Project:**
   - Framework: Next.js
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables:**
   Go to Vercel Dashboard → Settings → Environment Variables
   Add all variables from `.env.example`

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Vercel Cron Jobs

Cron jobs are configured in `vercel.json`:
- Daily scans: Every day at 9 AM UTC
- Weekly digest: Every Monday at 9 AM UTC

### Post-Deployment

1. Update Etsy OAuth redirect URL to production domain
2. Update Stripe webhook URL to production domain
3. Test the full user flow end-to-end
4. Follow `PRODUCTION_CHECKLIST.md`

**Full deployment guide:** See `DEPLOYMENT.md`

---

## 📧 Email System

### Sending Emails

```typescript
import { sendWelcomeEmail } from '@/lib/email/send';

await sendWelcomeEmail(
  'user@example.com',
  'John Doe',
  'My Etsy Shop',
  'user-id'
);
```

### Available Email Functions

- `sendWelcomeEmail()` - Welcome new users
- `sendScanCompleteEmail()` - Scan results
- `sendViolationAlertEmail()` - Critical violations
- `sendWeeklyDigestEmail()` - Weekly summary
- `sendUpgradePromptEmail()` - Conversion nudge

### Email Templates

All templates are in `lib/email/templates/` using React Email components.

---

## 🔗 API Routes

### Email Endpoints

- `POST /api/emails/welcome` - Send welcome email
- `POST /api/emails/alert` - Send violation alert
- `POST /api/emails/digest` - Send weekly digest

### Referral Endpoints

- `POST /api/referrals/generate` - Generate referral code
- `POST /api/referrals/apply` - Apply referral code

### Cron Endpoints (Protected)

- `GET /api/cron/daily-scans` - Run daily scans
- `GET /api/cron/weekly-digest` - Send weekly digests

---

## 📊 Analytics Events

Track custom events:

```typescript
import { analytics } from '@/lib/analytics/posthog';

// User signed up
analytics.userSignedUp(userId, email);

// Shop connected
analytics.shopConnected(userId, shopId, shopName);

// Violation detected
analytics.violationDetected(userId, shopId, 'Prohibited Claims', 'critical');

// Upgrade to Pro
analytics.upgradeToPro(userId, 'pro', 29);
```

---

## 🎨 Styling

- **Framework:** Tailwind CSS
- **Theme:** Brand colors in `tailwind.config.js`
- **Components:** Custom components with Tailwind
- **Icons:** Lucide React

### Brand Colors

```javascript
brand: {
  50: '#fef7ee',
  100: '#fdecd6',
  // ...
  500: '#ef711e', // Primary
  600: '#e05614',
  // ...
  900: '#762c16',
}
```

---

## 🧪 Testing

### Test User Flow

1. Sign up for an account
2. Connect Etsy shop via OAuth
3. Run first scan
4. View violations
5. Fix violations manually
6. Upgrade to Pro
7. Use auto-fix
8. Generate referral code
9. Check email notifications

### Test Admin Dashboard

1. Go to `/admin`
2. View overview statistics
3. Check `/admin/users`
4. Check `/admin/shops`

---

## 🐛 Troubleshooting

### Email Not Sending

- Check `RESEND_API_KEY` is set correctly
- Verify domain is verified in Resend dashboard
- Check email logs in Supabase `email_logs` table

### OAuth Not Working

- Verify Etsy app redirect URI matches exactly
- Check `ETSY_API_KEY` and `ETSY_SHARED_SECRET`
- Ensure app has correct scopes

### Cron Jobs Not Running

- Check Vercel cron configuration
- Verify `CRON_SECRET` is set
- Check Vercel function logs

### Database Errors

- Verify Supabase credentials
- Check RLS policies are configured
- Ensure tables are created

---

## 📚 Additional Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Etsy API Docs:** https://developers.etsy.com/documentation
- **Resend Docs:** https://resend.com/docs
- **PostHog Docs:** https://posthog.com/docs
- **React Email:** https://react.email

---

## 🤝 Support

For deployment issues:
- Check `DEPLOYMENT.md`
- Review `PRODUCTION_CHECKLIST.md`
- Check Vercel build logs
- Review Supabase logs

For feature requests or bugs:
- Open an issue on GitHub
- Contact: support@etsyguard.com

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🙏 Credits

Built with:
- Next.js 14
- Supabase
- Stripe
- Resend
- PostHog
- React Email
- Tailwind CSS
- Recharts

---

**Ready to launch? Follow the DEPLOYMENT.md guide!** 🚀
