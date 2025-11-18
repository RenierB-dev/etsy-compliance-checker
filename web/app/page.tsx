import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap, TrendingUp, Bell, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold">Etsy Compliance Checker</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/connect">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
          Protect Your Etsy Shop from Policy Violations
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Automatically scan your listings for compliance issues before Etsy does.
          Get instant alerts and fix suggestions to keep your shop safe.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/connect">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Connect Your Shop
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-orange-600">10,000+</div>
            <div className="text-gray-600">Shops Protected</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-orange-600">50,000+</div>
            <div className="text-gray-600">Violations Caught</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl font-bold text-orange-600">99.8%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Stay Compliant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Instant Scanning</CardTitle>
              <CardDescription>
                Scan all your listings in seconds with our powerful detection engine
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Daily Monitoring</CardTitle>
              <CardDescription>
                Automatic daily scans with email alerts for new violations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle2 className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>One-Click Fixes</CardTitle>
              <CardDescription>
                Smart suggestions to fix violations automatically via Etsy API
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Compliance Score</CardTitle>
              <CardDescription>
                Track your shop's health with visual dashboards and analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <ShieldCheck className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Multi-Layer Detection</CardTitle>
              <CardDescription>
                Check for prohibited keywords, trademarks, medical claims, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Always up-to-date with the latest Etsy policies and rules
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>5 manual scans/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Basic violation detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>PDF reports</span>
                </li>
              </ul>
              <Link href="/connect">
                <Button className="w-full" variant="outline">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-orange-600 border-2 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Unlimited scans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Daily automatic scans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Auto-fix suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Email alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/connect?plan=pro">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Upgrade to Pro</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Multiple shops</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Custom rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Link href="/connect?plan=enterprise">
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Protect Your Shop?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Etsy sellers who trust us to keep their shops compliant
          </p>
          <Link href="/connect">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              Connect Your Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 Etsy Compliance Checker. Built with the CLI tool you already trust.</p>
        </div>
      </footer>
    </div>
  );
}
