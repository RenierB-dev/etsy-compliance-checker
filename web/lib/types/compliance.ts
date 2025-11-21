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
  | 'shop_standards'
  | 'product_detail_page'
  | 'brand_trademarks'
  | 'restricted_categories'
  | 'fba_requirements'
  | 'content_policy'
  | 'technical_requirements';

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
  sellerSku?: string;
  title: string;
  description?: string;
  bulletPoints?: string[];
  brand?: string;
  manufacturer?: string;
  productType?: string;
  price?: number;
  currency?: string;
  listPrice?: number;
  businessPrice?: number;
  quantity?: number;
  fulfillmentChannel?: 'DEFAULT' | 'AMAZON_NA' | 'AMAZON_EU';
  condition?: string;
  conditionNote?: string;
  mainImageUrl?: string;
  images?: string[];
  category?: string;
  productCategory?: string;
  itemClassification?: string;
  browseNodes?: string[];
  attributes?: Record<string, any>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit?: string;
  };
  keywords?: string[];
  searchTerms?: string[];
  targetAudience?: string;
  status?: 'BUYABLE' | 'DISCOVERABLE' | 'DELETED';
  listingId?: string;
  issueMessages?: Array<{
    code: string;
    message: string;
    severity: 'ERROR' | 'WARNING' | 'INFO';
    attributeName?: string;
  }>;
  createdDate?: string;
  lastUpdatedDate?: string;
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
