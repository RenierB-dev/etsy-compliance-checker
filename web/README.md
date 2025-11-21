# SellerGuard Pro - Web Dashboard

This directory contains the web infrastructure for the SellerGuard Pro dashboard.

## Phase 1: Expanded Etsy Rules ✅

Created comprehensive Etsy compliance rules:
- **48 total rules** across 5 categories
- TypeScript-based rule engine
- Modular architecture ready for Amazon integration

### Structure

```
web/
├── lib/
│   ├── compliance/
│   │   └── etsy-rules.ts          # 48 Etsy compliance rules
│   ├── services/                  # API integrations (to be added)
│   └── types/
│       └── compliance.ts          # TypeScript type definitions
└── README.md
```

### Rule Categories

1. **Prohibited Items** (15 rules)
   - Weapons, drugs, adult content
   - Counterfeit detection
   - Hazardous materials
   - Endangered species

2. **Title & Description Quality** (10 rules)
   - SEO optimization
   - Length requirements
   - Spam detection
   - External link detection

3. **Policy Compliance** (10 rules)
   - Required fields (tags, materials, shipping)
   - Handmade attributes
   - Photo requirements
   - Shop organization

4. **Pricing & Fees** (5 rules)
   - Profitability analysis
   - Fee calculations
   - Pricing strategies
   - Free shipping optimization

5. **Shop Standards** (8 rules)
   - Inventory management
   - SEO keyword optimization
   - Seasonal relevance
   - Customer experience

### Rule Severity Levels

- **Critical** (15 rules): Immediate action required - policy violations
- **Warning** (18 rules): Important issues affecting shop performance
- **Info** (15 rules): Optimization suggestions

## Phase 2: Amazon API Integration ✅

Complete Amazon Selling Partner API (SP-API) integration with:
- **OAuth (LWA)** authentication with automatic token refresh
- **AWS Signature V4** request signing
- **Catalog Items API** for product search
- **Listings Items API** for seller inventory
- **Rate limiting** to prevent API throttling
- **Error handling** with detailed error messages

### New Structure

```
web/
├── lib/
│   ├── compliance/
│   │   └── etsy-rules.ts          # 48 Etsy rules
│   ├── services/
│   │   ├── amazon-api.ts          # SP-API client
│   │   └── amazon-oauth.ts        # OAuth token manager
│   ├── types/
│   │   ├── compliance.ts          # Compliance types
│   │   └── amazon.ts              # Amazon API types
│   ├── config/
│   │   └── env.ts                 # Config loader
│   └── examples/
│       └── amazon-api-usage.ts    # Usage examples
├── AMAZON_SETUP_GUIDE.md          # Setup instructions
└── README.md
```

### Amazon Features

#### OAuth Token Management
- Automatic token refresh before expiration
- Token caching for performance
- Detailed error messages for auth issues

#### API Operations
- **Get Listings**: Fetch all seller inventory
- **Get Listing by SKU**: Retrieve specific listing details
- **Search Catalog**: Search Amazon catalog by keyword
- **Get Catalog Item**: Get product details by ASIN

#### Rate Limiting
Built-in rate limiting for all endpoints:
- Catalog Items: 2 requests/second
- Listings Items: 5 requests/second
- Automatic throttling and queuing

#### Error Handling
- AWS signature errors
- OAuth authentication failures
- Rate limit detection
- Network errors
- SP-API error responses

### Setup Amazon Integration

See [AMAZON_SETUP_GUIDE.md](./AMAZON_SETUP_GUIDE.md) for detailed instructions.

**Quick Start:**

1. Register as Amazon SP-API developer
2. Create an application in Seller Central
3. Get OAuth credentials (Client ID, Client Secret, Refresh Token)
4. Create AWS IAM user with SP-API permissions
5. Configure environment variables

```bash
AMAZON_CLIENT_ID=amzn1.application-oa2-client.YOUR_ID
AMAZON_CLIENT_SECRET=YOUR_SECRET
AMAZON_REFRESH_TOKEN=Atzr|YOUR_TOKEN
AMAZON_ACCESS_KEY_ID=YOUR_AWS_KEY
AMAZON_SECRET_ACCESS_KEY=YOUR_AWS_SECRET
AMAZON_REGION=us-east-1
AMAZON_MARKETPLACE_ID=ATVPDKIKX0DER
```

### Usage Examples

```typescript
import { createAmazonAPIService } from './lib/services/amazon-api';
import { loadAmazonConfig } from './lib/config/env';

// Initialize service
const config = loadAmazonConfig();
const amazon = createAmazonAPIService(config!);

// Test connection
const test = await amazon.testConnection();
console.log(test.data?.message);

// Get all listings
const listings = await amazon.getListings({ maxResults: 50 });
console.log(`Found ${listings.data?.length} listings`);

// Get specific listing
const listing = await amazon.getListingBySKU('MY-SKU-123');
console.log(listing.data?.title);

// Search catalog
const results = await amazon.searchCatalog('laptop', { pageSize: 10 });
console.log(`Found ${results.data?.length} products`);
```

See [examples/amazon-api-usage.ts](./lib/examples/amazon-api-usage.ts) for more examples.

## Next Phases

- **Phase 3**: Amazon Rules (60+ rules)
- **Phase 4**: Unified Dashboard
- **Phase 5**: Rebrand to SellerGuard Pro

## Etsy Usage

```typescript
import { allEtsyRules, etsyRulesByCategory } from './lib/compliance/etsy-rules';

// Check a listing against all rules
allEtsyRules.forEach(rule => {
  const violation = rule.check(listing);
  if (violation) {
    console.log(violation);
  }
});
```
