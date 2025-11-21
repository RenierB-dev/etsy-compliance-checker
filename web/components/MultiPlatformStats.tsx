/**
 * SellerGuard Pro - Multi-Platform Stats Component
 *
 * Displays compliance statistics across Etsy and Amazon platforms
 */

import React from 'react';
import { ScanResult, Platform } from '../lib/types/compliance';

export interface MultiPlatformStatsProps {
  etsyStats?: ScanResult | null;
  amazonStats?: ScanResult | null;
  complianceScores?: {
    etsy: number;
    amazon: number;
  };
  loading?: boolean;
  className?: string;
}

interface StatCardProps {
  platform: Platform;
  stats: ScanResult | null;
  score: number;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ platform, stats, score, loading }) => {
  if (loading) {
    return (
      <div className="stat-card loading">
        <div className="stat-card-header">
          <h3>{platform === 'etsy' ? 'Etsy' : 'Amazon'}</h3>
        </div>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stat-card empty">
        <div className="stat-card-header">
          <h3>{platform === 'etsy' ? 'Etsy' : 'Amazon'}</h3>
        </div>
        <div className="empty-state">
          <p>No data available</p>
          <p className="empty-hint">Connect your {platform === 'etsy' ? 'Etsy' : 'Amazon'} account to start scanning</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#8bc34a';
    if (score >= 70) return '#ffc107';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const healthyListings = stats.totalListings - stats.violations.length;
  const healthPercentage = Math.round((healthyListings / stats.totalListings) * 100);

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h3>{platform === 'etsy' ? 'Etsy' : 'Amazon'}</h3>
        <span className="platform-badge">{stats.totalListings} listings</span>
      </div>

      {/* Compliance Score */}
      <div className="score-section">
        <div className="score-circle" style={{ borderColor: getScoreColor(score) }}>
          <div className="score-value" style={{ color: getScoreColor(score) }}>
            {score}
          </div>
          <div className="score-label">Score</div>
          <div className="score-grade" style={{ color: getScoreColor(score) }}>
            Grade {getGrade(score)}
          </div>
        </div>
      </div>

      {/* Violation Stats */}
      <div className="stats-grid">
        <div className="stat-item critical">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.criticalCount}</div>
            <div className="stat-label">Critical</div>
          </div>
        </div>

        <div className="stat-item warning">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">{stats.warningCount}</div>
            <div className="stat-label">Warnings</div>
          </div>
        </div>

        <div className="stat-item info">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <div className="stat-value">{stats.infoCount}</div>
            <div className="stat-label">Info</div>
          </div>
        </div>

        <div className="stat-item healthy">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{healthyListings}</div>
            <div className="stat-label">Healthy</div>
          </div>
        </div>
      </div>

      {/* Health Bar */}
      <div className="health-bar">
        <div className="health-bar-label">
          <span>Compliance Health</span>
          <span className="health-percentage">{healthPercentage}%</span>
        </div>
        <div className="health-bar-track">
          <div
            className="health-bar-fill"
            style={{
              width: `${healthPercentage}%`,
              backgroundColor: getScoreColor(score)
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .stat-card.loading,
        .stat-card.empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .stat-card-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .platform-badge {
          padding: 0.25rem 0.75rem;
          background: #f5f5f5;
          border-radius: 12px;
          font-size: 0.875rem;
          color: #666;
          font-weight: 500;
        }

        .score-section {
          display: flex;
          justify-content: center;
          margin: 1.5rem 0;
        }

        .score-circle {
          width: 140px;
          height: 140px;
          border: 8px solid;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .score-value {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .score-label {
          font-size: 0.75rem;
          color: #999;
          margin-top: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .score-grade {
          position: absolute;
          bottom: -30px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin: 2rem 0 1.5rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid transparent;
        }

        .stat-item.critical {
          border-left-color: #f44336;
        }

        .stat-item.warning {
          border-left-color: #ff9800;
        }

        .stat-item.info {
          border-left-color: #2196f3;
        }

        .stat-item.healthy {
          border-left-color: #4caf50;
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .health-bar {
          margin-top: 1rem;
        }

        .health-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          color: #666;
        }

        .health-percentage {
          font-weight: 600;
          color: #333;
        }

        .health-bar-track {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .health-bar-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .loading-spinner {
          font-size: 1rem;
          color: #666;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .empty-state {
          text-align: center;
          color: #999;
        }

        .empty-state p {
          margin: 0.5rem 0;
        }

        .empty-hint {
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export const MultiPlatformStats: React.FC<MultiPlatformStatsProps> = ({
  etsyStats,
  amazonStats,
  complianceScores = { etsy: 0, amazon: 0 },
  loading = false,
  className = ''
}) => {
  const combinedStats = React.useMemo(() => {
    if (!etsyStats && !amazonStats) return null;

    const totalListings = (etsyStats?.totalListings || 0) + (amazonStats?.totalListings || 0);
    const totalViolations = (etsyStats?.violationCount || 0) + (amazonStats?.violationCount || 0);
    const avgScore = Math.round((complianceScores.etsy + complianceScores.amazon) / 2);

    return {
      totalListings,
      totalViolations,
      avgScore
    };
  }, [etsyStats, amazonStats, complianceScores]);

  return (
    <div className={`multi-platform-stats ${className}`}>
      {/* Combined Stats Header */}
      {combinedStats && (
        <div className="combined-header">
          <div className="combined-stat">
            <div className="combined-value">{combinedStats.totalListings}</div>
            <div className="combined-label">Total Listings</div>
          </div>
          <div className="combined-stat">
            <div className="combined-value">{combinedStats.totalViolations}</div>
            <div className="combined-label">Total Violations</div>
          </div>
          <div className="combined-stat">
            <div className="combined-value">{combinedStats.avgScore}</div>
            <div className="combined-label">Avg. Score</div>
          </div>
        </div>
      )}

      {/* Platform Stats Cards */}
      <div className="stats-cards">
        <StatCard
          platform="etsy"
          stats={etsyStats || null}
          score={complianceScores.etsy}
          loading={loading}
        />
        <StatCard
          platform="amazon"
          stats={amazonStats || null}
          score={complianceScores.amazon}
          loading={loading}
        />
      </div>

      <style jsx>{`
        .multi-platform-stats {
          width: 100%;
        }

        .combined-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          color: white;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
        }

        .combined-stat {
          flex: 1;
          text-align: center;
        }

        .combined-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .combined-label {
          font-size: 0.875rem;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .combined-header {
            flex-direction: column;
            gap: 1rem;
          }

          .stats-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MultiPlatformStats;
