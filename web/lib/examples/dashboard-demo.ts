/**
 * SellerGuard Pro - Dashboard Demo & Usage Examples
 *
 * This file demonstrates how to use the unified dashboard components
 * and compliance scanner service with sample data
 */

import { EtsyListing, AmazonListing } from '../types/compliance';
import { ComplianceScanner, MultiPlatformScanner } from '../services/compliance-scanner';

// ============================================================================
// SAMPLE DATA
// ============================================================================

// Sample Etsy Listings
export const sampleEtsyListings: EtsyListing[] = [
  {
    listing_id: 1234567890,
    title: 'Handmade Silver Ring',
    description: 'Beautiful handmade silver ring. Perfect gift!',
    price: {
      amount: 2500,
      divisor: 100,
      currency_code: 'USD'
    },
    quantity: 5,
    state: 'active',
    tags: ['ring', 'jewelry'],
    materials: ['silver'],
    who_made: 'i_did',
    when_made: '2020_2023',
    is_supply: false,
    images: [
      { url_fullxfull: 'https://example.com/image1.jpg' }
    ]
  },
  {
    listing_id: 1234567891,
    title: 'FREE SHIPPING!!!',
    description: 'Check out my website www.example.com for more products! Contact me at test@example.com',
    price: {
      amount: 1000,
      divisor: 100,
      currency_code: 'USD'
    },
    quantity: 10,
    state: 'active',
    tags: ['item'],
    materials: [],
    images: []
  }
];

// Sample Amazon Listings
export const sampleAmazonListings: AmazonListing[] = [
  {
    asin: 'B08N5WRWNW',
    sku: 'LAPTOP-001',
    title: 'Professional Laptop Computer - Intel Core i7, 16GB RAM, 512GB SSD - Perfect for Business and Gaming',
    description: 'High-performance laptop with latest Intel processor. Ideal for productivity and entertainment.',
    bulletPoints: [
      'Intel Core i7 processor for fast performance',
      '16GB DDR4 RAM for multitasking',
      '512GB SSD storage for quick boot times',
      'Full HD display with vibrant colors',
      '1-year manufacturer warranty'
    ],
    brand: 'TechBrand',
    price: 899.99,
    currency: 'USD',
    quantity: 25,
    fulfillmentChannel: 'AMAZON_NA',
    condition: 'New',
    mainImageUrl: 'https://example.com/laptop.jpg',
    images: [
      'https://example.com/laptop-1.jpg',
      'https://example.com/laptop-2.jpg',
      'https://example.com/laptop-3.jpg'
    ],
    category: 'Electronics',
    status: 'BUYABLE',
    dimensions: {
      length: 15,
      width: 10,
      height: 1,
      weight: 4.5,
      unit: 'inches'
    }
  },
  {
    asin: 'B08N5WRWNY',
    sku: 'HEALTH-MIRACLE',
    title: 'MIRACLE CURE - Best Quality - #1 Seller!!!',
    description: 'This product cures cancer and treats diabetes! FDA approved! Visit www.example.com for more. Call 555-1234',
    bulletPoints: [
      'Cures all diseases',
      'Clinically proven',
      'Free shipping',
      'Buy now!'
    ],
    brand: 'Generic',
    price: 2.99,
    currency: 'USD',
    quantity: 0,
    condition: 'New',
    images: [],
    status: 'DISCOVERABLE'
  }
];

// ============================================================================
// DEMO USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Scan Etsy Listings
 */
export function demoEtsyScan() {
  console.log('=== Etsy Scan Demo ===\n');

  const result = ComplianceScanner.scanEtsyListings(sampleEtsyListings);

  console.log(`Total Listings: ${result.totalListings}`);
  console.log(`Total Violations: ${result.violationCount}`);
  console.log(`  - Critical: ${result.criticalCount}`);
  console.log(`  - Warning: ${result.warningCount}`);
  console.log(`  - Info: ${result.infoCount}\n`);

  // Get compliance score
  const score = ComplianceScanner.getComplianceScore(result);
  console.log(`Compliance Score: ${score}/100\n`);

  // Get summary
  const summary = ComplianceScanner.generateSummary(result);
  console.log(`Grade: ${summary.grade}`);
  console.log(`Recommendation: ${summary.recommendation}\n`);

  // Show violations
  result.violations.forEach(listing => {
    console.log(`\nListing: ${listing.listingTitle}`);
    listing.violations.forEach(v => {
      console.log(`  - [${v.severity.toUpperCase()}] ${v.message}`);
    });
  });

  return result;
}

/**
 * Example 2: Scan Amazon Listings
 */
export function demoAmazonScan() {
  console.log('\n=== Amazon Scan Demo ===\n');

  const result = ComplianceScanner.scanAmazonListings(sampleAmazonListings);

  console.log(`Total Listings: ${result.totalListings}`);
  console.log(`Total Violations: ${result.violationCount}`);
  console.log(`  - Critical: ${result.criticalCount}`);
  console.log(`  - Warning: ${result.warningCount}`);
  console.log(`  - Info: ${result.infoCount}\n`);

  // Get compliance score
  const score = ComplianceScanner.getComplianceScore(result);
  console.log(`Compliance Score: ${score}/100\n`);

  // Get breakdown by category
  const breakdown = ComplianceScanner.getViolationBreakdown(result);
  console.log('Top Violations:');
  breakdown.topViolations.slice(0, 5).forEach(v => {
    console.log(`  - ${v.ruleId}: ${v.count} occurrences (${v.severity})`);
  });

  return result;
}

