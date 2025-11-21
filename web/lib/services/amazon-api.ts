/**
 * SellerGuard Pro - Amazon SP-API Client
 *
 * Full-featured Amazon Selling Partner API integration with:
 * - OAuth (LWA) authentication
 * - AWS Signature Version 4 signing
 * - Catalog Items API (product search)
 * - Listings Items API (seller inventory)
 * - Rate limiting
 * - Error handling
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import crypto from 'crypto';
import {
  AmazonSPAPIConfig,
  AmazonListing,
  AmazonAPIResponse,
  CatalogItemsSearchParams,
  CatalogItemsResponse,
  CatalogItem,
  ListingsItem,
  ListingsItemSearchResponse,
  SPAPIErrorResponse,
  RateLimitInfo,
  SP_API_RATE_LIMITS,
  AMAZON_MARKETPLACES
} from '../types/amazon';
import { AmazonOAuthManager, createAmazonOAuthManager } from './amazon-oauth';

/**
 * Rate limiter to prevent exceeding SP-API rate limits
 */
class RateLimiter {
  private queues: Map<string, number[]> = new Map();

  async throttle(endpoint: string): Promise<void> {
    const limit = SP_API_RATE_LIMITS[endpoint];
    if (!limit) {
      return; // No rate limit defined
    }

    const now = Date.now();
    const queue = this.queues.get(endpoint) || [];

    // Remove timestamps older than 1 second
    const recentRequests = queue.filter(timestamp => now - timestamp < 1000);

    // Check if we're at the rate limit
    if (recentRequests.length >= limit.rate) {
      const oldestRequest = recentRequests[0];
      const waitTime = 1000 - (now - oldestRequest);

      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    // Record this request
    recentRequests.push(Date.now());
    this.queues.set(endpoint, recentRequests);
  }
}

/**
 * AWS Signature Version 4 Signer
 */
class AWSSignatureV4 {
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;
  private service: string = 'execute-api';

  constructor(accessKeyId: string, secretAccessKey: string, region: string) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
  }

  /**
   * Sign an HTTP request with AWS Signature Version 4
   */
  sign(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: string
  ): Record<string, string> {
    const urlObj = new URL(url);
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const date = timestamp.substr(0, 8);

    // Canonical headers
    const signedHeaders = 'host;x-amz-date';
    const canonicalHeaders = `host:${urlObj.hostname}\nx-amz-date:${timestamp}\n`;

    // Canonical request
    const payloadHash = crypto.createHash('sha256').update(body || '').digest('hex');
    const canonicalRequest = [
      method,
      urlObj.pathname,
      urlObj.search.slice(1), // Remove leading '?'
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');

    // String to sign
    const credentialScope = `${date}/${this.region}/${this.service}/aws4_request`;
    const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timestamp,
      credentialScope,
      canonicalRequestHash
    ].join('\n');

    // Calculate signature
    const signature = this.calculateSignature(date, stringToSign);

    // Authorization header
    const authorization = [
      `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`
    ].join(', ');

    return {
      ...headers,
      'host': urlObj.hostname,
      'x-amz-date': timestamp,
      'Authorization': authorization
    };
  }

  private calculateSignature(date: string, stringToSign: string): string {
    const kDate = this.hmac(`AWS4${this.secretAccessKey}`, date);
    const kRegion = this.hmac(kDate, this.region);
    const kService = this.hmac(kRegion, this.service);
    const kSigning = this.hmac(kService, 'aws4_request');
    return this.hmac(kSigning, stringToSign, 'hex');
  }

  private hmac(key: string | Buffer, data: string, encoding?: 'hex'): any {
    const hmac = crypto.createHmac('sha256', key).update(data);
    return encoding ? hmac.digest(encoding) : hmac.digest();
  }
}

/**
 * Amazon SP-API Service
 */
export class AmazonSPAPIService {
  private config: AmazonSPAPIConfig;
  private oauthManager: AmazonOAuthManager;
  private rateLimiter: RateLimiter;
  private signer: AWSSignatureV4;
  private endpoint: string;

  constructor(config: AmazonSPAPIConfig) {
    this.config = config;

    // Initialize OAuth manager
    this.oauthManager = createAmazonOAuthManager({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken
    });

    // Initialize rate limiter
    this.rateLimiter = new RateLimiter();

    // Initialize AWS signer
    this.signer = new AWSSignatureV4(
      config.accessKeyId,
      config.secretAccessKey,
      config.region
    );

    // Get endpoint from marketplace
    const marketplace = Object.values(AMAZON_MARKETPLACES).find(
      m => m.id === config.marketplaceId
    );
    this.endpoint = marketplace?.endpoint || AMAZON_MARKETPLACES.US.endpoint;
  }

