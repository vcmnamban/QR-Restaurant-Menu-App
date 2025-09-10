import http from './api';
import { Restaurant, ApiResponse } from '@/types';

// Restaurant service
export class RestaurantService {
  // Test backend connectivity
  static async testBackend(): Promise<any> {
    try {
      console.log('🔍 Frontend: Testing backend connectivity...');
      const response = await http.get('/restaurants/test');
      console.log('🔍 Frontend: Backend test response:', response);
      return response;
    } catch (error: any) {
      console.error('🔍 Frontend: Backend test failed:', error);
      throw error;
    }
  }

  // Test simple restaurant creation without authentication
  static async testSimpleRestaurant(): Promise<any> {
    try {
      console.log('🔍 Frontend: Testing simple restaurant creation...');
      const testData = {
        name: 'Test Restaurant',
        description: 'Test Description'
      };
      const response = await http.post('/restaurants/simple', testData);
      console.log('🔍 Frontend: Simple restaurant test response:', response);
      return response;
    } catch (error: any) {
      console.error('🔍 Frontend: Simple restaurant test failed:', error);
      throw error;
    }
  }
  // Get all restaurants for the current user
  static async getMyRestaurants(): Promise<Restaurant[]> {
    const response = await http.get<{ restaurants: Restaurant[] }>('/restaurants/my');
    
    if (response.success && response.data && response.data.restaurants) {
      return response.data.restaurants;
    }
    
    throw new Error(response.error || 'Failed to fetch restaurants');
  }

  // Get restaurant by ID
  static async getRestaurant(id: string): Promise<Restaurant> {
    const response = await http.get<Restaurant>(`/restaurants/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch restaurant');
  }

  // Create new restaurant
  static async createRestaurant(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Frontend: Sending restaurant data:', JSON.stringify(restaurantData, null, 2));
    }
    
    const response = await http.post<Restaurant>('/restaurants', restaurantData);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Frontend: Received response:', response);
      console.log('🔍 Frontend: Response success:', response.success);
      console.log('🔍 Frontend: Response error:', response.error);
      console.log('🔍 Frontend: Response message:', response.message);
    }
    
    if (response.success && response.data) {
      return response.data;
    }
    
    // Handle error response
    const errorMessage = response.error || response.message || 'Failed to create restaurant';
    console.error('Restaurant creation failed:', errorMessage);
    throw new Error(errorMessage);
  }

  // Update restaurant
  static async updateRestaurant(id: string, restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Frontend: Updating restaurant with ID:', id);
      console.log('🔍 Frontend: Update data:', JSON.stringify(restaurantData, null, 2));
    }
    
    const response = await http.put<Restaurant>(`/restaurants/${id}`, restaurantData);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Frontend: Update response:', response);
      console.log('🔍 Frontend: Update success:', response.success);
      console.log('🔍 Frontend: Update error:', response.error);
    }
    
    if (response.success && response.data) {
      return response.data;
    }
    
    const errorMessage = response.error || response.message || 'Failed to update restaurant';
    console.error('Restaurant update failed:', errorMessage);
    throw new Error(errorMessage);
  }

  // Delete restaurant
  static async deleteRestaurant(id: string): Promise<void> {
    const response = await http.delete(`/restaurants/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete restaurant');
    }
  }

  // Upload restaurant logo
  static async uploadLogo(id: string, file: File): Promise<{ logoUrl: string }> {
    const response = await http.upload<{ logoUrl: string }>(`/restaurants/${id}/logo`, file);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to upload logo');
  }

  // Toggle restaurant status (active/inactive)
  static async toggleStatus(id: string): Promise<Restaurant> {
    const response = await http.patch<Restaurant>(`/restaurants/${id}/toggle-status`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to toggle restaurant status');
  }

  // Get restaurant statistics
  static async getRestaurantStats(id: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    popularItems: Array<{ name: string; orderCount: number }>;
  }> {
    const response = await http.get(`/restaurants/${id}/stats`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch restaurant statistics');
  }

  // Search restaurants (for customers)
  static async searchRestaurants(params: {
    query?: string;
    category?: string;
    cuisine?: string;
    city?: string;
    delivery?: boolean;
    rating?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    restaurants: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await http.get<{
      restaurants: Restaurant[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/restaurants/search?${queryParams.toString()}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to search restaurants');
  }

  // Get nearby restaurants
  static async getNearbyRestaurants(location: {
    latitude: number;
    longitude: number;
    radius?: number;
  }): Promise<Restaurant[]> {
    const response = await http.get<Restaurant[]>(`/restaurants/nearby`, {
      params: location
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch nearby restaurants');
  }

  // Get restaurant reviews
  static async getRestaurantReviews(id: string, page: number = 1, limit: number = 10): Promise<{
    reviews: Array<{
      _id: string;
      user: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
      };
      rating: number;
      comment: string;
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await http.get(`/restaurants/${id}/reviews`, {
      params: { page, limit }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch restaurant reviews');
  }

  // Validate restaurant data
  static validateRestaurantData(data: Partial<Restaurant>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Restaurant name is required');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Restaurant description is required');
    }

    if (!data.address?.street || data.address.street.trim().length === 0) {
      errors.push('Street address is required');
    }

    if (!data.address?.city || data.address.city.trim().length === 0) {
      errors.push('City is required');
    }

    if (!data.address?.state || data.address.state.trim().length === 0) {
      errors.push('State/Province is required');
    }

    if (!data.contact?.phone || data.contact.phone.trim().length === 0) {
      errors.push('Phone number is required');
    }

    if (!data.contact?.email || data.contact.email.trim().length === 0) {
      errors.push('Email address is required');
    }

    if (!data.category || data.category.length === 0) {
      errors.push('At least one category is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format restaurant data for API submission
  static formatRestaurantData(data: Partial<Restaurant>): Partial<Restaurant> {
    const formatted = { ...data };

    // Ensure required fields are present
    if (formatted.name) {
      formatted.name = formatted.name.trim();
    }

    if (formatted.description) {
      formatted.description = formatted.description.trim();
    }

    if (formatted.address) {
      if (formatted.address.street) {
        formatted.address.street = formatted.address.street.trim();
      }
      if (formatted.address.city) {
        formatted.address.city = formatted.address.city.trim();
      }
      if (formatted.address.state) {
        formatted.address.state = formatted.address.state.trim();
      }
    }

    if (formatted.contact) {
      if (formatted.contact.phone) {
        formatted.contact.phone = formatted.contact.phone.trim();
      }
      if (formatted.contact.email) {
        formatted.contact.email = formatted.contact.email.trim().toLowerCase();
      }
    }

    return formatted;
  }
}

// Export default instance
export default RestaurantService;
