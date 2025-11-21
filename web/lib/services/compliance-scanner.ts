/**
 * SellerGuard Pro - Unified Compliance Scanner Service
 *
 * Scans listings from both Etsy and Amazon against their respective compliance rules
 */

import { allEtsyRules } from '../compliance/etsy-rules';
import { allAmazonRules } from '../compliance/amazon-rules';
import {
  Platform,
  EtsyListing,
  AmazonListing,
  ViolationResult,
  ScanResult,
  Severity
} from '../types/compliance';

export interface ScanOptions {
  platform: Platform;
  maxListings?: number;
  severityFilter?: Severity[];
  categoryFilter?: string[];
}

export interface ListingViolation {
  listingId: string | number;
  listingTitle: string;
  listingUrl?: string;
  violations: ViolationResult[];
  criticalCount: number;
  warningCount: number;
  infoCount: number;
}

/**
 * Unified Compliance Scanner
 */
export class ComplianceScanner {
  /**
   * Scan an Etsy listing for violations
   */
  static scanEtsyListing(listing: EtsyListing): ListingViolation {
    const violations: ViolationResult[] = [];

    allEtsyRules.forEach(rule => {
      const violation = rule.check(listing);
      if (violation) {
        violations.push(violation);
      }
    });

    const criticalCount = violations.filter(v => v.severity === 'critical').length;
    const warningCount = violations.filter(v => v.severity === 'warning').length;
    const infoCount = violations.filter(v => v.severity === 'info').length;

    return {
      listingId: listing.listing_id,
      listingTitle: listing.title,
      violations,
      criticalCount,
      warningCount,
      infoCount
    };
  }

  /**
   * Scan an Amazon listing for violations
   */
  static scanAmazonListing(listing: AmazonListing): ListingViolation {
    const violations: ViolationResult[] = [];

    allAmazonRules.forEach(rule => {
      const violation = rule.check(listing);
      if (violation) {
        violations.push(violation);
      }
    });

    const criticalCount = violations.filter(v => v.severity === 'critical').length;
    const warningCount = violations.filter(v => v.severity === 'warning').length;
    const infoCount = violations.filter(v => v.severity === 'info').length;

    return {
      listingId: listing.asin,
      listingTitle: listing.title,
      violations,
      criticalCount,
      warningCount,
      infoCount
    };
  }

  /**
   * Scan multiple Etsy listings
   */
  static scanEtsyListings(listings: EtsyListing[]): ScanResult {
    const timestamp = new Date().toISOString();
    const violationsPerListing: ListingViolation[] = [];

    listings.forEach(listing => {
      const result = this.scanEtsyListing(listing);
      if (result.violations.length > 0) {
        violationsPerListing.push(result);
      }
    });

    const allViolations = violationsPerListing.flatMap(v => v.violations);
    const criticalCount = allViolations.filter(v => v.severity === 'critical').length;
    const warningCount = allViolations.filter(v => v.severity === 'warning').length;
    const infoCount = allViolations.filter(v => v.severity === 'info').length;

    return {
      platform: 'etsy',
      timestamp,
      totalListings: listings.length,
      violationCount: allViolations.length,
      criticalCount,
      warningCount,
      infoCount,
      violations: violationsPerListing
    };
  }

  /**
   * Scan multiple Amazon listings
   */
  static scanAmazonListings(listings: AmazonListing[]): ScanResult {
    const timestamp = new Date().toISOString();
    const violationsPerListing: ListingViolation[] = [];

    listings.forEach(listing => {
      const result = this.scanAmazonListing(listing);
      if (result.violations.length > 0) {
        violationsPerListing.push(result);
      }
    });

    const allViolations = violationsPerListing.flatMap(v => v.violations);
    const criticalCount = allViolations.filter(v => v.severity === 'critical').length;
    const warningCount = allViolations.filter(v => v.severity === 'warning').length;
    const infoCount = allViolations.filter(v => v.severity === 'info').length;

    return {
      platform: 'amazon',
      timestamp,
      totalListings: listings.length,
      violationCount: allViolations.length,
      criticalCount,
      warningCount,
      infoCount,
      violations: violationsPerListing
    };
  }

