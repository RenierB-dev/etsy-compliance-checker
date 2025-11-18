import axios, { AxiosInstance } from 'axios';
import { EtsyListing } from '../types';

export class EtsyApiService {
  private client: AxiosInstance;
  private apiKey: string;
  private shopId: string;
  private rateLimitDelay: number = 500; // 500ms delay between requests

  constructor(apiKey: string, shopId: string) {
    this.apiKey = apiKey;
    this.shopId = shopId;

    this.client = axios.create({
      baseURL: 'https://openapi.etsy.com/v3',
      headers: {
        'x-api-key': this.apiKey,
      },
    });
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getShopListings(limit: number = 100): Promise<EtsyListing[]> {
    try {
      const listings: EtsyListing[] = [];
      let offset = 0;
      const batchSize = 25; // Etsy API limit per request

      while (offset < limit) {
        await this.sleep(this.rateLimitDelay);

        const response = await this.client.get(`/application/shops/${this.shopId}/listings/active`, {
          params: {
            limit: Math.min(batchSize, limit - offset),
            offset: offset,
          },
        });

        if (response.data && response.data.results) {
          listings.push(...response.data.results);

          if (response.data.results.length < batchSize) {
            break; // No more listings
          }

          offset += batchSize;
        } else {
          break;
        }
      }

      return listings;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Etsy API Error: ${error.response.status} - ${error.response.data?.error || error.message}`);
      }
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }
  }

  async getListingDetails(listingId: number): Promise<EtsyListing> {
    try {
      await this.sleep(this.rateLimitDelay);

      const response = await this.client.get(`/application/listings/${listingId}`);

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Etsy API Error: ${error.response.status} - ${error.response.data?.error || error.message}`);
      }
      throw new Error(`Failed to fetch listing details: ${error.message}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get(`/application/shops/${this.shopId}`);
      return true;
    } catch (error) {
      return false;
    }
  }
}
