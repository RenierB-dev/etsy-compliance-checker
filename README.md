# SellerGuard Pro

> **Multi-Platform E-Commerce Compliance Checker for Etsy, Amazon, and More**

Protect your seller accounts from suspensions and policy violations with SellerGuard Pro. Automatically scan your listings across multiple platforms with 108+ compliance rules, get real-time violation alerts, and fix issues before they become problems.

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platforms](https://img.shields.io/badge/platforms-Etsy%20%7C%20Amazon-orange)
![Rules](https://img.shields.io/badge/rules-108%2B-purple)

</div>

---

## ✨ Features

### 🛡️ **Multi-Platform Protection**
- ✅ **Etsy** - 48 compliance rules covering prohibited items, SEO, and shop standards
- ✅ **Amazon** - 60 SP-API integrated rules for FBA, trademarks, and content policy
- 🔜 **eBay** - Coming soon!

### ⚡ **Automated Compliance**
- **108+ Compliance Rules** across all major policy areas
- **Real-Time Scanning** with automated daily checks
- **Smart Violation Detection** with severity classification (Critical, Warning, Info)
- **Instant Alerts** for policy violations before they cause suspensions

### 📊 **Unified Dashboard**
- **Web Interface** - Beautiful React dashboard for monitoring all platforms
- **CLI Tool** - Fast command-line scanning for automation
- **Multi-Platform View** - Switch between Etsy and Amazon with one click
- **Analytics** - Historical tracking and compliance scoring (0-100)

### 🎯 **Advanced Features**
- **Cross-Platform Comparison** - See how your compliance stacks up across platforms
- **Export Reports** - JSON and CSV formats for record-keeping
- **Violation Recommendations** - Actionable fixes for each issue
- **API Integration** - Official Etsy API v3 and Amazon SP-API
- **Rate Limiting** - Automatic throttling to respect platform limits

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sellerguard-pro.git
cd sellerguard-pro

# Install dependencies
npm install

# Build the project
npm run build
```

### CLI Usage

#### 1. Initialize Configuration

Set up your API credentials for Etsy and/or Amazon:

```bash
# Etsy setup
npm start init

# Amazon setup (see AMAZON_SETUP_GUIDE.md)
cp .env.example .env
# Edit .env with your Amazon SP-API credentials
```

#### 2. Scan Your Listings

```bash
# Scan Etsy shop
npm start scan

# Scan with options
npm start scan --limit 50 --save

# Generate report
npm start report --format markdown
```

### Web Dashboard

Launch the web interface for a visual compliance dashboard:

```bash
cd web
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to access:
- 🎨 **Landing Page** - Product overview and pricing
- 📊 **Dashboard** - Multi-platform compliance monitoring at `/dashboard`
- 🔄 **Platform Switcher** - Toggle between Etsy and Amazon
- 📈 **Analytics** - Compliance scores and violation trends

---

## 📋 Compliance Rules

### Etsy Rules (48 Total)

#### 🚨 Prohibited Items (15 rules)
- Weapons, firearms, ammunition
- Adult content and explicit material
- Drugs and drug paraphernalia
- Counterfeit goods and replicas
- Hazardous materials

#### 📝 Title & Description (10 rules)
- Prohibited keywords and spam
- External links and contact info
- Title length and format
- Description quality
- SEO optimization

#### 📜 Policy Compliance (10 rules)
- Medical and health claims
- Guarantees and warranties
- Trademark violations
- Privacy compliance
- Copyright issues

#### 💰 Pricing & Fees (5 rules)
- Price manipulation
- Fee avoidance
- Unrealistic pricing
- Currency compliance

#### ⭐ Shop Standards (8 rules)
- Material disclosure
- Production information
- Shipping policies
- Image requirements
- Tag optimization

### Amazon Rules (60 Total)

#### 📦 Product Detail Page (12 rules)
- Title quality and format
- Bullet point optimization
- Description completeness
- Image requirements
- Variant compliance

#### ™️ Brand & Trademarks (8 rules)
- Trademark violations
- Brand registry compliance
- Unauthorized brand usage
- Keyword stuffing

#### 🚫 Restricted Categories (10 rules)
- Category-specific requirements
- Age restrictions
- Regulatory compliance
- Hazmat restrictions

#### 📮 FBA Requirements (8 rules)
- Packaging standards
- Labeling requirements
- Prep requirements
- Dimension limits

#### 📄 Content Policy (12 rules)
- Prohibited claims
- Medical/health compliance
- Offensive content
- Contact information
- External links

#### ⚙️ Technical Requirements (10 rules)
- ASIN compliance
- Attribute requirements
- Search term optimization
- Category selection
- Variation setup

---

## 🛠️ Project Structure

```
sellerguard-pro/
├── src/                          # CLI Source Code
│   ├── commands/                 # CLI commands (init, scan, report)
│   ├── services/                 # Core services (API clients, scanners)
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
├── web/                          # Web Dashboard (Next.js)
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx              # Landing page
│   │   ├── dashboard/            # Dashboard page
│   │   ├── layout.tsx            # Root layout with SEO
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   │   ├── PlatformSwitcher.tsx  # Platform toggle
│   │   ├── MultiPlatformStats.tsx # Statistics visualization
│   │   └── ViolationList.tsx     # Violation display
│   └── lib/                      # Shared libraries
│       ├── compliance/           # Rule engines
│       │   ├── etsy-rules.ts     # 48 Etsy rules
│       │   └── amazon-rules.ts   # 60 Amazon rules
│       ├── services/             # API services
│       │   ├── compliance-scanner.ts  # Unified scanner
│       │   ├── amazon-api.ts          # Amazon SP-API client
│       │   └── amazon-oauth.ts        # OAuth manager
│       ├── types/                # Type definitions
│       │   ├── compliance.ts     # Compliance types
│       │   └── amazon.ts         # Amazon types
│       ├── constants/            # App constants
│       │   └── index.ts          # Pricing, features, platforms
│       └── examples/             # Usage examples
├── rules.json                    # Legacy rules (CLI)
├── reports/                      # Generated reports
├── .env                          # API credentials (gitignored)
├── .env.example                  # Environment template
└── AMAZON_SETUP_GUIDE.md        # Amazon integration guide
```

---

## 🔧 Configuration

### Etsy API Setup

1. Visit [Etsy Developers](https://www.etsy.com/developers/your-apps)
2. Create a new app or use existing
3. Copy your API Key (Keystring)
4. Find your Shop ID in your shop URL: `https://www.etsy.com/shop/YOUR_SHOP_ID`
5. Run `npm start init` and enter credentials

### Amazon SP-API Setup

See [AMAZON_SETUP_GUIDE.md](./web/AMAZON_SETUP_GUIDE.md) for detailed instructions.

**Quick Overview:**
1. Register as Amazon Developer
2. Create SP-API app with PII access
3. Generate LWA credentials (Client ID, Client Secret)
4. Create IAM user with SP-API permissions
5. Get Refresh Token via OAuth flow
6. Add credentials to `.env` file

**Required Environment Variables:**
```env
# Amazon SP-API
AMAZON_CLIENT_ID=amzn1.application-oa2-client.xxxxx
AMAZON_CLIENT_SECRET=xxxxx
AMAZON_REFRESH_TOKEN=Atzr|xxxxx
AMAZON_ACCESS_KEY_ID=AKIAXXXXX
AMAZON_SECRET_ACCESS_KEY=xxxxx
AMAZON_REGION=us-east-1
AMAZON_MARKETPLACE_ID=ATVPDKIKX0DER
AMAZON_SELLER_ID=A1XXXXX (optional)

# Etsy API
ETSY_API_KEY=xxxxx
ETSY_SHOP_ID=xxxxx

# Web App (Optional)
NEXT_PUBLIC_BASE_URL=https://sellerguardpro.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 📊 Pricing Plans

### 🆓 Free
- One-time compliance check
- Choose 1 platform (Etsy or Amazon)
- Basic violation detection
- Export results to CSV
- Email support

### 💼 Solo Seller - $29/month
- Daily automated scans
- 1 platform of your choice
- All 108+ compliance rules
- Email alerts for violations
- Export to JSON & CSV
- Historical tracking
- Priority email support

### ⭐ Multi-Platform - $49/month (Most Popular)
- **BOTH** Etsy & Amazon platforms
- Unlimited daily scans
- All 108+ compliance rules
- Real-time violation alerts
- Cross-platform comparison
- Advanced analytics dashboard
- Export to JSON & CSV
- Historical tracking & trends
- Slack/Discord integration
- Priority support

### 🏢 Enterprise - $99/month
- All platforms (Etsy, Amazon, eBay*)
- Unlimited scans
- White-label dashboard
- Custom compliance rules
- API access
- Team collaboration (5 users)
- Dedicated account manager
- Custom integrations
- SLA guarantee
- 24/7 phone & chat support

*eBay coming soon

---

## 🔒 Security & Privacy

- **OAuth 2.0** authentication - Never store your passwords
- **Read-Only Access** - We can't modify your listings
- **Encrypted Transit** - All API calls use HTTPS/TLS
- **Data Privacy** - Your listing data is never shared
- **AWS Security** - Amazon SP-API uses AWS Signature V4 signing
- **Environment Variables** - Credentials stored securely in `.env` (gitignored)

---

## 🎯 Use Cases

### For Etsy Sellers
- ✅ Catch prohibited keywords before listing
- ✅ Optimize titles and tags for search
- ✅ Ensure material disclosure compliance
- ✅ Avoid trademark violations
- ✅ Prevent external link violations

### For Amazon Sellers
- ✅ FBA prep requirement validation
- ✅ Product detail page optimization
- ✅ Brand registry compliance
- ✅ Restricted category checks
- ✅ Content policy enforcement
- ✅ Trademark and IP protection

### For Multi-Platform Sellers
- ✅ Unified compliance dashboard
- ✅ Cross-platform violation comparison
- ✅ Centralized alert management
- ✅ Bulk listing validation
- ✅ Historical compliance tracking

---

## 🧪 Tech Stack

### CLI
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe development
- **Commander.js** - CLI framework
- **Axios** - HTTP client for APIs
- **Chalk** - Terminal styling

### Web Dashboard
- **React 18** - UI framework
- **Next.js 14** - App Router, SSR, SEO
- **TypeScript** - Type safety
- **styled-jsx** - Component styling
- **Etsy API v3** - Official API integration
- **Amazon SP-API** - Selling Partner API

### AWS Services (for Amazon)
- **AWS Signature V4** - Request signing
- **IAM** - Access management
- **LWA (Login with Amazon)** - OAuth 2.0

---

## 📈 Roadmap

### ✅ Completed
- [x] Phase 1: Expand Etsy Rules (48 rules)
- [x] Phase 2: Amazon SP-API Integration
- [x] Phase 3: Amazon Compliance Rules (60 rules)
- [x] Phase 4: Unified Multi-Platform Dashboard
- [x] Phase 5: Rebrand to SellerGuard Pro

### 🚧 In Progress
- [ ] eBay integration
- [ ] Real-time monitoring mode
- [ ] Email notification system
- [ ] Slack/Discord webhooks

### 🔮 Future
- [ ] Mobile app (iOS/Android)
- [ ] Browser extension
- [ ] Shopify integration
- [ ] WooCommerce plugin
- [ ] AI-powered fix suggestions
- [ ] Bulk listing editor
- [ ] API for third-party integrations
- [ ] Team collaboration features

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install
cd web && npm install

# Run CLI in dev mode
npm run dev

# Run web dashboard in dev mode
cd web && npm run dev

# Build everything
npm run build
cd web && npm run build

# Run tests (when available)
npm test
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🆘 Support

- 📧 Email: support@sellerguardpro.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/sellerguard-pro/issues)
- 📖 Docs: [Documentation](https://docs.sellerguardpro.com)
- 💬 Community: [Discord Server](https://discord.gg/sellerguardpro)

---

## ⚠️ Disclaimer

SellerGuard Pro is not affiliated with Etsy, Amazon, or eBay. This tool provides compliance suggestions based on publicly available platform policies but does not guarantee compliance or account protection. Always review each platform's official policies and terms of service. Use at your own risk.

---

## 🌟 Show Your Support

If SellerGuard Pro helped protect your seller account, please:
- ⭐ Star this repository
- 🐦 Share on Twitter
- 📝 Write a review
- 🤝 Recommend to other sellers

---

<div align="center">

**Made with ❤️ for e-commerce sellers worldwide**

[Website](https://sellerguardpro.com) • [Documentation](https://docs.sellerguardpro.com) • [Blog](https://blog.sellerguardpro.com)

</div>
