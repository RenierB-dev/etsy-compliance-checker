import { NextRequest, NextResponse } from 'next/server';
import { sendWeeklyDigestEmail } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      userName,
      shopName,
      currentScore,
      previousScore,
      scansThisWeek,
      violationsFixed,
      newViolations,
      topViolationType,
      userId,
    } = await request.json();

    if (!email || !userName || !shopName || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendWeeklyDigestEmail(
      email,
      userName,
      shopName,
      currentScore || 0,
      previousScore || 0,
      scansThisWeek || 0,
      violationsFixed || 0,
      newViolations || 0,
      topViolationType || 'Policy Violations',
      userId
    );

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Digest email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send digest email' },
      { status: 500 }
    );
  }
}
