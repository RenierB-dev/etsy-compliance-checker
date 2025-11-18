import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

/**
 * Etsy OAuth Flow - Step 2: Handle callback
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect(new URL('/connect?error=oauth_failed', request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.etsy.com/v3/public/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.ETSY_CLIENT_ID,
      redirect_uri: process.env.ETSY_REDIRECT_URI,
      code,
      code_verifier: 'placeholder', // In production, use proper PKCE
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Get shop info
    const shopResponse = await axios.get('https://openapi.etsy.com/v3/application/users/me', {
      headers: {
        'x-api-key': process.env.ETSY_API_KEY,
        'Authorization': `Bearer ${access_token}`,
      },
    });

    const userData = shopResponse.data;

    // Get shop details
    const shopsResponse = await axios.get(`https://openapi.etsy.com/v3/application/users/${userData.user_id}/shops`, {
      headers: {
        'x-api-key': process.env.ETSY_API_KEY,
        'Authorization': `Bearer ${access_token}`,
      },
    });

    const shop = shopsResponse.data.results[0];

    // Save to database (requires Supabase setup)
    try {
      // TODO: Get current user from session
      const userId = 'temp-user-id'; // Replace with actual user ID from session

      await supabase.from('shops').upsert({
        user_id: userId,
        shop_id: shop.shop_id.toString(),
        shop_name: shop.shop_name,
        etsy_user_id: userData.user_id.toString(),
        access_token,
        refresh_token,
      });
    } catch (error) {
      console.error('Failed to save shop:', error);
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL(`/dashboard?shop=${shop.shop_id}`, request.url));
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/connect?error=oauth_failed', request.url));
  }
}
