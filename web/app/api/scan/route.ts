import { NextRequest, NextResponse } from 'next/server';
import { scanShop, calculateComplianceScore } from '@/lib/scanner';
import { saveScanResult } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, shopId, limit } = body;

    if (!apiKey || !shopId) {
      return NextResponse.json(
        { error: 'API key and shop ID are required' },
        { status: 400 }
      );
    }

    // Use existing CLI scanner wrapped in our lib
    const scanResult = await scanShop({
      apiKey,
      shopId,
      limit: limit || 100,
    });

    // Calculate compliance score
    const complianceScore = calculateComplianceScore(scanResult);

    // Save to database (optional - user must have Supabase configured)
    try {
      await saveScanResult(shopId, scanResult, complianceScore);
    } catch (error) {
      console.error('Failed to save scan result:', error);
      // Continue even if save fails
    }

    return NextResponse.json({
      ...scanResult,
      compliance_score: complianceScore,
    });
  } catch (error: any) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scan shop' },
      { status: 500 }
    );
  }
}
