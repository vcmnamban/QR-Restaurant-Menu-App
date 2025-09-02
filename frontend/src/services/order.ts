import http from './api';
import { Order, OrderItem, ApiResponse } from '@/types';

// Order service
export class OrderService {
  // Get all orders for a restaurant
  static async getOrders(restaurantId: string, params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await http.get<{
      orders: Order[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/restaurants/${restaurantId}/orders?${queryParams.toString()}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch orders');
  }

  // Get order by ID
  static async getOrder(orderId: string): Promise<Order> {
    const response = await http.get<Order>(`/orders/${orderId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch order');
  }

  // Create new order
  static async createOrder(restaurantId: string, orderData: Partial<Order>): Promise<Order> {
    const response = await http.post<Order>(`/restaurants/${restaurantId}/orders`, orderData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create order');
  }

  // Update order
  static async updateOrder(orderId: string, orderData: Partial<Order>): Promise<Order> {
    const response = await http.put<Order>(`/orders/${orderId}`, orderData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update order');
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<Order> {
    const response = await http.patch<Order>(`/orders/${orderId}/status`, { status, notes });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update order status');
  }

  // Cancel order
  static async cancelOrder(orderId: string, reason: string): Promise<Order> {
    const response = await http.patch<Order>(`/orders/${orderId}/cancel`, { reason });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to cancel order');
  }

  // Accept order
  static async acceptOrder(orderId: string, estimatedTime: number): Promise<Order> {
    const response = await http.patch<Order>(`/orders/${orderId}/accept`, { estimatedTime });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to accept order');
  }

  // Mark order as ready
  static async markOrderReady(orderId: string): Promise<Order> {
    const response = await http.patch<Order>(`/orders/${orderId}/ready`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to mark order as ready');
  }

  // Mark order as delivered
  static async markOrderDelivered(orderId: string): Promise<Order> {
    const response = await http.patch<Order>(`/orders/${orderId}/delivered`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to mark order as delivered');
  }

  // Get order analytics
  static async getOrderAnalytics(restaurantId: string, period: 'day' | 'week' | 'month' = 'month'): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Array<{ status: string; count: number }>;
    revenueByDay: Array<{ date: string; revenue: number }>;
    topItems: Array<{ name: string; quantity: number; revenue: number }>;
  }> {
    const response = await http.get(`/restaurants/${restaurantId}/order-analytics`, {
      params: { period }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch order analytics');
  }

  // Get order statistics
  static async getOrderStats(restaurantId: string): Promise<{
    pending: number;
    accepted: number;
    preparing: number;
    ready: number;
    delivered: number;
    cancelled: number;
    totalToday: number;
    revenueToday: number;
  }> {
    const response = await http.get(`/restaurants/${restaurantId}/order-stats`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch order statistics');
  }

  // Search orders
  static async searchOrders(restaurantId: string, query: string): Promise<Order[]> {
    const response = await http.get<Order[]>(`/restaurants/${restaurantId}/orders/search`, {
      params: { q: query }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to search orders');
  }

  // Get orders by customer
  static async getOrdersByCustomer(restaurantId: string, customerId: string): Promise<Order[]> {
    const response = await http.get<Order[]>(`/restaurants/${restaurantId}/customers/${customerId}/orders`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch customer orders');
  }

  // Add note to order
  static async addOrderNote(orderId: string, note: string): Promise<Order> {
    const response = await http.post<Order>(`/orders/${orderId}/notes`, { note });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to add note to order');
  }

  // Validate order data
  static validateOrderData(data: Partial<Order>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.customer || (typeof data.customer === 'string' && data.customer.trim().length === 0)) {
      errors.push('Customer is required');
    }

    if (!data.items || data.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    if (data.items) {
      data.items.forEach((item, index) => {
        if (!item.menuItemId) {
          errors.push(`Item ${index + 1}: Menu item is required`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Valid quantity is required`);
        }
      });
    }

    if (data.deliveryAddress && !data.deliveryAddress.street) {
      errors.push('Delivery address street is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format order data for API submission
  static formatOrderData(data: Partial<Order>): Partial<Order> {
    const formatted = { ...data };

    // Ensure items have required fields
    if (formatted.items) {
      formatted.items = formatted.items.map(item => ({
        ...item,
        quantity: parseInt(item.quantity.toString()) || 1,
        price: parseFloat((item.price || 0).toString()) || 0
      }));
    }

    // Ensure total is calculated
    if (formatted.items) {
      formatted.totalAmount = formatted.items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
    }

    return formatted;
  }

  // Get order status color
  static getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'accepted': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'ready': 'bg-green-100 text-green-800',
      'delivered': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  // Get order status text
  static getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'pending': 'Pending',
      'accepted': 'Accepted',
      'preparing': 'Preparing',
      'ready': 'Ready',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusTexts[status] || 'Unknown';
  }

  // Calculate order total
  static calculateOrderTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
  }

  // Get estimated delivery time
  static getEstimatedDeliveryTime(order: Order): string {
    if (order.status === 'delivered') {
      return 'Delivered';
    }
    
    if (order.estimatedDeliveryTime) {
      const date = new Date(order.estimatedDeliveryTime);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    return 'Not set';
  }

  // Delete order
  static async deleteOrder(orderId: string): Promise<void> {
    try {
      await http.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
}

// Export default instance
export default OrderService;
