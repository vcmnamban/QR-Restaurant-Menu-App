import { http } from './api';
import { MenuItem, MenuCategory } from '@/types';

class MenuService {
  // Categories
  static async getCategories(restaurantId: string): Promise<MenuCategory[]> {
    const response = await http.get<{ categories: MenuCategory[] }>(`/restaurants/${restaurantId}/categories`);
    return response.data?.categories || [];
  }

  static async createCategory(restaurantId: string, categoryData: Partial<MenuCategory>): Promise<MenuCategory> {
    const response = await http.post<MenuCategory>(`/restaurants/${restaurantId}/categories`, categoryData);
    return response.data;
  }

  static async updateCategory(categoryId: string, categoryData: Partial<MenuCategory>): Promise<MenuCategory> {
    const response = await http.put<MenuCategory>(`/categories/${categoryId}`, categoryData);
    return response.data;
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    await http.delete(`/categories/${categoryId}`);
  }

  static async reorderCategories(restaurantId: string, categoryIds: string[]): Promise<void> {
    await http.put(`/restaurants/${restaurantId}/categories/reorder`, { categoryIds });
  }

  // Menu Items
  static async getMenuItems(restaurantId: string): Promise<{ items: MenuItem[] }> {
    const response = await http.get<{ menuItems: MenuItem[] }>(`/restaurants/${restaurantId}/menu-items`);
    return { items: response.data?.menuItems || [] };
  }

  static async createMenuItem(restaurantId: string, itemData: Partial<MenuItem>): Promise<MenuItem> {
    const response = await http.post<MenuItem>(`/restaurants/${restaurantId}/menu-items`, itemData);
    return response.data;
  }

  static async updateMenuItem(restaurantId: string, itemId: string, itemData: Partial<MenuItem>): Promise<MenuItem> {
    const response = await http.put<MenuItem>(`/restaurants/${restaurantId}/menu-items/${itemId}`, itemData);
    return response.data;
  }

  static async deleteMenuItem(restaurantId: string, itemId: string): Promise<void> {
    await http.delete(`/restaurants/${restaurantId}/menu-items/${itemId}`);
  }

  static async toggleItemStatus(itemId: string): Promise<void> {
    await http.patch(`/menu-items/${itemId}/toggle-status`);
  }
}

export default MenuService;