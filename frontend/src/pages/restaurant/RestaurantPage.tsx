import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import RestaurantList from '@/components/restaurant/RestaurantList';
import RestaurantForm from '@/components/restaurant/RestaurantForm';
import RestaurantService from '@/services/restaurant';
import RoleGuard from '@/components/auth/RoleGuard';
import { Restaurant } from '@/types';
import { Plus, ArrowLeft } from 'lucide-react';

type ViewMode = 'list' | 'add' | 'edit' | 'view';

const RestaurantPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add error boundary for unhandled errors
  const [hasError, setHasError] = useState(false);

  // Fetch restaurants on component mount
  useEffect(() => {
    try {
      if (viewMode === 'list') {
        fetchRestaurants();
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
      setHasError(true);
    }
  }, [viewMode]);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await RestaurantService.getMyRestaurants();
      setRestaurants(data);
    } catch (error: any) {
      console.error('Error fetching restaurants:', error);
      const errorMessage = error.message || 'Failed to fetch restaurants';
      setError(errorMessage);
      toast.error(errorMessage);
      // Set empty array instead of leaving restaurants undefined
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRestaurant = () => {
    setSelectedRestaurant(null);
    setViewMode('add');
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setViewMode('edit');
  };

  const handleViewRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setViewMode('view');
  };

  const handleDeleteRestaurant = async (restaurantId: string) => {
    if (!confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      return;
    }

    try {
      await RestaurantService.deleteRestaurant(restaurantId);
      toast.success('Restaurant deleted successfully');
      fetchRestaurants();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete restaurant');
    }
  };

  const handleSubmitRestaurant = async (data: Partial<Restaurant>) => {
    setIsSubmitting(true);
    try {
      if (viewMode === 'add') {
        await RestaurantService.createRestaurant(data);
        toast.success('Restaurant created successfully');
      } else if (viewMode === 'edit' && selectedRestaurant) {
        await RestaurantService.updateRestaurant(selectedRestaurant._id, data);
        toast.success('Restaurant updated successfully');
      }
      setViewMode('list');
      fetchRestaurants();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save restaurant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedRestaurant(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'add':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Restaurants
              </button>
            </div>
            <RestaurantForm
              onSubmit={handleSubmitRestaurant}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        );

      case 'edit':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Restaurants
              </button>
            </div>
            <RestaurantForm
              restaurant={selectedRestaurant || undefined}
              onSubmit={handleSubmitRestaurant}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        );

      case 'view':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Restaurants
              </button>
            </div>
            <div className="card">
              <div className="card-body">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Restaurant Details
                </h2>
                {selectedRestaurant && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Name</h3>
                      <p className="text-gray-600">{selectedRestaurant.name}</p>
                      {selectedRestaurant.nameAr && (
                        <p className="text-gray-600 font-arabic">{selectedRestaurant.nameAr}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Description</h3>
                      <p className="text-gray-600">{selectedRestaurant.description}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Address</h3>
                      <p className="text-gray-600">
                        {selectedRestaurant.address?.street}, {selectedRestaurant.address?.city}, {selectedRestaurant.address?.state}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Contact</h3>
                      <p className="text-gray-600">
                        Phone: {selectedRestaurant.contact?.phone}<br />
                        Email: {selectedRestaurant.contact?.email}
                      </p>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={() => handleEditRestaurant(selectedRestaurant)}
                        className="btn-primary"
                      >
                        Edit Restaurant
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <RestaurantList
            restaurants={restaurants}
            onAddRestaurant={handleAddRestaurant}
            onEditRestaurant={handleEditRestaurant}
            onViewRestaurant={handleViewRestaurant}
            onDeleteRestaurant={handleDeleteRestaurant}
            isLoading={isLoading}
          />
        );
    }
  };

  // Show error boundary state
  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your restaurant profiles and settings</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>An unexpected error occurred. Please refresh the page.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your restaurant profiles and settings</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading restaurants</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchRestaurants}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['restaurant_owner', 'admin']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            {viewMode === 'list' 
              ? 'Manage your restaurant profiles and settings'
              : viewMode === 'add'
              ? 'Create a new restaurant profile'
              : viewMode === 'edit'
              ? 'Edit restaurant information'
              : 'View restaurant details'
            }
          </p>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </RoleGuard>
  );
};

export default RestaurantPage;
