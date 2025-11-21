/**
 * SellerGuard Pro - Amazon SP-API Usage Examples
 *
 * This file demonstrates how to use the Amazon SP-API integration
 */

import { createAmazonAPIService } from '../services/amazon-api';
import { loadAmazonConfig, validateAmazonConfig } from '../config/env';
import { AmazonSPAPIConfig } from '../types/amazon';

/**
 * Example 1: Initialize Amazon API Service
 */
export async function exampleInitialize() {
  // Option 1: Load from environment variables
  const config = loadAmazonConfig();

  if (!config) {
    throw new Error('Amazon configuration not found in environment variables');
  }

  const validation = validateAmazonConfig(config);
  if (!validation.valid) {
    throw new Error(`Invalid configuration:\n${validation.errors.join('\n')}`);
  }

  const amazonService = createAmazonAPIService(config);

  console.log('✅ Amazon SP-API service initialized');

  return amazonService;
}

/**
 * Example 2: Manual Configuration
 */
export async function exampleManualConfig() {
  const config: AmazonSPAPIConfig = {
    clientId: 'amzn1.application-oa2-client.your_client_id',
    clientSecret: 'your_client_secret',
    refreshToken: 'Atzr|your_refresh_token',
    accessKeyId: 'your_aws_access_key_id',
    secretAccessKey: 'your_aws_secret_access_key',
    region: 'us-east-1',
    marketplaceId: 'ATVPDKIKX0DER', // US marketplace
    sellerId: 'your_seller_id'
  };

  const amazonService = createAmazonAPIService(config);

  return amazonService;
}

/**
 * Example 3: Test Connection
 */
export async function exampleTestConnection() {
  const amazonService = await exampleInitialize();

  console.log('Testing connection to Amazon SP-API...');

  const result = await amazonService.testConnection();

  if (result.success) {
    console.log('✅', result.data?.message);
  } else {
    console.log('❌ Connection failed:', result.error?.message);
  }

  return result;
}

/**
 * Example 4: Get All Listings
 */
export async function exampleGetListings() {
  const amazonService = await exampleInitialize();

  console.log('Fetching Amazon listings...');

  const result = await amazonService.getListings({
    maxResults: 50 // Fetch up to 50 listings
  });

  if (result.success && result.data) {
    console.log(`✅ Found ${result.data.length} listings`);

    // Display first 3 listings
    result.data.slice(0, 3).forEach(listing => {
      console.log('\nListing:', {
        ASIN: listing.asin,
        SKU: listing.sku,
        Title: listing.title,
        Price: listing.price,
        Quantity: listing.quantity,
        Status: listing.status
      });
    });
  } else {
    console.log('❌ Failed to fetch listings:', result.error?.message);
  }

  return result;
}

/**
 * Example 5: Get Specific Listing by SKU
 */
export async function exampleGetListingBySKU(sku: string) {
  const amazonService = await exampleInitialize();

  console.log(`Fetching listing with SKU: ${sku}...`);

  const result = await amazonService.getListingBySKU(sku);

  if (result.success && result.data) {
    console.log('✅ Listing found:', {
      ASIN: result.data.asin,
      SKU: result.data.sku,
      Title: result.data.title,
      Price: result.data.price,
      Quantity: result.data.quantity,
      Condition: result.data.condition,
      Status: result.data.status,
      Issues: result.data.issueMessages?.length || 0
    });

    // Display issues if any
    if (result.data.issueMessages && result.data.issueMessages.length > 0) {
      console.log('\n⚠️  Issues:');
      result.data.issueMessages.forEach(issue => {
        console.log(`  - [${issue.severity}] ${issue.message}`);
      });
    }
  } else {
    console.log('❌ Failed to fetch listing:', result.error?.message);
  }

  return result;
}

/**
 * Example 6: Search Catalog by Keyword
 */
