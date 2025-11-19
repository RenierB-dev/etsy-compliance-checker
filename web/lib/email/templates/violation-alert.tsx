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

interface Violation {
  listingTitle: string;
  violationType: string;
  severity: 'critical' | 'warning' | 'info';
  issue: string;
  suggestion: string;
}

interface ViolationAlertEmailProps {
  shopName?: string;
  violations?: Violation[];
  totalViolations?: number;
  criticalCount?: number;
  dashboardUrl?: string;
}

export const ViolationAlertEmail = ({
  shopName = 'Your Shop',
  violations = [],
  totalViolations = 0,
  criticalCount = 0,
  dashboardUrl = '',
}: ViolationAlertEmailProps) => {
  const displayViolations = violations.slice(0, 3);

  return (
    <Html>
      <Head />
      <Preview>
        🚨 {criticalCount} critical violation{criticalCount !== 1 ? 's' : ''} detected in {shopName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>🚨 Violation Alert</Heading>
          </Section>

          <Section style={content}>
            <Section style={alertBox}>
              <Heading as="h2" style={alertHeading}>
                ⚠️ Action Required
              </Heading>
              <Text style={alertText}>
                We've detected <strong>{totalViolations}</strong> new violation
                {totalViolations !== 1 ? 's' : ''} in <strong>{shopName}</strong>.
                {criticalCount > 0 && (
                  <> <strong>{criticalCount}</strong> of these are critical and require immediate attention.</>
                )}
              </Text>
            </Section>

            <Text style={paragraph}>
              These violations could put your shop at risk of being flagged or suspended by Etsy.
              Review and fix them as soon as possible.
            </Text>

            <Section style={violationsSection}>
              <Heading as="h2" style={h2}>
                🔍 Violations Found
              </Heading>

              {displayViolations.map((violation, index) => (
                <Section key={index} style={violationCard}>
                  <div style={violationHeader}>
                    <span
                      style={
                        violation.severity === 'critical'
                          ? criticalBadge
                          : violation.severity === 'warning'
                          ? warningBadge
                          : infoBadge
                      }
                    >
                      {violation.severity.toUpperCase()}
                    </span>
                    <Text style={violationType}>{violation.violationType}</Text>
                  </div>

                  <Text style={listingTitle}>📦 {violation.listingTitle}</Text>

                  <Section style={issueBox}>
                    <Text style={issueLabel}>Issue:</Text>
                    <Text style={issueText}>{violation.issue}</Text>
                  </Section>

                  <Section style={suggestionBox}>
                    <Text style={suggestionLabel}>💡 Suggested Fix:</Text>
                    <Text style={suggestionText}>{violation.suggestion}</Text>
                  </Section>
                </Section>
              ))}

              {totalViolations > 3 && (
                <Text style={moreText}>
                  + {totalViolations - 3} more violation{totalViolations - 3 !== 1 ? 's' : ''}
                </Text>
              )}
            </Section>

            <Section style={proTip}>
              <Text style={proTipText}>
                <strong>⚡ Pro Tip:</strong> Upgrade to EtsyGuard Pro to auto-fix all violations
                with one click. Save hours of manual editing!
              </Text>
              <Section style={buttonContainer}>
                <Link style={upgradeButton} href={process.env.NEXT_PUBLIC_APP_URL + '/pricing'}>
                  Upgrade to Pro
                </Link>
              </Section>
            </Section>

            <Section style={buttonContainer}>
              <Link
                style={button}
                href={dashboardUrl || process.env.NEXT_PUBLIC_APP_URL + '/dashboard'}
              >
                View All Violations
              </Link>
            </Section>

            <Text style={footNote}>
              <strong>Important:</strong> Etsy regularly scans shops for policy violations.
              Fixing these issues now can prevent potential suspension.
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

export default ViolationAlertEmail;

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
  backgroundColor: '#dc2626',
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

const alertBox = {
  backgroundColor: '#fef2f2',
  border: '3px solid #dc2626',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const alertHeading = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const alertText = {
  color: '#991b1b',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const violationsSection = {
  margin: '32px 0',
};

const violationCard = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
};

const violationHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
};

const criticalBadge = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
  letterSpacing: '0.5px',
};

const warningBadge = {
  backgroundColor: '#f59e0b',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
  letterSpacing: '0.5px',
};

const infoBadge = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
  letterSpacing: '0.5px',
};

const violationType = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
  fontWeight: '500',
};

const listingTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const issueBox = {
  margin: '12px 0',
};

const issueLabel = {
  color: '#dc2626',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const issueText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const suggestionBox = {
  backgroundColor: '#fef7ee',
  borderLeft: '3px solid #f6b879',
  padding: '12px',
  margin: '12px 0 0',
};

const suggestionLabel = {
  color: '#92400e',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const suggestionText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const moreText = {
  color: '#6b7280',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '16px 0',
  fontStyle: 'italic',
};

const proTip = {
  backgroundColor: '#eff6ff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
};

const proTipText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '16px 0',
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

const upgradeButton = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const footNote = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fcd34d',
  borderRadius: '8px',
  padding: '16px',
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0',
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
