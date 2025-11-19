import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userName?: string;
  shopName?: string;
}

export const WelcomeEmail = ({
  userName = 'there',
  shopName = 'your shop',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to EtsyGuard Pro - Protect Your Shop from Violations</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>🛡️ Welcome to EtsyGuard Pro!</Heading>
        </Section>

        <Section style={content}>
          <Text style={paragraph}>Hi {userName},</Text>

          <Text style={paragraph}>
            Thank you for joining EtsyGuard Pro! You've taken the first step to protect{' '}
            <strong>{shopName}</strong> from Etsy policy violations and potential suspensions.
          </Text>

          <Section style={card}>
            <Heading as="h2" style={h2}>
              🎯 What's Next?
            </Heading>
            <Text style={listItem}>✓ Run your first compliance scan</Text>
            <Text style={listItem}>✓ Review any violations found</Text>
            <Text style={listItem}>✓ Use one-click fixes to resolve issues</Text>
            <Text style={listItem}>✓ Set up daily monitoring alerts</Text>
          </Section>

          <Section style={buttonContainer}>
            <Link style={button} href={process.env.NEXT_PUBLIC_APP_URL + '/dashboard'}>
              Go to Dashboard
            </Link>
          </Section>

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>💡 Pro Tip:</strong> Run a scan within the first 24 hours to catch any
              hidden violations before Etsy does!
            </Text>
          </Section>

          <Text style={paragraph}>
            Our AI analyzes your listings against 50+ Etsy policies to keep your shop safe.
            You'll get instant alerts if any violations are detected.
          </Text>

          <Text style={paragraph}>
            Need help? Just reply to this email - we're here for you!
          </Text>

          <Text style={signature}>
            Happy selling,<br />
            The EtsyGuard Team
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            © 2024 EtsyGuard Pro. All rights reserved.
          </Text>
          <Text style={footerText}>
            <Link href={process.env.NEXT_PUBLIC_APP_URL + '/unsubscribe'} style={footerLink}>
              Unsubscribe
            </Link>
            {' • '}
            <Link href={process.env.NEXT_PUBLIC_APP_URL + '/privacy'} style={footerLink}>
              Privacy Policy
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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
  fontSize: '24px',
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

const card = {
  backgroundColor: '#f9fafb',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '32px',
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
  margin: '24px 0',
};

const infoText = {
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
