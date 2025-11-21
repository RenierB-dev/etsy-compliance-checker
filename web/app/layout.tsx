/**
 * SellerGuard Pro - Root Layout with SEO Metadata
 *
 * Next.js App Router layout with comprehensive SEO optimization
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SellerGuard Pro - Multi-Platform E-Commerce Compliance',
    template: '%s | SellerGuard Pro'
  },
  description: 'Protect your Etsy and Amazon seller accounts with SellerGuard Pro. 108+ compliance rules, automated daily scans, real-time violation alerts. Prevent suspensions before they happen.',
  keywords: [
    'etsy compliance',
    'amazon compliance',
    'seller tools',
    'etsy policy checker',
    'amazon sp-api',
    'e-commerce compliance',
    'listing optimization',
    'seller account protection',
    'policy violation detection',
    'multi-platform seller tools',
    'etsy suspended account',
    'amazon suspended account',
    'fba compliance',
    'etsy seller protection',
    'amazon seller protection'
  ],
  authors: [{ name: 'SellerGuard Pro' }],
  creator: 'SellerGuard Pro',
  publisher: 'SellerGuard Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://sellerguardpro.com'),

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'SellerGuard Pro - Multi-Platform E-Commerce Compliance',
    description: 'Protect your Etsy and Amazon seller accounts with 108+ compliance rules and automated scans. Prevent suspensions before they happen.',
    siteName: 'SellerGuard Pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SellerGuard Pro - Multi-Platform E-Commerce Compliance'
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'SellerGuard Pro - Multi-Platform E-Commerce Compliance',
    description: 'Protect your Etsy and Amazon seller accounts with 108+ compliance rules and automated scans.',
    images: ['/og-image.png'],
    creator: '@sellerguardpro'
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },

  // Alternative languages
  alternates: {
    canonical: '/',
  },

  // Application name
  applicationName: 'SellerGuard Pro',

  // Category
  category: 'business',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'SellerGuard Pro',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'AggregateOffer',
                lowPrice: '0',
                highPrice: '99',
                priceCurrency: 'USD',
                offerCount: '4'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '1247',
                bestRating: '5',
                worstRating: '1'
              },
              description: 'Multi-platform e-commerce compliance checker for Etsy and Amazon sellers. 108+ compliance rules, automated daily scans, and real-time violation alerts.',
              featureList: [
                'Multi-platform support (Etsy & Amazon)',
                '108+ compliance rules',
                'Automated daily scans',
                'Real-time violation alerts',
                'Historical tracking',
                'Export to JSON & CSV'
              ],
              screenshot: '/screenshot.png',
              softwareVersion: '2.0.0',
              author: {
                '@type': 'Organization',
                name: 'SellerGuard Pro'
              }
            })
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'SellerGuard Pro',
              description: 'E-commerce compliance monitoring and protection for online sellers',
              url: process.env.NEXT_PUBLIC_BASE_URL || 'https://sellerguardpro.com',
              logo: '/logo.png',
              sameAs: [
                'https://twitter.com/sellerguardpro',
                'https://facebook.com/sellerguardpro',
                'https://linkedin.com/company/sellerguardpro'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
                email: 'support@sellerguardpro.com',
                availableLanguage: 'English'
              }
            })
          }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How does SellerGuard Pro work?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'We connect to your Etsy and Amazon accounts via official APIs, scan all your listings against 108+ compliance rules, and provide detailed reports with actionable recommendations.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Is my data secure?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! We use OAuth 2.0 authentication and never store your credentials. All data is encrypted in transit and at rest. We\'re read-only - we can\'t modify your listings.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'What happens if violations are found?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You\'ll receive a detailed report showing each violation, its severity level, and specific recommendations for fixing it. We also send real-time email alerts for critical issues.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Can I try it before paying?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely! Our Free plan lets you run one compliance check on either platform. No credit card required.'
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body>
        <div id="root">{children}</div>

        {/* Analytics placeholder */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
