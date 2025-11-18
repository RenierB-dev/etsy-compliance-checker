'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface ViolationFixCardProps {
  violation: any;
  onFixed?: () => void;
}

export function ViolationFixCard({ violation, onFixed }: ViolationFixCardProps) {
  const [isFixing, setIsFixing] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [error, setError] = useState('');

  const handleFix = async () => {
    setIsFixing(true);
    setError('');

    try {
      // Get fix suggestions
      const fixSuggestion = getFixSuggestion(violation);

      if (!fixSuggestion) {
        setError('No automatic fix available for this violation');
        return;
      }

      // Call fix API
      const response = await fetch('/api/fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: violation.listing_id,
          field: violation.field,
          fixType: fixSuggestion.type,
          newValue: fixSuggestion.value,
          // Note: Access token would come from user session in production
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply fix');
      }

      setIsFixed(true);
      if (onFixed) {
        onFixed();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to apply fix');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">Suggested Fix</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              {getFixSuggestions(violation).map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
            {error && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <div>
            {isFixed ? (
              <Button disabled className="bg-green-600">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Fixed
              </Button>
            ) : (
              <Button
                onClick={handleFix}
                disabled={isFixing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isFixing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Fixing...
                  </>
                ) : (
                  'Apply Fix'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getFixSuggestions(violation: any): string[] {
  const suggestions: string[] = [];

  if (violation.matched_keyword) {
    suggestions.push(`Remove the keyword "${violation.matched_keyword}" from your listing`);
  }

  if (violation.field === 'title') {
    suggestions.push('Edit your listing title to fix this issue');
  } else if (violation.field === 'description') {
    suggestions.push('Update your listing description');
  } else if (violation.field === 'materials') {
    suggestions.push('Add materials information to your listing');
  } else if (violation.field === 'tags') {
    suggestions.push('Add more tags to improve discoverability');
  }

  if (violation.severity === 'critical') {
    suggestions.push('⚠️ This is a critical issue - fix immediately to avoid shop suspension');
  }

  return suggestions;
}

function getFixSuggestion(violation: any): { type: string; value: string } | null {
  // This is a simplified version - in production, you'd have more sophisticated logic
  if (violation.matched_keyword && violation.field === 'title') {
    return {
      type: 'remove_keyword',
      value: violation.listing_title.replace(new RegExp(violation.matched_keyword, 'gi'), '').trim(),
    };
  }

  if (violation.field === 'materials') {
    return {
      type: 'add_materials',
      value: 'Cotton, Polyester', // Example default
    };
  }

  return null;
}
