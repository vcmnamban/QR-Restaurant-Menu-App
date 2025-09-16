import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/store/auth';
import { mockOrderService } from '@/services/mockOrderService';
import { 
  Building2, 
  Menu, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  MapPin,
  Phone,
  Mail,
  ShoppingCart,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/utils';
import { Order } from '@/types';
import OrderService from '@/services/order';
import RestaurantService from '@/services/restaurant';

const DashboardPage: React.FC = () => {
  const user = useUser();
  const navigate = useNavigate();
  
  // State for orders and restaurant
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Optimized event listener for mock orders
  const handleMockOrderCreated = useCallback(() => {
    // Get current restaurant ID from state or use fallback
    const currentRestaurantId = restaurantId || '68c06ccb91f62a12fa494813';
    const mockOrders = mockOrderService.getOrders(currentRestaurantId);
    setRecentOrders(mockOrders);
  }, [restaurantId]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always use mock orders for consistency with orders page
        const testRestaurantId = '68c06ccb91f62a12fa494813';
        mockOrderService.initializeSampleData(testRestaurantId);
        const mockOrders = mockOrderService.getOrders(testRestaurantId);
        setRecentOrders(mockOrders);
        setRestaurantId(testRestaurantId);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set empty state on error
        setRecentOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Listen for new mock orders
    window.addEventListener('mockOrderCreated', handleMockOrderCreated);
    window.addEventListener('mockOrderUpdated', handleMockOrderCreated);

    // Set up periodic refresh to ensure data consistency
    const refreshInterval = setInterval(() => {
      if (restaurantId) {
        const mockOrders = mockOrderService.getOrders(restaurantId);
        setRecentOrders(mockOrders);
      }
    }, 5000); // Refresh every 5 seconds

    return () => {
      window.removeEventListener('mockOrderCreated', handleMockOrderCreated);
      window.removeEventListener('mockOrderUpdated', handleMockOrderCreated);
      clearInterval(refreshInterval);
    };
  }, [handleMockOrderCreated]); // Include handleMockOrderCreated in dependencies

  // Manual refresh function - optimized to prevent unnecessary re-renders
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (restaurantId) {
        const mockOrders = mockOrderService.getOrders(restaurantId);
        setRecentOrders(mockOrders);
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [restaurantId, isRefreshing]);

  // Calculate stats from real data
  const totalOrders = recentOrders.length;
  const totalRevenue = recentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = recentOrders.filter(order => order.status === 'pending').length;
  const preparingOrders = recentOrders.filter(order => order.status === 'preparing').length;

  // Stats data - now using real data
  const stats = [
    {
      name: 'Total Orders',
      value: totalOrders.toString(),
      change: '+12.3%',
      changeType: 'positive',
      icon: ShoppingCart,
    },
    {
      name: 'Pending Orders',
      value: pendingOrders.toString(),
      change: preparingOrders > 0 ? 'In Progress' : 'All Clear',
      changeType: preparingOrders > 0 ? 'positive' : 'positive',
      icon: Clock,
    },
    {
      name: 'Preparing Orders',
      value: preparingOrders.toString(),
      change: preparingOrders > 0 ? 'Active' : 'None',
      changeType: preparingOrders > 0 ? 'positive' : 'positive',
      icon: Menu,
    },
    {
      name: 'Total Revenue',
      value: `SAR ${totalRevenue.toFixed(2)}`,
      change: '+15.2%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  // Helper function to format time ago
  const getTimeAgo = (date: Date | string): string => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Generate recent activities from orders
  const recentActivities = recentOrders.slice(0, 4).map((order, index) => ({
    id: order._id,
    type: 'order_placed',
    message: `New order ${order.orderNumber} was placed by ${order.customer?.name || 'Customer'}`,
    time: getTimeAgo(order.createdAt),
    user: order.customer?.name || 'Customer',
    order: order
  }));

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
        navigate('/restaurant');
        break;
      case 'create-menu':
        navigate('/menu');
        break;
      case 'view-orders':
        navigate('/orders');
        break;
      case 'view-analytics':
        navigate('/analytics');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Early return for loading state to prevent flickering
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.firstName}! Here's what's happening with your restaurant business.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            'flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
            isRefreshing && 'opacity-50 cursor-not-allowed'
          )}
        >
          <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
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
                Manage Restaurant
              </button>
              <button 
                onClick={() => handleQuickAction('create-menu')}
                className="btn-outline w-full justify-center hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                <Menu className="mr-2 h-5 w-5" />
                Manage Menu
              </button>
              <button 
                onClick={() => handleQuickAction('view-orders')}
                className="btn-outline w-full justify-center hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                View Orders
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No orders yet</p>
                <p className="text-xs text-gray-400">Orders from QR code scans will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.slice(0, 3).map((order) => (
                  <div key={order._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} • 
                        SAR {order.totalAmount?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customer?.name || 'Customer'} • {getTimeAgo(order.createdAt)}
                      </p>
                    </div>
                    <span className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      order.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                      order.status === 'preparing' && 'bg-orange-100 text-orange-800',
                      order.status === 'ready' && 'bg-green-100 text-green-800',
                      order.status === 'delivered' && 'bg-gray-100 text-gray-800',
                      order.status === 'cancelled' && 'bg-red-100 text-red-800'
                    )}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                    </span>
                  </div>
                ))}
                {recentOrders.length > 3 && (
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => navigate('/orders')}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      View all orders ({recentOrders.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
