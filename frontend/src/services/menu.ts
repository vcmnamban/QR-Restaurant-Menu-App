import http from './api';
import { MenuItem, MenuCategory, ApiResponse } from '@/types';

// Menu service
export class MenuService {
  // Get all menu categories for a restaurant
  static async getCategories(restaurantId: string): Promise<MenuCategory[]> {
    const response = await http.get<MenuCategory[]>(`/restaurants/${restaurantId}/categories`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch categories');
  }

  // Get menu category by ID
  static async getCategory(categoryId: string): Promise<MenuCategory> {
    const response = await http.get<MenuCategory>(`/categories/${categoryId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch category');
  }

  // Create new menu category
  static async createCategory(restaurantId: string, categoryData: Partial<MenuCategory>): Promise<MenuCategory> {
    const response = await http.post<MenuCategory>(`/restaurants/${restaurantId}/categories`, categoryData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create category');
  }

  // Update menu category
  static async updateCategory(categoryId: string, categoryData: Partial<MenuCategory>): Promise<MenuCategory> {
    const response = await http.put<MenuCategory>(`/categories/${categoryId}`, categoryData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update category');
  }

  // Delete menu category
  static async deleteCategory(categoryId: string): Promise<void> {
    const response = await http.delete(`/categories/${categoryId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete category');
    }
  }

  // Get all menu items for a restaurant
  static async getMenuItems(restaurantId: string, params?: {
    categoryId?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: MenuItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await http.get<{
      items: MenuItem[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/restaurants/${restaurantId}/menu-items?${queryParams.toString()}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch menu items');
  }

  // Get menu item by ID
  static async getMenuItem(itemId: string): Promise<MenuItem> {
    const response = await http.get<MenuItem>(`/menu-items/${itemId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch menu item');
  }

  // Create new menu item
  static async createMenuItem(restaurantId: string, itemData: Partial<MenuItem>): Promise<MenuItem> {
    const response = await http.post<MenuItem>(`/restaurants/${restaurantId}/menu-items`, itemData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create menu item');
  }

  // Update menu item
  static async updateMenuItem(itemId: string, itemData: Partial<MenuItem>): Promise<MenuItem> {
    const response = await http.put<MenuItem>(`/menu-items/${itemId}`, itemData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update menu item');
  }

  // Delete menu item
  static async deleteMenuItem(itemId: string): Promise<void> {
    const response = await http.delete(`/menu-items/${itemId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete menu item');
    }
  }

  // Toggle menu item status (active/inactive)
  static async toggleItemStatus(itemId: string): Promise<MenuItem> {
    const response = await http.patch<MenuItem>(`/menu-items/${itemId}/toggle-status`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to toggle item status');
  }

  // Upload menu item image
  static async uploadItemImage(itemId: string, file: File): Promise<{ imageUrl: string }> {
    const response = await http.upload<{ imageUrl: string }>(`/menu-items/${itemId}/image`, file);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to upload image');
  }

  // Upload category image
  static async uploadCategoryImage(categoryId: string, file: File): Promise<{ imageUrl: string }> {
    const response = await http.upload<{ imageUrl: string }>(`/categories/${categoryId}/image`, file);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to upload category image');
  }

  // Reorder menu items
  static async reorderItems(restaurantId: string, itemIds: string[]): Promise<void> {
    const response = await http.patch(`/restaurants/${restaurantId}/menu-items/reorder`, { itemIds });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to reorder items');
    }
  }

  // Reorder categories
  static async reorderCategories(restaurantId: string, categoryIds: string[]): Promise<void> {
    const response = await http.patch(`/restaurants/${restaurantId}/categories/reorder`, { categoryIds });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to reorder categories');
    }
  }

  // Get public menu (for customers)
  static async getPublicMenu(restaurantId: string): Promise<{
    categories: Array<MenuCategory & { items: MenuItem[] }>;
  }> {
    const response = await http.get(`/restaurants/${restaurantId}/public-menu`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch public menu');
  }

  // Search menu items
  static async searchMenuItems(restaurantId: string, query: string): Promise<MenuItem[]> {
    const response = await http.get<MenuItem[]>(`/restaurants/${restaurantId}/menu-items/search`, {
      params: { q: query }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to search menu items');
  }

  // Get popular menu items
  static async getPopularItems(restaurantId: string, limit: number = 10): Promise<MenuItem[]> {
    const response = await http.get<MenuItem[]>(`/restaurants/${restaurantId}/menu-items/popular`, {
      params: { limit }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch popular items');
  }

  // Get menu analytics
  static async getMenuAnalytics(restaurantId: string, period: 'day' | 'week' | 'month' = 'month'): Promise<{
    totalItems: number;
    activeItems: number;
    totalCategories: number;
    popularCategories: Array<{ name: string; itemCount: number }>;
    topSellingItems: Array<{ name: string; salesCount: number; revenue: number }>;
  }> {
    const response = await http.get(`/restaurants/${restaurantId}/menu-analytics`, {
      params: { period }
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch menu analytics');
  }

  // Validate menu item data
  static validateMenuItemData(data: Partial<MenuItem>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Item name is required');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Item description is required');
    }

    if (!data.categoryId || data.categoryId.trim().length === 0) {
      errors.push('Category is required');
    }

    if (data.price === undefined || data.price < 0) {
      errors.push('Valid price is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate category data
  static validateCategoryData(data: Partial<MenuCategory>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Category name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format menu item data for API submission
  static formatMenuItemData(data: Partial<MenuItem>): Partial<MenuItem> {
    const formatted = { ...data };

    // Ensure required fields are present
    if (formatted.name) {
      formatted.name = formatted.name.trim();
    }

    if (formatted.description) {
      formatted.description = formatted.description.trim();
    }

    // Ensure price is a number
    if (formatted.price !== undefined) {
      formatted.price = parseFloat(formatted.price.toString()) || 0;
    }

    // Ensure comparePrice is a number
    if (formatted.comparePrice !== undefined) {
      formatted.comparePrice = parseFloat(formatted.comparePrice.toString()) || 0;
    }

    return formatted;
  }

  // Format category data for API submission
  static formatCategoryData(data: Partial<MenuCategory>): Partial<MenuCategory> {
    const formatted = { ...data };

    // Ensure required fields are present
    if (formatted.name) {
      formatted.name = formatted.name.trim();
    }

    if (formatted.description) {
      formatted.description = formatted.description.trim();
    }

    // Ensure sortOrder is a number
    if (formatted.sortOrder !== undefined) {
      formatted.sortOrder = parseInt(formatted.sortOrder.toString()) || 0;
    }

    return formatted;
  }
}

// Export default instance
export default MenuService;
