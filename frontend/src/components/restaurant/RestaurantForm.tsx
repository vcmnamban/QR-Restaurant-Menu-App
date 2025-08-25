import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  CreditCard,
  Truck,
  Save,
  X
} from 'lucide-react';
import { Restaurant, Address, ContactInfo, OperatingHours, DeliveryOptions } from '@/types';
import { cn } from '@/utils';

interface RestaurantFormProps {
  restaurant?: Partial<Restaurant>;
  onSubmit: (data: Partial<Restaurant>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  restaurant,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue
  } = useForm<Partial<Restaurant>>({
    defaultValues: {
      name: restaurant?.name || '',
      nameAr: restaurant?.nameAr || '',
      description: restaurant?.description || '',
      descriptionAr: restaurant?.descriptionAr || '',
      category: restaurant?.category || [],
      cuisine: restaurant?.cuisine || [],
      address: restaurant?.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Saudi Arabia'
      },
      contact: restaurant?.contact || {
        phone: '',
        email: '',
        website: ''
      },
      hours: restaurant?.hours || {},
      features: restaurant?.features || [],
      paymentMethods: restaurant?.paymentMethods || [],
      deliveryOptions: restaurant?.deliveryOptions || {
        delivery: false,
        pickup: true,
        dineIn: true,
        deliveryFee: 0,
        minimumOrder: 0,
        deliveryRadius: 5
      }
    }
  });

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'hours', label: 'Hours', icon: Clock },
    { id: 'services', label: 'Services', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard }
  ];

  const categories = [
    'Fast Food', 'Fine Dining', 'Casual Dining', 'Cafe', 'Pizzeria',
    'Seafood', 'Steakhouse', 'Italian', 'Chinese', 'Japanese',
    'Indian', 'Mexican', 'Thai', 'Mediterranean', 'American'
  ];

  const cuisines = [
    'Arabic', 'International', 'Fusion', 'Traditional', 'Modern',
    'Street Food', 'Healthy', 'Vegetarian', 'Vegan', 'Halal'
  ];

  const features = [
    'WiFi', 'Parking', 'Outdoor Seating', 'Private Dining',
    'Live Music', 'Sports TV', 'Family Friendly', 'Romantic',
    'Business Lunch', 'Happy Hour', 'Delivery', 'Takeout'
  ];

  const paymentMethods = [
    'Cash', 'Credit Card', 'Debit Card', 'Mada', 'Apple Pay',
    'Google Pay', 'Samsung Pay', 'PayPal', 'Bank Transfer'
  ];

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const handleFormSubmit = async (data: Partial<Restaurant>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {restaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
        </h2>
        <p className="text-gray-600">
          Fill in the details below to {restaurant ? 'update' : 'create'} your restaurant profile
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Restaurant Name (English) *
                </label>
                <input
                  id="name"
                  type="text"
                  className={cn('input', errors.name ? 'input-error' : '')}
                  placeholder="Enter restaurant name"
                  {...register('name', { required: 'Restaurant name is required' })}
                />
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="nameAr" className="form-label">
                  Restaurant Name (Arabic)
                </label>
                <input
                  id="nameAr"
                  type="text"
                  className="input"
                  placeholder="اسم المطعم"
                  {...register('nameAr')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description (English) *
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className={cn('input', errors.description ? 'input-error' : '')}
                  placeholder="Describe your restaurant"
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="form-error">{errors.description.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="descriptionAr" className="form-label">
                  Description (Arabic)
                </label>
                <textarea
                  id="descriptionAr"
                  rows={3}
                  className="input"
                  placeholder="وصف المطعم"
                  {...register('descriptionAr')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Categories *</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={category}
                        {...register('category', { required: 'At least one category is required' })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
                {errors.category && (
                  <p className="form-error">{errors.category.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Cuisine Types</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {cuisines.map((cuisine) => (
                    <label key={cuisine} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={cuisine}
                        {...register('cuisine')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="street" className="form-label">
                  Street Address *
                </label>
                <input
                  id="street"
                  type="text"
                  className={cn('input', errors.address?.street ? 'input-error' : '')}
                  placeholder="Enter street address"
                  {...register('address.street', { required: 'Street address is required' })}
                />
                {errors.address?.street && (
                  <p className="form-error">{errors.address.street.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  className={cn('input', errors.address?.city ? 'input-error' : '')}
                  placeholder="Enter city"
                  {...register('address.city', { required: 'City is required' })}
                />
                {errors.address?.city && (
                  <p className="form-error">{errors.address.city.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  State/Province *
                </label>
                <input
                  id="state"
                  type="text"
                  className={cn('input', errors.address?.state ? 'input-error' : '')}
                  placeholder="Enter state"
                  {...register('address.state', { required: 'State is required' })}
                />
                {errors.address?.state && (
                  <p className="form-error">{errors.address.state.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode" className="form-label">
                  ZIP/Postal Code
                </label>
                <input
                  id="zipCode"
                  type="text"
                  className="input"
                  placeholder="Enter ZIP code"
                  {...register('address.zipCode')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country" className="form-label">
                  Country *
                </label>
                <input
                  id="country"
                  type="text"
                  className={cn('input', errors.address?.country ? 'input-error' : '')}
                  defaultValue="Saudi Arabia"
                  {...register('address.country', { required: 'Country is required' })}
                />
                {errors.address?.country && (
                  <p className="form-error">{errors.address.country.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={cn('input', errors.contact?.phone ? 'input-error' : '')}
                  placeholder="+966 50 123 4567"
                  {...register('contact.phone', { required: 'Phone number is required' })}
                />
                {errors.contact?.phone && (
                  <p className="form-error">{errors.contact.phone.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  className={cn('input', errors.contact?.email ? 'input-error' : '')}
                  placeholder="restaurant@example.com"
                  {...register('contact.email', { required: 'Email is required' })}
                />
                {errors.contact?.email && (
                  <p className="form-error">{errors.contact.email.message}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="website" className="form-label">
                Website
              </label>
              <input
                id="website"
                type="url"
                className="input"
                placeholder="https://www.restaurant.com"
                {...register('contact.website')}
              />
            </div>
          </div>
        )}

        {/* Hours Tab */}
        {activeTab === 'hours' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {days.map((day) => (
                <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-24">
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register(`hours.${day}.isOpen`)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">Open</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      {...register(`hours.${day}.open`)}
                      className="input w-32"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      {...register(`hours.${day}.close`)}
                      className="input w-32"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="form-group">
              <label className="form-label">Features & Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                {features.map((feature) => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={feature}
                      {...register('features')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Delivery Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('deliveryOptions.delivery')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Offer Delivery</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('deliveryOptions.pickup')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Allow Pickup</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('deliveryOptions.dineIn')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Dine-in Available</span>
                  </label>
                </div>
                
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Delivery Fee (SAR)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input"
                      {...register('deliveryOptions.deliveryFee')}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Minimum Order (SAR)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input"
                      {...register('deliveryOptions.minimumOrder')}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Delivery Radius (km)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      className="input"
                      {...register('deliveryOptions.deliveryRadius')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="form-group">
              <label className="form-label">Accepted Payment Methods</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={method}
                      {...register('paymentMethods')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="spinner w-4 h-4 mr-2" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Restaurant
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm;
