import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWeeklyDigestEmail } from '@/lib/email/send';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This endpoint is called weekly by Vercel Cron (Mondays at 9am)
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active users with shops
    const { data: shops, error: shopsError } = await supabase
      .from('shops')
      .select('*, user:user_id(id, email, raw_user_meta_data)')
      .not('user_id', 'is', null);

    if (shopsError) {
      console.error('Error fetching shops:', shopsError);
      return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
    }

    const results = {
      total: shops?.length || 0,
      sent: 0,
      failed: 0,
    };

    // Calculate date 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Calculate date 14 days ago (for previous week comparison)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Process each shop
    for (const shop of shops || []) {
      try {
        // Get scans from this week
        const { data: thisWeekScans } = await supabase
          .from('scans')
          .select('*')
          .eq('shop_id', shop.id)
          .gte('created_at', oneWeekAgo.toISOString())
          .order('created_at', { ascending: false });

        // Get previous week's last scan for comparison
        const { data: previousWeekScans } = await supabase
          .from('scans')
          .select('*')
          .eq('shop_id', shop.id)
          .gte('created_at', twoWeeksAgo.toISOString())
          .lt('created_at', oneWeekAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(1);

        // Get violations fixed this week
        const { data: violationsFixed } = await supabase
          .from('violations')
          .select('*')
          .eq('shop_id', shop.id)
          .eq('fixed', true)
          .gte('fixed_at', oneWeekAgo.toISOString());

        // Get new violations this week
        const { data: newViolations } = await supabase
          .from('violations')
          .select('*')
          .eq('shop_id', shop.id)
          .eq('fixed', false)
          .gte('created_at', oneWeekAgo.toISOString());

        // Calculate stats
        const currentScore = shop.compliance_score || 0;
        const previousScore =
          previousWeekScans && previousWeekScans.length > 0
            ? previousWeekScans[0].compliance_score
            : currentScore;

        const scansThisWeek = thisWeekScans?.length || 0;
        const violationsFixedCount = violationsFixed?.length || 0;
        const newViolationsCount = newViolations?.length || 0;

        // Find most common violation type
        const violationTypes: { [key: string]: number } = {};
        newViolations?.forEach((v) => {
          violationTypes[v.violation_type] = (violationTypes[v.violation_type] || 0) + 1;
        });
        const topViolationType =
          Object.keys(violationTypes).sort(
            (a, b) => violationTypes[b] - violationTypes[a]
          )[0] || 'Policy Violations';

        // Send weekly digest email
        const userEmail = shop.user?.email;
        const userName = shop.user?.raw_user_meta_data?.name || 'there';

        if (userEmail) {
          await sendWeeklyDigestEmail(
            userEmail,
            userName,
            shop.shop_name,
            currentScore,
            previousScore,
            scansThisWeek,
            violationsFixedCount,
            newViolationsCount,
            topViolationType,
            shop.user_id
          );
          results.sent++;
        }
      } catch (error) {
        console.error(`Error processing digest for shop ${shop.shop_name}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Weekly digests sent',
      results,
    });
  } catch (error) {
    console.error('Weekly digest cron error:', error);
    return NextResponse.json(
      { error: 'Failed to send weekly digests' },
      { status: 500 }
    );
  }
}
