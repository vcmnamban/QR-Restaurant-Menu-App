import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// In-memory storage for orders (in production, use a database)
const ordersStorage = new Map<string, any[]>();

// Initialize sample orders on server start
const initializeSampleOrders = () => {
  console.log('🔧 Initializing sample orders...');
  
  const sampleOrders = [
    {
      _id: 'order_001',
      restaurantId: '68c06ccb91f62a12fa494813',
      orderNumber: 'ORD-001',
      customer: {
        name: 'Ahmed Al-Rashid',
        phone: '+966501234567',
        email: 'ahmed@example.com'
      },
      items: [
        {
          menuItemId: 'item_001',
          name: 'Chicken Biryani',
          quantity: 2,
          price: 25.00,
          totalPrice: 50.00,
          notes: 'Extra spicy'
        },
        {
          menuItemId: 'item_002',
          name: 'Fresh Salad',
          quantity: 1,
          price: 12.00,
          totalPrice: 12.00
        }
      ],
      totalAmount: 62.00,
      status: 'preparing',
      paymentMethod: 'cash',
      deliveryMethod: 'dine_in',
      tableNumber: 'TB01',
      specialInstructions: 'Please make it extra spicy',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      _id: 'order_002',
      restaurantId: '68c06ccb91f62a12fa494813',
      orderNumber: 'ORD-002',
      customer: {
        name: 'Sarah Johnson',
        phone: '+966501234568',
        email: 'sarah@example.com'
      },
      items: [
        {
          menuItemId: 'item_003',
          name: 'Orange Juice',
          quantity: 1,
          price: 8.00,
          totalPrice: 8.00
        }
      ],
      totalAmount: 8.00,
      status: 'ready',
      paymentMethod: 'credit_card',
      deliveryMethod: 'pickup',
      specialInstructions: '',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      updatedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      _id: 'order_003',
      restaurantId: '68c06ccb91f62a12fa494813',
      orderNumber: 'ORD-003',
      customer: {
        name: 'Omar Hassan',
        phone: '+966501234569',
        email: 'omar@example.com'
      },
      items: [
        {
          menuItemId: 'item_001',
          name: 'Chicken Biryani',
          quantity: 1,
          price: 25.00,
          totalPrice: 25.00
        },
        {
          menuItemId: 'item_004',
          name: 'Ice Cream',
          quantity: 2,
          price: 15.00,
          totalPrice: 30.00
        }
      ],
      totalAmount: 55.00,
      status: 'delivered',
      paymentMethod: 'cash',
      deliveryMethod: 'delivery',
      deliveryAddress: {
        street: 'King Fahd Road',
        city: 'Riyadh',
        state: 'Riyadh Province',
        zipCode: '12345'
      },
      specialInstructions: 'Ring the doorbell twice',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    }
  ];

  ordersStorage.set('68c06ccb91f62a12fa494813', sampleOrders);
  console.log('✅ Sample orders initialized');
};

// Initialize sample data
initializeSampleOrders();

// @route   GET /api/orders/test
// @desc    Test endpoint to verify orders API is working
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Orders API is working',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/restaurants/:restaurantId/orders',
      'POST /api/restaurants/:restaurantId/orders',
      'GET /api/orders/:id',
      'PUT /api/orders/:id'
    ]
  });
});

// @route   GET /api/restaurants/:restaurantId/orders
// @desc    Get orders for a specific restaurant
// @access  Private (Restaurant owner or Admin)
router.get('/restaurants/:restaurantId/orders', authenticate, asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { status, limit = '10', page = '1' } = req.query;
  
  console.log('🔍 Getting orders for restaurant:', restaurantId);
  
  try {
    // Get orders from storage
    const allOrders = ordersStorage.get(restaurantId) || [];
    
    // Filter by status if provided
    let filteredOrders = allOrders;
    if (status) {
      filteredOrders = allOrders.filter(order => order.status === status);
    }
    
    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    console.log(`✅ Found ${filteredOrders.length} orders, returning ${paginatedOrders.length}`);
    
    res.json({
      success: true,
      data: {
        orders: paginatedOrders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredOrders.length,
          pages: Math.ceil(filteredOrders.length / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
}));

// @route   POST /api/restaurants/:restaurantId/orders
// @desc    Create a new order for a restaurant
// @access  Public (for QR code orders)
router.post('/restaurants/:restaurantId/orders', asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const orderData = req.body;
  
  console.log('🔧 Creating new order for restaurant:', restaurantId);
  console.log('📝 Order data:', JSON.stringify(orderData, null, 2));
  
  // Validate required fields
  if (!restaurantId) {
    return res.status(400).json({
      success: false,
      message: 'Restaurant ID is required'
    });
  }
  
  if (!orderData.customer || !orderData.customer.name) {
    return res.status(400).json({
      success: false,
      message: 'Customer information is required'
    });
  }
  
  if (!orderData.items || orderData.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order must contain at least one item'
    });
  }
  
  try {
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    // Create new order
    const newOrder = {
      _id: `order_${Date.now()}`,
      restaurantId,
      orderNumber,
      customer: orderData.customer || {
        name: orderData.customerName || 'Walk-in Customer',
        phone: orderData.customerPhone || '',
        email: orderData.customerEmail || ''
      },
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      status: 'pending',
      paymentMethod: orderData.paymentMethod || 'cash',
      deliveryMethod: orderData.deliveryMethod || 'dine_in',
      tableNumber: orderData.tableNumber || '',
      deliveryAddress: orderData.deliveryAddress || null,
      specialInstructions: orderData.specialInstructions || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store order
    const existingOrders = ordersStorage.get(restaurantId) || [];
    existingOrders.push(newOrder);
    ordersStorage.set(restaurantId, existingOrders);
    
    console.log('✅ Order created successfully:', newOrder._id);
    
    res.status(201).json({
      success: true,
      data: {
        order: newOrder
      }
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
}));

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private (Owner or Admin)
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  console.log('🔍 Getting order by ID:', id);
  
  try {
    // Search through all restaurants for the order
    let foundOrder = null;
    for (const [restaurantId, orders] of ordersStorage.entries()) {
      const order = orders.find(o => o._id === id);
      if (order) {
        foundOrder = order;
        break;
      }
    }
    
    if (!foundOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    console.log('✅ Order found:', foundOrder.orderNumber);
    
    res.json({
      success: true,
      data: {
        order: foundOrder
      }
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
}));

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private (Restaurant owner or Admin)
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  
  console.log('🔧 Updating order status:', id, 'to', status);
  
  try {
    // Find and update the order
    let updatedOrder = null;
    for (const [restaurantId, orders] of ordersStorage.entries()) {
      const orderIndex = orders.findIndex(o => o._id === id);
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date();
        if (notes) {
          orders[orderIndex].notes = notes;
        }
        updatedOrder = orders[orderIndex];
        ordersStorage.set(restaurantId, orders);
        break;
      }
    }
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    console.log('✅ Order status updated successfully');
    
    res.json({
      success: true,
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order'
    });
  }
}));

export default router;

