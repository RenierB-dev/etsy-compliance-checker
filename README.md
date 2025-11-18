# Etsy Compliance Checker

A powerful CLI tool to scan your Etsy shop for policy violations and compliance issues. Automatically detect prohibited keywords, missing required fields, and other potential violations before they become problems.

**NEW**: Premium web dashboard with automated monitoring, one-click fixes, and compliance analytics! See [web/README.md](web/README.md) for details.

## Features

- **Comprehensive Violation Detection**
  - Prohibited keywords (weapons, adult content, illegal items, trademark violations)
  - Missing required fields (materials, shipping info, tags)
  - Title and description pattern violations
  - Medical claims and guarantees

- **Etsy API v3 Integration**
  - Secure API key authentication
  - Rate limiting to respect API quotas
  - Bulk listing scanning

- **Flexible Reporting**
  - Console summary with color-coded severity levels
  - Markdown reports for easy sharing
  - JSON output for programmatic processing
  - Detailed violation breakdown by listing

## Installation

```bash
npm install
npm run build
```

## Quick Start

### 1. Initialize Configuration

Set up your Etsy API credentials:

```bash
npm start init
```

You'll be prompted to enter:
- Etsy API Key (get from https://www.etsy.com/developers/your-apps)
- Etsy Shop ID

### 2. Scan Your Shop

Run a compliance scan:

```bash
# Scan up to 100 listings
npm start scan

# Scan specific number of listings
npm start scan --limit 50

# Scan and save report to file
npm start scan --save
```

### 3. View Reports

Display the latest scan report:

```bash
# Console summary
npm start report

# Markdown format
npm start report --format markdown

# JSON format
npm start report --format json
```

## Commands

### `etsy-check init`

Initialize Etsy API credentials. Creates a `.env` file with your API key and shop ID.

**Usage:**
```bash
npm start init
```

### `etsy-check scan`

Scan your Etsy shop for compliance violations.

**Options:**
- `-l, --limit <number>`: Maximum number of listings to scan (default: 100)
- `-s, --save`: Save report to reports directory

**Usage:**
```bash
npm start scan --limit 50 --save
```

### `etsy-check report`

Generate a report from the latest scan.

**Options:**
- `-f, --format <type>`: Report format - console, markdown, or json (default: console)

**Usage:**
```bash
npm start report --format markdown
```

## Violation Categories

### Critical Violations (🔴)

Issues that may result in listing removal or shop suspension:

- **Weapons**: guns, knives, firearms, ammunition
- **Adult Content**: explicit material, adult toys
- **Illegal Items**: drugs, counterfeit goods, unauthorized replicas
- **Trademark Violations**: unauthorized use of brand names
- **External Links**: URLs in descriptions

### Warnings (⚠️)

Issues that should be addressed:

- **Prohibited Claims**: medical claims, guarantees, therapeutic claims
- **Spam Keywords**: misleading promotional language
- **Missing Fields**: materials, shipping information
- **Short Descriptions**: descriptions under 50 characters
- **Contact Info**: email addresses or external contact methods

### Info (ℹ️)

Best practice suggestions:

- **Tag Count**: fewer than 3 tags
- **Title Issues**: excessive capitalization, too many exclamation marks
- **Title Length**: titles under 20 characters

## Violation Rules

The tool uses `rules.json` to define violation patterns. You can customize these rules to match your specific needs:

```json
{
  "prohibitedKeywords": {
    "weapons": {
      "severity": "critical",
      "keywords": ["gun", "knife", "weapon"],
      "description": "Weapons and weapon-related items are prohibited on Etsy"
    }
  },
  "requiredFields": [...],
  "titlePatterns": [...],
  "descriptionPatterns": [...]
}
```

## Getting Your Etsy API Key

1. Go to https://www.etsy.com/developers/your-apps
2. Create a new app or use an existing one
3. Copy your API Key (Keystring)
4. Find your Shop ID in your shop's URL: `https://www.etsy.com/shop/YOUR_SHOP_ID`

## Report Output

### Console Output

Color-coded summary with violation counts and top issues.

### Markdown Report

Detailed report with:
- Summary statistics
- Violations grouped by severity
- Listing details with URLs
- Actionable recommendations

### JSON Report

Complete scan data including:
- All violations with metadata
- Listing information
- Severity classifications
- Timestamps

## Project Structure

```
etsy-compliance-checker/
├── src/
│   ├── commands/          # CLI command implementations
│   │   ├── init.ts
│   │   ├── scan.ts
│   │   └── report.ts
│   ├── services/          # Core services
│   │   ├── etsyApi.ts
│   │   ├── violationDetector.ts
│   │   └── reportGenerator.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── config.ts
│   └── index.ts           # Main CLI entry point
├── rules.json             # Violation rules database
├── reports/               # Generated reports (created on save)
├── .env                   # API credentials (gitignored)
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe development
- **Commander.js** - CLI framework
- **Axios** - HTTP client for Etsy API
- **Chalk** - Terminal styling

## Rate Limiting

The tool implements automatic rate limiting (500ms between requests) to comply with Etsy API rate limits. For large shops, scans may take several minutes.

## Security Notes

- API keys are stored in `.env` file (gitignored)
- Never commit your `.env` file to version control
- Use environment-specific API keys for testing vs. production

## Troubleshooting

**"Configuration not found" error**
- Run `etsy-check init` to set up your credentials

**"Failed to connect to Etsy API" error**
- Verify your API key is correct
- Check your shop ID matches your Etsy shop
- Ensure you have an active internet connection

**No violations found but listings have issues**
- Review and customize `rules.json` for your specific needs
- Some violations may require manual review

## Web Dashboard (Premium)

Want more than just CLI? Check out our premium web dashboard:

- **Visual Dashboard**: Beautiful UI with compliance scores and charts
- **Automated Monitoring**: Daily background scans with email alerts
- **One-Click Fixes**: Apply suggested fixes directly via Etsy API
- **Historical Tracking**: Store and analyze scan history over time
- **Stripe Payments**: Subscription-based pricing (Free tier available!)

See [web/README.md](web/README.md) for setup instructions.

**Note**: The CLI tool remains completely free! The web dashboard is an optional premium add-on.

## License

MIT

## Support

For issues, questions, or contributions, please open an issue on the project repository.

---

**Disclaimer**: This tool is not affiliated with Etsy. It provides suggestions based on Etsy's published policies but does not guarantee compliance. Always review Etsy's official policies and terms of service.
