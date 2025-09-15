import http from './api';
import { User, LoginForm, RegisterForm } from '@/types';
import { storage } from '@/utils';

// Authentication service
export class AuthService {
  // Login user
  static async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    try {
      const response = await http.post<{ user: User; token: string }>('/auth/login', credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store authentication data
        storage.set('authToken', token);
        storage.set('user', user);
        
        return { user, token };
      }
      
      // Extract proper error message
      let errorMessage = 'Login failed';
      if (response.error) {
        errorMessage = response.error;
      } else if (response.message) {
        errorMessage = response.message;
      }
      
      throw new Error(errorMessage);
    } catch (error: any) {
      // Handle rate limiting specifically
      if (error.message && error.message.includes('Too many requests')) {
        throw new Error('Too many login attempts. Please wait 15 minutes before trying again.');
      }
      throw error;
    }
  }

  // Register user
  static async register(userData: RegisterForm): Promise<{ user: User; token: string }> {
    const response = await http.post<{ user: User; token: string }>('/auth/register', userData);
    
    if (response.success && response.data) {
      const { user, token } = response.data;
      
      // Store authentication data
      storage.set('authToken', token);
      storage.set('user', user);
      
      return { user, token };
    }
    
    throw new Error(response.error || 'Registration failed');
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await http.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage
      storage.remove('authToken');
      storage.remove('user');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    const response = await http.get<User>('/auth/me');
    
    if (response.success && response.data) {
      // Update stored user data
      storage.set('user', response.data);
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get user data');
  }

  // Update user profile
  static async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await http.put<User>('/auth/profile', userData);
    
    if (response.success && response.data) {
      // Update stored user data
      const currentUser = storage.get('user');
      const updatedUser = { ...currentUser, ...response.data };
      storage.set('user', updatedUser);
      
      return response.data;
    }
    
    throw new Error(response.error || 'Profile update failed');
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await http.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Password change failed');
    }
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<void> {
    const response = await http.post('/auth/forgot-password', { email });
    
    if (!response.success) {
      throw new Error(response.error || 'Password reset request failed');
    }
  }

  // Reset password
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await http.post('/auth/reset-password', {
      token,
      password: newPassword,
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Password reset failed');
    }
  }

  // Refresh token (if implemented)
  static async refreshToken(): Promise<{ token: string }> {
    const response = await http.post<{ token: string }>('/auth/refresh-token');
    
    if (response.success && response.data) {
      const { token } = response.data;
      
      // Update stored token
      storage.set('authToken', token);
      
      return { token };
    }
    
    throw new Error(response.error || 'Token refresh failed');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = storage.get('authToken');
    const user = storage.get('user');
    
    return !!(token && user);
  }

  // Get stored user data
  static getStoredUser(): User | null {
    return storage.get('user');
  }

  // Get stored token
  static getStoredToken(): string | null {
    return storage.get('authToken');
  }

  // Check if user has specific role
  static hasRole(role: string): boolean {
    const user = storage.get('user');
    return user?.role === role;
  }

  // Check if user has any of the specified roles
  static hasAnyRole(roles: string[]): boolean {
    const user = storage.get('user');
    return roles.includes(user?.role || '');
  }

  // Check if user is admin
  static isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Check if user is restaurant owner
  static isRestaurantOwner(): boolean {
    return this.hasRole('restaurant_owner');
  }

  // Check if user is customer
  static isCustomer(): boolean {
    return this.hasRole('customer');
  }

  // Get user permissions (for future use)
  static getUserPermissions(): string[] {
    const user = storage.get('user');
    const permissions: string[] = [];
    
    if (user) {
      // Basic permissions based on role
      switch (user.role) {
        case 'admin':
          permissions.push('manage_users', 'manage_restaurants', 'manage_orders', 'view_analytics');
          break;
        case 'restaurant_owner':
          permissions.push('manage_own_restaurant', 'manage_own_menus', 'view_own_orders');
          break;
        case 'customer':
          permissions.push('place_orders', 'view_restaurants', 'manage_profile');
          break;
      }
    }
    
    return permissions;
  }

  // Check if user has specific permission
  static hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  // Validate token (basic check)
  static isTokenValid(): boolean {
    const token = storage.get('authToken');
    if (!token) return false;
    
    try {
      // Basic JWT structure validation
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < now) {
        // Token expired, clear it
        storage.remove('authToken');
        storage.remove('user');
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  // Auto-logout if token is invalid
  static validateAndCleanup(): boolean {
    if (!this.isTokenValid()) {
      this.logout();
      return false;
    }
    return true;
  }
}

// Export default instance
export default AuthService;
