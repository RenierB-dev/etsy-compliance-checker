/**
 * SellerGuard Pro - Application Constants
 *
 * Pricing plans, features, and platform information
 */

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'one-time' | 'month' | 'year';
  popular?: boolean;
  features: string[];
  platforms: number;
  scansPerDay: number;
  support: string;
  cta: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'one-time',
    features: [
      'One-time compliance check',
      'Choose 1 platform (Etsy or Amazon)',
      'Basic violation detection',
      'Export results to CSV',
      'Email support'
    ],
    platforms: 1,
    scansPerDay: 1,
    support: 'Email (48h response)',
    cta: 'Start Free Check'
  },
  {
    id: 'solo',
    name: 'Solo Seller',
    price: 29,
    period: 'month',
    features: [
      'Daily automated scans',
      '1 platform of your choice',
      'All 108+ compliance rules',
      'Email alerts for violations',
      'Export to JSON & CSV',
      'Historical tracking',
      'Priority email support'
    ],
    platforms: 1,
    scansPerDay: 3,
    support: 'Priority Email (24h response)',
    cta: 'Start Solo Plan'
  },
  {
    id: 'multi',
    name: 'Multi-Platform',
    price: 49,
    period: 'month',
    popular: true,
    features: [
      'BOTH Etsy & Amazon platforms',
      'Unlimited daily scans',
      'All 108+ compliance rules',
      'Real-time violation alerts',
      'Cross-platform comparison',
      'Advanced analytics dashboard',
      'Export to JSON & CSV',
      'Historical tracking & trends',
      'Slack/Discord integration',
      'Priority support'
    ],
    platforms: 2,
    scansPerDay: 999,
    support: 'Priority Support (12h response)',
    cta: 'Start Multi-Platform'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'month',
    features: [
      'All platforms (Etsy, Amazon, eBay*)',
      'Unlimited scans',
      'White-label dashboard',
      'Custom compliance rules',
      'API access',
      'Team collaboration (5 users)',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      '24/7 phone & chat support'
    ],
    platforms: 999,
    scansPerDay: 999,
    support: '24/7 Phone & Chat',
    cta: 'Contact Sales'
  }
];

export interface PlatformInfo {
  id: string;
  name: string;
  status: 'live' | 'coming-soon';
  icon: string;
  rules: number;
  description: string;
  color: string;
}

export const SUPPORTED_PLATFORMS: PlatformInfo[] = [
  {
    id: 'etsy',
    name: 'Etsy',
    status: 'live',
    icon: '🎨',
    rules: 48,
    description: 'Comprehensive Etsy policy compliance with 48 specialized rules covering prohibited items, SEO optimization, and shop standards.',
    color: '#F56400'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    status: 'live',
    icon: '📦',
    rules: 60,
    description: 'Complete Amazon SP-API integration with 60 rules for product detail pages, FBA requirements, and content policy compliance.',
    color: '#FF9900'
  },
  {
    id: 'ebay',
    name: 'eBay',
    status: 'coming-soon',
    icon: '🏪',
    rules: 0,
    description: 'Coming soon! eBay compliance rules for listing optimization, prohibited items, and seller performance.',
    color: '#E53238'
  }
];

export const FEATURES = {
  totalRules: 108,
  platforms: 2,
  upcomingPlatforms: 1,
  totalSellers: '17M+',
  scanSpeed: '< 2 minutes',
  accuracy: '99.9%'
};

export const FEATURE_HIGHLIGHTS = [
  {
    icon: '🛡️',
    title: 'Account Protection',
    description: 'Prevent suspensions and policy violations before they happen'
  },
  {
    icon: '⚡',
    title: 'Automated Scanning',
    description: 'Daily compliance checks with instant violation alerts'
  },
  {
    icon: '📊',
    title: 'Smart Analytics',
    description: 'Track compliance scores and historical trends over time'
  },
  {
    icon: '🔄',
    title: 'Multi-Platform',
    description: 'Monitor Etsy and Amazon from a single unified dashboard'
  },
  {
    icon: '📧',
    title: 'Real-Time Alerts',
    description: 'Get notified immediately when violations are detected'
  },
  {
    icon: '🎯',
    title: '108+ Rules',
    description: 'Comprehensive rule coverage across all major policy areas'
  }
];

export const MARKET_STATS = {
  etsySellers: '7.5M+',
  amazonSellers: '9.7M+',
  totalMarket: '17M+',
  avgSuspensionCost: '$50,000',
  suspensionRate: '12%',
  complianceTime: '4-6 hours/week'
};

export const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Etsy Shop Owner',
    platform: 'etsy',
    rating: 5,
    quote: 'SellerGuard Pro saved my shop! I had 3 critical violations I never knew about. Fixed them before Etsy noticed.',
    savings: '$15,000'
  },
  {
    name: 'Michael Chen',
    role: 'Amazon FBA Seller',
    platform: 'amazon',
    rating: 5,
    quote: 'The Amazon SP-API integration is incredible. Caught trademark issues on 12 listings that would have gotten me suspended.',
    savings: '$100,000+'
  },
  {
    name: 'Lisa Martinez',
    role: 'Multi-Platform Seller',
    platform: 'both',
    rating: 5,
    quote: 'Managing compliance across Etsy and Amazon was a nightmare. This dashboard makes it so easy. Worth every penny.',
    timeSaved: '15 hours/week'
  }
];

export const FAQ = [
  {
    question: 'How does SellerGuard Pro work?',
    answer: 'We connect to your Etsy and Amazon accounts via official APIs, scan all your listings against 108+ compliance rules, and provide detailed reports with actionable recommendations.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes! We use OAuth 2.0 authentication and never store your credentials. All data is encrypted in transit and at rest. We\'re read-only - we can\'t modify your listings.'
  },
  {
    question: 'What happens if violations are found?',
    answer: 'You\'ll receive a detailed report showing each violation, its severity level, and specific recommendations for fixing it. We also send real-time email alerts for critical issues.'
  },
  {
    question: 'Can I try it before paying?',
    answer: 'Absolutely! Our Free plan lets you run one compliance check on either platform. No credit card required.'
  },
  {
    question: 'Do you support other platforms?',
    answer: 'Currently we support Etsy and Amazon. eBay integration is coming soon! Enterprise customers can request custom platform integrations.'
  },
  {
    question: 'How long does a scan take?',
    answer: 'Most scans complete in under 2 minutes, even with hundreds of listings. Our system is highly optimized for speed.'
  }
];

export const SOCIAL_PROOF = {
  totalUsers: '5,000+',
  violationsCaught: '50,000+',
  suspensionsPrevented: '1,200+',
  moneySaved: '$25M+',
  avgRating: 4.9,
  totalReviews: 1247
};

export const CTA_MESSAGES = {
  hero: 'Protect Your Seller Account Today',
  pricing: 'Start Your Free Check Now',
  footer: 'Join 5,000+ Protected Sellers',
  dashboard: 'Try SellerGuard Pro Free'
};
