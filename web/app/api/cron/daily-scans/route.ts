import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendViolationAlertEmail, sendScanCompleteEmail } from '@/lib/email/send';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This endpoint is called daily by Vercel Cron
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all shops that need daily scanning
    const { data: shops, error: shopsError } = await supabase
      .from('shops')
      .select('*, user:user_id(email, raw_user_meta_data)')
      .order('last_scan_at', { ascending: true, nullsFirst: true });

    if (shopsError) {
      console.error('Error fetching shops:', shopsError);
      return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
    }

    const results = {
      total: shops?.length || 0,
      scanned: 0,
      failed: 0,
      alerts_sent: 0,
    };

    // Process each shop
    for (const shop of shops || []) {
      try {
        // Here you would integrate with the CLI scanning logic
        // For now, we'll simulate a scan
        // In production, you'd call your Etsy API scanning function

        // Simulate scan results
        const scanResults = {
          totalListings: 50,
          violationsFound: 3,
          criticalCount: 1,
          warningCount: 2,
          complianceScore: 85,
          violations: [
            {
              listingTitle: 'Example Product',
              violationType: 'Prohibited Claims',
              severity: 'critical',
              issue: 'Uses word "guaranteed"',
              suggestion: 'Remove guarantee language',
            },
          ],
        };

        // Create scan record
        const { data: scanRecord, error: scanError } = await supabase
          .from('scans')
          .insert({
            shop_id: shop.id,
            scan_type: 'daily_automated',
            total_listings: scanResults.totalListings,
            violations_found: scanResults.violationsFound,
            compliance_score: scanResults.complianceScore,
            scan_data: scanResults,
          })
          .select()
          .single();

        if (scanError) {
          console.error('Error creating scan record:', scanError);
          results.failed++;
          continue;
        }

        // Update shop last_scan_at
        await supabase
          .from('shops')
          .update({
            last_scan_at: new Date().toISOString(),
            compliance_score: scanResults.complianceScore,
          })
          .eq('id', shop.id);

        results.scanned++;

        // Send alert if violations found
        if (scanResults.violationsFound > 0 && scanResults.criticalCount > 0) {
          const userEmail = shop.user?.email;
          if (userEmail) {
            await sendViolationAlertEmail(
              userEmail,
              shop.shop_name,
              scanResults.violations,
              scanResults.violationsFound,
              scanResults.criticalCount,
              shop.user_id
            );
            results.alerts_sent++;
          }
        } else {
          // Send scan complete email
          const userEmail = shop.user?.email;
          if (userEmail) {
            await sendScanCompleteEmail(
              userEmail,
              shop.shop_name,
              scanResults.complianceScore,
              scanResults.totalListings,
              scanResults.violationsFound,
              scanResults.criticalCount,
              scanResults.warningCount,
              shop.user_id
            );
          }
        }
      } catch (error) {
        console.error(`Error scanning shop ${shop.shop_name}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Daily scans completed',
      results,
    });
  } catch (error) {
    console.error('Daily scans cron error:', error);
    return NextResponse.json(
      { error: 'Failed to run daily scans' },
      { status: 500 }
    );
  }
}
