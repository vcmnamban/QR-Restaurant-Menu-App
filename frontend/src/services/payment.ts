import { api } from './api';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mada' | 'apple_pay' | 'stc_pay' | 'cash';
  last4?: string;
  brand?: string;
  isDefault: boolean;
  isActive: boolean;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  paymentMethodId?: string;
  clientSecret: string;
  description: string;
  metadata: Record<string, any>;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  paymentMethod: PaymentMethod;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}

export interface PaymentSettings {
  stripePublishableKey: string;
  madaEnabled: boolean;
  applePayEnabled: boolean;
  stcPayEnabled: boolean;
  cashEnabled: boolean;
  vatRate: number;
  vatEnabled: boolean;
  currency: string;
  supportedCurrencies: string[];
}

export interface CreatePaymentIntentRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethodType: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  paymentMethodId: string;
  returnUrl?: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason?: string;
}

export class PaymentService {
  // Get payment settings for the restaurant
  static async getPaymentSettings(): Promise<PaymentSettings> {
    try {
      const response = await api.get<PaymentSettings>('/payments/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      throw error;
    }
  }

  // Create a payment intent
  static async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    try {
      const response = await api.post<PaymentIntent>('/payments/create-intent', data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Confirm a payment
  static async confirmPayment(data: ConfirmPaymentRequest): Promise<PaymentTransaction> {
    try {
      const response = await api.post<PaymentTransaction>('/payments/confirm', data);
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Get payment methods for a customer
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await api.get<PaymentMethod[]>('/payments/methods');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  // Add a new payment method
  static async addPaymentMethod(paymentMethodData: any): Promise<PaymentMethod> {
    try {
      const response = await api.post<PaymentMethod>('/payments/methods', paymentMethodData);
      return response.data;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  // Remove a payment method
  static async removePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await api.delete(`/payments/methods/${paymentMethodId}`);
    } catch (error) {
      console.error('Error removing payment method:', error);
      throw error;
    }
  }

  // Set default payment method
  static async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await api.patch(`/payments/methods/${paymentMethodId}/default`);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  // Get payment transaction history
  static async getTransactionHistory(
    page: number = 1,
    limit: number = 20,
    filters?: Record<string, any>
  ): Promise<{ transactions: PaymentTransaction[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      
      const response = await api.get<{ transactions: PaymentTransaction[]; total: number; page: number; totalPages: number }>(
        `/payments/transactions?${params}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  // Get a specific transaction
  static async getTransaction(transactionId: string): Promise<PaymentTransaction> {
    try {
      const response = await api.get<PaymentTransaction>(`/payments/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  // Process refund
  static async processRefund(data: RefundRequest): Promise<PaymentTransaction> {
    try {
      const response = await api.post<PaymentTransaction>('/payments/refund', data);
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Validate payment method
  static async validatePaymentMethod(paymentMethodData: any): Promise<{ isValid: boolean; errors?: string[] }> {
    try {
      const response = await api.post<{ isValid: boolean; errors?: string[] }>('/payments/validate', paymentMethodData);
      return response.data;
    } catch (error) {
      console.error('Error validating payment method:', error);
      throw error;
    }
  }

  // Get payment analytics
  static async getPaymentAnalytics(
    startDate: string,
    endDate: string
  ): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    averageTransactionValue: number;
    paymentMethodBreakdown: Record<string, { count: number; amount: number }>;
    dailyRevenue: Array<{ date: string; revenue: number }>;
  }> {
    try {
      const response = await api.get('/payments/analytics', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      throw error;
    }
  }

  // Test payment integration
  static async testPaymentIntegration(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const response = await api.post('/payments/test-integration');
      return response.data;
    } catch (error) {
      console.error('Error testing payment integration:', error);
      throw error;
    }
  }

  // Get supported payment methods for an order
  static async getSupportedPaymentMethods(orderAmount: number, currency: string): Promise<PaymentMethod[]> {
    try {
      const response = await api.get('/payments/supported-methods', {
        params: { orderAmount, currency }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching supported payment methods:', error);
      throw error;
    }
  }

  // Calculate VAT amount
  static calculateVAT(amount: number, vatRate: number): number {
    return Math.round((amount * vatRate) / 100);
  }

  // Format currency amount
  static formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2
    }).format(amount / 100); // Assuming amount is in cents
  }

  // Validate card number (Luhn algorithm)
  static validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\s/g, '').split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Validate expiry date
  static validateExpiryDate(month: number, year: number): boolean {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    if (month < 1 || month > 12) return false;

    return true;
  }

  // Get payment method icon
  static getPaymentMethodIcon(type: string): string {
    switch (type) {
      case 'card':
        return '💳';
      case 'mada':
        return '🏦';
      case 'apple_pay':
        return '🍎';
      case 'stc_pay':
        return '📱';
      case 'cash':
        return '💵';
      default:
        return '💳';
    }
  }

  // Get payment method display name
  static getPaymentMethodDisplayName(type: string): string {
    switch (type) {
      case 'card':
        return 'Credit/Debit Card';
      case 'mada':
        return 'Mada Card';
      case 'apple_pay':
        return 'Apple Pay';
      case 'stc_pay':
        return 'STC Pay';
      case 'cash':
        return 'Cash';
      default:
        return 'Payment Method';
    }
  }
}

export default PaymentService;

