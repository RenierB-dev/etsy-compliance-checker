/**
 * SellerGuard Pro - Landing Page
 *
 * Main landing page with hero, features, pricing, and CTAs
 */

'use client';

import React from 'react';
import Link from 'next/link';
import {
  PRICING_PLANS,
  SUPPORTED_PLATFORMS,
  FEATURES,
  FEATURE_HIGHLIGHTS,
  MARKET_STATS,
  SOCIAL_PROOF,
  CTA_MESSAGES
} from '../lib/constants';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            ⭐ Trusted by {SOCIAL_PROOF.totalUsers} sellers worldwide
          </div>
          <h1 className="hero-title">
            SellerGuard Pro
            <span className="hero-subtitle">Multi-Platform E-Commerce Protection</span>
          </h1>
          <p className="hero-description">
            Protect your Etsy & Amazon seller accounts with automated compliance monitoring.
            Detect policy violations before they cost you your business.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">{FEATURES.totalRules}+</div>
              <div className="stat-label">Compliance Rules</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{SOCIAL_PROOF.suspensionsPrevented}+</div>
              <div className="stat-label">Suspensions Prevented</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{SOCIAL_PROOF.moneySaved}</div>
              <div className="stat-label">Money Saved</div>
            </div>
          </div>
          <div className="hero-cta">
            <Link href="/dashboard" className="btn btn-primary btn-large">
              {CTA_MESSAGES.hero}
            </Link>
            <Link href="#pricing" className="btn btn-secondary btn-large">
              View Pricing
            </Link>
          </div>
          <p className="hero-note">✓ No credit card required • ✓ Free compliance check</p>
        </div>
      </section>

      {/* Platform Support Section */}
      <section className="platforms">
        <div className="section-header">
          <h2>Supported Platforms</h2>
          <p>Monitor compliance across multiple e-commerce platforms</p>
        </div>
        <div className="platform-grid">
          {SUPPORTED_PLATFORMS.map(platform => (
            <div key={platform.id} className={`platform-card ${platform.status}`}>
              <div className="platform-icon">{platform.icon}</div>
              <h3>{platform.name}</h3>
              {platform.status === 'live' ? (
                <>
                  <div className="platform-badge live">✅ Live</div>
                  <div className="platform-rules">{platform.rules} Rules</div>
                  <p>{platform.description}</p>
                </>
              ) : (
                <>
                  <div className="platform-badge coming-soon">🔜 Coming Soon</div>
                  <p>{platform.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Why SellerGuard Pro?</h2>
          <p>The most comprehensive compliance protection for e-commerce sellers</p>
        </div>
        <div className="features-grid">
          {FEATURE_HIGHLIGHTS.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Market Stats Section */}
      <section className="market-stats">
        <div className="section-header">
          <h2>The Cost of Non-Compliance</h2>
          <p>One suspension can destroy your business</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card danger">
            <div className="stat-icon">⚠️</div>
            <div className="stat-value">{MARKET_STATS.suspensionRate}</div>
            <div className="stat-label">Suspension Rate</div>
            <p>Sellers suspended annually for policy violations</p>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">💰</div>
            <div className="stat-value">{MARKET_STATS.avgSuspensionCost}</div>
            <div className="stat-label">Avg. Suspension Cost</div>
            <p>Lost revenue + legal fees + appeal process</p>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">⏰</div>
            <div className="stat-value">{MARKET_STATS.complianceTime}</div>
            <div className="stat-label">Manual Compliance Time</div>
            <p>Hours spent manually checking listings weekly</p>
          </div>
        </div>
        <div className="stats-cta">
          <p className="stats-highlight">
            Don't risk your business. Automate compliance monitoring for less than $2/day.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your business</p>
        </div>
        <div className="pricing-grid">
          {PRICING_PLANS.map(plan => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">⭐ Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="price-currency">$</span>
                <span className="price-amount">{plan.price}</span>
                {plan.period !== 'one-time' && (
                  <span className="price-period">/{plan.period}</span>
                )}
              </div>
              {plan.period === 'one-time' && <p className="price-note">One-time check</p>}
              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-full`}>
                {plan.cta}
              </button>
              <div className="plan-meta">
                <span>{plan.platforms === 999 ? 'All' : plan.platforms} platform{plan.platforms !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span>{plan.support}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof">
        <div className="section-header">
          <h2>Trusted by Sellers Worldwide</h2>
          <p>Join thousands of protected sellers</p>
        </div>
        <div className="proof-stats">
          <div className="proof-stat">
            <div className="proof-value">{SOCIAL_PROOF.totalUsers}</div>
            <div className="proof-label">Active Users</div>
          </div>
          <div className="proof-stat">
            <div className="proof-value">{SOCIAL_PROOF.violationsCaught}</div>
            <div className="proof-label">Violations Detected</div>
          </div>
          <div className="proof-stat">
            <div className="proof-value">{SOCIAL_PROOF.avgRating}★</div>
            <div className="proof-label">Average Rating</div>
          </div>
          <div className="proof-stat">
            <div className="proof-value">{MARKET_STATS.totalMarket}</div>
            <div className="proof-label">Total Market</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to Protect Your Seller Account?</h2>
          <p>Start with a free compliance check. No credit card required.</p>
          <Link href="/dashboard" className="btn btn-primary btn-large">
            {CTA_MESSAGES.footer}
          </Link>
          <p className="cta-note">
            ✓ 5-minute setup • ✓ Cancel anytime • ✓ 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>SellerGuard Pro</h3>
            <p>Multi-platform e-commerce compliance protection</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <Link href="/dashboard">Dashboard</Link>
              <a href="#platforms">Platforms</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="mailto:support@sellerguard.pro">Contact</a>
              <a href="/docs">Documentation</a>
              <a href="/api">API</a>
              <a href="/status">Status</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/security">Security</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 SellerGuard Pro. All rights reserved.</p>
          <p>Made with ❤️ for e-commerce sellers worldwide</p>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: #f5f7fa;
        }

        section {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }

        .section-header p {
          font-size: 1.25rem;
          color: #666;
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 6rem 2rem;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-subtitle {
          display: block;
          font-size: 1.5rem;
          font-weight: 400;
          opacity: 0.9;
          margin-top: 0.5rem;
        }

        .hero-description {
          font-size: 1.25rem;
          max-width: 700px;
          margin: 0 auto 2rem;
          opacity: 0.95;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 3rem 0;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .hero-cta {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .hero-note {
          font-size: 0.875rem;
          opacity: 0.8;
          margin-top: 1rem;
        }

        .btn {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: #2196f3;
          color: white;
        }

        .btn-primary:hover {
          background: #1976d2;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #667eea;
        }

        .btn-secondary:hover {
          background: #f5f5f5;
        }

        .btn-large {
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
        }

        .btn-full {
          width: 100%;
        }

        /* Platform Grid */
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .platform-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .platform-card:hover {
          transform: translateY(-8px);
        }

        .platform-card.coming-soon {
          opacity: 0.7;
        }

        .platform-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .platform-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .platform-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .platform-badge.live {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .platform-badge.coming-soon {
          background: #fff3e0;
          color: #e65100;
        }

        .platform-rules {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2196f3;
          margin-bottom: 1rem;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #333;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        /* Market Stats */
        .market-stats {
          background: #fff3cd;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-card.danger {
          border-left: 4px solid #f44336;
        }

        .stat-card.warning {
          border-left: 4px solid #ff9800;
        }

        .stat-card.info {
          border-left: 4px solid #2196f3;
        }

        .stat-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .stat-card .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .stat-card .stat-label {
          font-size: 1rem;
          font-weight: 600;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .stat-card p {
          color: #999;
          font-size: 0.875rem;
        }

        .stats-cta {
          text-align: center;
          margin-top: 3rem;
        }

        .stats-highlight {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
        }

        /* Pricing Grid */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .pricing-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          transition: transform 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-8px);
        }

        .pricing-card.popular {
          border: 3px solid #2196f3;
          transform: scale(1.05);
        }

        .popular-badge {
          position: absolute;
          top: -15px;
          right: 20px;
          background: #2196f3;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .pricing-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }

        .price {
          margin-bottom: 2rem;
        }

        .price-currency {
          font-size: 1.5rem;
          vertical-align: top;
        }

        .price-amount {
          font-size: 3rem;
          font-weight: 700;
          color: #333;
        }

        .price-period {
          font-size: 1.25rem;
          color: #666;
        }

        .price-note {
          color: #999;
          font-size: 0.875rem;
          margin-top: -1rem;
          margin-bottom: 1rem;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
        }

        .features-list li {
          padding: 0.5rem 0;
          color: #666;
          line-height: 1.5;
        }

        .plan-meta {
          text-align: center;
          color: #999;
          font-size: 0.875rem;
          margin-top: 1rem;
        }

        /* Social Proof */
        .proof-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          text-align: center;
        }

        .proof-value {
          font-size: 3rem;
          font-weight: 700;
          color: #2196f3;
          margin-bottom: 0.5rem;
        }

        .proof-label {
          font-size: 1rem;
          color: #666;
        }

        /* Final CTA */
        .final-cta {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }

        .final-cta h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .final-cta p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .cta-note {
          font-size: 0.875rem;
          opacity: 0.8;
          margin-top: 1rem;
        }

        /* Footer */
        .footer {
          background: #2c3e50;
          color: white;
          padding: 3rem 2rem 1rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .footer-brand h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .footer-brand p {
          color: #bdc3c7;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .footer-column h4 {
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .footer-column a {
          display: block;
          color: #bdc3c7;
          text-decoration: none;
          margin-bottom: 0.5rem;
          transition: color 0.3s;
        }

        .footer-column a:hover {
          color: white;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid #34495e;
          color: #bdc3c7;
        }

        .footer-bottom p {
          margin: 0.5rem 0;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .hero-cta {
            flex-direction: column;
          }

          .footer-content {
            grid-template-columns: 1fr;
          }

          .footer-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
