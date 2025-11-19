import { NextRequest, NextResponse } from 'next/server';
import { applyReferralCode } from '@/lib/referrals';

export async function POST(request: NextRequest) {
  try {
    const { code, userId } = await request.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await applyReferralCode(code, userId);

    if (result.success) {
      return NextResponse.json({ success: true, referral: result.referral });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Apply referral code API error:', error);
    return NextResponse.json(
      { error: 'Failed to apply referral code' },
      { status: 500 }
    );
  }
}
