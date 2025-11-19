import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
    });
  }
}

// Analytics event tracking
export const analytics = {
  // User events
  userSignedUp: (userId: string, email: string) => {
    posthog.capture('user_signed_up', {
      user_id: userId,
      email,
    });
    posthog.identify(userId, {
      email,
    });
  },

  // Shop events
  shopConnected: (userId: string, shopId: string, shopName: string) => {
    posthog.capture('shop_connected', {
      user_id: userId,
      shop_id: shopId,
      shop_name: shopName,
    });
  },

  // Scan events
  firstScanCompleted: (
    userId: string,
    shopId: string,
    complianceScore: number,
    violationsFound: number
  ) => {
    posthog.capture('first_scan_completed', {
      user_id: userId,
      shop_id: shopId,
      compliance_score: complianceScore,
      violations_found: violationsFound,
    });
  },

  scanCompleted: (
    userId: string,
    shopId: string,
    scanType: string,
    complianceScore: number,
    violationsFound: number
  ) => {
    posthog.capture('scan_completed', {
      user_id: userId,
      shop_id: shopId,
      scan_type: scanType,
      compliance_score: complianceScore,
      violations_found: violationsFound,
    });
  },

  // Violation events
  violationDetected: (
    userId: string,
    shopId: string,
    violationType: string,
    severity: string
  ) => {
    posthog.capture('violation_detected', {
      user_id: userId,
      shop_id: shopId,
      violation_type: violationType,
      severity,
    });
  },

  violationFixed: (
    userId: string,
    shopId: string,
    violationType: string,
    fixMethod: 'manual' | 'auto'
  ) => {
    posthog.capture('violation_fixed', {
      user_id: userId,
      shop_id: shopId,
      violation_type: violationType,
      fix_method: fixMethod,
    });
  },

  // Subscription events
  upgradeToPro: (userId: string, plan: string, amount: number) => {
    posthog.capture('upgrade_to_pro', {
      user_id: userId,
      plan,
      amount,
    });
  },

  subscriptionCancelled: (userId: string, plan: string, reason?: string) => {
    posthog.capture('subscription_cancelled', {
      user_id: userId,
      plan,
      reason,
    });
  },

  // Referral events
  referralSent: (userId: string, referralCode: string) => {
    posthog.capture('referral_sent', {
      user_id: userId,
      referral_code: referralCode,
    });
  },

  referralCompleted: (referrerId: string, referredId: string) => {
    posthog.capture('referral_completed', {
      referrer_id: referrerId,
      referred_id: referredId,
    });
  },

  // Automation events
  dailyScanTriggered: (shopId: string, scheduledTime: string) => {
    posthog.capture('daily_scan_triggered', {
      shop_id: shopId,
      scheduled_time: scheduledTime,
    });
  },

  autoFixUsed: (userId: string, shopId: string, violationsFixed: number) => {
    posthog.capture('auto_fix_used', {
      user_id: userId,
      shop_id: shopId,
      violations_fixed: violationsFixed,
    });
  },

  // Shop-level analytics
  complianceScoreImproved: (
    shopId: string,
    previousScore: number,
    newScore: number
  ) => {
    posthog.capture('compliance_score_improved', {
      shop_id: shopId,
      previous_score: previousScore,
      new_score: newScore,
      improvement: newScore - previousScore,
    });
  },

  // Engagement events
  featureUsed: (userId: string, feature: string) => {
    posthog.capture('feature_used', {
      user_id: userId,
      feature,
    });
  },

  pageViewed: (userId: string, page: string) => {
    posthog.capture('page_viewed', {
      user_id: userId,
      page,
    });
  },

  // Onboarding events
  onboardingStarted: (userId: string) => {
    posthog.capture('onboarding_started', {
      user_id: userId,
    });
  },

  onboardingCompleted: (userId: string, timeSpent: number) => {
    posthog.capture('onboarding_completed', {
      user_id: userId,
      time_spent_seconds: timeSpent,
    });
  },

  tourSkipped: (userId: string, step: number) => {
    posthog.capture('tour_skipped', {
      user_id: userId,
      step,
    });
  },
};

export default posthog;
