import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Order, OrderItem, MenuItem, MenuCategory, Restaurant } from '@/types';
import { cn, formatCurrency } from '@/utils';
import MenuService from '@/services/menu';

interface OrderFormProps {
  order?: Order;
  restaurantId: string;
  onSubmit: (data: Partial<Order>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    menuItemId: string;
    quantity: number;
    price: number;
    notes?: string;
    customizations?: Array<{
      name: string;
      value: string;
      price: number;
    }>;
  }>;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'card' | 'online';
  specialInstructions?: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  restaurantId,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<OrderFormData>({
    defaultValues: {
      customerName: order?.customerName || '',
      customerPhone: order?.customerPhone || '',
      customerEmail: order?.customerEmail || '',
      deliveryAddress: order?.deliveryAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Saudi Arabia'
      },
      items: order?.items?.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes,
        customizations: item.customizations
      })) || [],
      deliveryMethod: (order?.deliveryMethod as 'delivery' | 'pickup') || 'delivery',
      paymentMethod: (order?.paymentMethod as 'card' | 'cash' | 'online') || 'cash',
      specialInstructions: order?.specialInstructions || ''
    },
    mode: 'onChange'
  });

  const watchedItems = watch('items');
  const watchedDeliveryMethod = watch('deliveryMethod');

  // Fetch menu items and categories
  useEffect(() => {
    fetchMenuData();
  }, [restaurantId]);

  const fetchMenuData = async () => {
    setIsLoadingMenu(true);
    try {
      const [menuData, categoriesData] = await Promise.all([
        MenuService.getMenuItems(restaurantId),
        MenuService.getCategories(restaurantId)
      ]);
      setMenuItems(menuData.items);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch menu data:', error);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || item.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory && item.isActive;
  });

  // Add item to order
  const addItemToOrder = (menuItem: MenuItem) => {
    const existingItemIndex = watchedItems.findIndex(
      item => item.menuItemId === menuItem._id
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...watchedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setValue('items', updatedItems);
    } else {
      // Add new item
      const newItem = {
        menuItemId: menuItem._id,
        quantity: 1,
        price: menuItem.price,
        notes: '',
        customizations: []
      };
      setValue('items', [...watchedItems, newItem]);
    }
  };

  // Remove item from order
  const removeItemFromOrder = (index: number) => {
    const updatedItems = watchedItems.filter((_, i) => i !== index);
    setValue('items', updatedItems);
  };

  // Update item quantity
  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(index);
      return;
    }

    const updatedItems = [...watchedItems];
    updatedItems[index].quantity = newQuantity;
    setValue('items', updatedItems);
  };

  // Update item notes
  const updateItemNotes = (index: number, notes: string) => {
    const updatedItems = [...watchedItems];
    updatedItems[index].notes = notes;
    setValue('items', updatedItems);
  };

  // Calculate order total
  const calculateTotal = () => {
    return watchedItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const customizationTotal = (item.customizations || []).reduce(
        (sum, custom) => sum + (custom.price || 0), 0
      );
      return total + itemTotal + customizationTotal;
    }, 0);
  };

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || 'Unknown Category';
  };

  // Handle form submission
  const handleFormSubmit = async (data: OrderFormData) => {
    if (data.items.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    try {
      // Convert OrderFormData to Order format
      const orderData: Partial<Order> = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        items: data.items.map(item => ({
          menuItem: item.menuItemId,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          price: item.price,
          notes: item.notes,
          customizations: item.customizations
        })),
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        specialInstructions: data.specialInstructions
      };
      await onSubmit(orderData);
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Customer Information */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  {...register('customerName', { required: 'Customer name is required' })}
                  className={cn(
                    'input w-full',
                    errors.customerName && 'border-red-500'
                  )}
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('customerPhone', { required: 'Phone number is required' })}
                  className={cn(
                    'input w-full',
                    errors.customerPhone && 'border-red-500'
                  )}
                  placeholder="Enter phone number"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('customerEmail')}
                  className="input w-full"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Method
                </label>
                <Controller
                  name="deliveryMethod"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="input w-full">
                      <option value="delivery">Delivery</option>
                      <option value="pickup">Pickup</option>
                    </select>
                  )}
                />
              </div>
            </div>

            {/* Delivery Address */}
            {watchedDeliveryMethod === 'delivery' && (
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Delivery Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      {...register('deliveryAddress.street', { 
                        required: watchedDeliveryMethod === 'delivery' ? 'Street address is required' : false 
                      })}
                      className={cn(
                        'input w-full',
                        errors.deliveryAddress?.street && 'border-red-500'
                      )}
                      placeholder="Enter street address"
                    />
                    {errors.deliveryAddress?.street && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.street.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register('deliveryAddress.city', { 
                        required: watchedDeliveryMethod === 'delivery' ? 'City is required' : false 
                      })}
                      className={cn(
                        'input w-full',
                        errors.deliveryAddress?.city && 'border-red-500'
                      )}
                      placeholder="Enter city"
                    />
                    {errors.deliveryAddress?.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      {...register('deliveryAddress.state', { 
                        required: watchedDeliveryMethod === 'delivery' ? 'State is required' : false 
                      })}
                      className={cn(
                        'input w-full',
                        errors.deliveryAddress?.state && 'border-red-500'
                      )}
                      placeholder="Enter state"
                    />
                    {errors.deliveryAddress?.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      {...register('deliveryAddress.postalCode', { 
                        required: watchedDeliveryMethod === 'delivery' ? 'Postal code is required' : false 
                      })}
                      className={cn(
                        'input w-full',
                        errors.deliveryAddress?.postalCode && 'border-red-500'
                      )}
                      placeholder="Enter postal code"
                    />
                    {errors.deliveryAddress?.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.postalCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      {...register('deliveryAddress.country')}
                      className="input w-full"
                      placeholder="Enter country"
                      defaultValue="Saudi Arabia"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items Selection */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Menu Items</h3>
            
            {/* Search and Filter */}
            <div className="mb-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Menu Items Grid */}
            {isLoadingMenu ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading menu items...</p>
              </div>
            ) : filteredMenuItems.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 mt-2">No menu items found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 cursor-pointer transition-colors"
                    onClick={() => addItemToOrder(item)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">IMG</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{item.description}</p>
                        <p className="text-sm text-primary-600 font-medium">
                          {formatCurrency(item.price || 0)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getCategoryName(item.categoryId)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItemToOrder(item);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        {watchedItems.length > 0 && (
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {watchedItems.map((item, index) => {
                  const menuItem = menuItems.find(mi => mi._id === item.menuItemId);
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {menuItem?.name || 'Unknown Item'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(item.price)} each
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                            className="btn-outline p-2"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-lg font-medium text-gray-900 w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                            className="btn-outline p-2"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItemFromOrder(index)}
                            className="btn-outline p-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Notes */}
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Add notes for this item..."
                          value={item.notes || ''}
                          onChange={(e) => updateItemNotes(index, e.target.value)}
                          className="input w-full text-sm"
                        />
                      </div>

                      {/* Item Total */}
                      <div className="mt-3 text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          Total: {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Total */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-xl font-semibold">
                  <span>Order Total</span>
                  <span className="text-2xl text-primary-600">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="input w-full">
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="online">Online Payment</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  {...register('specialInstructions')}
                  rows={3}
                  className="input w-full"
                  placeholder="Any special instructions or notes..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isLoading || watchedItems.length === 0}
            className="btn-primary"
          >
            {isLoading ? (
              <>
                <div className="spinner w-4 h-4 mr-2"></div>
                Saving...
              </>
            ) : order ? 'Update Order' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
