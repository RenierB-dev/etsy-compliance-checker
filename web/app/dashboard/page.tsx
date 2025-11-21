/**
 * SellerGuard Pro - Unified Dashboard Page
 *
 * Main dashboard for viewing compliance across Etsy and Amazon platforms
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Platform, ScanResult } from '../../lib/types/compliance';
import { ComplianceScanner } from '../../lib/services/compliance-scanner';
import PlatformSwitcher from '../../components/PlatformSwitcher';
import MultiPlatformStats from '../../components/MultiPlatformStats';
import ViolationList from '../../components/ViolationList';

export default function DashboardPage() {
  const [currentPlatform, setCurrentPlatform] = useState<Platform>('etsy');
  const [loading, setLoading] = useState(false);
  const [etsyScanResult, setEtsyScanResult] = useState<ScanResult | null>(null);
  const [amazonScanResult, setAmazonScanResult] = useState<ScanResult | null>(null);
  const [complianceScores, setComplianceScores] = useState({ etsy: 0, amazon: 0 });

  // Calculate compliance scores when scan results change
  useEffect(() => {
    if (etsyScanResult) {
      const etsyScore = ComplianceScanner.getComplianceScore(etsyScanResult);
      setComplianceScores(prev => ({ ...prev, etsy: etsyScore }));
    }
    if (amazonScanResult) {
      const amazonScore = ComplianceScanner.getComplianceScore(amazonScanResult);
      setComplianceScores(prev => ({ ...prev, amazon: amazonScore }));
    }
  }, [etsyScanResult, amazonScanResult]);

  const handleScanPlatform = async (platform: Platform) => {
    setLoading(true);

    try {
      if (platform === 'etsy') {
        // In production, fetch from Etsy API
        // const etsyApi = new EtsyApiService(config);
        // const listings = await etsyApi.getActiveListings();
        // const result = ComplianceScanner.scanEtsyListings(listings);
        // setEtsyScanResult(result);

        console.log('Scan Etsy - would fetch from API in production');
      } else {
        // In production, fetch from Amazon SP-API
        // const amazonApi = createAmazonAPIService(config);
        // const listings = await amazonApi.getListings();
        // const result = ComplianceScanner.scanAmazonListings(listings.data);
        // setAmazonScanResult(result);

        console.log('Scan Amazon - would fetch from API in production');
      }
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    const currentResult = currentPlatform === 'etsy' ? etsyScanResult : amazonScanResult;
    if (!currentResult) return;

    const json = ComplianceScanner.exportToJSON(currentResult);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sellerguard-${currentPlatform}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const currentResult = currentPlatform === 'etsy' ? etsyScanResult : amazonScanResult;
    if (!currentResult) return;

    const csv = ComplianceScanner.exportToCSV(currentResult);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sellerguard-${currentPlatform}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentScanResult = currentPlatform === 'etsy' ? etsyScanResult : amazonScanResult;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">SellerGuard Pro</h1>
          <p className="dashboard-subtitle">Multi-Platform E-Commerce Compliance Checker</p>
        </div>
        <div className="header-actions">
          <button
            className="action-btn primary"
            onClick={() => handleScanPlatform(currentPlatform)}
            disabled={loading}
          >
            {loading ? 'Scanning...' : `Scan ${currentPlatform === 'etsy' ? 'Etsy' : 'Amazon'}`}
          </button>
          {currentScanResult && (
            <>
              <button className="action-btn secondary" onClick={handleExportJSON}>
                Export JSON
              </button>
              <button className="action-btn secondary" onClick={handleExportCSV}>
                Export CSV
              </button>
            </>
          )}
        </div>
      </header>

      {/* Platform Switcher */}
      <div className="section">
        <PlatformSwitcher
          currentPlatform={currentPlatform}
          onPlatformChange={setCurrentPlatform}
          etsyCount={etsyScanResult?.totalListings}
          amazonCount={amazonScanResult?.totalListings}
          disabled={loading}
        />
      </div>

      {/* Multi-Platform Stats */}
      <div className="section">
        <h2 className="section-title">Compliance Overview</h2>
        <MultiPlatformStats
          etsyStats={etsyScanResult}
          amazonStats={amazonScanResult}
          complianceScores={complianceScores}
          loading={loading}
        />
      </div>

      {/* Summary Cards */}
      {currentScanResult && (
        <div className="section">
          <div className="summary-grid">
            {(() => {
              const summary = ComplianceScanner.generateSummary(currentScanResult);
              return (
                <>
                  <div className="summary-card">
                    <div className="summary-icon">📊</div>
                    <div className="summary-content">
                      <div className="summary-value">{summary.score}</div>
                      <div className="summary-label">Compliance Score</div>
                      <div className="summary-grade">Grade: {summary.grade}</div>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon">✅</div>
                    <div className="summary-content">
                      <div className="summary-value">{summary.healthyListings}</div>
                      <div className="summary-label">Healthy Listings</div>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon">⚠️</div>
                    <div className="summary-content">
                      <div className="summary-value">{summary.listingsWithIssues}</div>
                      <div className="summary-label">Need Attention</div>
                    </div>
                  </div>
                  <div className="summary-card recommendation">
                    <div className="summary-icon">💡</div>
                    <div className="summary-content">
                      <div className="summary-label">Recommendation</div>
                      <div className="summary-text">{summary.recommendation}</div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Violations List */}
      {currentScanResult && currentScanResult.violations.length > 0 && (
        <div className="section">
          <h2 className="section-title">
            Violations Found ({currentScanResult.violations.length})
          </h2>
          <ViolationList
            violations={currentScanResult.violations}
            platform={currentPlatform}
            onFixClick={(violation, listingId) => {
              console.log('Fix violation:', violation, 'for listing:', listingId);
              // In production, navigate to listing edit page
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {!currentScanResult && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🚀</div>
          <h3>Start Your Compliance Check</h3>
          <p>Click "Scan {currentPlatform === 'etsy' ? 'Etsy' : 'Amazon'}" to analyze your listings for compliance violations.</p>
          <button
            className="action-btn primary large"
            onClick={() => handleScanPlatform(currentPlatform)}
          >
            Scan Now
          </button>
        </div>
      )}

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #f5f7fa;
          padding: 2rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          flex: 1;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 0.5rem 0;
        }

        .dashboard-subtitle {
          font-size: 1rem;
          color: #666;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: #2196f3;
          color: white;
        }

        .action-btn.primary:hover {
          background: #1976d2;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }

        .action-btn.secondary {
          background: #f5f5f5;
          color: #333;
        }

        .action-btn.secondary:hover {
          background: #e0e0e0;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-btn.large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        .section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 1.5rem 0;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .summary-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-4px);
        }

        .summary-card.recommendation {
          grid-column: span 2;
        }

        .summary-icon {
          font-size: 2.5rem;
        }

        .summary-content {
          flex: 1;
        }

        .summary-value {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .summary-label {
          font-size: 0.875rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-grade {
          font-size: 0.875rem;
          color: #2196f3;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        .summary-text {
          font-size: 1rem;
          color: #333;
          margin-top: 0.5rem;
          line-height: 1.5;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 0.5rem 0;
        }

        .empty-state p {
          font-size: 1rem;
          color: #666;
          margin: 0 0 2rem 0;
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-actions {
            flex-wrap: wrap;
            width: 100%;
          }

          .action-btn {
            flex: 1;
          }

          .summary-card.recommendation {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
