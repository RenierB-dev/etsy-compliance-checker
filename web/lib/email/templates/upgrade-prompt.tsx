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

interface UpgradePromptEmailProps {
  userName?: string;
  shopName?: string;
  violationsCount?: number;
  timeSpentManuallyFixing?: string;
  pricingUrl?: string;
}

export const UpgradePromptEmail = ({
  userName = 'there',
  shopName = 'Your Shop',
  violationsCount = 0,
  timeSpentManuallyFixing = '3 hours',
  pricingUrl = '',
}: UpgradePromptEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Upgrade to EtsyGuard Pro - Auto-fix violations with one click</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>⚡ Upgrade to Pro</Heading>
            <Text style={headerSubtext}>Save hours with one-click auto-fix</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>

            <Text style={paragraph}>
              You've been doing great keeping <strong>{shopName}</strong> compliant manually!
              But we noticed you've spent approximately <strong>{timeSpentManuallyFixing}</strong> fixing
              violations this month.
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>
                💡 <strong>What if you could fix all {violationsCount} violations in under 30 seconds?</strong>
              </Text>
            </Section>

            {/* Pro Features */}
            <Section style={featuresSection}>
              <Heading as="h2" style={h2}>
                🚀 With EtsyGuard Pro, you get:
              </Heading>

              <Section style={featureItem}>
                <Text style={featureIcon}>⚡</Text>
                <div>
                  <Text style={featureTitle}>One-Click Auto-Fix</Text>
                  <Text style={featureText}>
                    Fix all violations instantly. No manual editing required.
                  </Text>
                </div>
              </Section>

              <Section style={featureItem}>
                <Text style={featureIcon}>🤖</Text>
                <div>
                  <Text style={featureTitle}>AI-Powered Suggestions</Text>
                  <Text style={featureText}>
                    Get smart, policy-compliant alternatives for every issue.
                  </Text>
                </div>
              </Section>

              <Section style={featureItem}>
                <Text style={featureIcon}>📧</Text>
                <div>
                  <Text style={featureTitle}>Instant Alerts</Text>
                  <Text style={featureText}>
                    Get notified the moment a violation is detected.
                  </Text>
                </div>
              </Section>

              <Section style={featureItem}>
                <Text style={featureIcon}>📊</Text>
                <div>
                  <Text style={featureTitle}>Advanced Analytics</Text>
                  <Text style={featureText}>
                    Track compliance trends and optimize your listings.
                  </Text>
                </div>
              </Section>

              <Section style={featureItem}>
                <Text style={featureIcon}>🔄</Text>
                <div>
                  <Text style={featureTitle}>Automated Daily Scans</Text>
                  <Text style={featureText}>
                    Your shop is monitored 24/7, even while you sleep.
                  </Text>
                </div>
              </Section>

              <Section style={featureItem}>
                <Text style={featureIcon}>🏪</Text>
                <div>
                  <Text style={featureTitle}>Multi-Shop Support</Text>
                  <Text style={featureText}>
                    Manage unlimited shops from one dashboard.
                  </Text>
                </div>
              </Section>
            </Section>

            {/* Pricing */}
            <Section style={pricingCard}>
              <Text style={pricingBadge}>LIMITED TIME OFFER</Text>
              <Text style={pricingAmount}>
                <span style={pricingDollar}>$</span>
                29
                <span style={pricingPeriod}>/month</span>
              </Text>
              <Text style={pricingSavings}>
                Save 3+ hours per week = $360/month in time savings*
              </Text>

              <Section style={includesList}>
                <Text style={includesTitle}>Everything you need:</Text>
                <Text style={includesItem}>✓ Unlimited scans</Text>
                <Text style={includesItem}>✓ Unlimited auto-fixes</Text>
                <Text style={includesItem}>✓ Priority support</Text>
                <Text style={includesItem}>✓ Cancel anytime</Text>
              </Section>

              <Section style={buttonContainer}>
                <Link
                  style={button}
                  href={pricingUrl || process.env.NEXT_PUBLIC_APP_URL + '/pricing'}
                >
                  Upgrade Now
                </Link>
              </Section>

              <Text style={moneyBack}>
                💯 30-day money-back guarantee
              </Text>
            </Section>

            {/* Social Proof */}
            <Section style={testimonialSection}>
              <Heading as="h3" style={h3}>
                What other sellers are saying:
              </Heading>

              <Section style={testimonial}>
                <Text style={testimonialText}>
                  "EtsyGuard Pro saved my shop from suspension. The auto-fix feature is incredible -
                  what used to take me hours now takes seconds!"
                </Text>
                <Text style={testimonialAuthor}>
                  — Sarah M., 5-star Etsy seller
                </Text>
              </Section>

              <Section style={testimonial}>
                <Text style={testimonialText}>
                  "Best $29 I spend every month. Caught violations I would have never noticed myself."
                </Text>
                <Text style={testimonialAuthor}>
                  — Mike T., 2,000+ sales
                </Text>
              </Section>
            </Section>

            {/* CTA */}
            <Section style={ctaBox}>
              <Text style={ctaText}>
                Join 1,000+ sellers who trust EtsyGuard Pro to protect their shops
              </Text>
              <Section style={buttonContainer}>
                <Link
                  style={ctaButton}
                  href={pricingUrl || process.env.NEXT_PUBLIC_APP_URL + '/pricing'}
                >
                  Start My Pro Trial
                </Link>
              </Section>
              <Text style={ctaSubtext}>
                No credit card required for 7-day trial
              </Text>
            </Section>

            <Text style={footnote}>
              * Based on average hourly rate of $30/hr for e-commerce management
            </Text>

            <Text style={signature}>
              Ready to save time and protect your shop?<br />
              The EtsyGuard Team
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © 2024 EtsyGuard Pro. All rights reserved.
            </Text>
            <Text style={footerText}>
              Not interested? <Link href={process.env.NEXT_PUBLIC_APP_URL + '/settings'} style={footerLink}>
                Update email preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default UpgradePromptEmail;

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
  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
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
  color: '#fae8ff',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 20px',
};

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
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

