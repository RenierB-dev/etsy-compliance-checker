'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Store,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Shield,
} from 'lucide-react';

// Sample data - in production, fetch from Supabase
const stats = {
  totalShops: 248,
  proSubscribers: 87,
  mrr: 2523,
  totalViolations: 1342,
  avgComplianceScore: 84,
  shopsAtRisk: 12,
};

const shopGrowthData = [
  { month: 'Jan', shops: 45 },
  { month: 'Feb', shops: 78 },
  { month: 'Mar', shops: 112 },
  { month: 'Apr', shops: 156 },
  { month: 'May', shops: 198 },
  { month: 'Jun', shops: 248 },
];

const violationData = [
  { name: 'Prohibited Claims', value: 425, color: '#ef4444' },
  { name: 'Misleading Info', value: 312, color: '#f59e0b' },
  { name: 'Copyright Issues', value: 234, color: '#3b82f6' },
  { name: 'Trademark Violations', value: 198, color: '#8b5cf6' },
  { name: 'Other', value: 173, color: '#6b7280' },
];

const revenueData = [
  { month: 'Jan', mrr: 1305, conversions: 15 },
  { month: 'Feb', mrr: 1566, conversions: 24 },
  { month: 'Mar', mrr: 1827, conversions: 33 },
  { month: 'Apr', mrr: 2088, conversions: 42 },
  { month: 'May', mrr: 2320, conversions: 51 },
  { month: 'Jun', mrr: 2523, conversions: 58 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">EtsyGuard Pro Analytics & Insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Shops"
            value={stats.totalShops}
            icon={<Store className="h-6 w-6" />}
            color="blue"
            change="+12%"
            changeType="positive"
          />
          <StatCard
            title="Pro Subscribers"
            value={stats.proSubscribers}
            icon={<Users className="h-6 w-6" />}
            color="purple"
            change="+8%"
            changeType="positive"
          />
          <StatCard
            title="Monthly Recurring Revenue"
            value={`$${stats.mrr.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            color="green"
            change="+15%"
            changeType="positive"
          />
          <StatCard
            title="Violations Detected"
            value={stats.totalViolations.toLocaleString()}
            icon={<AlertTriangle className="h-6 w-6" />}
            color="orange"
            change="-5%"
            changeType="negative"
          />
          <StatCard
            title="Avg Compliance Score"
            value={`${stats.avgComplianceScore}/100`}
            icon={<Shield className="h-6 w-6" />}
            color="indigo"
            change="+3%"
            changeType="positive"
          />
          <StatCard
            title="Shops at Risk"
            value={stats.shopsAtRisk}
            icon={<AlertTriangle className="h-6 w-6" />}
            color="red"
            change="-2"
            changeType="positive"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Shop Growth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shop Growth Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={shopGrowthData}>
                <defs>
                  <linearGradient id="colorShops" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="shops"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorShops)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Violations by Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Violations by Type
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={violationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {violationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6">
          {/* Revenue & Conversion Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue & Pro Conversions
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="mrr"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="MRR ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversions"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Pro Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            <ActivityItem
              icon="🎉"
              title="New Pro Subscription"
              description="sarah_designs upgraded to Pro plan"
              time="5 minutes ago"
            />
            <ActivityItem
              icon="🚨"
              title="Critical Violation Detected"
              description="vintage_treasures - Prohibited claim in listing #12345"
              time="12 minutes ago"
            />
            <ActivityItem
              icon="✅"
              title="Scan Completed"
              description="handmade_jewelry - 98/100 compliance score"
              time="23 minutes ago"
            />
            <ActivityItem
              icon="👥"
              title="New Shop Connected"
              description="craft_corner linked their shop via OAuth"
              time="1 hour ago"
            />
            <ActivityItem
              icon="⚡"
              title="Auto-Fix Applied"
              description="etsy_seller_123 fixed 5 violations with one click"
              time="2 hours ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  change,
  changeType,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change: string;
  changeType: 'positive' | 'negative';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p
            className={`text-sm mt-2 ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {changeType === 'positive' ? '↑' : '↓'} {change} from last month
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-4">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <span className="text-sm text-gray-500">{time}</span>
      </div>
    </div>
  );
}