  /**
   * Get detailed violation breakdown by category
   */
  static getViolationBreakdown(scanResult: ScanResult): {
    byCategory: Record<string, number>;
    bySeverity: Record<Severity, number>;
    topViolations: Array<{ ruleId: string; count: number; severity: Severity }>;
  } {
    const allViolations = scanResult.violations.flatMap(v => v.violations);

    // Count by category (extract from rule ID)
    const byCategory: Record<string, number> = {};
    allViolations.forEach(v => {
      const category = v.ruleId.split('-')[1]; // e.g., "ETSY-PI-001" -> "PI"
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    // Count by severity
    const bySeverity: Record<Severity, number> = {
      critical: scanResult.criticalCount,
      warning: scanResult.warningCount,
      info: scanResult.infoCount
    };

    // Count occurrences of each rule
    const ruleCount: Record<string, { count: number; severity: Severity }> = {};
    allViolations.forEach(v => {
      if (!ruleCount[v.ruleId]) {
        ruleCount[v.ruleId] = { count: 0, severity: v.severity };
      }
      ruleCount[v.ruleId].count++;
    });

    // Get top 10 most common violations
    const topViolations = Object.entries(ruleCount)
      .map(([ruleId, data]) => ({ ruleId, count: data.count, severity: data.severity }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      byCategory,
      bySeverity,
      topViolations
    };
  }

  /**
   * Filter violations by severity
   */
  static filterBySeverity(scanResult: ScanResult, severities: Severity[]): ScanResult {
    const filteredViolations = scanResult.violations.map(listing => ({
      ...listing,
      violations: listing.violations.filter(v => severities.includes(v.severity))
    })).filter(listing => listing.violations.length > 0);

    const allViolations = filteredViolations.flatMap(v => v.violations);
    const criticalCount = allViolations.filter(v => v.severity === 'critical').length;
    const warningCount = allViolations.filter(v => v.severity === 'warning').length;
    const infoCount = allViolations.filter(v => v.severity === 'info').length;

    return {
      ...scanResult,
      violationCount: allViolations.length,
      criticalCount,
      warningCount,
      infoCount,
      violations: filteredViolations
    };
  }

  /**
   * Get compliance score (0-100)
   */
  static getComplianceScore(scanResult: ScanResult): number {
    if (scanResult.totalListings === 0) return 100;

    const listingsWithViolations = scanResult.violations.length;
    const healthyListings = scanResult.totalListings - listingsWithViolations;

    // Base score on healthy listings percentage
    let score = (healthyListings / scanResult.totalListings) * 100;

    // Deduct points for severity of violations
    const avgCriticalPerListing = scanResult.criticalCount / scanResult.totalListings;
    const avgWarningPerListing = scanResult.warningCount / scanResult.totalListings;

    score -= avgCriticalPerListing * 10; // -10 points per critical violation
    score -= avgWarningPerListing * 5;   // -5 points per warning violation

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generate compliance summary
   */
  static generateSummary(scanResult: ScanResult): {
    score: number;
    grade: string;
    healthyListings: number;
    listingsWithIssues: number;
    mostCommonIssue: string | null;
    recommendation: string;
  } {
    const score = this.getComplianceScore(scanResult);
    const breakdown = this.getViolationBreakdown(scanResult);

    let grade: string;
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';

    const healthyListings = scanResult.totalListings - scanResult.violations.length;
    const listingsWithIssues = scanResult.violations.length;

    const mostCommonIssue = breakdown.topViolations[0]?.ruleId || null;

    let recommendation: string;
    if (score >= 90) {
      recommendation = 'Excellent compliance! Continue monitoring for any new violations.';
    } else if (scanResult.criticalCount > 0) {
      recommendation = `Address ${scanResult.criticalCount} critical violation(s) immediately to avoid account suspension.`;
    } else if (scanResult.warningCount > 0) {
      recommendation = `Fix ${scanResult.warningCount} warning(s) to improve listing quality and visibility.`;
    } else {
      recommendation = `Review ${scanResult.infoCount} optimization suggestions to maximize performance.`;
    }

    return {
      score,
      grade,
      healthyListings,
      listingsWithIssues,
      mostCommonIssue,
      recommendation
    };
  }

  /**
   * Compare scans over time
   */
  static compareScans(previous: ScanResult, current: ScanResult): {
    scoreChange: number;
    violationChange: number;
    criticalChange: number;
    warningChange: number;
    improved: boolean;
  } {
    const prevScore = this.getComplianceScore(previous);
    const currScore = this.getComplianceScore(current);

    return {
      scoreChange: currScore - prevScore,
      violationChange: current.violationCount - previous.violationCount,
      criticalChange: current.criticalCount - previous.criticalCount,
      warningChange: current.warningCount - previous.warningCount,
      improved: currScore > prevScore
    };
  }

  /**
   * Export scan results to JSON
   */
  static exportToJSON(scanResult: ScanResult): string {
    const summary = this.generateSummary(scanResult);
    const breakdown = this.getViolationBreakdown(scanResult);

    const exportData = {
      ...scanResult,
      summary,
      breakdown,
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export scan results to CSV
   */
  static exportToCSV(scanResult: ScanResult): string {
    const rows: string[] = [
      'Listing ID,Listing Title,Severity,Rule ID,Message,Field,Recommendation'
    ];

    scanResult.violations.forEach(listing => {
      listing.violations.forEach(violation => {
        const row = [
          listing.listingId,
          `"${listing.listingTitle.replace(/"/g, '""')}"`,
          violation.severity,
          violation.ruleId,
          `"${violation.message.replace(/"/g, '""')}"`,
          violation.field || '',
          `"${(violation.recommendation || '').replace(/"/g, '""')}"`
        ].join(',');
        rows.push(row);
      });
    });

    return rows.join('\n');
  }
}

/**
 * Multi-platform scanner for comparing both platforms
 */
export class MultiPlatformScanner {
  /**
   * Scan both platforms and compare
   */
  static async scanBoth(
    etsyListings: EtsyListing[],
    amazonListings: AmazonListing[]
  ): Promise<{
    etsy: ScanResult;
    amazon: ScanResult;
    combined: {
      totalListings: number;
      totalViolations: number;
      avgComplianceScore: number;
      platformComparison: {
        etsyScore: number;
        amazonScore: number;
        betterPlatform: Platform;
      };
    };
  }> {
    const etsyResult = ComplianceScanner.scanEtsyListings(etsyListings);
    const amazonResult = ComplianceScanner.scanAmazonListings(amazonListings);

    const etsyScore = ComplianceScanner.getComplianceScore(etsyResult);
    const amazonScore = ComplianceScanner.getComplianceScore(amazonResult);

    return {
      etsy: etsyResult,
      amazon: amazonResult,
      combined: {
        totalListings: etsyListings.length + amazonListings.length,
        totalViolations: etsyResult.violationCount + amazonResult.violationCount,
        avgComplianceScore: Math.round((etsyScore + amazonScore) / 2),
        platformComparison: {
          etsyScore,
          amazonScore,
          betterPlatform: etsyScore >= amazonScore ? 'etsy' : 'amazon'
        }
      }
    };
  }
}
