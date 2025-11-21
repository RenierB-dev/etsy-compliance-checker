/**
 * SellerGuard Pro - Amazon LWA (Login with Amazon) OAuth Manager
 *
 * Handles OAuth token management for Amazon SP-API:
 * - Access token retrieval
 * - Automatic token refresh
 * - Token caching with expiration
 * - Error handling
 */

import axios, { AxiosError } from 'axios';
import {
  LWAAuthorizationCredentials,
  LWATokenResponse,
  TokenCache
} from '../types/amazon';

const LWA_TOKEN_ENDPOINT = 'https://api.amazon.com/auth/o2/token';
const TOKEN_EXPIRY_BUFFER = 300; // Refresh 5 minutes before expiry

export class AmazonOAuthManager {
  private credentials: LWAAuthorizationCredentials;
  private tokenCache: TokenCache | null = null;

  constructor(credentials: LWAAuthorizationCredentials) {
    this.credentials = credentials;
  }

  /**
   * Get a valid access token (from cache or by refreshing)
   */
  async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.tokenCache && this.isTokenValid()) {
      return this.tokenCache.accessToken;
    }

    // Otherwise, refresh token
    await this.refreshAccessToken();

    if (!this.tokenCache) {
      throw new Error('Failed to obtain access token');
    }

    return this.tokenCache.accessToken;
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<void> {
    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.credentials.refreshToken,
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret
      });

      const response = await axios.post<LWATokenResponse>(
        LWA_TOKEN_ENDPOINT,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      const tokenData = response.data;

      // Cache the token with expiration time
      this.tokenCache = {
        accessToken: tokenData.access_token,
        tokenType: tokenData.token_type,
        expiresAt: Date.now() + (tokenData.expires_in * 1000) - (TOKEN_EXPIRY_BUFFER * 1000)
      };

      console.log('[Amazon OAuth] Access token refreshed successfully');
    } catch (error) {
      this.handleOAuthError(error);
    }
  }

  /**
   * Check if the cached token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.tokenCache) {
      return false;
    }

    return Date.now() < this.tokenCache.expiresAt;
  }

  /**
   * Force token refresh (useful for testing or error recovery)
   */
  async forceRefresh(): Promise<void> {
    this.tokenCache = null;
    await this.refreshAccessToken();
  }

  /**
   * Clear the token cache
   */
  clearCache(): void {
    this.tokenCache = null;
  }

  /**
   * Get token expiration info (for debugging)
   */
  getTokenInfo(): { isValid: boolean; expiresIn?: number } | null {
    if (!this.tokenCache) {
      return null;
    }

    const expiresIn = Math.max(0, this.tokenCache.expiresAt - Date.now());

    return {
      isValid: this.isTokenValid(),
      expiresIn: Math.floor(expiresIn / 1000) // seconds
    };
  }

  /**
   * Handle OAuth errors with detailed messages
   */
  private handleOAuthError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;

        switch (status) {
          case 400:
            if (data?.error === 'invalid_grant') {
              throw new Error(
                'Amazon OAuth: Invalid refresh token. Please re-authorize your application in Amazon Seller Central.'
              );
            }
            throw new Error(
              `Amazon OAuth: Bad request - ${data?.error_description || data?.error || 'Unknown error'}`
            );

          case 401:
            throw new Error(
              'Amazon OAuth: Invalid client credentials. Check your Client ID and Client Secret.'
            );

          case 403:
            throw new Error(
              'Amazon OAuth: Access forbidden. Verify your application permissions.'
            );

          case 429:
            throw new Error(
              'Amazon OAuth: Rate limit exceeded. Please wait before retrying.'
            );

          case 500:
          case 502:
          case 503:
          case 504:
            throw new Error(
              `Amazon OAuth: Server error (${status}). Please try again later.`
            );

          default:
            throw new Error(
              `Amazon OAuth: HTTP ${status} - ${data?.error_description || 'Unknown error'}`
            );
        }
      } else if (axiosError.request) {
        throw new Error(
          'Amazon OAuth: No response from server. Check your internet connection.'
        );
      }
    }

    // Generic error
    throw new Error(
      `Amazon OAuth: Unexpected error - ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  /**
   * Validate credentials format
   */
  static validateCredentials(credentials: LWAAuthorizationCredentials): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!credentials.clientId || credentials.clientId.trim() === '') {
      errors.push('Client ID is required');
    }

    if (!credentials.clientSecret || credentials.clientSecret.trim() === '') {
      errors.push('Client Secret is required');
    }

    if (!credentials.refreshToken || credentials.refreshToken.trim() === '') {
      errors.push('Refresh Token is required');
    }

    // Basic format validation
    if (credentials.clientId && !credentials.clientId.startsWith('amzn1.application-oa2-client.')) {
      errors.push('Client ID should start with "amzn1.application-oa2-client."');
    }

    if (credentials.refreshToken && !credentials.refreshToken.startsWith('Atzr|')) {
      errors.push('Refresh Token should start with "Atzr|"');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * Factory function to create OAuth manager
 */
export function createAmazonOAuthManager(
  credentials: LWAAuthorizationCredentials
): AmazonOAuthManager {
  const validation = AmazonOAuthManager.validateCredentials(credentials);

  if (!validation.valid) {
    throw new Error(
      `Invalid Amazon OAuth credentials:\n${validation.errors.join('\n')}`
    );
  }

  return new AmazonOAuthManager(credentials);
}
