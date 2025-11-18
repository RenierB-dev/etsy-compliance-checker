# Etsy Compliance Checker - Web Dashboard

Premium web dashboard for the Etsy Compliance Checker CLI tool. Adds automated monitoring, one-click fixes, and compliance analytics on top of the existing CLI functionality.

## Features

- **Visual Dashboard**: Beautiful UI showing compliance scores and violations
- **Automatic Scanning**: Daily background scans with email alerts
- **One-Click Fixes**: Apply suggested fixes directly via Etsy API
- **Historical Tracking**: Store and view scan history with Supabase
- **Stripe Payments**: Subscription-based pricing (Free, Pro, Enterprise)
- **OAuth Integration**: Seamless Etsy shop connection

## Architecture

This web app is built **on top of** the existing CLI tool, not as a replacement:

```
/etsy-compliance-checker
├── src/                    ← Existing CLI (untouched!)
│   ├── services/
│   │   ├── etsyApi.ts     ← Reused by web app
│   │   ├── violationDetector.ts  ← Reused by web app
│   │   └── reportGenerator.ts    ← Reused by web app
│   └── types/             ← Shared types
├── web/                   ← New web dashboard
│   ├── app/              (Next.js 15 App Router)
│   ├── components/       (React components)
│   └── lib/
│       └── scanner.ts    ← Imports and wraps CLI functions!
└── rules.json            ← Shared compliance rules
```

**Key Design Principle**: The web app **imports** existing CLI functions rather than duplicating code.

## Tech Stack

- **Next.js 15** (App Router, Server Actions)
- **React 18** (UI components)
- **Tailwind CSS** (Styling)
- **Supabase** (Database, authentication)
- **Trigger.dev** (Background jobs, scheduled scans)
- **Stripe** (Payments)
- **Etsy API v3** (OAuth, listing updates)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp web/.env.example web/.env
```

Required variables:
- `ETSY_API_KEY` - Your Etsy API key
- `ETSY_CLIENT_ID` - Etsy OAuth client ID
- `ETSY_CLIENT_SECRET` - Etsy OAuth client secret
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `TRIGGER_API_KEY` - Trigger.dev API key

### 3. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the schema:

```bash
# Copy the SQL from web/supabase/schema.sql
# and run it in your Supabase SQL editor
```

### 4. Set Up Stripe

1. Create products in Stripe Dashboard:
   - Pro Plan: $29/month
   - Enterprise Plan: $99/month

2. Copy the price IDs and add to `.env`:
   ```
   STRIPE_PRICE_ID_PRO=price_xxx
   STRIPE_PRICE_ID_ENTERPRISE=price_xxx
   ```

3. Set up webhook endpoint for subscription events:
   ```
   Endpoint: https://your-domain.com/api/webhooks/stripe
   Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
   ```

### 5. Set Up Trigger.dev

1. Create account at https://trigger.dev
2. Create new project
3. Copy API key to `.env`
4. Deploy background jobs:

```bash
cd web
npx trigger.dev@latest deploy
```

## Development

### Run Web Dashboard

```bash
npm run web:dev
```

The web app will be available at http://localhost:3000

### Run CLI (Still Works!)

```bash
npm run build
npm start scan
```

The CLI continues to work exactly as before!

## How It Works

### 1. Scanning Flow

```typescript
// web/lib/scanner.ts imports existing CLI services
import { EtsyApiService } from '../../src/services/etsyApi';
import { ViolationDetector } from '../../src/services/violationDetector';

export async function scanShop(options) {
  // Reuse existing CLI services - no code duplication!
  const etsyApi = new EtsyApiService(apiKey, shopId);
  const detector = new ViolationDetector();

  const listings = await etsyApi.getShopListings();
  const violations = detector.detectViolations(listing);

  return result;
}
```

### 2. Daily Monitoring

Background job runs daily via Trigger.dev:

```typescript
// web/lib/trigger.ts
export const dailyScanJob = client.defineJob({
  trigger: { cron: '0 9 * * *' }, // 9 AM daily
  run: async () => {
    // Imports and uses scanShop() from lib/scanner.ts
    // which in turn uses existing CLI services
  }
});
```

### 3. Auto-Fix

One-click fixes via Etsy API:

```typescript
// web/app/api/fix/route.ts
export async function POST(request) {
  // Apply fix via Etsy API
  await axios.patch(`/listings/${listingId}`, updateData);
}
```

## Deployment

### Deploy to Vercel

```bash
cd web
vercel --prod
```

### Environment Variables on Vercel

Add all environment variables from `.env` to your Vercel project settings.

### Set Up Webhooks

1. **Stripe**: Update webhook endpoint to your production URL
2. **Trigger.dev**: Deploy jobs to production environment

## Pricing Plans

- **Free**: 5 manual scans/month, basic features
- **Pro ($29/mo)**: Unlimited scans, daily monitoring, auto-fix, email alerts
- **Enterprise ($99/mo)**: Multiple shops, API access, custom rules

## API Routes

- `POST /api/scan` - Run shop scan
- `POST /api/fix` - Apply violation fix
- `GET /api/auth/etsy` - Start Etsy OAuth flow
- `GET /api/auth/callback` - Handle OAuth callback
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## Database Schema

See `web/supabase/schema.sql` for complete schema including:
- `users` - User accounts with subscription info
- `shops` - Connected Etsy shops
- `scan_history` - Historical scan results
- `monitoring_schedules` - Automated scan schedules
- `email_alerts` - Sent alert tracking

## Background Jobs

- **Daily Shop Scan**: Runs at 9 AM daily for all shops with monitoring enabled
- **Email Alerts**: Sends alerts when critical violations are detected

## Contributing

The web dashboard is designed to complement, not replace, the CLI tool. When adding features:

1. **Keep CLI Working**: Never modify existing CLI code
2. **Reuse, Don't Duplicate**: Import CLI functions in web app
3. **Share Rules**: Use the same `rules.json` for consistency

## Support

- CLI Tool: See main README.md
- Web Dashboard: Open an issue or contact support

## License

MIT
