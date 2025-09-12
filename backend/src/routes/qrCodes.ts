import express from 'express';
import QRCode from 'qrcode';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// In-memory storage for QR codes (in production, use database)
const qrCodesStorage = new Map<string, any[]>();

// Initialize sample QR codes on server start
const initializeSampleQRCodes = () => {
  console.log('🔧 Initializing sample QR codes...');
  
  // Sample QR codes for different restaurants
  const sampleQRCodes = [
    {
      _id: 'qr_001',
      restaurantId: '68c06ccb91f62a12fa494813', // Your test restaurant ID
      name: 'Table 1 Main Entrance',
      description: '4 seat table',
      type: 'table',
      targetUrl: 'TB01',
      qrCodeData: 'https://qr-restaurant-menu-app-01.vercel.app/menu/68c06ccb91f62a12fa494813?table=TB01',
      qrCodeImage: '', // Will be generated
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'qr_002',
      restaurantId: '68c06ccb91f62a12fa494813',
      name: 'Restaurant Main Menu',
      description: 'Full restaurant menu access',
      type: 'restaurant',
      targetUrl: '',
      qrCodeData: 'https://qr-restaurant-menu-app-01.vercel.app/menu/68c06ccb91f62a12fa494813',
      qrCodeImage: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  qrCodesStorage.set('68c06ccb91f62a12fa494813', sampleQRCodes);
  console.log('✅ Sample QR codes initialized');
};

// Initialize on server start
initializeSampleQRCodes();

// @route   GET /api/restaurants/:restaurantId/qr-codes
// @desc    Get all QR codes for a restaurant
// @access  Private
router.get('/:restaurantId/qr-codes', authenticate, asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  
  console.log('🔍 GET QR codes for restaurant:', restaurantId);
  
  // Get QR codes from storage
  const qrCodes = qrCodesStorage.get(restaurantId) || [];
  
  console.log('📊 Found QR codes:', qrCodes.length);
  
  res.json({
    success: true,
    qrCodes: qrCodes
  });
}));

// @route   GET /api/restaurants/:restaurantId/qr-codes/:qrCodeId
// @desc    Get a specific QR code
// @access  Private
router.get('/:restaurantId/qr-codes/:qrCodeId', authenticate, asyncHandler(async (req, res) => {
  const { restaurantId, qrCodeId } = req.params;
  
  console.log('🔍 GET QR code:', qrCodeId, 'for restaurant:', restaurantId);
  
  const qrCodes = qrCodesStorage.get(restaurantId) || [];
  const qrCode = qrCodes.find(qr => qr._id === qrCodeId);
  
  if (!qrCode) {
    return res.status(404).json({
      success: false,
      message: 'QR code not found'
    });
  }
  
  res.json({
    success: true,
    qrCode: qrCode
  });
}));

// @route   POST /api/restaurants/:restaurantId/qr-codes
// @desc    Generate a new QR code
// @access  Private
router.post('/:restaurantId/qr-codes', authenticate, asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { name, description, type, targetUrl } = req.body;
  
  console.log('🔧 Generating QR code for restaurant:', restaurantId);
  console.log('📝 QR code data:', { name, description, type, targetUrl });
  
  // Generate QR code data URL based on type
  let qrCodeData = '';
  let finalTargetUrl = targetUrl || '';
  
  switch (type) {
    case 'table':
      qrCodeData = `https://qr-restaurant-menu-app-01.vercel.app/menu/${restaurantId}?table=${finalTargetUrl}`;
      break;
    case 'menu':
      qrCodeData = `https://qr-restaurant-menu-app-01.vercel.app/menu/${restaurantId}?category=${finalTargetUrl}`;
      break;
    case 'restaurant':
      qrCodeData = `https://qr-restaurant-menu-app-01.vercel.app/menu/${restaurantId}`;
      finalTargetUrl = '';
      break;
    case 'custom':
      qrCodeData = finalTargetUrl;
      break;
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code type'
      });
  }
  
  // Generate QR code image
  let qrCodeImage = '';
  try {
    qrCodeImage = await QRCode.toDataURL(qrCodeData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('❌ Failed to generate QR code image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate QR code image'
    });
  }
  
  // Create new QR code object
  const newQRCode = {
    _id: `qr_${Date.now()}`,
    restaurantId,
    name: name || 'Untitled QR Code',
    description: description || '',
    type,
    targetUrl: finalTargetUrl,
    qrCodeData,
    qrCodeImage,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Store in memory
  const existingQRCodes = qrCodesStorage.get(restaurantId) || [];
  existingQRCodes.push(newQRCode);
  qrCodesStorage.set(restaurantId, existingQRCodes);
  
  console.log('✅ QR code generated successfully:', newQRCode._id);
  
  res.status(201).json({
    success: true,
    qrCode: newQRCode
  });
}));

