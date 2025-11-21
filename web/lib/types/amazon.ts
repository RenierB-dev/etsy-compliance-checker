/**
 * SellerGuard Pro - Amazon SP-API Type Definitions
 *
 * Types for Amazon Selling Partner API integration
 * Covers: Catalog Items API, Listings Items API, and OAuth (LWA)
 */

// ============================================================================
// AMAZON SP-API CONFIGURATION
// ============================================================================

export interface AmazonSPAPIConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessKeyId: string;
  secretAccessKey: string;
  roleArn?: string;
  region: string; // e.g., 'us-east-1'
  marketplaceId: string; // e.g., 'ATVPDKIKX0DER' (US)
  sellerId?: string;
}

export interface AmazonMarketplace {
  id: string;
  countryCode: string;
  name: string;
  endpoint: string;
}

// Pre-defined marketplaces
export const AMAZON_MARKETPLACES: Record<string, AmazonMarketplace> = {
  US: {
    id: 'ATVPDKIKX0DER',
    countryCode: 'US',
    name: 'United States',
    endpoint: 'https://sellingpartnerapi-na.amazon.com'
  },
  CA: {
    id: 'A2EUQ1WTGCTBG2',
    countryCode: 'CA',
    name: 'Canada',
    endpoint: 'https://sellingpartnerapi-na.amazon.com'
  },
  MX: {
    id: 'A1AM78C64UM0Y8',
    countryCode: 'MX',
    name: 'Mexico',
    endpoint: 'https://sellingpartnerapi-na.amazon.com'
  },
  UK: {
    id: 'A1F83G8C2ARO7P',
    countryCode: 'GB',
    name: 'United Kingdom',
    endpoint: 'https://sellingpartnerapi-eu.amazon.com'
  },
  DE: {
    id: 'A1PA6795UKMFR9',
    countryCode: 'DE',
    name: 'Germany',
    endpoint: 'https://sellingpartnerapi-eu.amazon.com'
  },
  FR: {
    id: 'A13V1IB3VIYZZH',
    countryCode: 'FR',
    name: 'France',
    endpoint: 'https://sellingpartnerapi-eu.amazon.com'
  },
  IT: {
    id: 'APJ6JRA9NG5V4',
    countryCode: 'IT',
    name: 'Italy',
    endpoint: 'https://sellingpartnerapi-eu.amazon.com'
  },
  ES: {
    id: 'A1RKKUPIHCS9HS',
    countryCode: 'ES',
    name: 'Spain',
    endpoint: 'https://sellingpartnerapi-eu.amazon.com'
  },
  JP: {
    id: 'A1VC38T7YXB528',
    countryCode: 'JP',
    name: 'Japan',
    endpoint: 'https://sellingpartnerapi-fe.amazon.com'
  },
  AU: {
    id: 'A39IBJ37TRP1C6',
    countryCode: 'AU',
    name: 'Australia',
    endpoint: 'https://sellingpartnerapi-fe.amazon.com'
  }
};

// ============================================================================
// OAUTH (LWA) - LOGIN WITH AMAZON
// ============================================================================

export interface LWATokenResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number; // seconds
  refresh_token?: string;
}

export interface LWAAuthorizationCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

// ============================================================================
// AMAZON LISTING ITEM
// ============================================================================

export interface AmazonListing {
  // Identifiers
  asin: string;
  sku: string;
  sellerSku?: string;

  // Basic Info
  title: string;
  description?: string;
  bulletPoints?: string[];
  brand?: string;
  manufacturer?: string;
  productType?: string;

  // Pricing
  price?: number;
  currency?: string;
  listPrice?: number;
  businessPrice?: number;

  // Inventory
  quantity?: number;
  fulfillmentChannel?: 'DEFAULT' | 'AMAZON_NA' | 'AMAZON_EU'; // FBA vs FBM
  condition?: AmazonCondition;
  conditionNote?: string;

  // Images
  mainImageUrl?: string;
  images?: string[];

  // Categorization
  category?: string;
  productCategory?: string;
  itemClassification?: string;
  browseNodes?: string[];

  // Attributes
  attributes?: Record<string, any>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit?: string;
  };

  // Compliance
  keywords?: string[];
  searchTerms?: string[];
  targetAudience?: string;

  // Status
  status?: 'BUYABLE' | 'DISCOVERABLE' | 'DELETED';
  listingId?: string;
  issueMessages?: AmazonIssue[];

  // Metadata
  createdDate?: string;
  lastUpdatedDate?: string;
}

export type AmazonCondition =
  | 'New'
  | 'Refurbished'
  | 'UsedLikeNew'
  | 'UsedVeryGood'
  | 'UsedGood'
  | 'UsedAcceptable'
  | 'CollectibleLikeNew'
  | 'CollectibleVeryGood'
  | 'CollectibleGood'
  | 'CollectibleAcceptable';

