import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  QrCode,
  Download,
  Copy,
  Share2,
  Settings,
  Table,
  Utensils,
  Building,
  Plus,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

// Import components
import QRCodeGenerator from '@/components/qr/QRCodeGenerator';
import QRCodeList from '@/components/qr/QRCodeList';
import QRCodeForm from '@/components/qr/QRCodeForm';
import RoleGuard from '@/components/auth/RoleGuard';

// Import services
import QRService from '@/services/qr';
import RestaurantService from '@/services/restaurant';

// Import types
import { QRCode, Restaurant } from '@/types';
import { cn } from '@/utils';

type ViewMode = 'list' | 'generate' | 'edit' | 'view';
type QRCodeTypeEnum = 'table' | 'menu' | 'restaurant' | 'custom';

const QRGenerationPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);

  // Data states
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchQRCodes();
    }
  }, [selectedRestaurant]);

  const fetchRestaurants = async () => {
    try {
      const data = await RestaurantService.getMyRestaurants();
      setRestaurants(data);
      if (data.length > 0) {
        setSelectedRestaurant(data[0]);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch restaurants');
    }
  };

  const fetchQRCodes = async () => {
    if (!selectedRestaurant) return;

    setIsLoading(true);
    try {
      const data = await QRService.getQRCodes(selectedRestaurant._id);
      setQrCodes(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch QR codes');
    } finally {
      setIsLoading(false);
    }
  };

  // QR Code handlers
  const handleGenerateQR = () => {
    setSelectedQR(null);
    setViewMode('generate');
  };

  const handleEditQR = (qrCode: QRCode) => {
    setSelectedQR(qrCode);
    setViewMode('edit');
  };

  const handleViewQR = (qrCode: QRCode) => {
    setSelectedQR(qrCode);
    setViewMode('view');
  };

  const handleDeleteQR = async (qrCodeId: string) => {
    if (!selectedRestaurant) return;
    
    if (!confirm('Are you sure you want to delete this QR code? This action cannot be undone.')) {
      return;
    }

    try {
      await QRService.deleteQRCode(selectedRestaurant._id, qrCodeId);
      toast.success('QR code deleted successfully');
      fetchQRCodes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete QR code');
    }
  };

  const handleSubmitQR = async (data: Partial<QRCode>) => {
    if (!selectedRestaurant) return;

    setIsSubmitting(true);
    try {
      if (viewMode === 'generate') {
        await QRService.generateQRCode(selectedRestaurant._id, data as any);
        toast.success('QR code generated successfully');
      } else if (viewMode === 'edit' && selectedQR) {
        await QRService.updateQRCode(selectedRestaurant._id, selectedQR._id, data);
        toast.success('QR code updated successfully');
      }
      setViewMode('list');
      fetchQRCodes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save QR code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedQR(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'generate':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to QR Codes
              </button>
            </div>
            <QRCodeForm
              qrCode={selectedQR || undefined}
              onSubmit={handleSubmitQR}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              restaurant={selectedRestaurant!}
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
                Back to QR Codes
              </button>
            </div>
            <QRCodeForm
              qrCode={selectedQR || undefined}
              onSubmit={handleSubmitQR}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              restaurant={selectedRestaurant!}
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
                Back to QR Codes
              </button>
            </div>
            {selectedQR && (
              <QRCodeGenerator
                qrCode={selectedQR}
                onEdit={() => handleEditQR(selectedQR)}
                onDelete={() => handleDeleteQR(selectedQR._id)}
              />
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  QR Code Management
                </h2>
                <p className="text-sm text-gray-500">
                  Generate and manage QR codes for your restaurant
                </p>
              </div>
              <button
                onClick={handleGenerateQR}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate QR Code
              </button>
            </div>

            {/* Restaurant Selector */}
            <div>
              <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Restaurant
              </label>
              <select
                id="restaurant-select"
                value={selectedRestaurant?._id || ''}
                onChange={(e) => {
                  const restaurant = restaurants.find(r => r._id === e.target.value);
                  if (restaurant) {
                    setSelectedRestaurant(restaurant);
                  }
                }}
                className="input max-w-xs"
              >
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* QR Codes List */}
            <QRCodeList
              qrCodes={qrCodes}
              onViewQR={(qrCode: QRCode) => handleViewQR(qrCode)}
              onEditQR={(qrCode: QRCode) => handleEditQR(qrCode)}
              onDeleteQR={handleDeleteQR}
              isLoading={isLoading}
            />
          </div>
        );
    }
  };

  if (!selectedRestaurant) {
    return (
      <div className="text-center py-12">
        <QrCode className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Restaurant Selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please select a restaurant to manage its QR codes.
        </p>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['restaurant_owner', 'admin']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Code Generation</h1>
        <p className="mt-1 text-sm text-gray-500">
          {viewMode === 'list'
            ? 'Create and manage QR codes for tables, menus, and your restaurant'
            : viewMode === 'generate'
            ? 'Generate a new QR code'
            : viewMode === 'edit'
            ? 'Edit QR code settings'
            : 'View QR code details'
          }
        </p>
      </div>

        {/* Content */}
        {renderContent()}
      </div>
    </RoleGuard>
  );
};

export default QRGenerationPage;
