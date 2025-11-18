import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/stripe';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold">Etsy Compliance Checker</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Select the plan that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>{PRICING_PLANS.free.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-gray-900">${PRICING_PLANS.free.price}</span>
                <span className="text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {PRICING_PLANS.free.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
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
              <CardTitle>{PRICING_PLANS.pro.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-gray-900">${PRICING_PLANS.pro.price}</span>
                <span className="text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {PRICING_PLANS.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="priceId" value={PRICING_PLANS.pro.priceId || ''} />
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  Upgrade to Pro
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <CardTitle>{PRICING_PLANS.enterprise.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-gray-900">${PRICING_PLANS.enterprise.price}</span>
                <span className="text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {PRICING_PLANS.enterprise.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="priceId" value={PRICING_PLANS.enterprise.priceId || ''} />
                <Button type="submit" className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is the CLI tool still free?</h3>
              <p className="text-gray-600">
                Yes! The CLI tool remains completely free and open-source. The web app adds premium features like automated monitoring and one-click fixes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards through Stripe's secure payment processing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How accurate is the violation detection?</h3>
              <p className="text-gray-600">
                Our detection engine has a 99.8% accuracy rate and is constantly updated with the latest Etsy policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
