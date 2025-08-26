import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  QrCode,
  Table,
  Utensils,
  Building,
  Link,
  Palette,
  Settings,
  Eye,
  Copy
} from 'lucide-react';
import { QRCode as QRCodeType, Restaurant } from '@/types';
import { cn } from '@/utils';

interface QRCodeFormProps {
  qrCode?: QRCodeType;
  onSubmit: (data: Partial<QRCodeType>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  restaurant: Restaurant;
}

interface QRCodeFormData {
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

const QRCodeForm: React.FC<QRCodeFormProps> = ({
  qrCode,
  onSubmit,
  onCancel,
  isLoading = false,
  restaurant
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'design' | 'settings'>('basic');
  const [previewUrl, setPreviewUrl] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<QRCodeFormData>({
    defaultValues: {
      name: qrCode?.name || '',
      type: qrCode?.type || 'table',
      description: qrCode?.description || '',
      targetUrl: qrCode?.targetUrl || '',
      tableNumber: qrCode?.tableNumber || '',
      menuCategory: qrCode?.menuCategory || '',
      customData: qrCode?.customData || {},
      design: {
        foregroundColor: qrCode?.design?.foregroundColor || '#000000',
        backgroundColor: qrCode?.design?.backgroundColor || '#FFFFFF',
        size: qrCode?.design?.size || 256,
        logo: qrCode?.design?.logo || '',
        logoSize: qrCode?.design?.logoSize || 64,
        cornerRadius: qrCode?.design?.cornerRadius || 0
      },
      settings: {
        isActive: qrCode?.settings?.isActive ?? true,
        expiresAt: qrCode?.settings?.expiresAt || '',
        maxScans: qrCode?.settings?.maxScans || 0,
        redirectType: qrCode?.settings?.redirectType || 'direct'
      }
    },
    mode: 'onChange'
  });

  const watchedType = watch('type');
  const watchedTargetUrl = watch('targetUrl');

  // Generate preview URL based on type and target
  useEffect(() => {
    let url = '';
    
    switch (watchedType) {
      case 'table':
        url = `${window.location.origin}/menu/${restaurant._id}?table=${watchedTargetUrl}`;
        break;
      case 'menu':
        url = `${window.location.origin}/menu/${restaurant._id}?category=${watchedTargetUrl}`;
        break;
      case 'restaurant':
        url = `${window.location.origin}/menu/${restaurant._id}`;
        break;
      case 'custom':
        url = watchedTargetUrl;
        break;
    }
    
    setPreviewUrl(url);
  }, [watchedType, watchedTargetUrl, restaurant._id]);

  const handleFormSubmit = async (data: QRCodeFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit QR code:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'table':
        return <Table className="h-4 w-4" />;
      case 'menu':
        return <Utensils className="h-4 w-4" />;
      case 'restaurant':
        return <Building className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'table':
        return 'QR code for a specific table - customers can scan to view menu and place orders';
      case 'menu':
        return 'QR code for a specific menu category - customers can scan to view that category';
      case 'restaurant':
        return 'QR code for the entire restaurant - customers can scan to view full menu';
      case 'custom':
        return 'Custom QR code with your own URL or data';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'basic', label: 'Basic Info', icon: QrCode },
              { id: 'design', label: 'Design', icon: Palette },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* QR Code Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                QR Code Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'table', label: 'Table QR Code', description: 'For individual tables' },
                  { value: 'menu', label: 'Menu Category', description: 'For specific menu sections' },
                  { value: 'restaurant', label: 'Restaurant', description: 'For the entire restaurant' },
                  { value: 'custom', label: 'Custom', description: 'Custom URL or data' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'relative flex cursor-pointer rounded-lg border p-4 hover:bg-gray-50',
                      watchedType === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300'
                    )}
                  >
                    <input
                      type="radio"
                      {...register('type')}
                      value={option.value}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(option.value)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {getTypeDescription(watchedType)}
              </p>
            </div>

