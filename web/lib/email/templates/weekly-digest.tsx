import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WeeklyDigestEmailProps {
  userName?: string;
  shopName?: string;
  currentScore?: number;
  previousScore?: number;
  scansThisWeek?: number;
  violationsFixed?: number;
  newViolations?: number;
  topViolationType?: string;
  dashboardUrl?: string;
}

export const WeeklyDigestEmail = ({
  userName = 'there',
  shopName = 'Your Shop',
  currentScore = 0,
  previousScore = 0,
  scansThisWeek = 0,
  violationsFixed = 0,
  newViolations = 0,
  topViolationType = 'Policy Violations',
  dashboardUrl = '',
}: WeeklyDigestEmailProps) => {
  const scoreDelta = currentScore - previousScore;
  const scoreImproved = scoreDelta > 0;
  const scoreUnchanged = scoreDelta === 0;

  return (
    <Html>
      <Head />
      <Preview>
        This week: {shopName} - {currentScore}/100 compliance score
        {scoreImproved && ` (↑${scoreDelta})`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>📊 Weekly Report</Heading>
            <Text style={headerSubtext}>Your compliance summary for the week</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>

            <Text style={paragraph}>
              Here's how <strong>{shopName}</strong> performed this week:
            </Text>

            {/* Compliance Score */}
            <Section style={scoreCard}>
              <Text style={scoreLabel}>Compliance Score</Text>
              <div style={scoreRow}>
                <Text style={scoreValue}>{currentScore}/100</Text>
                {!scoreUnchanged && (
                  <span
                    style={{
                      ...scoreDelta > 0 ? trendUp : trendDown,
                    }}
                  >
                    {scoreDelta > 0 ? '↑' : '↓'} {Math.abs(scoreDelta)}
                  </span>
                )}
                {scoreUnchanged && (
                  <span style={trendNeutral}>→ 0</span>
                )}
              </div>
              {scoreImproved && (
                <Text style={scoreMessage}>Great improvement! 🎉</Text>
              )}
              {!scoreImproved && !scoreUnchanged && (
                <Text style={{...scoreMessage, color: '#dc2626'}}>
                  Let's work on bringing this back up
                </Text>
              )}
            </Section>

            {/* Stats Grid */}
            <Section style={statsGrid}>
              <div style={statCard}>
                <Text style={statNumber}>{scansThisWeek}</Text>
                <Text style={statLabel}>Scans Run</Text>
              </div>
              <div style={statCard}>
                <Text style={{...statNumber, color: '#10b981'}}>{violationsFixed}</Text>
                <Text style={statLabel}>Fixed</Text>
              </div>
              <div style={statCard}>
                <Text style={{...statNumber, color: newViolations > 0 ? '#dc2626' : '#10b981'}}>
                  {newViolations}
                </Text>
                <Text style={statLabel}>New Issues</Text>
              </div>
            </Section>

            {/* Weekly Highlights */}
            <Section style={highlightsSection}>
              <Heading as="h2" style={h2}>
                ✨ This Week's Highlights
              </Heading>

              {violationsFixed > 0 && (
                <Section style={highlightItem}>
                  <Text style={highlightIcon}>✅</Text>
                  <div>
                    <Text style={highlightTitle}>Violations Resolved</Text>
                    <Text style={highlightText}>
                      You fixed <strong>{violationsFixed}</strong> violation
                      {violationsFixed !== 1 ? 's' : ''}! Well done keeping your shop compliant.
                    </Text>
                  </div>
                </Section>
              )}

              {newViolations > 0 && (
                <Section style={highlightItem}>
                  <Text style={highlightIcon}>⚠️</Text>
                  <div>
                    <Text style={highlightTitle}>New Violations Detected</Text>
                    <Text style={highlightText}>
                      <strong>{newViolations}</strong> new issue{newViolations !== 1 ? 's' : ''} found,
                      mostly related to <strong>{topViolationType}</strong>.
                    </Text>
                  </div>
                </Section>
              )}

              {newViolations === 0 && violationsFixed === 0 && (
                <Section style={highlightItem}>
                  <Text style={highlightIcon}>🎉</Text>
                  <div>
                    <Text style={highlightTitle}>No Changes</Text>
                    <Text style={highlightText}>
                      Your shop remained compliant all week. Great job!
                    </Text>
                  </div>
                </Section>
              )}

              {scansThisWeek >= 7 && (
                <Section style={highlightItem}>
                  <Text style={highlightIcon}>🔥</Text>
                  <div>
                    <Text style={highlightTitle}>Daily Monitoring Active</Text>
                    <Text style={highlightText}>
                      Your shop was scanned every day this week. Consistent monitoring = maximum protection!
                    </Text>
                  </div>
                </Section>
              )}
            </Section>

            {/* Action Items */}
            {newViolations > 0 && (
              <Section style={actionBox}>
                <Heading as="h3" style={h3}>
                  🎯 Recommended Actions
                </Heading>
                <Text style={actionItem}>
                  1. Review the {newViolations} new violation{newViolations !== 1 ? 's' : ''}
                </Text>
                <Text style={actionItem}>
                  2. Fix critical issues first to prevent suspension
                </Text>
                <Text style={actionItem}>
                  3. Enable auto-fix with Pro to save time
                </Text>
                <Section style={buttonContainer}>
                  <Link
                    style={button}
                    href={dashboardUrl || process.env.NEXT_PUBLIC_APP_URL + '/dashboard'}
                  >
                    View Dashboard
                  </Link>
                </Section>
              </Section>
            )}

            {/* Pro Tip */}
            <Section style={proTip}>
              <Text style={proTipTitle}>💡 Weekly Tip</Text>
              <Text style={proTipText}>
                Did you know? Most Etsy suspensions happen because sellers don't catch violations
                early. Keep your daily scans enabled to stay ahead!
              </Text>
            </Section>

            <Text style={signature}>
              Keep up the great work!<br />
              The EtsyGuard Team
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © 2024 EtsyGuard Pro. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link
                href={process.env.NEXT_PUBLIC_APP_URL + '/settings/notifications'}
                style={footerLink}
              >
                Email Preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WeeklyDigestEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px 12px 0 0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const headerSubtext = {
  color: '#e0e7ff',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const content = {
  padding: '0 24px',
};

const greeting = {
  color: '#374151',
  fontSize: '16px',
  margin: '24px 0 8px',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const scoreCard = {
  backgroundColor: '#f9fafb',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  padding: '32px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const scoreLabel = {
  color: '#6b7280',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 12px',
};

const scoreRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  margin: '8px 0',
};

const scoreValue = {
  fontSize: '48px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0',
};

const trendUp = {
  color: '#10b981',
  fontSize: '24px',
  fontWeight: 'bold',
};

const trendDown = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
};

const trendNeutral = {
  color: '#6b7280',
  fontSize: '24px',
  fontWeight: 'bold',
};

const scoreMessage = {
  color: '#10b981',
  fontSize: '14px',
  margin: '8px 0 0',
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '12px',
  margin: '24px 0',
};

const statCard = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px 12px',
  textAlign: 'center' as const,
};

const statNumber = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 4px',
};

const statLabel = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0',
};

const highlightsSection = {
  margin: '32px 0',
};

const highlightItem = {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
};

const highlightIcon = {
  fontSize: '32px',
  margin: '0',
  lineHeight: '1',
};

const highlightTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const highlightText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const actionBox = {
  backgroundColor: '#eff6ff',
  border: '2px solid #93c5fd',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const actionItem = {
  color: '#1e3a8a',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '20px 0 0',
};

const button = {
  backgroundColor: '#ef711e',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const proTip = {
  backgroundColor: '#fef7ee',
  border: '2px solid #f6b879',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const proTipTitle = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const proTipText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const signature = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '32px 0 0',
};

const footer = {
  borderTop: '1px solid #e5e7eb',
  margin: '48px 24px 0',
  padding: '24px 0 0',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
  textAlign: 'center' as const,
};

const footerLink = {
  color: '#6b7280',
  textDecoration: 'underline',
};
