import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EtsyGuard Pro - Protect Your Shop from Violations',
  description: 'Automated Etsy compliance monitoring. Detect and fix policy violations before they hurt your shop.',
  keywords: 'Etsy, compliance, policy violations, shop monitoring, seller tools',
  authors: [{ name: 'EtsyGuard Team' }],
  openGraph: {
    title: 'EtsyGuard Pro - Protect Your Shop from Violations',
    description: 'Automated Etsy compliance monitoring. Detect and fix policy violations before they hurt your shop.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
