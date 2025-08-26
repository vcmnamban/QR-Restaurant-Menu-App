import React, { useState } from 'react';
import { 
  Eye, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  DollarSign,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  Truck
} from 'lucide-react';
import { Order, OrderItem } from '@/types';
import { cn, formatCurrency, formatDate, formatTime } from '@/utils';
import OrderService from '@/services/order';

interface OrderListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: string, notes?: string) => Promise<void>;
  onCancelOrder: (orderId: string, reason: string) => Promise<void>;
  isLoading?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewOrder,
  onUpdateStatus,
  onCancelOrder,
  isLoading = false
}) => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    const matchesDate = dateFilter === '' || 
      formatDate(order.createdAt).includes(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      'pending': AlertCircle,
      'accepted': PlayCircle,
      'preparing': Clock,
      'ready': CheckCircle,
      'delivered': Truck,
      'cancelled': XCircle
    };
    return icons[status] || AlertCircle;
  };

  const getStatusColor = (status: string) => {
    return OrderService.getStatusColor(status);
  };

  const getStatusText = (status: string) => {
    return OrderService.getStatusText(status);
  };

  const getOrderTotal = (items: OrderItem[]) => {
    return OrderService.calculateOrderTotal(items);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await onUpdateStatus(orderId, newStatus);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      try {
        await onCancelOrder(orderId, reason);
        setSelectedOrder(null);
      } catch (error) {
        console.error('Failed to cancel order:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-body">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
        <p className="mt-1 text-sm text-gray-500">
          Orders will appear here when customers place them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Orders ({filteredOrders.length})
          </h2>
          <p className="text-sm text-gray-500">
            Manage and track customer orders
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input w-full"
            />
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setDateFilter('');
              }}
              className="btn-outline w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          
          return (
            <div key={order._id} className="card hover:shadow-medium transition-shadow">
              <div className="card-body">
                <div className="flex items-start space-x-4">
                  {/* Order Status Icon */}
                  <div className="flex-shrink-0">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      getStatusColor(order.status)
                    )}>
                      <StatusIcon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            Order #{order.orderNumber}
                          </h3>
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getStatusColor(order.status)
                          )}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatTime(order.createdAt)}</span>
                          </div>
                          {order.estimatedDeliveryTime && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>ETA: {OrderService.getEstimatedDeliveryTime(order)}</span>
                            </div>
                          )}
                        </div>

                        {/* Customer Info */}
                        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{order.customerName || 'Unknown Customer'}</span>
                          </div>
                          {order.customerPhone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              <span>{order.customerPhone}</span>
                            </div>
                          )}
                          {order.deliveryAddress && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="truncate max-w-32">
                                {order.deliveryAddress.street}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Order Items */}
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                          <div className="space-y-1">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex justify-between text-sm text-gray-600">
                                <span>
                                  {item.quantity}x {item.menuItemName || 'Unknown Item'}
                                </span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="text-sm text-gray-500">
                                +{order.items.length - 3} more items
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Total */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total:</span>
                            <span className="text-lg font-semibold text-gray-900">
                              {formatCurrency(getOrderTotal(order.items))}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onViewOrder(order)}
                            className="btn-outline text-sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          
                          <button
                            onClick={() => setSelectedOrder(
                              selectedOrder === order._id ? null : order._id
                            )}
                            className="btn-outline text-sm"
                          >
                            Actions
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Actions */}
                    {selectedOrder === order._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(order._id, 'accepted')}
                                className="btn-outline text-sm"
                              >
                                Accept Order
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="btn-outline text-sm text-red-600 hover:text-red-800"
                              >
                                Cancel Order
                              </button>
                            </>
                          )}
                          
                          {order.status === 'accepted' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'preparing')}
                              className="btn-outline text-sm"
                            >
                              Start Preparing
                            </button>
                          )}
                          
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'ready')}
                              className="btn-outline text-sm"
                            >
                              Mark Ready
                            </button>
                          )}
                          
                          {order.status === 'ready' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'delivered')}
                              className="btn-outline text-sm"
                            >
                              Mark Delivered
                            </button>
                          )}
                          
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                const notes = prompt('Add notes (optional):');
                                if (notes !== null) {
                                  handleStatusUpdate(order._id, order.status, notes);
                                }
                              }}
                              className="btn-outline text-sm"
                            >
                              Add Notes
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;
