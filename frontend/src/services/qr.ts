import { api } from './api';
import { QRCode } from '@/types';

export interface GenerateQRCodeData {
  name: string;
  type: 'table' | 'menu' | 'restaurant' | 'custom';
  description?: string;
  targetUrl: string;
  tableNumber?: string;
  menuCategory?: string;
  customData?: Record<string, any>;
  design: {
    foregroundColor: string;
    backgroundColor: string;
    size: number;
    logo?: string;
    logoSize: number;
    cornerRadius: number;
  };
  settings: {
    isActive: boolean;
    expiresAt?: string;
    maxScans?: number;
    redirectType: 'direct' | 'landing';
  };
}

export interface UpdateQRCodeData extends Partial<GenerateQRCodeData> {}

class QRService {
  // Get all QR codes for a restaurant
  static async getQRCodes(restaurantId: string): Promise<QRCode[]> {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/qr-codes`);
      return response.data.qrCodes || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch QR codes');
    }
  }

  // Get a specific QR code
  static async getQRCode(qrCodeId: string): Promise<QRCode> {
    try {
      const response = await api.get(`/qr-codes/${qrCodeId}`);
      return response.data.qrCode;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch QR code');
    }
  }

  // Generate a new QR code
  static async generateQRCode(restaurantId: string, data: GenerateQRCodeData): Promise<QRCode> {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/qr-codes`, data);
      return response.data.qrCode;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate QR code');
    }
  }

  // Update an existing QR code
  static async updateQRCode(qrCodeId: string, data: UpdateQRCodeData): Promise<QRCode> {
    try {
      const response = await api.put(`/qr-codes/${qrCodeId}`, data);
      return response.data.qrCode;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update QR code');
    }
  }

  // Delete a QR code
  static async deleteQRCode(qrCodeId: string): Promise<void> {
    try {
      await api.delete(`/qr-codes/${qrCodeId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete QR code');
    }
  }

  // Toggle QR code status
  static async toggleQRCodeStatus(qrCodeId: string): Promise<QRCode> {
    try {
      const response = await api.patch(`/qr-codes/${qrCodeId}/toggle-status`);
      return response.data.qrCode;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to toggle QR code status');
    }
  }

  // Get QR code analytics
  static async getQRCodeAnalytics(qrCodeId: string, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<any> {
    try {
      const response = await api.get(`/qr-codes/${qrCodeId}/analytics?period=${period}`);
      return response.data.analytics;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch QR code analytics');
    }
  }

  // Get QR code statistics
  static async getQRCodeStats(qrCodeId: string): Promise<any> {
    try {
      const response = await api.get(`/qr-codes/${qrCodeId}/stats`);
      return response.data.stats;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch QR code statistics');
    }
  }

  // Download QR code image
  static async downloadQRCode(qrCodeId: string, format: 'png' | 'svg' | 'pdf' = 'png'): Promise<Blob> {
    try {
      const response = await api.get(`/qr-codes/${qrCodeId}/download?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to download QR code');
    }
  }

  // Bulk generate QR codes (e.g., for multiple tables)
  static async bulkGenerateQRCodes(restaurantId: string, data: {
    type: 'table' | 'menu';
    prefix?: string;
    count: number;
    design: GenerateQRCodeData['design'];
    settings: GenerateQRCodeData['settings'];
  }): Promise<QRCode[]> {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/qr-codes/bulk`, data);
      return response.data.qrCodes;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to bulk generate QR codes');
    }
  }

  // Get QR code scan history
  static async getQRCodeScanHistory(qrCodeId: string, page: number = 1, limit: number = 20): Promise<{
    scans: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await api.get(`/qr-codes/${qrCodeId}/scans?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch QR code scan history');
    }
  }

  // Validate QR code data
  static validateQRCodeData(data: GenerateQRCodeData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('QR code name is required');
    }

    if (!data.type) {
      errors.push('QR code type is required');
    }

    if (data.type === 'table' && !data.tableNumber) {
      errors.push('Table number is required for table QR codes');
    }

    if (data.type === 'menu' && !data.menuCategory) {
      errors.push('Menu category is required for menu QR codes');
    }

    if (data.type === 'custom' && !data.targetUrl) {
      errors.push('Target URL is required for custom QR codes');
    }

    if (data.design.size < 128 || data.design.size > 2048) {
      errors.push('QR code size must be between 128 and 2048 pixels');
    }

    if (data.design.logoSize > data.design.size * 0.3) {
      errors.push('Logo size cannot exceed 30% of QR code size');
    }

    if (data.settings.maxScans && data.settings.maxScans < 0) {
      errors.push('Maximum scans cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format QR code data for API
  static formatQRCodeData(data: GenerateQRCodeData): any {
    return {
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      design: {
        ...data.design,
        size: Math.min(Math.max(data.design.size, 128), 2048),
        logoSize: Math.min(data.design.logoSize, data.design.size * 0.3)
      },
      settings: {
        ...data.settings,
        maxScans: data.settings.maxScans || 0
      }
    };
  }

  // Get QR code preview URL
  static getQRCodePreviewUrl(qrCode: QRCode): string {
    return `${window.location.origin}/qr-preview/${qrCode._id}`;
  }

  // Get QR code type label
  static getQRCodeTypeLabel(type: string): string {
    switch (type) {
      case 'table':
        return 'Table QR Code';
      case 'menu':
        return 'Menu Category';
      case 'restaurant':
        return 'Restaurant';
      case 'custom':
        return 'Custom';
      default:
        return 'Unknown';
    }
  }

  // Get QR code status label
  static getQRCodeStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  // Check if QR code is expired
  static isQRCodeExpired(qrCode: QRCode): boolean {
    if (!qrCode.settings?.expiresAt) return false;
    return new Date(qrCode.settings.expiresAt) < new Date();
  }

  // Check if QR code has reached max scans
  static hasQRCodeReachedMaxScans(qrCode: QRCode): boolean {
    if (!qrCode.settings?.maxScans || qrCode.settings.maxScans === 0) return false;
    return (qrCode.stats?.totalScans || 0) >= qrCode.settings.maxScans;
  }

  // Get QR code usage percentage
  static getQRCodeUsagePercentage(qrCode: QRCode): number {
    if (!qrCode.settings?.maxScans || qrCode.settings.maxScans === 0) return 0;
    const percentage = ((qrCode.stats?.totalScans || 0) / qrCode.settings.maxScans) * 100;
    return Math.min(percentage, 100);
  }
}

export default QRService;
