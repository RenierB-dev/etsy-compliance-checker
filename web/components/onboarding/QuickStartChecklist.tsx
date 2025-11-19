'use client';

import { useState, useEffect } from 'react';
import { Check, Circle, ChevronDown, ChevronUp, Star } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

interface QuickStartChecklistProps {
  onItemComplete?: (itemId: string) => void;
  initialProgress?: {
    shopConnected: boolean;
    firstScanCompleted: boolean;
    violationFixed: boolean;
    alertsEnabled: boolean;
    upgradedToPro: boolean;
  };
}

export default function QuickStartChecklist({
  onItemComplete,
  initialProgress = {
    shopConnected: false,
    firstScanCompleted: false,
    violationFixed: false,
    alertsEnabled: false,
    upgradedToPro: false,
  },
}: QuickStartChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'connect-shop',
      title: 'Connect Etsy shop via OAuth',
      description: 'Link your shop securely to enable compliance scanning',
      completed: initialProgress.shopConnected,
    },
    {
      id: 'first-scan',
      title: 'Run your first scan',
      description: 'Analyze your listings for policy violations',
      completed: initialProgress.firstScanCompleted,
    },
    {
      id: 'fix-violation',
      title: 'Fix one violation',
      description: 'Make your first compliance improvement',
      completed: initialProgress.violationFixed,
    },
    {
      id: 'enable-alerts',
      title: 'Enable email alerts',
      description: 'Get notified when new violations are detected',
      completed: initialProgress.alertsEnabled,
    },
    {
      id: 'upgrade-pro',
      title: 'Upgrade to Pro (optional)',
      description: 'Unlock one-click auto-fix and advanced features',
      completed: initialProgress.upgradedToPro,
      optional: true,
    },
  ]);

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progress = (completedCount / totalCount) * 100;

  const toggleItem = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
    if (onItemComplete) {
      onItemComplete(itemId);
    }
  };

  // Auto-collapse when all items are complete
  useEffect(() => {
    if (completedCount === totalCount) {
      setTimeout(() => setIsExpanded(false), 2000);
    }
  }, [completedCount, totalCount]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Quick Start Guide</h3>
              <p className="text-brand-100 text-sm">
                {completedCount} of {totalCount} completed
              </p>
            </div>
          </div>
          <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      {isExpanded && (
        <div className="p-6">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200 hover:border-brand-300 hover:bg-brand-50'
                }`}
                onClick={() => !item.completed && toggleItem(item.id)}
              >
                {/* Checkbox */}
                <div className="flex-shrink-0 mt-0.5">
                  {item.completed ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-semibold ${
                        item.completed ? 'text-green-900 line-through' : 'text-gray-900'
                      }`}
                    >
                      {item.title}
                    </h4>
                    {item.optional && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Star className="h-3 w-3" />
                        Optional
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      item.completed ? 'text-green-700' : 'text-gray-600'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Step number */}
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Completion message */}
          {completedCount === totalCount && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <h4 className="font-bold text-green-900">You're all set!</h4>
                  <p className="text-green-800 text-sm">
                    Your shop is protected. We'll monitor it daily and alert you of any issues.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
