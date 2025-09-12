import React, { useState, useRef } from 'react';
import {
  Download,
  Copy,
  Share2,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  QrCode,
  Table,
  Utensils,
  Building,
  Link
} from 'lucide-react';
import { QRCode as QRCodeType } from '@/types';
import { cn, formatDate, formatTime } from '@/utils';

interface QRCodeGeneratorProps {
  qrCode: QRCodeType;
  onEdit: () => void;
  onDelete: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  qrCode,
  onEdit,
  onDelete
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'table':
        return <Table className="h-5 w-5" />;
      case 'menu':
        return <Utensils className="h-5 w-5" />;
      case 'restaurant':
        return <Building className="h-5 w-5" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'table':
        return 'bg-blue-100 text-blue-800';
      case 'menu':
        return 'bg-green-100 text-green-800';
      case 'restaurant':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleDownload = async () => {
    if (!qrCode.qrCodeImage) {
      console.error('No QR code image available for download');
      return;
    }

    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.download = `${qrCode.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`;
      link.href = qrCode.qrCodeImage;
      link.click();
    } catch (error) {
      console.error('Failed to download QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      const urlToCopy = qrCode.qrCodeData || qrCode.targetUrl || '';
      await navigator.clipboard.writeText(urlToCopy);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: qrCode.name,
          text: qrCode.description || `QR Code for ${qrCode.name}`,
          url: qrCode.targetUrl
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      // Fallback to copying URL
      handleCopyUrl();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            {getTypeIcon(qrCode.type)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{qrCode.name}</h2>
              <p className="text-sm text-gray-500">{qrCode.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="btn-outline p-2"
              title={showStats ? 'Hide stats' : 'Show stats'}
            >
              {showStats ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={onEdit}
              className="btn-outline p-2"
              title="Edit QR code"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="btn-outline p-2 text-red-600 hover:text-red-800"
              title="Delete QR code"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Display */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">QR Code Preview</h3>
              
              {/* QR Code Image */}
              <div className="bg-gray-50 rounded-lg p-6 inline-block">
                {qrCode.qrCodeImage ? (
                  <img 
                    src={qrCode.qrCodeImage} 
                    alt={`QR Code for ${qrCode.name}`}
                    className="border border-gray-200 rounded"
                    style={{
                      width: qrCode.design?.size || 256,
                      height: qrCode.design?.size || 256,
                      backgroundColor: qrCode.design?.backgroundColor || '#FFFFFF'
                    }}
                  />
                ) : (
                  <div 
                    className="border border-gray-200 rounded flex items-center justify-center text-gray-400"
                    style={{
                      width: qrCode.design?.size || 256,
                      height: qrCode.design?.size || 256,
                      backgroundColor: qrCode.design?.backgroundColor || '#FFFFFF'
                    }}
                  >
                    <div className="text-center">
                      <QrCode className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">QR Code Preview</p>
                      <p className="text-xs">No image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="btn-primary"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleCopyUrl}
                  className="btn-outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </button>
                
                <button
                  onClick={handleShare}
                  className="btn-outline"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">QR Code Details</h3>
            
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Type</span>
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getTypeColor(qrCode.type)
                )}>
                  {getTypeIcon(qrCode.type)}
                  <span className="ml-1 capitalize">{qrCode.type}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(qrCode.settings?.isActive ?? true)
                )}>
                  {qrCode.settings?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Created</span>
                <span className="text-sm text-gray-600">
                  {formatDate(qrCode.createdAt)}
                </span>
              </div>

              {qrCode.settings?.expiresAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Expires</span>
                  <span className="text-sm text-gray-600">
                    {formatDate(qrCode.settings.expiresAt)}
                  </span>
                </div>
              )}
            </div>

            {/* Target URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={qrCode.targetUrl}
                  readOnly
                  className="input flex-1 bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopyUrl}
                  className="btn-outline p-2"
                  title="Copy URL"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Design Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Design Settings</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Size:</span>
                  <span className="ml-2 text-gray-900">
                    {qrCode.design?.size || 256}px
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Logo Size:</span>
                  <span className="ml-2 text-gray-900">
                    {qrCode.design?.logoSize || 64}px
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Corner Radius:</span>
                  <span className="ml-2 text-gray-900">
                    {qrCode.design?.cornerRadius || 0}px
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Redirect:</span>
                  <span className="ml-2 text-gray-900 capitalize">
                    {qrCode.settings?.redirectType || 'direct'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats (if enabled) */}
            {showStats && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Usage Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Scans:</span>
                    <span className="ml-2 text-gray-900">
                      {qrCode.stats?.totalScans || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Unique Scans:</span>
                    <span className="ml-2 text-gray-900">
                      {qrCode.stats?.uniqueScans || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Scanned:</span>
                    <span className="ml-2 text-gray-900">
                      {qrCode.stats?.lastScanned 
                        ? formatTime(qrCode.stats.lastScanned)
                        : 'Never'
                      }
                    </span>
                  </div>
                  {qrCode.settings?.maxScans && qrCode.settings.maxScans > 0 && (
                    <div>
                      <span className="text-gray-500">Remaining:</span>
                      <span className="ml-2 text-gray-900">
                        {Math.max(0, qrCode.settings.maxScans - (qrCode.stats?.totalScans || 0))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
