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

interface ScanCompleteEmailProps {
  shopName?: string;
  complianceScore?: number;
  totalListings?: number;
  violationsFound?: number;
  criticalCount?: number;
  warningCount?: number;
  dashboardUrl?: string;
}

export const ScanCompleteEmail = ({
  shopName = 'Your Shop',
  complianceScore = 0,
  totalListings = 0,
  violationsFound = 0,
  criticalCount = 0,
  warningCount = 0,
  dashboardUrl = '',
}: ScanCompleteEmailProps) => {
  const scoreColor = complianceScore >= 90 ? '#10b981' : complianceScore >= 70 ? '#f59e0b' : '#ef4444';
  const scoreEmoji = complianceScore >= 90 ? '🎉' : complianceScore >= 70 ? '⚠️' : '🚨';

  return (
    <Html>
      <Head />
      <Preview>
        {shopName} compliance scan complete - {complianceScore}/100 score
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>
              {scoreEmoji} Scan Complete
            </Heading>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>
              Your compliance scan for <strong>{shopName}</strong> is complete!
            </Text>

            <Section style={scoreCard}>
              <div style={scoreCircle}>
                <Text style={{...scoreNumber, color: scoreColor}}>
                  {complianceScore}
                </Text>
                <Text style={scoreLabel}>/ 100</Text>
              </div>
              <Text style={scoreDescription}>Compliance Score</Text>
            </Section>

            <Section style={statsGrid}>
              <div style={statItem}>
                <Text style={statNumber}>{totalListings}</Text>
                <Text style={statLabel}>Listings Scanned</Text>
              </div>
              <div style={statItem}>
                <Text style={{...statNumber, color: violationsFound > 0 ? '#ef4444' : '#10b981'}}>
                  {violationsFound}
                </Text>
                <Text style={statLabel}>Violations Found</Text>
              </div>
            </Section>

            {violationsFound > 0 && (
              <Section style={violationsCard}>
                <Heading as="h2" style={h2}>
                  📋 Violations Breakdown
                </Heading>

                {criticalCount > 0 && (
                  <div style={violationRow}>
                    <span style={criticalBadge}>CRITICAL</span>
                    <Text style={violationText}>
                      {criticalCount} issue{criticalCount !== 1 ? 's' : ''} requiring immediate attention
                    </Text>
                  </div>
                )}

                {warningCount > 0 && (
                  <div style={violationRow}>
                    <span style={warningBadge}>WARNING</span>
                    <Text style={violationText}>
                      {warningCount} issue{warningCount !== 1 ? 's' : ''} to review
                    </Text>
                  </div>
                )}

                <Section style={infoBox}>
                  <Text style={infoText}>
                    <strong>💡 Quick Fix:</strong> Upgrade to Pro to auto-fix violations with one click!
                  </Text>
                </Section>
              </Section>
            )}

            {violationsFound === 0 && (
              <Section style={successCard}>
                <Heading as="h2" style={h2}>
                  ✅ Great Job!
                </Heading>
                <Text style={paragraph}>
                  No violations detected! Your shop is fully compliant with Etsy policies.
                  We'll continue monitoring and alert you if anything changes.
                </Text>
              </Section>
            )}

            <Section style={buttonContainer}>
              <Link
                style={button}
                href={dashboardUrl || process.env.NEXT_PUBLIC_APP_URL + '/dashboard'}
              >
                View Detailed Report
              </Link>
            </Section>

            <Text style={paragraph}>
              Your next scan is scheduled for tomorrow. Stay protected! 🛡️
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © 2024 EtsyGuard Pro. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ScanCompleteEmail;

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
  backgroundColor: '#ef711e',
  borderRadius: '12px 12px 0 0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const content = {
  padding: '0 24px',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const scoreCard = {
  textAlign: 'center' as const,
  padding: '32px',
  margin: '24px 0',
};

const scoreCircle = {
  display: 'inline-block',
  textAlign: 'center' as const,
};

const scoreNumber = {
  fontSize: '64px',
  fontWeight: 'bold',
  lineHeight: '1',
  margin: '0',
  display: 'inline',
};

const scoreLabel = {
  fontSize: '24px',
  color: '#6b7280',
  margin: '0',
  display: 'inline',
};

const scoreDescription = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '8px 0 0',
  textAlign: 'center' as const,
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  margin: '24px 0',
};

const statItem = {
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
};

const statNumber = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 4px',
};

const statLabel = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
};

const violationsCard = {
  backgroundColor: '#fef2f2',
  border: '2px solid #fecaca',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const successCard = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #bbf7d0',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const violationRow = {
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const criticalBadge = {
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
};

const warningBadge = {
  backgroundColor: '#f59e0b',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
};

const violationText = {
  color: '#374151',
  fontSize: '14px',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
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

const infoBox = {
  backgroundColor: '#fef7ee',
  border: '2px solid #f6b879',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
};

const infoText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
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
