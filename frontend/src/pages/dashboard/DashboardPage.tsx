import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/store/auth';
import { 
  Building2, 
  Menu, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { cn } from '@/utils';

const DashboardPage: React.FC = () => {
  const user = useUser();
  const navigate = useNavigate();

  // Mock data - replace with real data from API
  const stats = [
    {
      name: 'Total Restaurants',
      value: '12',
      change: '+2.5%',
      changeType: 'positive',
      icon: Building2,
    },
    {
      name: 'Active Menus',
      value: '48',
      change: '+12.3%',
      changeType: 'positive',
      icon: Menu,
    },
    {
      name: 'Total Users',
      value: '1,234',
      change: '+8.1%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Revenue',
      value: 'SAR 45,678',
      change: '+15.2%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'restaurant_created',
      message: 'New restaurant "Al Baik" was created',
      time: '2 hours ago',
      user: 'Ahmed Al-Rashid',
    },
    {
      id: 2,
      type: 'menu_updated',
      message: 'Menu "Main Course" was updated',
      time: '4 hours ago',
      user: 'Sarah Johnson',
    },
    {
      id: 3,
      type: 'order_placed',
      message: 'New order #12345 was placed',
      time: '6 hours ago',
      user: 'Customer',
    },
    {
      id: 4,
      type: 'user_registered',
      message: 'New user registered: Omar Hassan',
      time: '1 day ago',
      user: 'System',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'restaurant_created':
        return <Building2 className="h-5 w-5 text-success-600" />;
      case 'menu_updated':
        return <Menu className="h-5 w-5 text-primary-600" />;
      case 'order_placed':
        return <Clock className="h-5 w-5 text-warning-600" />;
      case 'user_registered':
        return <Users className="h-5 w-5 text-info-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-restaurant':
        navigate('/restaurants/new');
        break;
      case 'create-menu':
        navigate('/menus/new');
        break;
      case 'manage-users':
        navigate('/users');
        break;
      case 'view-analytics':
        navigate('/analytics');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.firstName}! Here's what's happening with your restaurant business.
        </p>
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
                    className={cn(
                      'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium',
                      stat.changeType === 'positive'
                        ? 'bg-success-100 text-success-800'
                        : 'bg-error-100 text-error-800'
                    )}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
          </div>
          <div className="card-body">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                            {getActivityIcon(activity.type)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              by {activity.user}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time>{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button 
                onClick={() => handleQuickAction('add-restaurant')}
                className="btn-outline w-full justify-center hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Add Restaurant
              </button>
              <button 
                onClick={() => handleQuickAction('create-menu')}
                className="btn-outline w-full justify-center hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                <Menu className="mr-2 h-5 w-5" />
                Create Menu
              </button>
              <button 
                onClick={() => handleQuickAction('manage-users')}
                className="btn-outline w-full justify-center hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                <Users className="mr-2 h-5 w-5" />
                Manage Users
              </button>
              <button 
                onClick={() => handleQuickAction('view-analytics')}
                className="btn-outline w-full justify-center hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* System Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">API Status</span>
                <span className="badge-success">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Database</span>
                <span className="badge-success">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">File Storage</span>
                <span className="badge-success">Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Email Service</span>
                <span className="badge-success">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">+966 50 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">support@qrrestaurant.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Riyadh, Saudi Arabia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #12345</p>
                  <p className="text-xs text-gray-500">2 items • SAR 45.00</p>
                </div>
                <span className="badge-warning">Preparing</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #12344</p>
                  <p className="text-xs text-gray-500">1 item • SAR 25.00</p>
                </div>
                <span className="badge-success">Delivered</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #12343</p>
                  <p className="text-xs text-gray-500">3 items • SAR 67.50</p>
                </div>
                <span className="badge-primary">Out for Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
