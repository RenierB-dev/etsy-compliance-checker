import { NextRequest, NextResponse } from 'next/server';
import { sendViolationAlertEmail } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const { email, shopName, violations, totalViolations, criticalCount, userId } =
      await request.json();

    if (!email || !shopName || !violations || totalViolations === undefined || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendViolationAlertEmail(
      email,
      shopName,
      violations,
      totalViolations,
      criticalCount || 0,
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
    console.error('Alert email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send alert email' },
      { status: 500 }
    );
  }
}
