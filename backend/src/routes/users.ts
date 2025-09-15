import express from 'express';
import Joi from 'joi';
import { User } from '../models/User';
import { authenticate, authorize, authorizeOwner } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Validation schemas
const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^(\+966|966|0)?5[0-9]{8}$/),
  dateOfBirth: Joi.date().max('now'),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string().default('Saudi Arabia')
  }),
  preferences: Joi.object({
    language: Joi.string().valid('en', 'ar'),
    currency: Joi.string().valid('SAR', 'USD', 'EUR'),
    notifications: Joi.object({
      email: Joi.boolean(),
      sms: Joi.boolean(),
      push: Joi.boolean()
    })
  })
});

const updateUserByAdminSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^(\+966|966|0)?5[0-9]{8}$/),
  role: Joi.string().valid('customer', 'restaurant_owner', 'admin'),
  isVerified: Joi.boolean(),
  isActive: Joi.boolean(),
  dateOfBirth: Joi.date().max('now'),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string()
  }),
  preferences: Joi.object({
    language: Joi.string().valid('en', 'ar'),
    currency: Joi.string().valid('SAR', 'USD', 'EUR'),
    notifications: Joi.object({
      email: Joi.boolean(),
      sms: Joi.boolean(),
      push: Joi.boolean()
    })
  })
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    role,
    isVerified,
    isActive,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter: any = {};

  if (role) {
    filter.role = role;
  }

  if (isVerified !== undefined) {
    filter.isVerified = isVerified === 'true';
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Execute query
  const users = await User.find(filter)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit as string));

  // Get total count
  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    }
  });
}));

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin or self)
// @access  Private
router.get('/:id', authenticate, authorizeOwner(), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    throw createError('User not found', 404);
  }

  // Check if user can access this profile
  if (req.user!.role !== 'admin' && req.user!.id !== req.params.id) {
    throw createError('Access denied', 403);
  }

  res.json({
    success: true,
    data: {
      user
    }
  });
}));

// @route   PUT /api/users/:id
// @desc    Update user (Admin or self)
// @access  Private
router.put('/:id', authenticate, authorizeOwner(), asyncHandler(async (req, res) => {
  // Choose validation schema based on user role
  const schema = req.user!.role === 'admin' ? updateUserByAdminSchema : updateUserSchema;
  
  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  // Find user
  const user = await User.findById(req.params.id);
  if (!user) {
    throw createError('User not found', 404);
  }

  // Check if user can update this profile
  if (req.user!.role !== 'admin' && req.user!.id !== req.params.id) {
    throw createError('Access denied', 403);
  }

  // Update user
  Object.assign(user, value);
  await user.save();

  // Return user without password
  const userResponse = user.toObject();
  delete userResponse.password;

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: userResponse
    }
  });
}));

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw createError('User not found', 404);
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user!.id) {
    throw createError('Cannot delete your own account', 400);
  }

  // Soft delete (set isActive to false)
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

// @route   POST /api/users/:id/verify
// @desc    Verify user (Admin only)
// @access  Private (Admin only)
router.post('/:id/verify', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw createError('User not found', 404);
  }

  user.isVerified = true;
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  res.json({
    success: true,
    message: 'User verified successfully',
    data: {
      user: userResponse
    }
  });
}));

// @route   POST /api/users/:id/activate
// @desc    Activate/Deactivate user (Admin only)
// @access  Private (Admin only)
router.post('/:id/activate', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    throw createError('isActive must be a boolean', 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw createError('User not found', 404);
  }

  // Prevent admin from deactivating themselves
  if (user._id.toString() === req.user!.id && !isActive) {
    throw createError('Cannot deactivate your own account', 400);
  }

  user.isActive = isActive;
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  res.json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      user: userResponse
    }
  });
}));

// @route   GET /api/users/:id/restaurants
// @desc    Get restaurants owned by user
// @access  Private (Admin or self)
router.get('/:id/restaurants', authenticate, authorizeOwner(), asyncHandler(async (req, res) => {
  // Check if user can access this data
  if (req.user!.role !== 'admin' && req.user!.id !== req.params.id) {
    throw createError('Access denied', 403);
  }

  // This will be implemented when we create the Restaurant model
  // For now, return empty array
  res.json({
    success: true,
    data: {
      restaurants: []
    }
  });
}));

// @route   GET /api/users/:id/orders
// @desc    Get orders by user
// @access  Private (Admin or self)
router.get('/:id/orders', authenticate, authorizeOwner(), asyncHandler(async (req, res) => {
  // Check if user can access this data
  if (req.user!.role !== 'admin' && req.user!.id !== req.params.id) {
    throw createError('Access denied', 403);
  }

  // This will be implemented when we create the Order model
  // For now, return empty array
  res.json({
    success: true,
    data: {
      orders: []
    }
  });
}));

export default router;

