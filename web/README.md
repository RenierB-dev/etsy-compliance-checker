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

## Next Phases

- **Phase 2**: Amazon API Integration
- **Phase 3**: Amazon Rules (60+ rules)
- **Phase 4**: Unified Dashboard
- **Phase 5**: Rebrand to SellerGuard Pro

## Usage

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