export interface AmazonIssue {
  code: string;
  message: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  attributeName?: string;
}

// ============================================================================
// SP-API CATALOG ITEMS API (v2022-04-01)
// ============================================================================

export interface CatalogItemsSearchParams {
  keywords?: string;
  marketplaceIds: string[];
  includedData?: CatalogIncludedData[];
  brandNames?: string[];
  classificationIds?: string[];
  pageSize?: number;
  pageToken?: string;
  keywordsLocale?: string;
  locale?: string;
}

export type CatalogIncludedData =
  | 'identifiers'
  | 'images'
  | 'productTypes'
  | 'salesRanks'
  | 'summaries'
  | 'variations'
  | 'vendorDetails'
  | 'dimensions'
  | 'attributes';

export interface CatalogItem {
  asin: string;
  identifiers?: {
    marketplaceId: string;
    identifiers: Array<{
      identifier: string;
      identifierType: string; // UPC, EAN, ISBN, etc.
    }>;
  }[];
  images?: {
    marketplaceId: string;
    images: Array<{
      variant: string; // MAIN, PT01, PT02, etc.
      link: string;
      height: number;
      width: number;
    }>;
  }[];
  productTypes?: {
    marketplaceId: string;
    productType: string;
  }[];
  salesRanks?: {
    marketplaceId: string;
    ranks: Array<{
      title: string;
      link?: string;
      rank: number;
    }>;
  }[];
  summaries?: {
    marketplaceId: string;
    brandName?: string;
    browseNode?: string;
    colorName?: string;
    itemName?: string;
    manufacturer?: string;
    modelNumber?: string;
    sizeName?: string;
    styleName?: string;
  }[];
}

export interface CatalogItemsResponse {
  items: CatalogItem[];
  pagination?: {
    nextToken?: string;
    previousToken?: string;
  };
}

// ============================================================================
// SP-API LISTINGS ITEMS API (v2021-08-01)
// ============================================================================

export interface ListingsItemPutRequest {
  productType: string;
  requirements?: 'LISTING' | 'LISTING_PRODUCT_ONLY' | 'LISTING_OFFER_ONLY';
  attributes: Record<string, any>;
}

export interface ListingsItemPatchRequest {
  productType: string;
  patches: Array<{
    op: 'add' | 'replace' | 'delete';
    path: string;
    value?: any;
  }>;
}

export interface ListingsItemResponse {
  sku: string;
  status: 'ACCEPTED' | 'INVALID' | 'DELETED';
  submissionId: string;
  issues?: AmazonIssue[];
}

export interface ListingsItem {
  sku: string;
  summaries?: Array<{
    marketplaceId: string;
    asin?: string;
    productType?: string;
    conditionType?: AmazonCondition;
    status: string[];
    fulfillmentChannel?: string[];
    itemName?: string;
    createdDate?: string;
    lastUpdatedDate?: string;
    mainImage?: {
      link: string;
      height: number;
      width: number;
    };
  }>;
  attributes?: Record<string, any>;
  issues?: AmazonIssue[];
}

export interface ListingsItemSearchResponse {
  items: ListingsItem[];
  pagination?: {
    nextToken?: string;
  };
}

// ============================================================================
// SP-API ERROR RESPONSES
// ============================================================================

export interface SPAPIError {
  code: string;
  message: string;
  details?: string;
}

export interface SPAPIErrorResponse {
  errors: SPAPIError[];
}

// ============================================================================
// RATE LIMITING
// ============================================================================

export interface RateLimitInfo {
  rate: number; // requests per second
  burst: number; // max burst
  resetAt?: Date;
}

export const SP_API_RATE_LIMITS: Record<string, RateLimitInfo> = {
  // Catalog Items API
  'catalog.searchCatalogItems': { rate: 2, burst: 2 },
  'catalog.getCatalogItem': { rate: 2, burst: 2 },

  // Listings Items API
  'listings.getListingsItem': { rate: 5, burst: 10 },
  'listings.putListingsItem': { rate: 5, burst: 10 },
  'listings.deleteListingsItem': { rate: 5, burst: 10 },
  'listings.patchListingsItem': { rate: 5, burst: 10 },

  // Reports API (for bulk listing data)
  'reports.createReport': { rate: 0.0167, burst: 15 }, // ~1 per minute
  'reports.getReport': { rate: 2, burst: 15 },
  'reports.getReportDocument': { rate: 0.0167, burst: 15 }
};

// ============================================================================
// TOKEN CACHE
// ============================================================================

export interface TokenCache {
  accessToken: string;
  expiresAt: number; // timestamp
  tokenType: string;
}

// ============================================================================
// SERVICE RESPONSE WRAPPER
// ============================================================================

export interface AmazonAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  rateLimitRemaining?: number;
}
