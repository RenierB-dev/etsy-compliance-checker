/**
 * SellerGuard Pro - Environment Configuration Loader
 *
 * Loads and validates environment variables for both Etsy and Amazon APIs
 */

import { AmazonSPAPIConfig } from '../types/amazon';

/**
 * Etsy API Configuration
 */
export interface EtsyConfig {
  apiKey: string;
  shopId: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
}

/**
 * Load Etsy configuration from environment
 */
export function loadEtsyConfig(): EtsyConfig | null {
  const apiKey = process.env.ETSY_API_KEY;
  const shopId = process.env.ETSY_SHOP_ID;

  if (!apiKey || !shopId) {
    return null;
  }

  return {
    apiKey,
    shopId,
    clientId: process.env.ETSY_CLIENT_ID,
    clientSecret: process.env.ETSY_CLIENT_SECRET,
    accessToken: process.env.ETSY_ACCESS_TOKEN
  };
}

/**
 * Load Amazon SP-API configuration from environment
 */
export function loadAmazonConfig(): AmazonSPAPIConfig | null {
  const clientId = process.env.AMAZON_CLIENT_ID;
  const clientSecret = process.env.AMAZON_CLIENT_SECRET;
  const refreshToken = process.env.AMAZON_REFRESH_TOKEN;
  const accessKeyId = process.env.AMAZON_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AMAZON_SECRET_ACCESS_KEY;
  const region = process.env.AMAZON_REGION || 'us-east-1';
  const marketplaceId = process.env.AMAZON_MARKETPLACE_ID || 'ATVPDKIKX0DER';

  if (!clientId || !clientSecret || !refreshToken || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    accessKeyId,
    secretAccessKey,
    region,
    marketplaceId,
    sellerId: process.env.AMAZON_SELLER_ID
  };
}

/**
 * Validate Etsy configuration
 */
export function validateEtsyConfig(config: EtsyConfig | null): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config) {
    errors.push('Etsy configuration is missing');
    return { valid: false, errors };
  }

  if (!config.apiKey || config.apiKey.trim() === '') {
    errors.push('ETSY_API_KEY is required');
  }

  if (!config.shopId || config.shopId.trim() === '') {
    errors.push('ETSY_SHOP_ID is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate Amazon configuration
 */
export function validateAmazonConfig(config: AmazonSPAPIConfig | null): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config) {
    errors.push('Amazon configuration is missing');
    return { valid: false, errors };
  }

  if (!config.clientId || !config.clientId.startsWith('amzn1.application-oa2-client.')) {
    errors.push('AMAZON_CLIENT_ID is invalid (should start with "amzn1.application-oa2-client.")');
  }

  if (!config.clientSecret) {
    errors.push('AMAZON_CLIENT_SECRET is required');
  }

  if (!config.refreshToken || !config.refreshToken.startsWith('Atzr|')) {
    errors.push('AMAZON_REFRESH_TOKEN is invalid (should start with "Atzr|")');
  }

  if (!config.accessKeyId || config.accessKeyId.length < 16) {
    errors.push('AMAZON_ACCESS_KEY_ID is invalid');
  }

  if (!config.secretAccessKey || config.secretAccessKey.length < 20) {
    errors.push('AMAZON_SECRET_ACCESS_KEY is invalid');
  }

  if (!config.region) {
    errors.push('AMAZON_REGION is required');
  }

  if (!config.marketplaceId) {
    errors.push('AMAZON_MARKETPLACE_ID is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get all platform configurations
 */
export function loadAllConfigs(): {
  etsy: EtsyConfig | null;
  amazon: AmazonSPAPIConfig | null;
} {
  return {
    etsy: loadEtsyConfig(),
    amazon: loadAmazonConfig()
  };
}

/**
 * Check which platforms are configured
 */
export function getConfiguredPlatforms(): {
  etsy: boolean;
  amazon: boolean;
} {
  const etsyConfig = loadEtsyConfig();
  const amazonConfig = loadAmazonConfig();

  return {
    etsy: validateEtsyConfig(etsyConfig).valid,
    amazon: validateAmazonConfig(amazonConfig).valid
  };
}

/**
 * Print configuration status (for debugging)
 */
export function printConfigStatus(): void {
  const platforms = getConfiguredPlatforms();

  console.log('\n=== SellerGuard Pro Configuration Status ===\n');

  console.log('Etsy API:', platforms.etsy ? '✅ Configured' : '❌ Not configured');

  if (!platforms.etsy) {
    const etsyErrors = validateEtsyConfig(loadEtsyConfig()).errors;
    etsyErrors.forEach(error => console.log(`  - ${error}`));
  }

  console.log('Amazon SP-API:', platforms.amazon ? '✅ Configured' : '❌ Not configured');

  if (!platforms.amazon) {
    const amazonErrors = validateAmazonConfig(loadAmazonConfig()).errors;
    amazonErrors.forEach(error => console.log(`  - ${error}`));
  }

  console.log('\n');
}