  // ==========================================================================
  // LISTINGS ITEMS API - Get Seller Inventory
  // ==========================================================================

  /**
   * Get all active listings for the seller
   */
  async getListings(options?: {
    maxResults?: number;
    includeInactive?: boolean;
  }): Promise<AmazonAPIResponse<AmazonListing[]>> {
    try {
      const listings: AmazonListing[] = [];
      let nextToken: string | undefined;
      const maxResults = options?.maxResults || 100;

      do {
        await this.rateLimiter.throttle('listings.getListingsItem');

        const url = this.buildUrl('/listings/2021-08-01/items', {
          marketplaceIds: this.config.marketplaceId,
          sellerId: this.config.sellerId || '',
          pageSize: '20',
          ...(nextToken && { pageToken: nextToken })
        });

        const response = await this.makeRequest<ListingsItemSearchResponse>('GET', url);

        if (response.success && response.data) {
          const items = response.data.items;

          for (const item of items) {
            const listing = this.convertListingsItemToListing(item);
            listings.push(listing);

            if (listings.length >= maxResults) {
              return {
                success: true,
                data: listings
              };
            }
          }

          nextToken = response.data.pagination?.nextToken;
        } else {
          return {
            success: false,
            error: response.error
          };
        }
      } while (nextToken);

      return {
        success: true,
        data: listings
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get a specific listing by SKU
   */
  async getListingBySKU(sku: string): Promise<AmazonAPIResponse<AmazonListing>> {
    try {
      await this.rateLimiter.throttle('listings.getListingsItem');

      const url = this.buildUrl(`/listings/2021-08-01/items/${this.config.sellerId}/${sku}`, {
        marketplaceIds: this.config.marketplaceId,
        includedData: 'summaries,attributes,issues'
      });

      const response = await this.makeRequest<ListingsItem>('GET', url);

      if (response.success && response.data) {
        return {
          success: true,
          data: this.convertListingsItemToListing(response.data)
        };
      }

      return {
        success: false,
        error: response.error
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // CATALOG ITEMS API - Product Information
  // ==========================================================================

  /**
   * Search catalog items by keyword
   */
  async searchCatalog(
    keywords: string,
    options?: { pageSize?: number }
  ): Promise<AmazonAPIResponse<CatalogItem[]>> {
    try {
      await this.rateLimiter.throttle('catalog.searchCatalogItems');

      const url = this.buildUrl('/catalog/2022-04-01/items', {
        keywords,
        marketplaceIds: this.config.marketplaceId,
        includedData: 'summaries,images,identifiers',
        pageSize: String(options?.pageSize || 20)
      });

      const response = await this.makeRequest<CatalogItemsResponse>('GET', url);

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.items
        };
      }

      return {
        success: false,
        error: response.error
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get catalog item details by ASIN
   */
  async getCatalogItem(asin: string): Promise<AmazonAPIResponse<CatalogItem>> {
    try {
      await this.rateLimiter.throttle('catalog.getCatalogItem');

      const url = this.buildUrl(`/catalog/2022-04-01/items/${asin}`, {
        marketplaceIds: this.config.marketplaceId,
        includedData: 'summaries,images,identifiers,productTypes,dimensions,attributes'
      });

      const response = await this.makeRequest<CatalogItem>('GET', url);

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Convert ListingsItem to AmazonListing format
   */
  private convertListingsItemToListing(item: ListingsItem): AmazonListing {
    const summary = item.summaries?.[0];
    const attributes = item.attributes || {};

    return {
      asin: summary?.asin || '',
      sku: item.sku,
      sellerSku: item.sku,

      // Basic info from attributes
      title: this.extractAttribute(attributes, 'item_name') || summary?.itemName || '',
      description: this.extractAttribute(attributes, 'product_description'),
      bulletPoints: this.extractAttribute(attributes, 'bullet_point'),
      brand: this.extractAttribute(attributes, 'brand'),
      manufacturer: this.extractAttribute(attributes, 'manufacturer'),

      // Pricing
      price: this.extractPrice(attributes),
      currency: 'USD', // Default, should be detected from marketplace

      // Inventory
      quantity: this.extractAttribute(attributes, 'fulfillment_availability')?.quantity,
      fulfillmentChannel: this.extractAttribute(attributes, 'fulfillment_channel_code'),
      condition: summary?.conditionType,

      // Images
      mainImageUrl: summary?.mainImage?.link,
      images: this.extractImages(attributes),

      // Category
      productType: summary?.productType,

      // Attributes
      attributes: attributes,

      // Status
      status: this.determineStatus(summary?.status),
      issueMessages: item.issues,

      // Metadata
      createdDate: summary?.createdDate,
      lastUpdatedDate: summary?.lastUpdatedDate,

      // Keywords
      keywords: this.extractAttribute(attributes, 'generic_keyword') ||
                this.extractAttribute(attributes, 'search_terms')
    };
  }

  /**
   * Extract attribute value (handles single values and arrays)
   */
  private extractAttribute(attributes: Record<string, any>, key: string): any {
    const value = attributes[key];
    if (!value) return undefined;

    // SP-API wraps attributes in objects with value/marketplace_id
    if (Array.isArray(value) && value.length > 0) {
      if (value[0].value !== undefined) {
        return value.map(v => v.value);
      }
      return value;
    }

    if (value.value !== undefined) {
      return value.value;
    }

    return value;
  }

  /**
   * Extract price from attributes
   */
  private extractPrice(attributes: Record<string, any>): number | undefined {
    const price = this.extractAttribute(attributes, 'purchasable_offer');
    if (price && Array.isArray(price) && price.length > 0) {
      return price[0]?.our_price?.[0]?.schedule?.[0]?.value_with_tax || undefined;
    }
    return undefined;
  }

  /**
   * Extract image URLs
   */
  private extractImages(attributes: Record<string, any>): string[] {
    const images: string[] = [];

    const mainImage = this.extractAttribute(attributes, 'main_product_image_locator');
    if (mainImage) {
      images.push(...(Array.isArray(mainImage) ? mainImage : [mainImage]));
    }

    const otherImages = this.extractAttribute(attributes, 'other_product_image_locator');
    if (otherImages) {
      images.push(...(Array.isArray(otherImages) ? otherImages : [otherImages]));
    }

    return images;
  }

  /**
   * Determine listing status
   */
  private determineStatus(statuses?: string[]): 'BUYABLE' | 'DISCOVERABLE' | 'DELETED' {
    if (!statuses || statuses.length === 0) return 'DELETED';
    if (statuses.includes('BUYABLE')) return 'BUYABLE';
    if (statuses.includes('DISCOVERABLE')) return 'DISCOVERABLE';
    return 'DELETED';
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path, this.endpoint);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value);
        }
      });
    }

    return url.toString();
  }

  /**
   * Make authenticated request to SP-API
   */
  private async makeRequest<T>(
    method: string,
    url: string,
    body?: any
  ): Promise<AmazonAPIResponse<T>> {
    try {
      // Get access token
      const accessToken = await this.oauthManager.getAccessToken();

      // Prepare headers
      let headers: Record<string, string> = {
        'x-amz-access-token': accessToken,
        'Content-Type': 'application/json'
      };

      // Sign request with AWS Signature V4
      const bodyString = body ? JSON.stringify(body) : undefined;
      headers = this.signer.sign(method, url, headers, bodyString);

      // Make request
      const config: AxiosRequestConfig = {
        method,
        url,
        headers,
        ...(bodyString && { data: bodyString }),
        timeout: 30000
      };

      const response = await axios(config);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError<T>(error: unknown): AmazonAPIResponse<T> {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<SPAPIErrorResponse>;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;

        // Extract error message
        let message = 'Unknown error';
        if (data?.errors && data.errors.length > 0) {
          message = data.errors.map(e => e.message).join('; ');
        }

        return {
          success: false,
          error: {
            code: `HTTP_${status}`,
            message: `Amazon SP-API Error: ${message}`,
            details: data
          }
        };
      } else if (axiosError.request) {
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: 'No response from Amazon SP-API. Check your connection.'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    };
  }

  /**
   * Test connection to Amazon SP-API
   */
  async testConnection(): Promise<AmazonAPIResponse<{ message: string }>> {
    try {
      // Try to get access token
      await this.oauthManager.getAccessToken();

      // Try a simple API call (search catalog with minimal results)
      const result = await this.searchCatalog('test', { pageSize: 1 });

      if (result.success) {
        return {
          success: true,
          data: {
            message: 'Successfully connected to Amazon SP-API'
          }
        };
      }

      return {
        success: false,
        error: result.error
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

/**
 * Factory function to create Amazon API service
 */
export function createAmazonAPIService(config: AmazonSPAPIConfig): AmazonSPAPIService {
  // Validate configuration
  const errors: string[] = [];

  if (!config.clientId) errors.push('Client ID is required');
  if (!config.clientSecret) errors.push('Client Secret is required');
  if (!config.refreshToken) errors.push('Refresh Token is required');
  if (!config.accessKeyId) errors.push('AWS Access Key ID is required');
  if (!config.secretAccessKey) errors.push('AWS Secret Access Key is required');
  if (!config.region) errors.push('AWS Region is required');
  if (!config.marketplaceId) errors.push('Marketplace ID is required');

  if (errors.length > 0) {
    throw new Error(`Invalid Amazon SP-API configuration:\n${errors.join('\n')}`);
  }

  return new AmazonSPAPIService(config);
}
