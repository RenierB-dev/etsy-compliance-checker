'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Gift, Users, TrendingUp } from 'lucide-react';

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    creditsEarned: 0,
  });

  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralCode}`;

  const shareMessage = `I use EtsyGuard to keep my shop compliant - saved me from suspension! Get 1 month free: ${referralUrl}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4">
            <Gift className="h-8 w-8 text-brand-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Refer & Earn
          </h1>
          <p className="text-xl text-gray-600">
            Share EtsyGuard with fellow sellers and both get 1 month free!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Referrals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Months Earned</p>
                <p className="text-3xl font-bold text-gray-900">{stats.creditsEarned}</p>
              </div>
              <Gift className="h-10 w-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Referral Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Referral Link
          </h2>
          <p className="text-gray-600 mb-6">
            Share this link with other Etsy sellers. When they sign up and connect their shop,
            you'll both get 1 month of Pro for free!
          </p>

          {/* Referral Code Display */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Referral Code
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg font-mono text-lg font-bold text-brand-600"
              />
              <button
                onClick={() => copyToClipboard(referralCode)}
                className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Referral URL Display */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Referral URL
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={referralUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-600"
              />
              <button
                onClick={() => copyToClipboard(referralUrl)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Copy className="h-5 w-5" />
                Copy
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Share via:
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
                    '_blank'
                  )
                }
                className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Twitter
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
                    '_blank'
                  )
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Facebook
              </button>
              <button
                onClick={() =>
                  window.open(
                    `mailto:?subject=${encodeURIComponent('Check out EtsyGuard!')}&body=${encodeURIComponent(shareMessage)}`,
                    '_blank'
                  )
                }
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Email
              </button>
              <button
                onClick={() => copyToClipboard(shareMessage)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Message'}
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Share Your Link</h3>
                <p className="text-gray-700">
                  Send your unique referral link to other Etsy sellers via email, social media, or messaging.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">They Sign Up</h3>
                <p className="text-gray-700">
                  When they create an account using your link and connect their Etsy shop, the referral is tracked.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Both Get Rewarded</h3>
                <p className="text-gray-700">
                  You and your referral both receive 1 month of EtsyGuard Pro for free! No limits on referrals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
