/**
 * SellerGuard Pro - Violation List Component
 *
 * Displays a list of compliance violations with filtering and sorting
 */

import React, { useState, useMemo } from 'react';
import { ViolationResult, Severity } from '../lib/types/compliance';
import { ListingViolation } from '../lib/services/compliance-scanner';

export interface ViolationListProps {
  violations: ListingViolation[];
  platform: 'etsy' | 'amazon';
  onFixClick?: (violation: ViolationResult, listingId: string | number) => void;
  className?: string;
}

type SortField = 'severity' | 'listing' | 'rule';
type SortOrder = 'asc' | 'desc';

const severityOrder: Record<Severity, number> = {
  critical: 0,
  warning: 1,
  info: 2
};

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const colors = {
    critical: { bg: '#ffebee', color: '#c62828', border: '#ef5350' },
    warning: { bg: '#fff3e0', color: '#e65100', border: '#ff9800' },
    info: { bg: '#e3f2fd', color: '#1565c0', border: '#2196f3' }
  };

  const style = colors[severity];

  return (
    <span
      className="severity-badge"
      style={{
        background: style.bg,
        color: style.color,
        borderLeft: `4px solid ${style.border}`
      }}
    >
      {severity === 'critical' && '🚨'}
      {severity === 'warning' && '⚠️'}
      {severity === 'info' && 'ℹ️'}
      {' '}
      {severity.toUpperCase()}
      <style jsx>{`
        .severity-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>
    </span>
  );
};

export const ViolationList: React.FC<ViolationListProps> = ({
  violations,
  platform,
  onFixClick,
  className = ''
}) => {
  const [sortField, setSortField] = useState<SortField>('severity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedListing, setExpandedListing] = useState<string | number | null>(null);

  const filteredAndSorted = useMemo(() => {
    let result = [...violations];

    // Filter by severity
    if (severityFilter !== 'all') {
      result = result.map(listing => ({
        ...listing,
        violations: listing.violations.filter(v => v.severity === severityFilter)
      })).filter(listing => listing.violations.length > 0);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(listing =>
        listing.listingTitle.toLowerCase().includes(query) ||
        listing.violations.some(v =>
          v.message.toLowerCase().includes(query) ||
          v.ruleId.toLowerCase().includes(query)
        )
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'severity') {
        const aMaxSeverity = Math.min(...a.violations.map(v => severityOrder[v.severity]));
        const bMaxSeverity = Math.min(...b.violations.map(v => severityOrder[v.severity]));
        comparison = aMaxSeverity - bMaxSeverity;
      } else if (sortField === 'listing') {
        comparison = a.listingTitle.localeCompare(b.listingTitle);
      } else if (sortField === 'rule') {
        comparison = a.violations.length - b.violations.length;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [violations, severityFilter, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleListing = (listingId: string | number) => {
    setExpandedListing(expandedListing === listingId ? null : listingId);
  };

  return (
    <div className={`violation-list ${className}`}>
      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search violations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="severity-filters">
          {(['all', 'critical', 'warning', 'info'] as const).map(severity => (
            <button
              key={severity}
              className={`filter-btn ${severityFilter === severity ? 'active' : ''}`}
              onClick={() => setSeverityFilter(severity)}
            >
              {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>

        <div className="sort-controls">
          <button
            className={`sort-btn ${sortField === 'severity' ? 'active' : ''}`}
            onClick={() => handleSort('severity')}
          >
            Severity {sortField === 'severity' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`sort-btn ${sortField === 'listing' ? 'active' : ''}`}
            onClick={() => handleSort('listing')}
          >
            Listing {sortField === 'listing' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`sort-btn ${sortField === 'rule' ? 'active' : ''}`}
            onClick={() => handleSort('rule')}
          >
            Count {sortField === 'rule' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'listing' : 'listings'} with violations
      </div>

      {/* Violation List */}
      <div className="violations">
        {filteredAndSorted.length === 0 ? (
          <div className="empty-state">
            <p>🎉 No violations found!</p>
            {severityFilter !== 'all' && (
              <p className="empty-hint">Try changing the filter to see other violations</p>
            )}
          </div>
        ) : (
          filteredAndSorted.map(listing => (
            <div key={listing.listingId} className="listing-card">
              <div
                className="listing-header"
                onClick={() => toggleListing(listing.listingId)}
                role="button"
                tabIndex={0}
              >
                <div className="listing-info">
                  <h4 className="listing-title">{listing.listingTitle}</h4>
                  <span className="listing-id">
                    {platform === 'etsy' ? 'Listing' : 'ASIN'}: {listing.listingId}
                  </span>
                </div>
                <div className="listing-summary">
                  {listing.criticalCount > 0 && (
                    <span className="violation-count critical">
                      {listing.criticalCount} critical
                    </span>
                  )}
                  {listing.warningCount > 0 && (
                    <span className="violation-count warning">
                      {listing.warningCount} warning
                    </span>
                  )}
                  {listing.infoCount > 0 && (
                    <span className="violation-count info">
                      {listing.infoCount} info
                    </span>
                  )}
                  <span className="expand-icon">
                    {expandedListing === listing.listingId ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {expandedListing === listing.listingId && (
                <div className="violations-detail">
                  {listing.violations.map((violation, index) => (
                    <div key={index} className="violation-item">
                      <div className="violation-header">
                        <SeverityBadge severity={violation.severity} />
                        <span className="rule-id">{violation.ruleId}</span>
                      </div>
                      <p className="violation-message">{violation.message}</p>
                      {violation.field && (
                        <div className="violation-meta">
                          <span className="meta-label">Field:</span>
                          <span className="meta-value">{violation.field}</span>
                        </div>
                      )}
                      {violation.matchedValue && (
                        <div className="violation-meta">
                          <span className="meta-label">Matched:</span>
                          <span className="meta-value">"{violation.matchedValue}"</span>
                        </div>
                      )}
                      {violation.recommendation && (
                        <div className="recommendation">
                          <strong>💡 Recommendation:</strong> {violation.recommendation}
                        </div>
                      )}
                      {onFixClick && (
                        <button
                          className="fix-btn"
                          onClick={() => onFixClick(violation, listing.listingId)}
                        >
                          Fix This Issue
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .violation-list {
          width: 100%;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .search-box {
          flex: 1;
          min-width: 200px;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: border-color 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #2196f3;
        }

        .severity-filters,
        .sort-controls {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn,
        .sort-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-btn:hover,
        .sort-btn:hover {
          border-color: #2196f3;
        }

        .filter-btn.active,
        .sort-btn.active {
          background: #2196f3;
          color: white;
          border-color: #2196f3;
        }

        .results-count {
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #666;
        }

        .violations {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .listing-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .listing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }

        .listing-header:hover {
          background: #f8f9fa;
        }

        .listing-info {
          flex: 1;
        }

        .listing-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          color: #333;
        }

        .listing-id {
          font-size: 0.75rem;
          color: #999;
        }

        .listing-summary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .violation-count {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .violation-count.critical {
          background: #ffebee;
          color: #c62828;
        }

        .violation-count.warning {
          background: #fff3e0;
          color: #e65100;
        }

        .violation-count.info {
          background: #e3f2fd;
          color: #1565c0;
        }

        .expand-icon {
          font-size: 0.75rem;
          color: #666;
        }

        .violations-detail {
          border-top: 1px solid #e0e0e0;
          padding: 1rem;
          background: #f8f9fa;
        }

        .violation-item {
          padding: 1rem;
          background: white;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .violation-item:last-child {
          margin-bottom: 0;
        }

        .violation-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .rule-id {
          font-size: 0.75rem;
          color: #666;
          font-family: monospace;
        }

        .violation-message {
          margin: 0.5rem 0;
          color: #333;
          line-height: 1.5;
        }

        .violation-meta {
          font-size: 0.875rem;
          color: #666;
          margin-top: 0.5rem;
        }

        .meta-label {
          font-weight: 600;
          margin-right: 0.5rem;
        }

        .meta-value {
          color: #333;
        }

        .recommendation {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          border-radius: 4px;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .fix-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s;
        }

        .fix-btn:hover {
          background: #1976d2;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .empty-state p {
          margin: 0.5rem 0;
        }

        .empty-hint {
          font-size: 0.875rem;
          color: #999;
        }

        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
          }

          .listing-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .listing-summary {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default ViolationList;
