import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { MenuItem, Restaurant } from '@/types';
import { cn, formatCurrency } from '@/utils';

interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  total: number;
  restaurant: Restaurant;
  tableId?: string | null;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  total,
  restaurant,
  tableId
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // TODO: Implement checkout flow
    setTimeout(() => {
      setIsCheckingOut(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
              {items.length > 0 && (
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  {items.reduce((count, item) => count + item.quantity, 0)}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start adding items from the menu
                </p>
              </div>
            ) : (
              items.map((cartItem) => (
                <div key={cartItem.item._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {/* Item Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      {cartItem.item.image ? (
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">IMG</span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {cartItem.item.name}
                      </h4>
                      <p className="text-sm text-primary-600 font-medium">
                        {formatCurrency(cartItem.item.price)}
                      </p>
                      {cartItem.notes && (
                        <p className="text-xs text-gray-500 mt-1">
                          Note: {cartItem.notes}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item._id, cartItem.quantity - 1)}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.item._id, cartItem.quantity + 1)}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem(cartItem.item._id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(cartItem.item.price * cartItem.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Restaurant Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {restaurant.name}
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3" />
                    <span>{restaurant.contact?.phone}</span>
                  </div>
                  {tableId && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>Table {tableId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Total */}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={cn(
                    'w-full btn-primary flex items-center justify-center space-x-2',
                    isCheckingOut && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isCheckingOut ? (
                    <>
                      <div className="spinner w-4 h-4"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={onClearCart}
                  className="w-full btn-outline text-red-600 hover:text-red-800 hover:border-red-300"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
