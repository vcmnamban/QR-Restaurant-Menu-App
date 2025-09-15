import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Eye, DollarSign } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock analytics data
  const stats = [
    {
      name: 'Total Views',
      value: '12,345',
      change: '+12.5%',
      changeType: 'positive',
      icon: Eye,
    },
    {
      name: 'Active Users',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Revenue',
      value: 'SAR 45,678',
      change: '+15.3%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      change: '-0.5%',
      changeType: 'negative',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-outline p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your restaurant's performance and insights
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'bg-success-100 text-success-800'
                        : 'bg-error-100 text-error-800'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
          </div>
          <div className="card-body">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart will be implemented here</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">User Activity</h3>
          </div>
          <div className="card-body">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart will be implemented here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Items */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Menu Items</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Grilled Chicken</p>
                  <p className="text-xs text-gray-500">Al Baik Restaurant</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">245 orders</p>
                <p className="text-xs text-gray-500">SAR 2,450</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Beef Shawarma</p>
                  <p className="text-xs text-gray-500">Shawarma House</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">198 orders</p>
                <p className="text-xs text-gray-500">SAR 1,980</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Fish & Chips</p>
                  <p className="text-xs text-gray-500">Seafood Corner</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">156 orders</p>
                <p className="text-xs text-gray-500">SAR 1,560</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

