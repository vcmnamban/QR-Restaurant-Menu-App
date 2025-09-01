import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  Truck,
  Edit,
  MessageSquare,
  Printer,
  Share2
} from 'lucide-react';
import { Order, OrderItem } from '@/types';
import { cn, formatCurrency, formatDate, formatTime } from '@/utils';
import OrderService from '@/services/order';

interface OrderDetailsProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: string, notes?: string) => Promise<void>;
  onCancelOrder: (orderId: string, reason: string) => Promise<void>;
  onAddNote: (orderId: string, note: string) => Promise<void>;
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onUpdateStatus,
  onCancelOrder,
  onAddNote,
  onClose
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');

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

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(order._id, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      try {
        await onCancelOrder(order._id, reason);
      } catch (error) {
        console.error('Failed to cancel order:', error);
      }
    }
  };

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        await onAddNote(order._id, newNote.trim());
        setNewNote('');
      } catch (error) {
        console.error('Failed to add note:', error);
      }
    }
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h2>
              <p className="text-gray-600">
                {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.print()}
                className="btn-outline"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={onClose}
                className="btn-outline"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Order Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Section */}
              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center',
                      getStatusColor(order.status)
                    )}>
                      <StatusIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {getStatusText(order.status)}
                      </h4>
                      <p className="text-gray-600">
                        {order.status === 'delivered' 
                          ? 'Order completed successfully'
                          : order.status === 'cancelled'
                          ? 'Order was cancelled'
                          : 'Order is being processed'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Status Timeline</h5>
                    <div className="space-y-3">
                      {order.statusHistory?.map((status, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={cn(
                            'w-3 h-3 rounded-full',
                            getStatusColor(status.status)
                          )}></div>
                          <span className="text-sm text-gray-600">
                            {OrderService.getStatusText(status.status)}
                          </span>
                          <span className="text-sm text-gray-400">
                            {formatTime(status.timestamp)}
                          </span>
                          {status.note && (
                            <span className="text-sm text-gray-500">
                              - {status.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.menuItemName || 'Unknown Item'}
                            </h4>
                            {item.notes && (
                              <p className="text-sm text-gray-600">
                                Notes: {item.notes}
                              </p>
                            )}
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {item.customizations.map((custom, idx) => (
                                  <span key={idx} className="inline-block bg-gray-200 rounded px-2 py-1 mr-1 mb-1">
                                    {custom.name}: {custom.value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {formatCurrency((item.price || 0) * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(item.price || 0)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-2xl text-primary-600">
                        {formatCurrency(getOrderTotal(order.items))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customerName || 'Unknown Customer'}
                        </p>
                        <p className="text-sm text-gray-500">Customer Name</p>
                      </div>
                    </div>
                    
                    {order.customerPhone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{order.customerPhone}</p>
                          <p className="text-sm text-gray-500">Phone Number</p>
                        </div>
                      </div>
                    )}

                    {order.deliveryAddress && (
                      <div className="flex items-start space-x-3 md:col-span-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Delivery Address</p>
                          <p className="text-sm text-gray-600">
                            {order.deliveryAddress.street}<br />
                            {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Notes</h3>
                  
                  {/* Add Note */}
                  <div className="mb-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="input flex-1"
                      />
                      <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className="btn-primary"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Existing Notes */}
                  {order.notes && order.notes.length > 0 ? (
                    <div className="space-y-3">
                      {order.notes.map((note, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No notes added yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate('accepted')}
                          disabled={isUpdating}
                          className="btn-primary w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Order
                        </button>
                        <button
                          onClick={handleCancelOrder}
                          disabled={isUpdating}
                          className="btn-outline w-full text-red-600 hover:text-red-800"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Order
                        </button>
                      </>
                    )}
                    
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate('preparing')}
                        disabled={isUpdating}
                        className="btn-primary w-full"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Start Preparing
                      </button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate('ready')}
                        disabled={isUpdating}
                        className="btn-primary w-full"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Ready
                      </button>
                    )}
                    
                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate('delivered')}
                        disabled={isUpdating}
                        className="btn-primary w-full"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number</span>
                      <span className="font-medium">#{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date</span>
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Time</span>
                      <span className="font-medium">{formatTime(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items</span>
                      <span className="font-medium">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-semibold text-lg text-primary-600">
                        {formatCurrency(getOrderTotal(order.items))}
                      </span>
                    </div>
                    {order.estimatedDeliveryTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Delivery</span>
                        <span className="font-medium">
                          {OrderService.getEstimatedDeliveryTime(order)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {order.paymentMethod && (
                <div className="card">
                  <div className="card-body">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method</span>
                        <span className="font-medium">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={cn(
                          'font-medium',
                          order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                        )}>
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
