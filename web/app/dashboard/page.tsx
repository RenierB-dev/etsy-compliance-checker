'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertCircle, TrendingUp, Play, RefreshCw } from 'lucide-react';
import { getSeverityBadge, getSeverityColor, formatDateTime } from '@/lib/utils';

interface ScanResultData {
  shop_id: string;
  scan_date: string;
  total_listings: number;
  scanned_listings: number;
  violations: any[];
  summary: {
    critical: number;
    warnings: number;
    info: number;
  };
  compliance_score: number;
}

export default function DashboardPage() {
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [shopId, setShopId] = useState('');
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!apiKey || !shopId) {
      setError('Please enter both API key and Shop ID');
      return;
    }

    setIsScanning(true);
    setError('');

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          shopId,
          limit: 100,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setScanResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to scan shop');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold">Etsy Compliance Checker</span>
          </Link>
          <nav className="flex gap-4">
            <Link href="/pricing">
              <Button variant="ghost">Upgrade</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!scanResult ? (
          /* Scan Form */
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Start Shop Scan</CardTitle>
                <CardDescription>
                  Enter your Etsy API credentials to scan your shop for violations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Etsy API Key</label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    placeholder="Enter your Etsy API key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shop ID</label>
                  <input
                    type="text"
                    value={shopId}
                    onChange={(e) => setShopId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    placeholder="Enter your shop ID"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="font-semibold text-blue-900 mb-2">Need API credentials?</p>
                  <p className="text-blue-800">
                    Get your Etsy API key from the{' '}
                    <a
                      href="https://www.etsy.com/developers/your-apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Etsy Developer Portal
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Scan Results */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Shop Compliance Report</h1>
                <p className="text-gray-600">Scanned {formatDateTime(scanResult.scan_date)}</p>
              </div>
              <Button onClick={() => setScanResult(null)} variant="outline">
                New Scan
              </Button>
            </div>

            {/* Compliance Score */}
            <Card className="bg-gradient-to-r from-orange-600 to-orange-400 text-white">
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{scanResult.compliance_score}%</div>
                  <div className="text-xl opacity-90">Compliance Score</div>
                  <p className="mt-4 opacity-80">
                    {scanResult.compliance_score >= 90
                      ? 'Excellent! Your shop is highly compliant.'
                      : scanResult.compliance_score >= 70
                      ? 'Good, but some improvements needed.'
                      : 'Action required - multiple violations detected.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Listings</CardDescription>
                  <CardTitle className="text-3xl">{scanResult.scanned_listings}</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Critical Issues</CardDescription>
                  <CardTitle className="text-3xl text-red-600">
                    {scanResult.summary.critical}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Warnings</CardDescription>
                  <CardTitle className="text-3xl text-yellow-600">
                    {scanResult.summary.warnings}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Info</CardDescription>
                  <CardTitle className="text-3xl text-blue-600">
                    {scanResult.summary.info}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Violations List */}
            {scanResult.violations.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detected Violations</CardTitle>
                  <CardDescription>
                    Click on any violation to see fix suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scanResult.violations.slice(0, 20).map((violation: any, index: number) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getSeverityBadge(violation.severity)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(
                                  violation.severity
                                )}`}
                              >
                                {violation.severity.toUpperCase()}
                              </span>
                              <span className="text-sm font-semibold text-gray-700">
                                {violation.category}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{violation.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span>Listing: {violation.listing_title}</span>
                              {violation.matched_keyword && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  Keyword: {violation.matched_keyword}
                                </span>
                              )}
                            </div>
                            <Link
                              href={violation.listing_url}
                              target="_blank"
                              className="text-xs text-orange-600 hover:underline mt-2 inline-block"
                            >
                              View Listing →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {scanResult.violations.length > 20 && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                      Showing 20 of {scanResult.violations.length} violations.
                      Upgrade to Pro to see all violations and get auto-fix suggestions.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold text-green-900 mb-2">
                    No Violations Found!
                  </h2>
                  <p className="text-green-800">
                    Your shop is fully compliant with Etsy policies.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Upgrade CTA */}
            {scanResult.violations.length > 0 && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Want to fix these automatically?</h3>
                      <p className="text-gray-700">
                        Upgrade to Pro for one-click fixes, daily monitoring, and email alerts
                      </p>
                    </div>
                    <Link href="/pricing">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
