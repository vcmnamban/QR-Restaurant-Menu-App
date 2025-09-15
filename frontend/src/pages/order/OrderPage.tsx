import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Clock,
  Plus,
  BarChart3,
  Settings,
  Eye,
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react';

// Import components
import OrderList from '@/components/order/OrderList';
import OrderForm from '@/components/order/OrderForm';
import OrderDetails from '@/components/order/OrderDetails';

// Import services
import OrderService from '@/services/order';
import RestaurantService from '@/services/restaurant';

// Import types
import { Order, Restaurant } from '@/types';
import { cn } from '@/utils';

type ViewMode = 'list' | 'add' | 'edit' | 'view';
type ActiveTab = 'orders' | 'analytics' | 'settings';

const OrderPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<ActiveTab>('orders');

  // Data states
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Form states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchOrders();
    }
  }, [selectedRestaurant]);

  const fetchRestaurants = async () => {
    try {
      const data = await RestaurantService.getMyRestaurants();
      setRestaurants(data);
      if (data.length > 0) {
        setSelectedRestaurant(data[0]);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch restaurants');
    }
  };

  const fetchOrders = async () => {
    if (!selectedRestaurant) return;

    setIsLoading(true);
    try {
      const data = await OrderService.getOrders(selectedRestaurant._id);
      setOrders(data.orders);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Order handlers
  const handleAddOrder = () => {
    setSelectedOrder(null);
    setViewMode('add');
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode('edit');
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode('view');
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      await OrderService.deleteOrder(orderId);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete order');
    }
  };

  const handleSubmitOrder = async (data: Partial<Order>) => {
    if (!selectedRestaurant) return;

    setIsSubmitting(true);
    try {
      if (viewMode === 'add') {
        await OrderService.createOrder(selectedRestaurant._id, data);
        toast.success('Order created successfully');
      } else if (viewMode === 'edit' && selectedOrder) {
        await OrderService.updateOrder(selectedOrder._id, data);
        toast.success('Order updated successfully');
      }
      setViewMode('list');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string, notes?: string) => {
    try {
      await OrderService.updateOrderStatus(orderId, status, notes);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId: string, reason: string) => {
    try {
      await OrderService.cancelOrder(orderId, reason);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    }
  };

  const handleAddNote = async (orderId: string, note: string) => {
    try {
      await OrderService.addOrderNote(orderId, note);
      toast.success('Note added successfully');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add note');
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedOrder(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'add':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </button>
            </div>
            <OrderForm
              restaurantId={selectedRestaurant?._id || ''}
              onSubmit={handleSubmitOrder}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        );

      case 'edit':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </button>
            </div>
            <OrderForm
              order={selectedOrder || undefined}
              restaurantId={selectedRestaurant?._id || ''}
              onSubmit={handleSubmitOrder}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        );

      case 'view':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </button>
            </div>
            {selectedOrder && (
              <OrderDetails
                order={selectedOrder}
                onUpdateStatus={handleUpdateStatus}
                onCancelOrder={handleCancelOrder}
                onAddNote={handleAddNote}
                onClose={handleCancel}
              />
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'orders'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Package className="h-4 w-4" />
                  <span>Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'analytics'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'settings'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'orders' && (
              <OrderList
                orders={orders}
                onViewOrder={handleViewOrder}
                onUpdateStatus={handleUpdateStatus}
                onCancelOrder={handleCancelOrder}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Order Analytics</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Analytics and insights will be available here.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Order Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Order configuration and settings will be available here.
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  if (!selectedRestaurant) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Restaurant Selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please select a restaurant to manage its orders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          {viewMode === 'list'
            ? 'Manage and track customer orders'
            : viewMode === 'add'
            ? 'Create a new order'
            : viewMode === 'edit'
            ? 'Edit order details'
            : 'View order details'
          }
        </p>

        {/* Restaurant Selector */}
        <div className="mt-4">
          <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Restaurant
          </label>
          <select
            id="restaurant-select"
            value={selectedRestaurant._id}
            onChange={(e) => {
              const restaurant = restaurants.find(r => r._id === e.target.value);
              if (restaurant) {
                setSelectedRestaurant(restaurant);
                setViewMode('list');
                setActiveTab('orders');
              }
            }}
            className="input max-w-xs"
          >
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Order Button */}
        {viewMode === 'list' && activeTab === 'orders' && (
          <div className="mt-4">
            <button
              onClick={handleAddOrder}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default OrderPage;

