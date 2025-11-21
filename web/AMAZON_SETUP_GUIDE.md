# Amazon SP-API Setup Guide

This guide walks you through setting up Amazon Selling Partner API (SP-API) integration for SellerGuard Pro.

## Prerequisites

1. Active Amazon Seller account
2. Access to Amazon Seller Central
3. Developer account (free)

## Step 1: Register as an Amazon SP-API Developer

1. Go to [Amazon Seller Central](https://sellercentral.amazon.com)
2. Navigate to **Apps & Services** > **Develop Apps**
3. Click **Add new app client**

## Step 2: Create an Application

### Application Information

- **App Name**: SellerGuard Pro
- **OAuth Login URI**: `https://localhost` (for testing)
- **OAuth Redirect URI**: `https://localhost/callback` (for testing)

### Select Roles

Choose the following roles:
- ✅ **Product Listing** - Access to your product listings
- ✅ **Catalog** - Access to Amazon catalog data
- ✅ **Reports** - Access to reports (optional)

Click **Save and Exit**

## Step 3: Get Your Credentials

After creating the app, you'll receive:

1. **LWA Client ID** - Starts with `amzn1.application-oa2-client.`
2. **LWA Client Secret** - Long alphanumeric string

**Save these securely!**

## Step 4: Authorize Your Application

1. In Seller Central, go to **Apps & Services** > **Authorize Apps**
2. Find your app and click **Authorize**
3. Copy the **Refresh Token** - Starts with `Atzr|`

**Important**: The refresh token is only shown once! Save it immediately.

## Step 5: Create AWS IAM User

Amazon SP-API requires AWS credentials for request signing.

### 5.1 Create IAM User

1. Log in to [AWS Console](https://console.aws.amazon.com)
2. Go to **IAM** > **Users** > **Add User**
3. User name: `sellerguard-pro-api`
4. Access type: **Programmatic access**
5. Click **Next: Permissions**

### 5.2 Create Policy

Click **Attach existing policies directly** > **Create policy**

Use this JSON policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:*:*:*"
    }
  ]
}
```

Name it: `AmazonSPAPIAccessPolicy`

### 5.3 Attach Policy to User

1. Find and select `AmazonSPAPIAccessPolicy`
2. Click **Next: Tags** (skip tags)
3. Click **Next: Review**
4. Click **Create User**

### 5.4 Save Access Keys

You'll receive:
- **Access Key ID** - 20 characters
- **Secret Access Key** - 40 characters

**Download and save these securely!**

## Step 6: Identify Your Region and Marketplace

### AWS Regions

| Region | AWS Region Code | Countries |
|--------|----------------|-----------|
| North America | `us-east-1` | US, Canada, Mexico, Brazil |
| Europe | `eu-west-1` | UK, Germany, France, Italy, Spain, etc. |
| Far East | `us-west-2` | Japan, Australia, Singapore, India |

### Marketplace IDs

| Country | Marketplace ID |
|---------|---------------|
| 🇺🇸 United States | `ATVPDKIKX0DER` |
| 🇨🇦 Canada | `A2EUQ1WTGCTBG2` |
| 🇲🇽 Mexico | `A1AM78C64UM0Y8` |
| 🇬🇧 United Kingdom | `A1F83G8C2ARO7P` |
| 🇩🇪 Germany | `A1PA6795UKMFR9` |
| 🇫🇷 France | `A13V1IB3VIYZZH` |
| 🇮🇹 Italy | `APJ6JRA9NG5V4` |
| 🇪🇸 Spain | `A1RKKUPIHCS9HS` |
| 🇯🇵 Japan | `A1VC38T7YXB528` |
| 🇦🇺 Australia | `A39IBJ37TRP1C6` |

## Step 7: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Amazon SP-API Configuration
AMAZON_CLIENT_ID=amzn1.application-oa2-client.YOUR_CLIENT_ID
AMAZON_CLIENT_SECRET=YOUR_CLIENT_SECRET
AMAZON_REFRESH_TOKEN=Atzr|YOUR_REFRESH_TOKEN

# AWS IAM Credentials
AMAZON_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AMAZON_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY

# Region and Marketplace
AMAZON_REGION=us-east-1
AMAZON_MARKETPLACE_ID=ATVPDKIKX0DER

# Optional: Seller ID (auto-detected if not provided)
AMAZON_SELLER_ID=YOUR_SELLER_ID
```

## Step 8: Test Your Configuration

Run the test script:

```typescript
import { createAmazonAPIService } from './lib/services/amazon-api';
import { loadAmazonConfig } from './lib/config/env';

const config = loadAmazonConfig();
const amazonService = createAmazonAPIService(config!);

const result = await amazonService.testConnection();
console.log(result);
```

If successful, you'll see:
```
✅ Successfully connected to Amazon SP-API
```

## Troubleshooting

### Error: "Invalid refresh token"

**Cause**: Refresh token expired or incorrect

**Solution**:
1. Go to Seller Central > Apps & Services
2. Re-authorize your application
3. Get a new refresh token

### Error: "Invalid client credentials"

**Cause**: Wrong Client ID or Client Secret

**Solution**:
1. Verify credentials match exactly (no extra spaces)
2. Check for correct LWA client ID format: `amzn1.application-oa2-client.`

### Error: "Access denied"

**Cause**: AWS IAM user lacks permissions

**Solution**:
1. Verify IAM policy is attached to user
2. Ensure policy allows `execute-api:Invoke`
3. Check AWS region matches your marketplace

### Error: "Rate limit exceeded"

**Cause**: Too many requests

**Solution**:
- SellerGuard Pro has built-in rate limiting
- Wait 60 seconds and retry
- Contact Amazon to request higher rate limits

## API Rate Limits

| API | Rate | Burst |
|-----|------|-------|
| Catalog Items | 2/sec | 2 |
| Listings Items | 5/sec | 10 |
| Reports | 1/min | 15 |

SellerGuard Pro automatically handles rate limiting!

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use `.env` files** and add to `.gitignore`
3. **Rotate credentials** every 90 days
4. **Use separate AWS users** for dev/prod
5. **Monitor IAM activity** in AWS CloudTrail
6. **Restrict IAM permissions** to minimum required

## Next Steps

Once configured:
1. ✅ Fetch your Amazon listings
2. ✅ Run compliance scans
3. ✅ View detailed reports
4. ✅ Track violations across platforms

## Support Resources

- [SP-API Documentation](https://developer-docs.amazon.com/sp-api/)
- [SP-API GitHub](https://github.com/amzn/selling-partner-api-docs)
- [AWS IAM Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/)
- [LWA (Login with Amazon)](https://developer.amazon.com/docs/login-with-amazon/documentation-overview.html)

---

**Need help?** Check the [examples file](./lib/examples/amazon-api-usage.ts) for code samples.