            {/* Name and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className={cn(
                    'input w-full',
                    errors.name && 'border-red-500'
                  )}
                  placeholder="e.g., Table 5, Main Menu, Restaurant Entrance"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  {...register('description')}
                  className="input w-full"
                  placeholder="Optional description"
                />
              </div>
            </div>

            {/* Type-specific fields */}
            {watchedType === 'table' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Number *
                </label>
                <input
                  type="text"
                  {...register('tableNumber', { required: 'Table number is required' })}
                  className={cn(
                    'input w-full',
                    errors.tableNumber && 'border-red-500'
                  )}
                  placeholder="e.g., 5, A1, VIP-1"
                />
                {errors.tableNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.tableNumber.message}</p>
                )}
              </div>
            )}

            {watchedType === 'menu' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Category *
                </label>
                <input
                  type="text"
                  {...register('menuCategory', { required: 'Menu category is required' })}
                  className={cn(
                    'input w-full',
                    errors.menuCategory && 'border-red-500'
                  )}
                  placeholder="e.g., appetizers, main-courses, desserts"
                />
                {errors.menuCategory && (
                  <p className="text-red-500 text-sm mt-1">{errors.menuCategory.message}</p>
                )}
              </div>
            )}

            {watchedType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target URL *
                </label>
                <input
                  type="url"
                  {...register('targetUrl', { required: 'Target URL is required' })}
                  className={cn(
                    'input w-full',
                    errors.targetUrl && 'border-red-500'
                  )}
                  placeholder="https://example.com"
                />
                {errors.targetUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.targetUrl.message}</p>
                )}
              </div>
            )}

            {/* Preview URL */}
            {watchedType !== 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={previewUrl}
                    readOnly
                    className="input w-full bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(previewUrl)}
                    className="btn-outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This is the URL that customers will be redirected to when they scan the QR code.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Design Tab */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foreground Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    {...register('design.foregroundColor')}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    {...register('design.foregroundColor')}
                    className="input flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    {...register('design.backgroundColor')}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    {...register('design.backgroundColor')}
                    className="input flex-1"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Size and Logo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Size (px)
                </label>
                <Controller
                  name="design.size"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="input w-full">
                      <option value={128}>128x128</option>
                      <option value={256}>256x256</option>
                      <option value={512}>512x512</option>
                      <option value={1024}>1024x1024</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Size (px)
                </label>
                <Controller
                  name="design.logoSize"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="input w-full">
                      <option value={32}>32x32</option>
                      <option value={48}>48x48</option>
                      <option value={64}>64x64</option>
                      <option value={96}>96x96</option>
                    </select>
                  )}
                />
              </div>
            </div>

            {/* Corner Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Corner Radius (px)
              </label>
              <Controller
                name="design.cornerRadius"
                control={control}
                render={({ field }) => (
                  <input
                    type="range"
                    {...field}
                    min="0"
                    max="20"
                    step="1"
                    className="w-full"
                  />
                )}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sharp</span>
                <span>Rounded</span>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <QrCode className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Upload a logo to display in the center of the QR code
                </p>
                <button
                  type="button"
                  className="btn-outline mt-2"
                >
                  Choose File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Active Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('settings.isActive')}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  QR Code is active
                </span>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Inactive QR codes will not redirect users when scanned.
              </p>
            </div>

            {/* Expiration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date (Optional)
              </label>
              <input
                type="datetime-local"
                {...register('settings.expiresAt')}
                className="input w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave empty for no expiration.
              </p>
            </div>

            {/* Max Scans */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Scans (Optional)
              </label>
              <input
                type="number"
                {...register('settings.maxScans')}
                min="0"
                className="input w-full"
                placeholder="0 for unlimited"
              />
              <p className="mt-1 text-sm text-gray-500">
                Set to 0 for unlimited scans.
              </p>
            </div>

            {/* Redirect Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect Type
              </label>
              <Controller
                name="settings.redirectType"
                control={control}
                render={({ field }) => (
                  <select {...field} className="input w-full">
                    <option value="direct">Direct Redirect</option>
                    <option value="landing">Landing Page</option>
                  </select>
                )}
              />
              <p className="mt-1 text-sm text-gray-500">
                Direct redirect goes straight to the target URL, landing page shows a brief welcome message first.
              </p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <>
                <div className="spinner w-4 h-4 mr-2"></div>
                Saving...
              </>
            ) : qrCode ? 'Update QR Code' : 'Generate QR Code'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QRCodeForm;
