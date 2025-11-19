'use client';

import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// Sample data - fetch from Supabase in production
const shops = [
  {
    id: '1',
    shopName: 'Vintage Treasures',
    owner: 'sarah@example.com',
    complianceScore: 92,
    lastScan: '2024-06-10',
    violationsCount: 2,
    criticalCount: 0,
    status: 'healthy',
  },
  {
    id: '2',
    shopName: 'Handmade Jewelry Co',
    owner: 'mike@example.com',
    complianceScore: 78,
    lastScan: '2024-06-09',
    violationsCount: 8,
    criticalCount: 2,
    status: 'warning',
  },
  {
    id: '3',
    shopName: 'Craft Corner',
    owner: 'emma@example.com',
    complianceScore: 98,
    lastScan: '2024-06-10',
    violationsCount: 1,
    criticalCount: 0,
    status: 'healthy',
  },
  {
    id: '4',
    shopName: 'Retro Designs',
    owner: 'john@example.com',
    complianceScore: 65,
    lastScan: '2024-06-08',
    violationsCount: 15,
    criticalCount: 5,
    status: 'critical',
  },
  {
    id: '5',
    shopName: 'Modern Home Decor',
    owner: 'lisa@example.com',
    complianceScore: 88,
    lastScan: '2024-06-10',
    violationsCount: 4,
    criticalCount: 1,
    status: 'warning',
  },
];

export default function ShopsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shop.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shop Management</h1>
          <p className="text-gray-600 mt-1">Monitor all connected Etsy shops</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by shop name or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filterStatus === 'all'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('healthy')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filterStatus === 'healthy'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Healthy
              </button>
              <button
                onClick={() => setFilterStatus('warning')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filterStatus === 'warning'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Warning
              </button>
              <button
                onClick={() => setFilterStatus('critical')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filterStatus === 'critical'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Critical
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Shops</p>
            <p className="text-2xl font-bold text-gray-900">{shops.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Healthy</p>
            <p className="text-2xl font-bold text-green-600">
              {shops.filter((s) => s.status === 'healthy').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Warning</p>
            <p className="text-2xl font-bold text-orange-600">
              {shops.filter((s) => s.status === 'warning').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Critical</p>
            <p className="text-2xl font-bold text-red-600">
              {shops.filter((s) => s.status === 'critical').length}
            </p>
          </div>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Status Bar */}
              <div
                className={`h-2 ${
                  shop.status === 'healthy'
                    ? 'bg-green-500'
                    : shop.status === 'warning'
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
              />

              <div className="p-6">
                {/* Shop Name */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{shop.shopName}</h3>
                    <p className="text-sm text-gray-500">{shop.owner}</p>
                  </div>
                  {shop.status === 'healthy' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : shop.status === 'warning' ? (
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>

                {/* Compliance Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Compliance Score
                    </span>
                    <span
                      className={`text-2xl font-bold ${
                        shop.complianceScore >= 90
                          ? 'text-green-600'
                          : shop.complianceScore >= 70
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}
                    >
                      {shop.complianceScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        shop.complianceScore >= 90
                          ? 'bg-green-500'
                          : shop.complianceScore >= 70
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${shop.complianceScore}%` }}
                    />
                  </div>
                </div>

                {/* Violations */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Total Violations</p>
                    <p className="text-xl font-bold text-gray-900">
                      {shop.violationsCount}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-600 mb-1">Critical</p>
                    <p className="text-xl font-bold text-red-600">{shop.criticalCount}</p>
                  </div>
                </div>

                {/* Last Scan */}
                <div className="text-sm text-gray-500">
                  Last scanned: {new Date(shop.lastScan).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                    Scan Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
