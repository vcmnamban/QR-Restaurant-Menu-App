import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  ShoppingCart
} from 'lucide-react';
import { MenuItem, Restaurant } from '@/types';
import { cn, formatCurrency } from '@/utils';

interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

const CheckoutPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get('table');

  // Data states
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    city: '',
    zipCode: '',
    deliveryInstructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem(`cart_${restaurantId}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Load restaurant data
    fetchRestaurantData();
  }, [restaurantId]);

  const fetchRestaurantData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://qr-restaurant-menu-app-production.up.railway.app/api'}/restaurants/${restaurantId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data.restaurant) {
        setRestaurant(data.data.restaurant);
      } else {
        throw new Error(data.message || 'Restaurant not found');
      }
    } catch (error: any) {
      console.error('Failed to fetch restaurant:', error);
      
      // Provide fallback restaurant data if API fails
      const fallbackRestaurant = {
        _id: restaurantId,
        name: 'Test Restaurant Chaya Kada',
        description: 'A test restaurant for chaay',
        address: {
          street: 'adaan',
          city: 'Adan',
          state: 'Adan State',
          zipCode: '12345',
          country: 'Saudi Arabia'
        },
        contact: {
          phone: '966501234567',
          email: 'test@restaurant.com'
        },
        isActive: true,
        isVerified: true,
        rating: 0.0,
        totalReviews: 0,
        category: ['Fast Food'],
        cuisine: ['International'],
        features: ['WiFi', 'Parking'],
        paymentMethods: ['Cash', 'Credit Card'],
        deliveryOptions: {
          delivery: false,
          pickup: true,
          dineIn: true,
          estimatedTime: '15-20 min'
        },
        hours: {
          monday: { open: '09:00', close: '22:00', isOpen: true },
          tuesday: { open: '09:00', close: '22:00', isOpen: true },
          wednesday: { open: '09:00', close: '22:00', isOpen: true },
          thursday: { open: '09:00', close: '22:00', isOpen: true },
          friday: { open: '09:00', close: '22:00', isOpen: true },
          saturday: { open: '09:00', close: '22:00', isOpen: true },
          sunday: { open: '09:00', close: '22:00', isOpen: true }
        }
      };
      
      setRestaurant(fallbackRestaurant as Restaurant);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, cartItem) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill in required customer information');
      return;
    }

    if (!restaurantId) {
      toast.error('Restaurant ID is missing');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        customer: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email || ''
        },
        items: cartItems.map(cartItem => ({
          menuItemId: cartItem.item._id,
          name: cartItem.item.name,
          quantity: cartItem.quantity,
          price: cartItem.item.price,
          totalPrice: cartItem.item.price * cartItem.quantity,
          notes: cartItem.notes || ''
        })),
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod,
        deliveryMethod: tableId ? 'dine_in' : 'pickup',
        tableNumber: tableId || '',
        deliveryAddress: paymentMethod === 'cash' && deliveryInfo.address ? {
          street: deliveryInfo.address,
          city: deliveryInfo.city,
          zipCode: deliveryInfo.zipCode
        } : null,
        specialInstructions: customerInfo.notes || deliveryInfo.deliveryInstructions || ''
      };

      console.log('Submitting order:', orderData);

      // Submit order to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://qr-restaurant-menu-app-production.up.railway.app/api'}/restaurants/${restaurantId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Order submitted successfully:', result);

      // Clear cart
      localStorage.removeItem(`cart_${restaurantId}`);
      
      toast.success(`Order ${result.data?.order?.orderNumber || 'placed'} successfully!`);
      
      // Redirect back to menu
      navigate(`/restaurant/${restaurantId}${tableId ? `?table=${tableId}` : ''}`);
    } catch (error: any) {
      console.error('Order submission failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-gray-500">Add some items to your cart first</p>
          <button
            onClick={() => navigate(`/restaurant/${restaurantId}${tableId ? `?table=${tableId}` : ''}`)}
            className="mt-4 btn-primary"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/restaurant/${restaurantId}${tableId ? `?table=${tableId}` : ''}`)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
            </div>
            {restaurant && (
              <div className="text-sm text-gray-500">
                {restaurant.name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full input"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full input"
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    className="w-full input"
                    rows={3}
                    placeholder="Any special instructions for your order?"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                    className="w-full input"
                    placeholder="Enter your delivery address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.city}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                    className="w-full input"
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.zipCode}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, zipCode: e.target.value })}
                    className="w-full input"
                    placeholder="Enter ZIP code"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Instructions
                  </label>
                  <textarea
                    value={deliveryInfo.deliveryInstructions}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, deliveryInstructions: e.target.value })}
                    className="w-full input"
                    rows={2}
                    placeholder="Any specific delivery instructions?"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when your order arrives</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">Pay securely online</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((cartItem) => (
                  <div key={cartItem.item._id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                      {cartItem.item.image ? (
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">IMG</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {cartItem.item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Qty: {cartItem.quantity} × {formatCurrency(cartItem.item.price)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(cartItem.item.price * cartItem.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={isProcessing}
                className={cn(
                  'w-full mt-6 btn-primary flex items-center justify-center space-x-2',
                  isProcessing && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner w-4 h-4"></div>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
