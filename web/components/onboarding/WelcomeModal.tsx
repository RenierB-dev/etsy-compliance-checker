'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  userName?: string;
}

export default function WelcomeModal({
  isOpen,
  onClose,
  onStartTour,
  userName = 'there',
}: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-6 rounded-t-2xl text-white">
            <div className="text-5xl mb-4 text-center">🛡️</div>
            <h2 className="text-3xl font-bold text-center mb-2">
              Welcome to EtsyGuard Pro!
            </h2>
            <p className="text-brand-100 text-center text-lg">
              Your shop's compliance guardian
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <p className="text-gray-700 text-lg mb-6">
              Hi {userName}! 👋 We're excited to help you protect your Etsy shop from policy violations and potential suspensions.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Connect Your Shop</h3>
                  <p className="text-gray-600 text-sm">
                    Securely link your Etsy shop via OAuth in just a few clicks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Run Your First Scan</h3>
                  <p className="text-gray-600 text-sm">
                    Our AI will analyze your listings against 50+ Etsy policies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Fix & Monitor</h3>
                  <p className="text-gray-600 text-sm">
                    Review violations and enable daily monitoring for ongoing protection.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold text-brand-900 mb-1">Pro Tip</h4>
                  <p className="text-brand-800 text-sm">
                    Most Etsy suspensions happen because sellers don't catch violations early. Run your first scan today to stay safe!
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onStartTour();
                  onClose();
                }}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Take the Tour
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
