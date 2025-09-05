import express from 'express';
import Joi from 'joi';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Validation schemas
const paymentSettingsSchema = Joi.object({
  stripePublicKey: Joi.string().optional(),
  stripeSecretKey: Joi.string().optional(),
  paypalClientId: Joi.string().optional(),
  paypalClientSecret: Joi.string().optional(),
  madaEnabled: Joi.boolean().default(true),
  visaEnabled: Joi.boolean().default(true),
  mastercardEnabled: Joi.boolean().default(true),
  americanExpressEnabled: Joi.boolean().default(false),
  currency: Joi.string().valid('SAR', 'USD', 'EUR').default('SAR'),
  taxRate: Joi.number().min(0).max(100).default(15), // 15% VAT in Saudi Arabia
  serviceFee: Joi.number().min(0).max(100).default(0),
  minimumOrderAmount: Joi.number().min(0).default(0),
  maximumOrderAmount: Joi.number().min(0).optional(),
  refundPolicy: Joi.string().max(1000).optional(),
  termsAndConditions: Joi.string().max(2000).optional()
});

// @route   GET /api/payments/settings
// @desc    Get payment settings
// @access  Private (Restaurant owners and admins)
router.get('/settings', authenticate, authorize('restaurant_owner', 'admin'), asyncHandler(async (req, res) => {
  // For now, return default payment settings
  // In a real app, this would be stored in the database per restaurant
  const defaultSettings = {
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ? '***hidden***' : '',
    paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET ? '***hidden***' : '',
    madaEnabled: true,
    visaEnabled: true,
    mastercardEnabled: true,
    americanExpressEnabled: false,
    currency: 'SAR',
    taxRate: 15,
    serviceFee: 0,
    minimumOrderAmount: 0,
    maximumOrderAmount: null,
    refundPolicy: 'Refunds are processed within 3-5 business days',
    termsAndConditions: 'By placing an order, you agree to our terms and conditions.'
  };

  res.json({
    success: true,
    data: {
      settings: defaultSettings
    }
  });
}));

// @route   PUT /api/payments/settings
// @desc    Update payment settings
// @access  Private (Restaurant owners and admins)
router.put('/settings', authenticate, authorize('restaurant_owner', 'admin'), asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = paymentSettingsSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  // In a real app, this would save to the database
  // For now, just return success
  res.json({
    success: true,
    message: 'Payment settings updated successfully',
    data: {
      settings: value
    }
  });
}));

// @route   POST /api/payments/process
// @desc    Process payment
// @access  Private
router.post('/process', authenticate, asyncHandler(async (req, res) => {
  const { amount, currency, paymentMethod, orderId } = req.body;

  // Basic validation
  if (!amount || !currency || !paymentMethod || !orderId) {
    throw createError('Missing required payment fields', 400);
  }

  if (amount <= 0) {
    throw createError('Invalid payment amount', 400);
  }

  // In a real app, this would integrate with payment processors
  // For now, simulate a successful payment
  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    success: true,
    message: 'Payment processed successfully',
    data: {
      paymentId,
      amount,
      currency,
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
      timestamp: new Date().toISOString()
    }
  });
}));

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', asyncHandler(async (req, res) => {
  const paymentMethods = [
    {
      id: 'mada',
      name: 'Mada',
      description: 'Saudi Arabia\'s national payment system',
      enabled: true,
      icon: '💳'
    },
    {
      id: 'visa',
      name: 'Visa',
      description: 'Visa credit and debit cards',
      enabled: true,
      icon: '💳'
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      description: 'Mastercard credit and debit cards',
      enabled: true,
      icon: '💳'
    },
    {
      id: 'american_express',
      name: 'American Express',
      description: 'American Express credit cards',
      enabled: false,
      icon: '💳'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      description: 'Pay with Apple Pay',
      enabled: false,
      icon: '🍎'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      description: 'Pay with Google Pay',
      enabled: false,
      icon: '📱'
    }
  ];

  res.json({
    success: true,
    data: {
      paymentMethods: paymentMethods.filter(method => method.enabled)
    }
  });
}));

// @route   POST /api/payments/refund
// @desc    Process refund
// @access  Private (Restaurant owners and admins)
router.post('/refund', authenticate, authorize('restaurant_owner', 'admin'), asyncHandler(async (req, res) => {
  const { paymentId, amount, reason } = req.body;

  if (!paymentId || !amount) {
    throw createError('Payment ID and amount are required', 400);
  }

  if (amount <= 0) {
    throw createError('Invalid refund amount', 400);
  }

  // In a real app, this would process the refund with payment processor
  const refundId = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    success: true,
    message: 'Refund processed successfully',
    data: {
      refundId,
      paymentId,
      amount,
      reason: reason || 'Customer request',
      status: 'completed',
      timestamp: new Date().toISOString()
    }
  });
}));

export default router;
