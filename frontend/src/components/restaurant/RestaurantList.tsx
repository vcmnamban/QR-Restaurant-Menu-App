import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  MapPin,
  Phone,
  Clock,
  Star,
  Truck,
  Building2
} from 'lucide-react';
import { Restaurant } from '@/types';
import { cn, formatCurrency } from '@/utils';

interface RestaurantListProps {
  restaurants: Restaurant[];
  onAddRestaurant: () => void;
  onEditRestaurant: (restaurant: Restaurant) => void;
  onViewRestaurant: (restaurant: Restaurant) => void;
  onDeleteRestaurant: (restaurantId: string) => void;
  onTestBackend?: () => void;
  onTestSimpleRestaurant?: () => void;
  isLoading?: boolean;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  onAddRestaurant,
  onEditRestaurant,
  onViewRestaurant,
  onDeleteRestaurant,
  onTestBackend,
  onTestSimpleRestaurant,
  isLoading = false
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const isOpenNow = (hours: any) => {
    if (!hours) return false;
    
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
    
    const dayHours = hours[day];
    if (!dayHours || !dayHours.isOpen) return false;
    
    return currentTime >= dayHours.open && currentTime <= dayHours.close;
  };

  const getOpenStatus = (hours: any) => {
    if (!hours) return { isOpen: false, text: 'Hours not set' };
    
    const isOpen = isOpenNow(hours);
    return {
      isOpen,
      text: isOpen ? 'Open Now' : 'Closed'
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
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

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No restaurants</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first restaurant.
        </p>
        <div className="mt-6">
          <button
            onClick={onAddRestaurant}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            My Restaurants ({restaurants.length})
          </h2>
          <p className="text-sm text-gray-500">
            Manage your restaurant profiles and settings
          </p>
        </div>
        <div className="flex gap-2">
          {onTestBackend && (
            <button
              onClick={onTestBackend}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Test Backend
            </button>
          )}
          {onTestSimpleRestaurant && (
            <button
              onClick={onTestSimpleRestaurant}
              className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              Test Simple
            </button>
          )}
          <button
            onClick={onAddRestaurant}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </button>
        </div>
      </div>

      {/* Restaurant Cards */}
      <div className="grid grid-cols-1 gap-4">
        {!Array.isArray(restaurants) ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading restaurants...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No restaurants</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first restaurant.</p>
            <div className="mt-6">
              <button
                onClick={onAddRestaurant}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Restaurant
              </button>
            </div>
          </div>
        ) : (
          restaurants.map((restaurant) => {
          const openStatus = getOpenStatus(restaurant.hours);
          
          return (
            <div key={restaurant._id} className="card hover:shadow-medium transition-shadow">
              <div className="card-body">
                <div className="flex items-start space-x-4">
                  {/* Restaurant Logo/Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                      {restaurant.logo ? (
                        <img
                          src={restaurant.logo}
                          alt={restaurant.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-primary-600" />
                      )}
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {restaurant.name}
                        </h3>
                        {restaurant.nameAr && (
                          <p className="text-sm text-gray-600 font-arabic">
                            {restaurant.nameAr}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {restaurant.description}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex-shrink-0 ml-4">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(restaurant.isActive)
                        )}>
                          {getStatusText(restaurant.isActive)}
                        </span>
                      </div>
                    </div>

                    {/* Restaurant Details */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">
                          {restaurant.address?.city}, {restaurant.address?.state}
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">
                          {restaurant.contact?.phone}
                        </span>
                      </div>

                      {/* Hours */}
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span className={cn(
                          'truncate',
                          openStatus.isOpen ? 'text-success-600' : 'text-gray-500'
                        )}>
                          {openStatus.text}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                        <span>
                          {restaurant.rating.toFixed(1)} ({restaurant.totalReviews})
                        </span>
                      </div>
                    </div>

                    {/* Categories and Features */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {restaurant.category?.slice(0, 3).map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {cat}
                        </span>
                      ))}
                      {restaurant.category && restaurant.category.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{restaurant.category.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Delivery Options */}
                    {restaurant.deliveryOptions && (
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        {restaurant.deliveryOptions.delivery && (
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 mr-1" />
                            <span>Delivery</span>
                            {restaurant.deliveryOptions.deliveryFee && (
                              <span className="ml-1">
                                ({formatCurrency(restaurant.deliveryOptions.deliveryFee)})
                              </span>
                            )}
                          </div>
                        )}
                        {restaurant.deliveryOptions.pickup && (
                          <span>Pickup</span>
                        )}
                        {restaurant.deliveryOptions.dineIn && (
                          <span>Dine-in</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <button
                        onClick={() => setSelectedRestaurant(
                          selectedRestaurant === restaurant._id ? null : restaurant._id
                        )}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {selectedRestaurant === restaurant._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onViewRestaurant(restaurant);
                                setSelectedRestaurant(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                onEditRestaurant(restaurant);
                                setSelectedRestaurant(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                onDeleteRestaurant(restaurant._id);
                                setSelectedRestaurant(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