// @route   PUT /api/restaurants/:restaurantId/qr-codes/:qrCodeId
// @desc    Update an existing QR code
// @access  Private
router.put('/:restaurantId/qr-codes/:qrCodeId', authenticate, asyncHandler(async (req, res) => {
  const { restaurantId, qrCodeId } = req.params;
  const { name, description, type, targetUrl, isActive } = req.body;
  
  console.log('🔧 Updating QR code:', qrCodeId, 'for restaurant:', restaurantId);
  
  const qrCodes = qrCodesStorage.get(restaurantId) || [];
  const qrCodeIndex = qrCodes.findIndex(qr => qr._id === qrCodeId);
  
  if (qrCodeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'QR code not found'
    });
  }
  
  // Update QR code data URL if type or target changed
  let qrCodeData = qrCodes[qrCodeIndex].qrCodeData;
  let finalTargetUrl = targetUrl || qrCodes[qrCodeIndex].targetUrl;
  
  if (type !== qrCodes[qrCodeIndex].type || targetUrl !== qrCodes[qrCodeIndex].targetUrl) {
    switch (type) {
      case 'table':
        qrCodeData = `https://qr-restaurant-menu-app-01.vercel.app/menu/${restaurantId}?table=${finalTargetUrl}`;
        break;
      case 'menu':
        qrCodeData = `https://qr-restaurant-menu-app-01.vercel.app/menu/${restaurantId}?category=${finalTargetUrl}`;
        break;
      case 'restaurant':
        qrCodeData = `https://qr-restaurant-menu-app-01.vercel.app/menu/${restaurantId}`;
        finalTargetUrl = '';
        break;
      case 'custom':
        qrCodeData = finalTargetUrl;
        break;
    }
    
    // Regenerate QR code image
    try {
      const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      qrCodes[qrCodeIndex].qrCodeImage = qrCodeImage;
    } catch (error) {
      console.error('❌ Failed to regenerate QR code image:', error);
    }
  }
  
  // Update QR code
  qrCodes[qrCodeIndex] = {
    ...qrCodes[qrCodeIndex],
    name: name || qrCodes[qrCodeIndex].name,
    description: description !== undefined ? description : qrCodes[qrCodeIndex].description,
    type: type || qrCodes[qrCodeIndex].type,
    targetUrl: finalTargetUrl,
    qrCodeData,
    isActive: isActive !== undefined ? isActive : qrCodes[qrCodeIndex].isActive,
    updatedAt: new Date()
  };
  
  qrCodesStorage.set(restaurantId, qrCodes);
  
  console.log('✅ QR code updated successfully:', qrCodeId);
  
  res.json({
    success: true,
    qrCode: qrCodes[qrCodeIndex]
  });
}));

// @route   DELETE /api/restaurants/:restaurantId/qr-codes/:qrCodeId
// @desc    Delete a QR code
// @access  Private
router.delete('/:restaurantId/qr-codes/:qrCodeId', authenticate, asyncHandler(async (req, res) => {
  const { restaurantId, qrCodeId } = req.params;
  
  console.log('🗑️ Deleting QR code:', qrCodeId, 'for restaurant:', restaurantId);
  
  const qrCodes = qrCodesStorage.get(restaurantId) || [];
  const qrCodeIndex = qrCodes.findIndex(qr => qr._id === qrCodeId);
  
  if (qrCodeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'QR code not found'
    });
  }
  
  // Remove QR code
  qrCodes.splice(qrCodeIndex, 1);
  qrCodesStorage.set(restaurantId, qrCodes);
  
  console.log('✅ QR code deleted successfully:', qrCodeId);
  
  res.json({
    success: true,
    message: 'QR code deleted successfully'
  });
}));

export default router;
