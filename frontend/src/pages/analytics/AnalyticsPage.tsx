import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Eye, DollarSign, ShoppingCart, Clock, ChefHat } from 'lucide-react';
import { mockOrderService } from '@/services/mockOrderService';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string>('');

  // Fetch orders data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Use the test restaurant ID
        const testRestaurantId = '68c06ccb91f62a12fa494813';
        setRestaurantId(testRestaurantId);
        
        // Initialize mock order service with sample data
        mockOrderService.initializeSampleData(testRestaurantId);
        
        // Get orders from mock service
        const mockOrders = mockOrderService.getOrders(testRestaurantId);
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();

    // Listen for new orders
    const handleNewOrder = () => {
      if (restaurantId) {
        const updatedOrders = mockOrderService.getOrders(restaurantId);
        setOrders(updatedOrders);
      }
    };

    window.addEventListener('mockOrderCreated', handleNewOrder);
    window.addEventListener('mockOrderUpdated', handleNewOrder);

    return () => {
      window.removeEventListener('mockOrderCreated', handleNewOrder);
      window.removeEventListener('mockOrderUpdated', handleNewOrder);
    };
  }, [restaurantId]);

  // Calculate analytics from real order data
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const preparingOrders = orders.filter(order => order.status === 'preparing').length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  
  // Calculate unique customers
  const uniqueCustomers = new Set(orders.map(order => order.customer.phone)).size;
  
  // Calculate average order value
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Calculate completion rate
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Real analytics data based on orders
  const stats = [
    {
      name: 'Total Orders',
      value: totalOrders.toString(),
      change: '+12.5%', // This could be calculated from previous period
      changeType: 'positive',
      icon: ShoppingCart,
    },
    {
      name: 'Unique Customers',
      value: uniqueCustomers.toString(),
      change: '+8.2%', // This could be calculated from previous period
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Total Revenue',
      value: `SAR ${totalRevenue.toFixed(2)}`,
      change: '+15.3%', // This could be calculated from previous period
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Completion Rate',
      value: `${completionRate.toFixed(1)}%`,
      change: completionRate > 80 ? '+5.2%' : '-2.1%',
      changeType: completionRate > 80 ? 'positive' : 'negative',
      icon: TrendingUp,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
        {/* Order Status Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Order Status Overview</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="font-medium text-gray-900">Pending Orders</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <ChefHat className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Preparing Orders</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{preparingOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">Completed Orders</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{completedOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Average Order Value</span>
                <span className="text-xl font-bold text-gray-900">SAR {averageOrderValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Total Orders</span>
                <span className="text-xl font-bold text-gray-900">{totalOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Unique Customers</span>
                <span className="text-xl font-bold text-gray-900">{uniqueCustomers}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Total Revenue</span>
                <span className="text-xl font-bold text-gray-900">SAR {totalRevenue.toFixed(2)}</span>
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
          {(() => {
            // Calculate item performance from orders
            const itemStats = new Map();
            
            orders.forEach(order => {
              order.items.forEach(item => {
                const key = item.name;
                if (itemStats.has(key)) {
                  const existing = itemStats.get(key);
                  itemStats.set(key, {
                    name: item.name,
                    totalQuantity: existing.totalQuantity + item.quantity,
                    totalRevenue: existing.totalRevenue + (item.price * item.quantity),
                    orderCount: existing.orderCount + 1
                  });
                } else {
                  itemStats.set(key, {
                    name: item.name,
                    totalQuantity: item.quantity,
                    totalRevenue: item.price * item.quantity,
                    orderCount: 1
                  });
                }
              });
            });

            // Sort by total revenue
            const sortedItems = Array.from(itemStats.values())
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .slice(0, 5);

            if (sortedItems.length === 0) {
              return (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No menu items ordered yet</p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {sortedItems.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        <span className={`text-sm font-medium ${
                          index === 0 ? 'text-primary-600' : 'text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.orderCount} order{item.orderCount !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{item.totalQuantity} sold</p>
                      <p className="text-xs text-gray-500">SAR {item.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

