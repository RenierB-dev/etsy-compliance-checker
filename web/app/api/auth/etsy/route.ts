import { NextRequest, NextResponse } from 'next/server';

/**
 * Etsy OAuth Flow - Step 1: Redirect to Etsy
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.ETSY_CLIENT_ID;
  const redirectUri = process.env.ETSY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: 'Etsy OAuth not configured' },
      { status: 500 }
    );
  }

  // Etsy OAuth URL
  const scopes = [
    'listings_r',
    'listings_w',
    'shops_r',
  ].join('%20');

  const state = crypto.randomUUID();
  const codeChallenge = 'placeholder'; // In production, implement PKCE properly

  const authUrl = `https://www.etsy.com/oauth/connect?` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${scopes}&` +
    `client_id=${clientId}&` +
    `state=${state}&` +
    `code_challenge=${codeChallenge}&` +
    `code_challenge_method=S256`;

  return NextResponse.redirect(authUrl);
}