/**
 * Example 3: Multi-Platform Comparison
 */
export async function demoMultiPlatformScan() {
  console.log('\n=== Multi-Platform Scan Demo ===\n');

  const result = await MultiPlatformScanner.scanBoth(
    sampleEtsyListings,
    sampleAmazonListings
  );

  console.log('Combined Results:');
  console.log(`  Total Listings: ${result.combined.totalListings}`);
  console.log(`  Total Violations: ${result.combined.totalViolations}`);
  console.log(`  Average Score: ${result.combined.avgComplianceScore}/100\n`);

  console.log('Platform Comparison:');
  console.log(`  Etsy Score: ${result.combined.platformComparison.etsyScore}`);
  console.log(`  Amazon Score: ${result.combined.platformComparison.amazonScore}`);
  console.log(`  Better Platform: ${result.combined.platformComparison.betterPlatform}\n`);

  return result;
}

/**
 * Example 4: Filter Violations by Severity
 */
export function demoSeverityFilter() {
  console.log('\n=== Severity Filter Demo ===\n');

  const result = ComplianceScanner.scanAmazonListings(sampleAmazonListings);

  // Show only critical violations
  const criticalOnly = ComplianceScanner.filterBySeverity(result, ['critical']);
  console.log(`Critical Violations Only: ${criticalOnly.violationCount}`);

  // Show critical and warning
  const importantOnly = ComplianceScanner.filterBySeverity(result, ['critical', 'warning']);
  console.log(`Critical + Warning: ${importantOnly.violationCount}\n`);

  return { criticalOnly, importantOnly };
}

/**
 * Example 5: Export Results
 */
export function demoExport() {
  console.log('\n=== Export Demo ===\n');

  const result = ComplianceScanner.scanEtsyListings(sampleEtsyListings);

  // Export to JSON
  const json = ComplianceScanner.exportToJSON(result);
  console.log('JSON Export (first 200 chars):');
  console.log(json.substring(0, 200) + '...\n');

  // Export to CSV
  const csv = ComplianceScanner.exportToCSV(result);
  console.log('CSV Export (first 200 chars):');
  console.log(csv.substring(0, 200) + '...\n');

  return { json, csv };
}

/**
 * Example 6: React Component Usage
 */
export function demoReactUsage() {
  return `
// Example React Component Using Dashboard Components

import React, { useState, useEffect } from 'react';
import { ComplianceScanner } from './lib/services/compliance-scanner';
import PlatformSwitcher from './components/PlatformSwitcher';
import MultiPlatformStats from './components/MultiPlatformStats';
import ViolationList from './components/ViolationList';

function MyDashboard() {
  const [platform, setPlatform] = useState('etsy');
  const [etsyResults, setEtsyResults] = useState(null);
  const [amazonResults, setAmazonResults] = useState(null);
  const [scores, setScores] = useState({ etsy: 0, amazon: 0 });

  // Scan Etsy
  const scanEtsy = async () => {
    // Fetch listings from Etsy API
    const listings = await fetchEtsyListings();
    const result = ComplianceScanner.scanEtsyListings(listings);
    setEtsyResults(result);

    const score = ComplianceScanner.getComplianceScore(result);
    setScores(prev => ({ ...prev, etsy: score }));
  };

  // Scan Amazon
  const scanAmazon = async () => {
    // Fetch listings from Amazon SP-API
    const listings = await fetchAmazonListings();
    const result = ComplianceScanner.scanAmazonListings(listings);
    setAmazonResults(result);

    const score = ComplianceScanner.getComplianceScore(result);
    setScores(prev => ({ ...prev, amazon: score }));
  };

  return (
    <div>
      <h1>SellerGuard Pro Dashboard</h1>

      {/* Platform Switcher */}
      <PlatformSwitcher
        currentPlatform={platform}
        onPlatformChange={setPlatform}
        etsyCount={etsyResults?.totalListings}
        amazonCount={amazonResults?.totalListings}
      />

      {/* Stats Overview */}
      <MultiPlatformStats
        etsyStats={etsyResults}
        amazonStats={amazonResults}
        complianceScores={scores}
      />

      {/* Violations List */}
      {platform === 'etsy' && etsyResults && (
        <ViolationList
          violations={etsyResults.violations}
          platform="etsy"
          onFixClick={(violation, listingId) => {
            console.log('Fix:', violation, 'for listing:', listingId);
          }}
        />
      )}

      {platform === 'amazon' && amazonResults && (
        <ViolationList
          violations={amazonResults.violations}
          platform="amazon"
          onFixClick={(violation, listingId) => {
            console.log('Fix:', violation, 'for listing:', listingId);
          }}
        />
      )}
    </div>
  );
}
  `;
}

/**
 * Run all demos
 */
export function runAllDemos() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        SellerGuard Pro - Dashboard Demo Suite         ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  demoEtsyScan();
  demoAmazonScan();
  demoMultiPlatformScan();
  demoSeverityFilter();
  demoExport();

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                   Demo Complete!                       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('React Component Usage:');
  console.log(demoReactUsage());
}

// Uncomment to run demos:
// runAllDemos();