export async function exampleSearchCatalog(keyword: string) {
  const amazonService = await exampleInitialize();

  console.log(`Searching catalog for: "${keyword}"...`);

  const result = await amazonService.searchCatalog(keyword, {
    pageSize: 10
  });

  if (result.success && result.data) {
    console.log(`✅ Found ${result.data.length} catalog items`);

    // Display first 3 results
    result.data.slice(0, 3).forEach(item => {
      const summary = item.summaries?.[0];
      console.log('\nCatalog Item:', {
        ASIN: item.asin,
        Name: summary?.itemName,
        Brand: summary?.brandName,
        Manufacturer: summary?.manufacturer
      });
    });
  } else {
    console.log('❌ Search failed:', result.error?.message);
  }

  return result;
}

/**
 * Example 7: Get Catalog Item by ASIN
 */
export async function exampleGetCatalogItem(asin: string) {
  const amazonService = await exampleInitialize();

  console.log(`Fetching catalog item with ASIN: ${asin}...`);

  const result = await amazonService.getCatalogItem(asin);

  if (result.success && result.data) {
    const summary = result.data.summaries?.[0];
    const images = result.data.images?.[0]?.images;

    console.log('✅ Catalog item found:', {
      ASIN: result.data.asin,
      Name: summary?.itemName,
      Brand: summary?.brandName,
      Manufacturer: summary?.manufacturer,
      ProductType: result.data.productTypes?.[0]?.productType,
      Images: images?.length || 0
    });
  } else {
    console.log('❌ Failed to fetch catalog item:', result.error?.message);
  }

  return result;
}

/**
 * Example 8: Full Workflow - Scan Listings for Compliance
 */
export async function exampleComplianceScan() {
  const amazonService = await exampleInitialize();

  console.log('Starting compliance scan...\n');

  // Step 1: Get all listings
  console.log('Step 1: Fetching listings...');
  const listingsResult = await amazonService.getListings({ maxResults: 100 });

  if (!listingsResult.success || !listingsResult.data) {
    console.log('❌ Failed to fetch listings');
    return;
  }

  const listings = listingsResult.data;
  console.log(`✅ Found ${listings.length} listings to scan\n`);

  // Step 2: Analyze each listing
  console.log('Step 2: Analyzing listings for issues...');

  const listingsWithIssues = listings.filter(
    listing => listing.issueMessages && listing.issueMessages.length > 0
  );

  const inactiveListing = listings.filter(
    listing => listing.status !== 'BUYABLE'
  );

  console.log(`\n📊 Scan Results:`);
  console.log(`  - Total listings: ${listings.length}`);
  console.log(`  - Listings with issues: ${listingsWithIssues.length}`);
  console.log(`  - Inactive listings: ${inactiveListing.length}`);
  console.log(`  - Healthy listings: ${listings.length - listingsWithIssues.length - inactiveListing.length}`);

  // Step 3: Display detailed issues
  if (listingsWithIssues.length > 0) {
    console.log('\n⚠️  Listings with Issues:\n');

    listingsWithIssues.slice(0, 5).forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.title} (${listing.sku})`);
      listing.issueMessages?.forEach(issue => {
        console.log(`   - [${issue.severity}] ${issue.message}`);
      });
      console.log('');
    });
  }

  return {
    total: listings.length,
    withIssues: listingsWithIssues.length,
    inactive: inactiveListing.length,
    healthy: listings.length - listingsWithIssues.length - inactiveListing.length
  };
}

/**
 * Example 9: Error Handling
 */
export async function exampleErrorHandling() {
  try {
    // Try with invalid SKU
    const amazonService = await exampleInitialize();
    const result = await amazonService.getListingBySKU('INVALID-SKU-12345');

    if (!result.success) {
      console.log('Expected error:', result.error?.message);
      console.log('Error code:', result.error?.code);
    }
  } catch (error) {
    console.log('Caught exception:', error instanceof Error ? error.message : error);
  }
}

/**
 * Run all examples (for testing)
 */
export async function runAllExamples() {
  try {
    console.log('=== Amazon SP-API Examples ===\n');

    await exampleTestConnection();
    console.log('\n---\n');

    await exampleGetListings();
    console.log('\n---\n');

    await exampleSearchCatalog('laptop');
    console.log('\n---\n');

    await exampleComplianceScan();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Uncomment to run examples:
// runAllExamples();
