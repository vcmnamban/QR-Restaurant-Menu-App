import express from 'express';
import Joi from 'joi';
import { Restaurant } from '../models/Restaurant';
import { authenticate, authorize, authorizeOwner } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Validation schemas
const createRestaurantSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  nameAr: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(1000).required(),
  descriptionAr: Joi.string().min(10).max(1000),
  category: Joi.array().items(Joi.string()).min(1).required(),
  cuisine: Joi.array().items(Joi.string()).min(1).required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('Saudi Arabia'),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180)
    })
  }).required(),
  contact: Joi.object({
    phone: Joi.string().pattern(/^(\+966|966|0)?5[0-9]{8}$/).required(),
    email: Joi.string().email().required(),
    website: Joi.string().uri()
  }).required(),
  hours: Joi.object({
    sunday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    monday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    tuesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    wednesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    thursday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    friday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    saturday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    })
  }),
  features: Joi.array().items(Joi.string()),
  paymentMethods: Joi.array().items(Joi.string()),
  deliveryOptions: Joi.object({
    delivery: Joi.boolean().default(false),
    pickup: Joi.boolean().default(true),
    dineIn: Joi.boolean().default(true),
    deliveryFee: Joi.number().min(0),
    minimumOrder: Joi.number().min(0),
    deliveryRadius: Joi.number().min(0)
  })
});

const updateRestaurantSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  nameAr: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(1000),
  descriptionAr: Joi.string().min(10).max(1000),
  category: Joi.array().items(Joi.string()).min(1),
  cuisine: Joi.array().items(Joi.string()).min(1),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180)
    })
  }),
  contact: Joi.object({
    phone: Joi.string().pattern(/^(\+966|966|0)?5[0-9]{8}$/),
    email: Joi.string().email(),
    website: Joi.string().uri()
  }),
  hours: Joi.object({
    sunday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    monday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    tuesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    wednesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    thursday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    friday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    }),
    saturday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      isOpen: Joi.boolean()
    })
  }),
  features: Joi.array().items(Joi.string()),
  paymentMethods: Joi.array().items(Joi.string()),
  deliveryOptions: Joi.object({
    delivery: Joi.boolean(),
    pickup: Joi.boolean(),
    dineIn: Joi.boolean(),
    deliveryFee: Joi.number().min(0),
    minimumOrder: Joi.number().min(0),
    deliveryRadius: Joi.number().min(0)
  }),
  isActive: Joi.boolean()
});

// @route   POST /api/restaurants
// @desc    Create a new restaurant
// @access  Private (Restaurant owners only)
router.post('/', authenticate, authorize('restaurant_owner', 'admin'), asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = createRestaurantSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  // Check if user already has a restaurant
  const existingRestaurant = await Restaurant.findOne({ owner: req.user!.id });
  if (existingRestaurant && req.user!.role === 'restaurant_owner') {
    throw createError('You can only own one restaurant', 400);
  }

  // Create restaurant
  const restaurant = new Restaurant({
    ...value,
    owner: req.user!.id
  });

  await restaurant.save();

  res.status(201).json({
    success: true,
    message: 'Restaurant created successfully',
    data: {
      restaurant
    }
  });
}));

// @route   GET /api/restaurants/my
// @desc    Get current user's restaurants
// @access  Private
router.get('/my', authenticate, asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ owner: req.user!.id })
    .populate('owner', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: {
      restaurants
    }
  });
}));

// @route   GET /api/restaurants
// @desc    Get all restaurants (with filtering and pagination)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    cuisine,
    city,
    rating,
    isOpen,
    search,
    sortBy = 'rating',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter: any = { isActive: true, isVerified: true };

  if (category) {
    filter.category = { $in: Array.isArray(category) ? category : [category] };
  }

  if (cuisine) {
    filter.cuisine = { $in: Array.isArray(cuisine) ? cuisine : [cuisine] };
  }

  if (city) {
    filter['address.city'] = { $regex: city, $options: 'i' };
  }

  if (rating) {
    filter.rating = { $gte: parseFloat(rating as string) };
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Execute query
  const restaurants = await Restaurant.find(filter)
    .populate('owner', 'firstName lastName email')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit as string));

  // Get total count
  const total = await Restaurant.countDocuments(filter);

  res.json({
    success: true,
    data: {
      restaurants,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    }
  });
}));

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
    .populate('owner', 'firstName lastName email')
    .populate('menus', 'name description isActive');

  if (!restaurant) {
    throw createError('Restaurant not found', 404);
  }

  if (!restaurant.isActive) {
    throw createError('Restaurant is not active', 400);
  }

  res.json({
    success: true,
    data: {
      restaurant
    }
  });
}));

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant
// @access  Private (Owner or Admin)
router.put('/:id', authenticate, authorizeOwner(), asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = updateRestaurantSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  // Find restaurant
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    throw createError('Restaurant not found', 404);
  }

  // Check ownership (unless admin)
  if (req.user!.role !== 'admin' && restaurant.owner.toString() !== req.user!.id) {
    throw createError('Access denied', 403);
  }

  // Update restaurant
  Object.assign(restaurant, value);
  await restaurant.save();

  res.json({
    success: true,
    message: 'Restaurant updated successfully',
    data: {
      restaurant
    }
  });
}));

// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant
// @access  Private (Owner or Admin)
router.delete('/:id', authenticate, authorizeOwner(), asyncHandler(async (req, res) => {
  // Find restaurant
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    throw createError('Restaurant not found', 404);
  }

  // Check ownership (unless admin)
  if (req.user!.role !== 'admin' && restaurant.owner.toString() !== req.user!.id) {
    throw createError('Access denied', 403);
  }

  // Soft delete (set isActive to false)
  restaurant.isActive = false;
  await restaurant.save();

  res.json({
    success: true,
    message: 'Restaurant deleted successfully'
  });
}));

// @route   GET /api/restaurants/:id/menus
// @desc    Get restaurant menus
// @access  Public
router.get('/:id/menus', asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant || !restaurant.isActive) {
    throw createError('Restaurant not found or inactive', 404);
  }

  // This will be implemented when we create the Menu model
  // For now, return empty array
  res.json({
    success: true,
    data: {
      menus: []
    }
  });
}));

// @route   POST /api/restaurants/:id/verify
// @desc    Verify restaurant (Admin only)
// @access  Private (Admin only)
router.post('/:id/verify', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    throw createError('Restaurant not found', 404);
  }

  restaurant.isVerified = true;
  await restaurant.save();

  res.json({
    success: true,
    message: 'Restaurant verified successfully',
    data: {
      restaurant
    }
  });
}));

export default router;
