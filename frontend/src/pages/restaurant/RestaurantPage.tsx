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
      
      // Extract proper error message
      let errorMessage = 'Failed to fetch restaurants';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      // Set empty array instead of leaving restaurants undefined
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRestaurant = () => {
    // Check if user already has a restaurant
    if (restaurants.length > 0) {
      toast.error('You already have a restaurant! Please edit your existing restaurant instead.');
      return;
    }
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
      console.log('🔍 Original form data:', JSON.stringify(data, null, 2));
      
      // Clean up the data - remove empty optional fields
      let cleanedData = { ...data };
      
      // Remove empty optional fields that cause validation errors
      if (cleanedData.nameAr === '' || cleanedData.nameAr === null || cleanedData.nameAr === undefined) {
        delete cleanedData.nameAr;
      }
      if (cleanedData.descriptionAr === '' || cleanedData.descriptionAr === null || cleanedData.descriptionAr === undefined) {
        delete cleanedData.descriptionAr;
      }
      
      // Clean up other optional fields
      if (cleanedData.contact?.website === '' || cleanedData.contact?.website === null || cleanedData.contact?.website === undefined) {
        delete cleanedData.contact.website;
      }
      
      // Ensure required arrays are not empty
      if (!cleanedData.category || cleanedData.category.length === 0) {
        cleanedData.category = ['Fast Food']; // Default category
      }
      if (!cleanedData.cuisine || cleanedData.cuisine.length === 0) {
        cleanedData.cuisine = ['International']; // Default cuisine
      }
      
      // Ensure required fields have default values
      if (!cleanedData.features || cleanedData.features.length === 0) {
        cleanedData.features = [];
      }
      if (!cleanedData.paymentMethods || cleanedData.paymentMethods.length === 0) {
        cleanedData.paymentMethods = ['Cash']; // Default payment method
      }
      
      // Ensure hours object exists
      if (!cleanedData.hours) {
        cleanedData.hours = {};
      }
      
      // Ensure deliveryOptions has required fields
      if (!cleanedData.deliveryOptions) {
        cleanedData.deliveryOptions = {
          delivery: false,
          pickup: true,
          dineIn: true,
          deliveryFee: 0,
          minimumOrder: 0,
          deliveryRadius: 5
        };
      }
      
      // Convert string numbers to actual numbers
      if (cleanedData.deliveryOptions.deliveryFee && typeof cleanedData.deliveryOptions.deliveryFee === 'string') {
        cleanedData.deliveryOptions.deliveryFee = parseFloat(cleanedData.deliveryOptions.deliveryFee);
      }
      if (cleanedData.deliveryOptions.minimumOrder && typeof cleanedData.deliveryOptions.minimumOrder === 'string') {
        cleanedData.deliveryOptions.minimumOrder = parseFloat(cleanedData.deliveryOptions.minimumOrder);
      }
      if (cleanedData.deliveryOptions.deliveryRadius && typeof cleanedData.deliveryOptions.deliveryRadius === 'string') {
        cleanedData.deliveryOptions.deliveryRadius = parseFloat(cleanedData.deliveryOptions.deliveryRadius);
      }
      
      // Fix phone number format for Saudi validation
      if (cleanedData.contact?.phone) {
        let phone = cleanedData.contact.phone;
        // Remove any non-digit characters
        phone = phone.replace(/\D/g, '');
        // Add country code if missing
        if (phone.length === 9 && phone.startsWith('5')) {
          phone = '966' + phone;
        } else if (phone.length === 10 && phone.startsWith('05')) {
          phone = '966' + phone.substring(1);
        }
        cleanedData.contact.phone = phone;
      }
      
      // Fix website format if provided
      if (cleanedData.contact?.website && cleanedData.contact.website !== '') {
        let website = cleanedData.contact.website;
        if (!website.startsWith('http://') && !website.startsWith('https://')) {
          website = 'https://' + website;
        }
        cleanedData.contact.website = website;
      }
      
      console.log('🔍 Cleaned data before API call:', JSON.stringify(cleanedData, null, 2));
      
      // Validate required fields before sending
      if (!cleanedData.name || cleanedData.name.trim() === '') {
        throw new Error('Restaurant name is required');
      }
      if (!cleanedData.description || cleanedData.description.trim() === '') {
        throw new Error('Restaurant description is required');
      }
      if (!cleanedData.address?.street || cleanedData.address.street.trim() === '') {
        throw new Error('Street address is required');
      }
      if (!cleanedData.address?.city || cleanedData.address.city.trim() === '') {
        throw new Error('City is required');
      }
      if (!cleanedData.contact?.phone || cleanedData.contact.phone.trim() === '') {
        throw new Error('Phone number is required');
      }
      if (!cleanedData.contact?.email || cleanedData.contact.email.trim() === '') {
        throw new Error('Email is required');
      }
      if (!cleanedData.category || cleanedData.category.length === 0) {
        throw new Error('At least one category is required');
      }
      if (!cleanedData.cuisine || cleanedData.cuisine.length === 0) {
        throw new Error('At least one cuisine type is required');
      }
      
      if (viewMode === 'add') {
        await RestaurantService.createRestaurant(cleanedData);
        toast.success('Restaurant created successfully');
      } else if (viewMode === 'edit' && selectedRestaurant) {
        await RestaurantService.updateRestaurant(selectedRestaurant._id, cleanedData);
        toast.success('Restaurant updated successfully');
      }
      setViewMode('list');
      fetchRestaurants();
    } catch (error: any) {
      console.error('Restaurant save error:', error);
      
      // Extract proper error message
      let errorMessage = 'Failed to save restaurant';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Handle specific business logic errors
      if (errorMessage.includes('You can only own one restaurant')) {
        toast.error('You already have a restaurant! Please edit your existing restaurant or contact support to delete it first.');
        // Optionally redirect to edit mode if there's an existing restaurant
        fetchRestaurants(); // Refresh the list to show existing restaurant
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedRestaurant(null);
  };

  const handleTestBackend = async () => {
    try {
      console.log('🔍 Testing backend connectivity...');
      await RestaurantService.testBackend();
      toast.success('Backend test successful!');
    } catch (error: any) {
      console.error('Backend test failed:', error);
      toast.error(`Backend test failed: ${error.message}`);
    }
  };

  const handleTestSimpleRestaurant = async () => {
    try {
      console.log('🔍 Testing simple restaurant creation...');
      await RestaurantService.testSimpleRestaurant();
      toast.success('Simple restaurant test successful!');
    } catch (error: any) {
      console.error('Simple restaurant test failed:', error);
      toast.error(`Simple restaurant test failed: ${error.message}`);
    }
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
            onTestBackend={handleTestBackend}
            onTestSimpleRestaurant={handleTestSimpleRestaurant}
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
