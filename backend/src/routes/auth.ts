import express from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^(\+966|966|0)?5[0-9]{8}$/).required(),
  role: Joi.string().valid('customer', 'restaurant_owner', 'admin').default('customer'),
  dateOfBirth: Joi.date().max('now'),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string().default('Saudi Arabia')
  }),
  preferences: Joi.object({
    language: Joi.string().valid('en', 'ar').default('en'),
    currency: Joi.string().valid('SAR', 'USD', 'EUR').default('SAR'),
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      sms: Joi.boolean().default(true),
      push: Joi.boolean().default(true)
    })
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

// Generate JWT token
const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  const options: jwt.SignOptions = { expiresIn };
  
  return jwt.sign(
    { userId, role },
    secret,
    options
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { email, password, firstName, lastName, phone, role, dateOfBirth, address, preferences } = value;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError('User with this email already exists', 409);
  }

  // Check if phone number already exists
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw createError('User with this phone number already exists', 409);
  }

  // Create new user
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    phone,
    role,
    dateOfBirth,
    address,
    preferences
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id.toString(), user.role);

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: userResponse,
      token
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { email, password } = value;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw createError('Account is deactivated', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401);
  }

  // Generate token
  const token = generateToken(user._id.toString(), user.role);
  
  // Debug logging
  console.log('Login successful for user:', user.email);
  console.log('JWT Secret available:', !!process.env.JWT_SECRET);
  console.log('Token generated:', !!token);

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      token
    }
  });
}));

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = forgotPasswordSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { email } = value;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not for security
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  }

  // Generate reset token (expires in 1 hour)
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const resetExpiresIn = '1h' as jwt.SignOptions['expiresIn'];
  const resetOptions: jwt.SignOptions = { expiresIn: resetExpiresIn };
  const resetToken = jwt.sign(
    { userId: user._id, type: 'password-reset' },
    secret,
    resetOptions
  );

  // TODO: Send email with reset link
  // For now, just return success message
  // In production, implement email sending logic

  res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent'
  });
}));

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post('/reset-password', asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { token, password } = value;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (decoded.type !== 'password-reset') {
      throw createError('Invalid token type', 400);
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createError('User not found', 404);
    }

    // Update password
    user.password = password;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError('Invalid or expired token', 400);
    }
    throw error;
  }
}));

// @route   POST /api/auth/change-password
// @desc    Change password (requires authentication)
// @access  Private
router.post('/change-password', asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { currentPassword, newPassword } = value;

  // Get user from request (set by auth middleware)
  const userId = req.user?.id;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  // Find user and include password
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw createError('User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw createError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// @route   GET /api/auth/test
// @desc    Test endpoint to verify API is working
// @access  Public
router.get('/test', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Auth API is working!',
    timestamp: new Date().toISOString(),
    jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
  });
}));

// @route   GET /api/auth/debug
// @desc    Debug endpoint to check authentication
// @access  Public
router.get('/debug', asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  res.json({
    success: true,
    message: 'Debug info',
    hasAuthHeader: !!authHeader,
    authHeader: authHeader ? authHeader.substring(0, 20) + '...' : 'None',
    jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    timestamp: new Date().toISOString()
  });
}));

// @route   GET /api/auth/create-test-user
// @desc    Create a test user for development
// @access  Public
router.get('/create-test-user', asyncHandler(async (req, res) => {

  // Check if test user already exists
  const existingUser = await User.findOne({ email: 'test@example.com' });
  if (existingUser) {
    return res.json({
      success: true,
      message: 'Test user already exists',
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
  }

  // Create test user
  const testUser = new User({
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phone: '0501234567',
    role: 'customer',
    isVerified: true,
    isActive: true
  });

  await testUser.save();

  res.status(201).json({
    success: true,
    message: 'Test user created successfully',
    data: {
      email: 'test@example.com',
      password: 'password123',
      role: 'customer'
    }
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', asyncHandler(async (req, res) => {
  // Get user from request (set by auth middleware)
  const userId = req.user?.id;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw createError('User not found', 404);
  }

  res.json({
    success: true,
    data: {
      user
    }
  });
}));

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', asyncHandler(async (req, res) => {
  // Get user from request (set by auth middleware)
  const userId = req.user?.id;
  if (!userId) {
    throw createError('Authentication required', 401);
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw createError('User not found', 404);
  }

  // Update allowed fields
  const allowedUpdates = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'address', 'preferences'];
  const updates = req.body;
  
  allowedUpdates.forEach(field => {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  });

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user
    }
  });
}));

export default router;
