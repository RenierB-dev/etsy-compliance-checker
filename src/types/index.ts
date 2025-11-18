export interface EtsyListing {
  listing_id: number;
  title: string;
  description: string;
  tags: string[];
  materials: string[];
  state: string;
  url: string;
  shipping_profile_id?: number;
  price?: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
}

export interface Violation {
  listing_id: number;
  listing_title: string;
  listing_url: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  field?: string;
  matched_keyword?: string;
}

export interface ScanResult {
  shop_id: string;
  scan_date: string;
  total_listings: number;
  scanned_listings: number;
  violations: Violation[];
  summary: {
    critical: number;
    warnings: number;
    info: number;
  };
}

export interface ViolationRule {
  severity: 'critical' | 'warning' | 'info';
  keywords?: string[];
  description: string;
  pattern?: string;
  field?: string;
  minCount?: number;
}

export interface ViolationRules {
  prohibitedKeywords: {
    [category: string]: ViolationRule;
  };
  requiredFields: Array<{
    field: string;
    severity: 'critical' | 'warning' | 'info';
    description: string;
    minCount?: number;
  }>;
  titlePatterns: Array<{
    pattern: string;
    severity: 'critical' | 'warning' | 'info';
    description: string;
  }>;
  descriptionPatterns: Array<{
    pattern: string;
    severity: 'critical' | 'warning' | 'info';
    description: string;
  }>;
}
