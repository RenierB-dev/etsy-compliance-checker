'use client';

import Link from 'next/link';
import { Shield, CheckCircle, Zap, TrendingUp, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-100 rounded-full mb-6">
            <Shield className="h-10 w-10 text-brand-600" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Protect Your Etsy Shop from <span className="text-brand-600">Policy Violations</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Automated compliance monitoring that detects and fixes policy violations before they hurt your shop.
            Get instant alerts and one-click fixes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white text-lg font-semibold rounded-lg transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 text-lg font-semibold rounded-lg transition-colors border-2 border-gray-200"
            >
              View Dashboard
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="One-Click Auto-Fix"
            description="Fix all violations instantly with AI-powered suggestions. No manual editing required."
            color="yellow"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="24/7 Monitoring"
            description="Daily automated scans keep your shop compliant around the clock. Get alerts instantly."
            color="blue"
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Compliance Score"
            description="Track your shop's health with real-time compliance scoring and trend analysis."
            color="green"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-center">
          <div>
            <div className="text-4xl font-bold text-brand-600">1,000+</div>
            <div className="text-gray-600 mt-2">Shops Protected</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-600">50,000+</div>
            <div className="text-gray-600 mt-2">Violations Fixed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-600">98%</div>
            <div className="text-gray-600 mt-2">Satisfaction Rate</div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Trusted by Successful Etsy Sellers
            </h2>
            <p className="text-gray-600">See what our users are saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestimonialCard
              quote="EtsyGuard Pro saved my shop from suspension. The auto-fix feature is incredible!"
              author="Sarah M."
              role="5-star seller"
            />
            <TestimonialCard
              quote="Best $29 I spend every month. Caught violations I would have never noticed myself."
              author="Mike T."
              role="2,000+ sales"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Protect Your Shop?
          </h2>
          <p className="text-xl mb-8 text-brand-100">
            Join 1,000+ sellers who trust EtsyGuard Pro
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-brand-600 text-lg font-semibold rounded-lg transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'yellow' | 'blue' | 'green';
}) {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-start gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400 text-xl">★</span>
        ))}
      </div>
      <p className="text-gray-700 italic mb-4">"{quote}"</p>
      <div>
        <div className="font-semibold text-gray-900">{author}</div>
        <div className="text-sm text-gray-600">{role}</div>
      </div>
    </div>
  );
}
