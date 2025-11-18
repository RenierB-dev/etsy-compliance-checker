// Import existing CLI services
import { EtsyApiService } from '../../src/services/etsyApi';
import { ViolationDetector } from '../../src/services/violationDetector';
import { ReportGenerator } from '../../src/services/reportGenerator';
import { EtsyListing, ScanResult, Violation } from '../../src/types';

export interface ScanOptions {
  apiKey: string;
  shopId: string;
  limit?: number;
}

/**
 * Server-side scan function that reuses existing CLI logic
 * This wraps the existing EtsyApiService and ViolationDetector
 */
export async function scanShop(options: ScanOptions): Promise<ScanResult> {
  const { apiKey, shopId, limit = 100 } = options;

  // Reuse existing CLI services
  const etsyApi = new EtsyApiService(apiKey, shopId);
  const detector = new ViolationDetector();

  try {
    // Test connection first
    const connected = await etsyApi.testConnection();
    if (!connected) {
      throw new Error('Failed to connect to Etsy API. Check your API key and shop ID.');
    }

    // Get listings using existing CLI service
    const listings = await etsyApi.getShopListings(limit);

    // Detect violations using existing CLI detector
    const allViolations: Violation[] = [];
    for (const listing of listings) {
      const violations = detector.detectViolations(listing);
      allViolations.push(...violations);
    }

    // Calculate summary
    const summary = {
      critical: allViolations.filter(v => v.severity === 'critical').length,
      warnings: allViolations.filter(v => v.severity === 'warning').length,
      info: allViolations.filter(v => v.severity === 'info').length,
    };

    const result: ScanResult = {
      shop_id: shopId,
      scan_date: new Date().toISOString(),
      total_listings: listings.length,
      scanned_listings: listings.length,
      violations: allViolations,
      summary,
    };

    return result;
  } catch (error: any) {
    throw new Error(`Scan failed: ${error.message}`);
  }
}

/**
 * Calculate compliance score (0-100)
 */
export function calculateComplianceScore(result: ScanResult): number {
  if (result.scanned_listings === 0) return 100;

  const totalViolations = result.summary.critical + result.summary.warnings + result.summary.info;
  if (totalViolations === 0) return 100;

  // Weight violations by severity
  const weightedViolations =
    (result.summary.critical * 3) +
    (result.summary.warnings * 2) +
    (result.summary.info * 1);

  // Max possible violations (assuming each listing has 3 critical violations)
  const maxPossibleViolations = result.scanned_listings * 3 * 3;

  // Calculate score
  const score = Math.max(0, 100 - ((weightedViolations / maxPossibleViolations) * 100));

  return Math.round(score);
}

/**
 * Get listings with violations
 */
export function getListingsWithViolations(result: ScanResult): Array<{
  listing_id: number;
  listing_title: string;
  listing_url: string;
  violations: Violation[];
  criticalCount: number;
  warningCount: number;
  infoCount: number;
}> {
  const listingsMap = new Map<number, Violation[]>();

  for (const violation of result.violations) {
    if (!listingsMap.has(violation.listing_id)) {
      listingsMap.set(violation.listing_id, []);
    }
    listingsMap.get(violation.listing_id)!.push(violation);
  }

  const listings = Array.from(listingsMap.entries()).map(([listingId, violations]) => {
    const first = violations[0];
    return {
      listing_id: listingId,
      listing_title: first.listing_title,
      listing_url: first.listing_url,
      violations,
      criticalCount: violations.filter(v => v.severity === 'critical').length,
      warningCount: violations.filter(v => v.severity === 'warning').length,
      infoCount: violations.filter(v => v.severity === 'info').length,
    };
  });

  // Sort by severity (critical first)
  return listings.sort((a, b) => {
    if (a.criticalCount !== b.criticalCount) {
      return b.criticalCount - a.criticalCount;
    }
    if (a.warningCount !== b.warningCount) {
      return b.warningCount - a.warningCount;
    }
    return b.infoCount - a.infoCount;
  });
}

/**
 * Get fix suggestions for a violation
 */
export function getFixSuggestions(violation: Violation): string[] {
  const suggestions: string[] = [];

  if (violation.matched_keyword) {
    suggestions.push(`Remove the keyword "${violation.matched_keyword}" from your listing`);
  }

  if (violation.field === 'title') {
    suggestions.push('Edit your listing title to fix this issue');
  } else if (violation.field === 'description') {
    suggestions.push('Update your listing description');
  } else if (violation.field === 'materials') {
    suggestions.push('Add materials information to your listing');
  } else if (violation.field === 'tags') {
    suggestions.push('Add more tags to improve discoverability');
  }

  if (violation.severity === 'critical') {
    suggestions.push('⚠️ This is a critical issue - fix immediately to avoid shop suspension');
  }

  return suggestions;
}

// Re-export types for convenience
export type { ScanResult, Violation, EtsyListing };
