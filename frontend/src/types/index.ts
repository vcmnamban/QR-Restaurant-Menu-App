// User Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'restaurant_owner' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  dateOfBirth?: Date;
  profileImage?: string;
  address?: Address;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UserPreferences {
  language: 'en' | 'ar';
  currency: 'SAR' | 'USD' | 'EUR';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Restaurant Types
export interface Restaurant {
  _id: string;
  owner: string | User;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  logo?: string;
  images: string[];
  category: string[];
  cuisine: string[];
  rating: number;
  totalReviews: number;
  address: Address;
  contact: ContactInfo;
  hours: OperatingHours;
  features: string[];
  paymentMethods: string[];
  deliveryOptions: DeliveryOptions;
  isActive: boolean;
  isVerified: boolean;
  subscription: SubscriptionInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
}

export interface OperatingHours {
  sunday?: DayHours;
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface DeliveryOptions {
  delivery: boolean;
  pickup: boolean;
  dineIn: boolean;
  deliveryFee?: number;
  minimumOrder?: number;
  deliveryRadius?: number;
}

export interface SubscriptionInfo {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// Menu Types
export interface Menu {
  _id: string;
  restaurant: string | Restaurant;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  isActive: boolean;
  isDefault: boolean;
  categories: MenuCategory[];
  items: MenuItem[];
  currency: 'SAR' | 'USD' | 'EUR';
  taxRate: number;
  serviceCharge: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface MenuItem {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  allergens: string[];
  nutritionalInfo?: NutritionalInfo;
  preparationTime: number;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  customizationOptions?: CustomizationOption[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface CustomizationOption {
  name: string;
  options: {
    name: string;
    price: number;
  }[];
  required: boolean;
  multiple: boolean;
  maxSelections?: number;
}

// Order Types
export interface Order {
  _id: string;
  customer: string | User;
  restaurant: string | Restaurant;
  items: OrderItem[];
  totalAmount: number;
  taxAmount: number;
  serviceCharge: number;
  deliveryFee?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  deliveryAddress?: Address;
  deliveryInstructions?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  menuItem: string | MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizationOptions?: {
    name: string;
    selectedOptions: string[];
    additionalPrice: number;
  }[];
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'restaurant_owner';
  dateOfBirth?: Date;
  address?: Address;
  preferences?: UserPreferences;
}

export interface RestaurantForm {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category: string[];
  cuisine: string[];
  address: Address;
  contact: ContactInfo;
  hours: OperatingHours;
  features: string[];
  paymentMethods: string[];
  deliveryOptions: DeliveryOptions;
}

export interface MenuForm {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  isDefault: boolean;
  categories: MenuCategory[];
  items: MenuItem[];
  currency: 'SAR' | 'USD' | 'EUR';
  taxRate: number;
  serviceCharge: number;
}

// UI Types
export interface Theme {
  mode: 'light' | 'dark';
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface Modal {
  id: string;
  isOpen: boolean;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

// Filter and Search Types
export interface RestaurantFilters {
  category?: string[];
  cuisine?: string[];
  city?: string;
  rating?: number;
  isOpen?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MenuFilters {
  category?: string[];
  isAvailable?: boolean;
  isPopular?: boolean;
  dietary?: string[];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// QR Code Types
export interface QRCodeData {
  restaurantId: string;
  menuId?: string;
  tableNumber?: string;
  type: 'menu' | 'table' | 'payment';
  metadata?: Record<string, any>;
}
