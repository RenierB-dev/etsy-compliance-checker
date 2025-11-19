import { Resend } from 'resend';
import { render } from '@react-email/render';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
  emailType: string;
  userId?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  emailType,
  userId,
}: SendEmailOptions) {
  try {
    const html = render(react);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'EtsyGuard <hello@etsyguard.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);

      // Log failed email
      if (userId) {
        await supabase.from('email_logs').insert({
          user_id: userId,
          email_type: emailType,
          recipient: to,
          subject,
          status: 'failed',
        });
      }

      return { success: false, error };
    }

    // Log successful email
    if (userId) {
      await supabase.from('email_logs').insert({
        user_id: userId,
        email_type: emailType,
        recipient: to,
        subject,
        status: 'sent',
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

// Specific email sending functions
export async function sendWelcomeEmail(
  email: string,
  userName: string,
  shopName: string,
  userId: string
) {
  const { WelcomeEmail } = await import('./templates/welcome');

  return sendEmail({
    to: email,
    subject: 'Welcome to EtsyGuard Pro! 🛡️',
    react: WelcomeEmail({ userName, shopName }),
    emailType: 'welcome',
    userId,
  });
}

export async function sendScanCompleteEmail(
  email: string,
  shopName: string,
  complianceScore: number,
  totalListings: number,
  violationsFound: number,
  criticalCount: number,
  warningCount: number,
  userId: string
) {
  const { ScanCompleteEmail } = await import('./templates/scan-complete');

  return sendEmail({
    to: email,
    subject: `Scan Complete: ${shopName} - ${complianceScore}/100 Score`,
    react: ScanCompleteEmail({
      shopName,
      complianceScore,
      totalListings,
      violationsFound,
      criticalCount,
      warningCount,
    }),
    emailType: 'scan_complete',
    userId,
  });
}

export async function sendViolationAlertEmail(
  email: string,
  shopName: string,
  violations: any[],
  totalViolations: number,
  criticalCount: number,
  userId: string
) {
  const { ViolationAlertEmail } = await import('./templates/violation-alert');

  return sendEmail({
    to: email,
    subject: `🚨 ${criticalCount} Critical Violation${criticalCount !== 1 ? 's' : ''} Detected in ${shopName}`,
    react: ViolationAlertEmail({
      shopName,
      violations,
      totalViolations,
      criticalCount,
    }),
    emailType: 'violation_alert',
    userId,
  });
}

export async function sendWeeklyDigestEmail(
  email: string,
  userName: string,
  shopName: string,
  currentScore: number,
  previousScore: number,
  scansThisWeek: number,
  violationsFixed: number,
  newViolations: number,
  topViolationType: string,
  userId: string
) {
  const { WeeklyDigestEmail } = await import('./templates/weekly-digest');

  return sendEmail({
    to: email,
    subject: `Weekly Report: ${shopName} - ${currentScore}/100 Score`,
    react: WeeklyDigestEmail({
      userName,
      shopName,
      currentScore,
      previousScore,
      scansThisWeek,
      violationsFixed,
      newViolations,
      topViolationType,
    }),
    emailType: 'weekly_digest',
    userId,
  });
}

export async function sendUpgradePromptEmail(
  email: string,
  userName: string,
  shopName: string,
  violationsCount: number,
  timeSpentManuallyFixing: string,
  userId: string
) {
  const { UpgradePromptEmail } = await import('./templates/upgrade-prompt');

  return sendEmail({
    to: email,
    subject: `Save ${timeSpentManuallyFixing} with EtsyGuard Pro Auto-Fix`,
    react: UpgradePromptEmail({
      userName,
      shopName,
      violationsCount,
      timeSpentManuallyFixing,
    }),
    emailType: 'upgrade_prompt',
    userId,
  });
}
