import React, { useState } from 'react';
import {
  QrCode,
  Table,
  Utensils,
  Building,
  Link,
  Eye,
  Edit,
  Trash2,
  Download,
  Copy,
  Share2,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { QRCode as QRCodeType } from '@/types';
import { cn, formatDate, formatTime } from '@/utils';

interface QRCodeListProps {
  qrCodes: QRCodeType[];
  onViewQR: (qrCode: QRCodeType) => void;
  onEditQR: (qrCode: QRCodeType) => void;
  onDeleteQR: (qrCodeId: string) => void;
  isLoading?: boolean;
}

const QRCodeList: React.FC<QRCodeListProps> = ({
  qrCodes,
  onViewQR,
  onEditQR,
  onDeleteQR,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'type' | 'scans'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  // Filter and sort QR codes
  const filteredAndSortedQRCodes = qrCodes
    .filter(qrCode => {
      const matchesSearch = searchQuery === '' ||
        qrCode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qrCode.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === '' || qrCode.type === selectedType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'scans':
          comparison = (a.stats?.totalScans || 0) - (b.stats?.totalScans || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleDownload = (qrCode: QRCodeType) => {
    // TODO: Implement actual QR code download
    console.log('Downloading QR code:', qrCode.name);
  };

  const handleCopyUrl = async (qrCode: QRCodeType) => {
    try {
      await navigator.clipboard.writeText(qrCode.targetUrl);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleShare = async (qrCode: QRCodeType) => {
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
      handleCopyUrl(qrCode);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="spinner mx-auto w-8 h-8"></div>
        <p className="mt-2 text-gray-600">Loading QR codes...</p>
      </div>
    );
  }

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <QrCode className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No QR codes yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by generating your first QR code.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search QR codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">All Types</option>
          <option value="table">Table</option>
          <option value="menu">Menu</option>
          <option value="restaurant">Restaurant</option>
          <option value="custom">Custom</option>
        </select>
        
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split('-');
            setSortBy(newSortBy as any);
            setSortOrder(newSortOrder as any);
          }}
          className="input max-w-xs"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="type-asc">Type A-Z</option>
          <option value="scans-desc">Most Scanned</option>
        </select>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedQRCodes.map((qrCode) => (
          <div
            key={qrCode._id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(qrCode.type)}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {qrCode.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {qrCode.description || 'No description'}
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Type and Status Badges */}
              <div className="flex items-center justify-between mt-3">
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getTypeColor(qrCode.type)
                )}>
                  {getTypeIcon(qrCode.type)}
                  <span className="ml-1 capitalize">{qrCode.type}</span>
                </span>
                
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(qrCode.settings?.isActive ?? true)
                )}>
                  {qrCode.settings?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Target URL */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Target URL
                </label>
                <div className="text-xs text-gray-600 truncate bg-gray-50 p-2 rounded">
                  {qrCode.targetUrl}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <div className="text-gray-900 font-medium">
                    {formatDate(qrCode.createdAt)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Scans:</span>
                  <div className="text-gray-900 font-medium">
                    {qrCode.stats?.totalScans || 0}
                  </div>
                </div>
              </div>

              {/* Design Info */}
              <div className="text-xs text-gray-500">
                <span>Size: {qrCode.design?.size || 256}px</span>
                {qrCode.design?.logo && (
                  <span className="ml-2">• Logo: {qrCode.design.logoSize || 64}px</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewQR(qrCode)}
                    className="btn-outline p-2 text-sm"
                    title="View QR code"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => onEditQR(qrCode)}
                    className="btn-outline p-2 text-sm"
                    title="Edit QR code"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDownload(qrCode)}
                    className="btn-outline p-2 text-sm"
                    title="Download QR code"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleCopyUrl(qrCode)}
                    className="btn-outline p-2 text-sm"
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleShare(qrCode)}
                    className="btn-outline p-2 text-sm"
                    title="Share QR code"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => onDeleteQR(qrCode._id)}
                    className="btn-outline p-2 text-sm text-red-600 hover:text-red-800"
                    title="Delete QR code"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedQRCodes.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No QR codes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeList;
