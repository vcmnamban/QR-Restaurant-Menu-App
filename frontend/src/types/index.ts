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
  restaurantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  postalCode?: string;
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
  cuisineType?: string;
  rating: number;
  totalReviews: number;
  address: Address;
  contact: ContactInfo;
  phone?: string;
  email?: string;
  website?: string;
  hours: OperatingHours;
  operatingHours?: OperatingHours;
  location?: string;
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
  _id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  itemCount?: number;
}

export interface MenuItem {
  _id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  comparePrice?: number;
  image?: string;
  category: string;
  categoryId?: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  isActive?: boolean;
  allergens: string[];
  tags?: string[];
  calories?: number;
  rating?: number;
  popularity?: number;
  nutritionalInfo?: NutritionalInfo;
  preparationTime: number;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  customizationOptions?: CustomizationOption[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  carbohydrates?: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium?: number;
}

export interface CustomizationOption {
  name: string;
  nameAr?: string;
  options: {
    name: string;
    nameAr?: string;
    price: number;
  }[];
  required: boolean;
  isRequired?: boolean;
  multiple: boolean;
  minSelections?: number;
  maxSelections?: number;
}

// Order Types
export interface Order {
  _id: string;
  orderNumber?: string;
  customer: string | User;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  restaurant: string | Restaurant;
  items: OrderItem[];
  totalAmount: number;
  taxAmount: number;
  serviceCharge: number;
  deliveryFee?: number;
  status: OrderStatus;
  statusHistory?: Array<{ status: OrderStatus; timestamp: Date; note?: string }>;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  deliveryMethod?: string;
  deliveryAddress?: Address;
  deliveryInstructions?: string;
  specialInstructions?: string;
  notes?: string[];
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  menuItem: string | MenuItem;
  menuItemId?: string;
  menuItemName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  price?: number;
  notes?: string;
  customizations?: Array<{ name: string; value: string; price: number }>;
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
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'paid'
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

export interface QRCode {
  _id: string;
  restaurant: string | Restaurant;
  type: 'menu' | 'table' | 'payment';
  data: QRCodeData;
  qrCodeImage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type QRCodeType = 'menu' | 'table' | 'payment';

export interface GenerateQRCodeData {
  restaurantId: string;
  type: QRCodeType;
  tableNumber?: string;
  menuId?: string;
}

export interface UpdateQRCodeData {
  type?: QRCodeType;
  tableNumber?: string;
  menuId?: string;
  isActive?: boolean;
}
