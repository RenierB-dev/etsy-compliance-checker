/**
 * SellerGuard Pro - Platform Switcher Component
 *
 * Allows users to switch between Etsy and Amazon platforms
 */

import React from 'react';
import { Platform } from '../lib/types/compliance';

export interface PlatformSwitcherProps {
  currentPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  etsyCount?: number;
  amazonCount?: number;
  disabled?: boolean;
  className?: string;
}

export const PlatformSwitcher: React.FC<PlatformSwitcherProps> = ({
  currentPlatform,
  onPlatformChange,
  etsyCount,
  amazonCount,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`platform-switcher ${className}`}>
      <div className="platform-switcher-container">
        <button
          className={`platform-button ${currentPlatform === 'etsy' ? 'active' : ''}`}
          onClick={() => onPlatformChange('etsy')}
          disabled={disabled}
          aria-label="Switch to Etsy"
        >
          <div className="platform-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <div className="platform-info">
            <span className="platform-name">Etsy</span>
            {etsyCount !== undefined && (
              <span className="platform-count">{etsyCount} listings</span>
            )}
          </div>
          {currentPlatform === 'etsy' && (
            <div className="active-indicator" aria-hidden="true">✓</div>
          )}
        </button>

        <div className="platform-divider" aria-hidden="true">
          <span>or</span>
        </div>

        <button
          className={`platform-button ${currentPlatform === 'amazon' ? 'active' : ''}`}
          onClick={() => onPlatformChange('amazon')}
          disabled={disabled}
          aria-label="Switch to Amazon"
        >
          <div className="platform-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <div className="platform-info">
            <span className="platform-name">Amazon</span>
            {amazonCount !== undefined && (
              <span className="platform-count">{amazonCount} listings</span>
            )}
          </div>
          {currentPlatform === 'amazon' && (
            <div className="active-indicator" aria-hidden="true">✓</div>
          )}
        </button>
      </div>

      <style jsx>{`
        .platform-switcher {
          width: 100%;
          margin: 0 auto;
        }

        .platform-switcher-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .platform-button {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .platform-button:hover:not(:disabled) {
          border-color: #2196f3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
        }

        .platform-button.active {
          border-color: #2196f3;
          background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }

        .platform-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .platform-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border-radius: 8px;
          color: #666;
        }

        .platform-button.active .platform-icon {
          background: #2196f3;
          color: white;
        }

        .platform-icon svg {
          width: 24px;
          height: 24px;
        }

        .platform-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }

        .platform-name {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
        }

        .platform-count {
          font-size: 0.875rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .platform-button.active .platform-name {
          color: #2196f3;
        }

        .platform-button.active .platform-count {
          color: #1976d2;
        }

        .active-indicator {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #4caf50;
          color: white;
          border-radius: 50%;
          font-size: 0.875rem;
          font-weight: bold;
        }

        .platform-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.5rem;
        }

        .platform-divider span {
          font-size: 0.875rem;
          color: #999;
          font-weight: 500;
          text-transform: uppercase;
          padding: 0.25rem 0.5rem;
          background: white;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .platform-switcher-container {
            flex-direction: column;
          }

          .platform-divider {
            transform: rotate(90deg);
          }

          .platform-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PlatformSwitcher;
