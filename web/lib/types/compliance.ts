/**
 * SellerGuard Pro - Compliance Type Definitions
 */

export type Platform = 'etsy' | 'amazon';

export type Severity = 'critical' | 'warning' | 'info';

export type RuleCategory =
  | 'prohibited_items'
  | 'title_description'
  | 'policy_compliance'
  | 'pricing_fees'
  | 'shop_standards';

export interface ComplianceRule<T = EtsyListing | AmazonListing> {
  id: string;
  category: RuleCategory;
  severity: Severity;
  name: string;
  description: string;
  platform: Platform;
  check: (listing: T) => ViolationResult | null;
}

// Platform-specific rule types
export type EtsyComplianceRule = ComplianceRule<EtsyListing>;
export type AmazonComplianceRule = ComplianceRule<AmazonListing>;

export interface ViolationResult {
  ruleId: string;
  severity: Severity;
  message: string;
  field?: string;
  matchedValue?: string;
  recommendation?: string;
}

export interface EtsyListing {
  listing_id: number;
  title: string;
  description: string;
  price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  quantity: number;
  state: string;
  tags: string[];
  materials: string[];
  taxonomy_id?: number;
  shipping_profile_id?: number;
  processing_min?: number;
  processing_max?: number;
  who_made?: string;
  when_made?: string;
  is_supply?: boolean;
  images?: Array<{ url_fullxfull: string }>;
  shop_section_id?: number;
}

export interface AmazonListing {
  asin: string;
  sku: string;
  title: string;
  description: string;
  bulletPoints: string[];
  price: number;
  currency: string;
  quantity: number;
  condition: string;
  category: string;
  brand?: string;
  manufacturer?: string;
  images?: string[];
  keywords?: string[];
  attributes?: Record<string, any>;
}

export interface ScanResult {
  platform: Platform;
  timestamp: string;
  totalListings: number;
  violationCount: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  violations: Array<{
    listingId: string | number;
    listingTitle: string;
    violations: ViolationResult[];
  }>;
}