const highlightBox = {
  backgroundColor: '#fef7ee',
  border: '3px solid #f6b879',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const highlightText = {
  color: '#92400e',
  fontSize: '18px',
  lineHeight: '26px',
  margin: '0',
};

const featuresSection = {
  margin: '32px 0',
};

const featureItem = {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  alignItems: 'flex-start',
};

const featureIcon = {
  fontSize: '32px',
  margin: '0',
  lineHeight: '1',
};

const featureTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const featureText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const pricingCard = {
  backgroundColor: '#f9fafb',
  border: '3px solid #7c3aed',
  borderRadius: '12px',
  padding: '32px 24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const pricingBadge = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '6px 12px',
  borderRadius: '16px',
  display: 'inline-block',
  letterSpacing: '0.5px',
  margin: '0 0 16px',
};

const pricingAmount = {
  fontSize: '56px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '16px 0',
  lineHeight: '1',
};

const pricingDollar = {
  fontSize: '32px',
  verticalAlign: 'top',
};

const pricingPeriod = {
  fontSize: '24px',
  color: '#6b7280',
};

const pricingSavings = {
  color: '#10b981',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0 24px',
};

const includesList = {
  textAlign: 'left' as const,
  margin: '24px auto',
  maxWidth: '300px',
};

const includesTitle = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px',
  textAlign: 'center' as const,
};

const includesItem = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '28px',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const button = {
  backgroundColor: '#7c3aed',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 48px',
  boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
};

const moneyBack = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '16px 0 0',
};

const testimonialSection = {
  margin: '32px 0',
};

const testimonial = {
  backgroundColor: '#f9fafb',
  borderLeft: '4px solid #7c3aed',
  padding: '16px 20px',
  margin: '16px 0',
};

const testimonialText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 8px',
  fontStyle: 'italic',
};

const testimonialAuthor = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0',
  fontWeight: '600',
};

const ctaBox = {
  backgroundColor: '#eff6ff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '32px 24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const ctaText = {
  color: '#1e3a8a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px',
};

const ctaButton = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const ctaSubtext = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '12px 0 0',
};

const footnote = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '24px 0',
  fontStyle: 'italic',
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
