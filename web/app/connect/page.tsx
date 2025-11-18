'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function ConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Redirect to Etsy OAuth
    window.location.href = '/api/auth/etsy';
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
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Connect Your Etsy Shop</CardTitle>
              <CardDescription>
                Securely connect your shop to start scanning for violations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What we'll access:</h3>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>✓ Read your shop listings</li>
                  <li>✓ Read shop information</li>
                  <li>✓ Update listings (for auto-fix feature)</li>
                </ul>
              </div>

              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                {isConnecting ? 'Connecting...' : 'Connect with Etsy'}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Or use with API Key</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Already have an Etsy API key? You can use the CLI tool or enter it manually.
                </p>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Enter API Key Manually
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
