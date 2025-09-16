// Mock Order Service for when backend is unavailable
// This provides a complete order management system using localStorage

export interface MockOrder {
  _id: string;
  orderNumber: string;
  restaurantId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'online';
  deliveryMethod: 'pickup' | 'delivery' | 'dine-in';
  tableNumber?: string;
  deliveryAddress?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

class MockOrderService {
  private storageKey = 'mock_orders';

  // Get all orders for a restaurant
  getOrders(restaurantId: string): MockOrder[] {
    try {
      const orders = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return orders.filter((order: MockOrder) => order.restaurantId === restaurantId);
    } catch (error) {
      console.error('Error loading mock orders:', error);
      return [];
    }
  }

  // Create a new order
  createOrder(orderData: Partial<MockOrder>): MockOrder {
    const order: MockOrder = {
      _id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
      restaurantId: orderData.restaurantId || '',
      customer: orderData.customer || { name: 'Unknown', phone: '' },
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      status: 'pending',
      paymentMethod: orderData.paymentMethod || 'cash',
      deliveryMethod: orderData.deliveryMethod || 'pickup',
      tableNumber: orderData.tableNumber,
      deliveryAddress: orderData.deliveryAddress,
      specialInstructions: orderData.specialInstructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData
    };

    // Save to localStorage
    this.saveOrder(order);
    
    return order;
  }

  // Save order to localStorage
  private saveOrder(newOrder: MockOrder): void {
    try {
      const existingOrders = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedOrders));
      
      // Trigger custom event for real-time updates
      window.dispatchEvent(new CustomEvent('mockOrderCreated', { detail: newOrder }));
    } catch (error) {
      console.error('Error saving mock order:', error);
    }
  }

  // Update order status
  updateOrderStatus(orderId: string, status: MockOrder['status']): boolean {
    try {
      const orders = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const orderIndex = orders.findIndex((order: MockOrder) => order._id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(orders));
        
        // Trigger custom event for real-time updates
        window.dispatchEvent(new CustomEvent('mockOrderUpdated', { detail: orders[orderIndex] }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating mock order:', error);
      return false;
    }
  }

  // Get order statistics
  getOrderStats(restaurantId: string) {
    const orders = this.getOrders(restaurantId);
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const preparingOrders = orders.filter(order => order.status === 'preparing').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      pendingOrders,
      preparingOrders,
      totalRevenue
    };
  }

  // Initialize with sample data if no orders exist
  initializeSampleData(restaurantId: string): void {
    const existingOrders = this.getOrders(restaurantId);
    
    if (existingOrders.length === 0) {
      const sampleOrders: MockOrder[] = [
        {
          _id: 'mock_sample_1',
          orderNumber: 'ORD-1234',
          restaurantId,
          customer: { name: 'Test Customer', phone: '+966501234567' },
          items: [{ name: 'Avocado Juice', quantity: 2, price: 12 }],
          totalAmount: 24,
          status: 'pending',
          paymentMethod: 'cash',
          deliveryMethod: 'dine-in',
          tableNumber: '5',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'mock_sample_2',
          orderNumber: 'ORD-1235',
          restaurantId,
          customer: { name: 'Another Customer', phone: '+966509876543' },
          items: [{ name: 'Orange Juice', quantity: 1, price: 10 }],
          totalAmount: 10,
          status: 'preparing',
          paymentMethod: 'card',
          deliveryMethod: 'delivery',
          deliveryAddress: '123 Main Street, Riyadh, Saudi Arabia',
          createdAt: new Date(Date.now() - 300000).toISOString(),
          updatedAt: new Date(Date.now() - 300000).toISOString()
        },
        {
          _id: 'mock_sample_3',
          orderNumber: 'ORD-284167',
          restaurantId,
          customer: { name: 'Vasu', phone: '+966501234568' },
          items: [{ name: 'Chicken Biryani', quantity: 1, price: 25 }, { name: 'Mutton Curry', quantity: 1, price: 30 }],
          totalAmount: 55,
          status: 'delivered',
          paymentMethod: 'cash',
          deliveryMethod: 'pickup',
          createdAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
          updatedAt: new Date(Date.now() - 120000).toISOString()
        },
        {
          _id: 'mock_sample_4',
          orderNumber: 'ORD-001',
          restaurantId,
          customer: { name: 'Ahmed Al-Rashid', phone: '+966509876544' },
          items: [{ name: 'Vegetable Samosa', quantity: 3, price: 8 }, { name: 'Tea', quantity: 2, price: 5 }],
          totalAmount: 34,
          status: 'ready',
          paymentMethod: 'card',
          deliveryMethod: 'dine-in',
          tableNumber: '3',
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          updatedAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      sampleOrders.forEach(order => this.saveOrder(order));
    }
  }
}

export const mockOrderService = new MockOrderService();
