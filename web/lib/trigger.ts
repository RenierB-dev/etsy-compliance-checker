import { TriggerClient } from '@trigger.dev/sdk';

export const client = new TriggerClient({
  id: 'etsy-compliance-checker',
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
});

/**
 * Background job for daily shop scanning
 * This imports and uses the existing CLI scanner
 */
export const dailyScanJob = client.defineJob({
  id: 'daily-shop-scan',
  name: 'Daily Shop Compliance Scan',
  version: '1.0.0',
  trigger: {
    type: 'scheduled',
    cron: '0 9 * * *', // Run at 9 AM daily
  },
  run: async (payload, io, ctx) => {
    const { scanShop, calculateComplianceScore } = await import('./scanner');
    const { saveScanResult, supabase } = await import('./supabase');

    // Get all shops with monitoring enabled
    const { data: schedules } = await supabase
      .from('monitoring_schedules')
      .select('*, shops(*)')
      .eq('enabled', true);

    if (!schedules) return;

    for (const schedule of schedules) {
      await io.runTask(`scan-shop-${schedule.shop_id}`, async () => {
        try {
          // Use existing CLI scanner
          const result = await scanShop({
            apiKey: schedule.shops.access_token,
            shopId: schedule.shop_id,
            limit: 100,
          });

          const complianceScore = calculateComplianceScore(result);

          // Save results
          await saveScanResult(schedule.shop_id, result, complianceScore);

          // Send alert if critical violations found
          if (result.summary.critical > 0) {
            await io.sendEvent('send-alert-email', {
              userId: schedule.user_id,
              shopId: schedule.shop_id,
              violations: result.summary.critical,
              severity: 'critical',
            });
          }

          // Update last run
          await supabase
            .from('monitoring_schedules')
            .update({
              last_run: new Date().toISOString(),
              next_run: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', schedule.id);

          return { success: true, violations: result.violations.length };
        } catch (error: any) {
          console.error(`Failed to scan shop ${schedule.shop_id}:`, error);
          return { success: false, error: error.message };
        }
      });
    }
  },
});

/**
 * Email alert job
 */
export const sendAlertEmailJob = client.defineJob({
  id: 'send-alert-email',
  name: 'Send Violation Alert Email',
  version: '1.0.0',
  trigger: {
    type: 'event',
    name: 'send-alert-email',
  },
  run: async (payload, io, ctx) => {
    const { userId, shopId, violations, severity } = payload;

    // TODO: Implement email sending with Resend or SendGrid
    await io.logger.info(`Sending ${severity} alert to user ${userId} for shop ${shopId}`);
    await io.logger.info(`${violations} violations detected`);

    // In production, send actual email
    // await io.sendEmail({
    //   to: userEmail,
    //   subject: `⚠️ ${violations} Critical Violations Detected in Your Etsy Shop`,
    //   html: emailTemplate,
    // });

    return { sent: true };
  },
});
