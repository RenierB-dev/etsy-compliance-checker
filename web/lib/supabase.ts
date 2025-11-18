import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Shop {
  id: string;
  user_id: string;
  shop_id: string;
  shop_name: string;
  etsy_user_id: string;
  access_token: string;
  refresh_token: string;
  created_at: string;
  updated_at: string;
}

export interface ScanHistory {
  id: string;
  shop_id: string;
  scan_date: string;
  total_listings: number;
  scanned_listings: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  compliance_score: number;
  violations: any; // JSONB
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  stripe_customer_id?: string;
  created_at: string;
}

/**
 * Save scan result to database
 */
export async function saveScanResult(shopId: string, scanResult: any, complianceScore: number) {
  const { data, error } = await supabase
    .from('scan_history')
    .insert({
      shop_id: shopId,
      scan_date: scanResult.scan_date,
      total_listings: scanResult.total_listings,
      scanned_listings: scanResult.scanned_listings,
      critical_count: scanResult.summary.critical,
      warning_count: scanResult.summary.warnings,
      info_count: scanResult.summary.info,
      compliance_score: complianceScore,
      violations: scanResult.violations,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get scan history for a shop
 */
export async function getScanHistory(shopId: string, limit = 30) {
  const { data, error } = await supabase
    .from('scan_history')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get latest scan for a shop
 */
export async function getLatestScan(shopId: string) {
  const { data, error } = await supabase
    .from('scan_history')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
  return data;
}

/**
 * Get user's connected shops
 */
export async function getUserShops(userId: string) {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
