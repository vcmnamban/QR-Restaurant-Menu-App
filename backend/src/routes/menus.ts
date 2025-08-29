import express from 'express';
import Joi from 'joi';
import { Menu } from '../models/Menu';
import { Restaurant } from '../models/Restaurant';
import { authenticate, authorize, authorizeOwner } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Validation schemas
const createMenuSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  nameAr: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(500).required(),
  descriptionAr: Joi.string().min(10).max(500),
  isDefault: Joi.boolean().default(false),
  categories: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    nameAr: Joi.string(),
    description: Joi.string(),
    descriptionAr: Joi.string(),
    image: Joi.string(),
    isActive: Joi.boolean().default(true),
    sortOrder: Joi.number().default(0)
  })),
  items: Joi.array().items(Joi.object({
    name: Joi.string().min(2).max(100).required(),
    nameAr: Joi.string().min(2).max(100),
    description: Joi.string().min(10).max(500).required(),
    descriptionAr: Joi.string().min(10).max(500),
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0),
    image: Joi.string(),
    category: Joi.string().required(),
    isAvailable: Joi.boolean().default(true),
    isPopular: Joi.boolean().default(false),
    isVegetarian: Joi.boolean().default(false),
    isVegan: Joi.boolean().default(false),
    isGlutenFree: Joi.boolean().default(false),
    isHalal: Joi.boolean().default(true),
    allergens: Joi.array().items(Joi.string()),
    nutritionalInfo: Joi.object({
      calories: Joi.number().min(0),
      protein: Joi.number().min(0),
      carbs: Joi.number().min(0),
      fat: Joi.number().min(0),
      fiber: Joi.number().min(0),
      sugar: Joi.number().min(0)
    }),
    preparationTime: Joi.number().min(1).max(180).required(),
    spiceLevel: Joi.string().valid('mild', 'medium', 'hot', 'extra-hot').default('mild'),
    customizationOptions: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      options: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).default(0)
      })),
      required: Joi.boolean().default(false),
      multiple: Joi.boolean().default(false),
      maxSelections: Joi.number().min(1)
    }))
  })).min(1).required(),
  currency: Joi.string().valid('SAR', 'USD', 'EUR').default('SAR'),
  taxRate: Joi.number().min(0).max(100).default(15),
  serviceCharge: Joi.number().min(0).max(100).default(0),
  isActive: Joi.boolean().default(true)
});

const updateMenuSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  nameAr: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(500),
  descriptionAr: Joi.string().min(10).max(500),
  isDefault: Joi.boolean(),
  categories: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    nameAr: Joi.string(),
    description: Joi.string(),
    descriptionAr: Joi.string(),
    image: Joi.string(),
    isActive: Joi.boolean(),
    sortOrder: Joi.number()
  })),
  items: Joi.array().items(Joi.object({
    name: Joi.string().min(2).max(100),
    nameAr: Joi.string().min(2).max(100),
    description: Joi.string().min(10).max(500),
    descriptionAr: Joi.string().min(10).max(500),
    price: Joi.number().min(0),
    originalPrice: Joi.number().min(0),
    image: Joi.string(),
    category: Joi.string(),
    isAvailable: Joi.boolean(),
    isPopular: Joi.boolean(),
    isVegetarian: Joi.boolean(),
    isVegan: Joi.boolean(),
    isGlutenFree: Joi.boolean(),
    isHalal: Joi.boolean(),
    allergens: Joi.array().items(Joi.string()),
    nutritionalInfo: Joi.object({
      calories: Joi.number().min(0),
      protein: Joi.number().min(0),
      carbs: Joi.number().min(0),
      fat: Joi.number().min(0),
      fiber: Joi.number().min(0),
      sugar: Joi.number().min(0)
    }),
    preparationTime: Joi.number().min(1).max(180),
    spiceLevel: Joi.string().valid('mild', 'medium', 'hot', 'extra-hot'),
    customizationOptions: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      options: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).default(0)
      })),
      required: Joi.boolean(),
      multiple: Joi.boolean(),
      maxSelections: Joi.number().min(1)
    }))
  }),
  currency: Joi.string().valid('SAR', 'USD', 'EUR'),
  taxRate: Joi.number().min(0).max(100),
  serviceCharge: Joi.number().min(0).max(100),
  isActive: Joi.boolean()
});

// @route   POST /api/menus
// @desc    Create a new menu
// @access  Private (Restaurant owners only)
router.post('/', authenticate, authorize('restaurant_owner', 'admin'), asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = createMenuSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  // Get restaurant ID from request (assuming it's passed in body or query)
  const restaurantId = req.body.restaurantId || req.query.restaurantId;
  if (!restaurantId) {
    throw createError('Restaurant ID is required', 400);
  }

  // Check if restaurant exists and user owns it
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw createError('Restaurant not found', 404);
  }

  if (req.user!.role !== 'admin' && restaurant.owner.toString() !== req.user!.id) {
    throw createError('Access denied', 403);
  }

  // Create menu
  const menu = new Menu({
    ...value,
    restaurant: restaurantId
  });

  await menu.save();

  res.status(201).json({
    success: true,
    message: 'Menu created successfully',
    data: {
      menu
    }
  });
}));

// @route   GET /api/menus
// @desc    Get all menus (with filtering and pagination)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    restaurant,
    category,
    isAvailable,
    isPopular,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter: any = { isActive: true };

  if (restaurant) {
    filter.restaurant = restaurant;
  }

  if (category) {
    filter['items.category'] = { $in: Array.isArray(category) ? category : [category] };
  }

  if (isAvailable !== undefined) {
    filter['items.isAvailable'] = isAvailable === 'true';
  }

  if (isPopular !== undefined) {
    filter['items.isPopular'] = isPopular === 'true';
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'items.name': { $regex: search, $options: 'i' } },
      { 'items.description': { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Execute query
  const menus = await Menu.find(filter)
    .populate('restaurant', 'name nameAr logo')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit as string));

  // Get total count
  const total = await Menu.countDocuments(filter);

  res.json({
    success: true,
    data: {
      menus,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    }
  });
}));

// @route   GET /api/menus/:id
// @desc    Get menu by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id)
    .populate('restaurant', 'name nameAr logo address contact hours');

  if (!menu) {
    throw createError('Menu not found', 404);
  }

  if (!menu.isActive) {
    throw createError('Menu is not active', 400);
  }

  res.json({
    success: true,
    data: {
      menu
    }
  });
}));

// @route   PUT /api/menus/:id
// @desc    Update menu
// @access  Private (Owner or Admin)
router.put('/:id', authenticate, authorizeOwner(), asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = updateMenuSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  // Find menu
  const menu = await Menu.findById(req.params.id);
  if (!menu) {
    throw createError('Menu not found', 404);
  }

  // Check ownership through restaurant
  const restaurant = await Restaurant.findById(menu.restaurant);
  if (!restaurant) {
    throw createError('Restaurant not found', 404);
  }

  if (req.user!.role !== 'admin' && restaurant.owner.toString() !== req.user!.id) {
    throw createError('Access denied', 403);
  }

  // Update menu
  Object.assign(menu, value);
  await menu.save();

  res.json({
    success: true,
    message: 'Menu updated successfully',
    data: {
      menu
    }
  });
}));

// @route   DELETE /api/menus/:id
// @desc    Delete menu
// @access  Private (Owner or Admin)
router.delete('/:id', authenticate, authorizeOwner(), asyncHandler(async (req, res) => {
  // Find menu
  const menu = await Menu.findById(req.params.id);
  if (!menu) {
    throw createError('Menu not found', 404);
  }

  // Check ownership through restaurant
  const restaurant = await Restaurant.findById(menu.restaurant);
  if (!restaurant) {
    throw createError('Restaurant not found', 404);
  }

  if (req.user!.role !== 'admin' && restaurant.owner.toString() !== req.user!.id) {
    throw createError('Access denied', 403);
  }

  // Soft delete (set isActive to false)
  menu.isActive = false;
  await menu.save();

  res.json({
    success: true,
    message: 'Menu deleted successfully'
  });
}));

// @route   GET /api/menus/restaurant/:restaurantId
// @desc    Get menus by restaurant ID
// @access  Public
router.get('/restaurant/:restaurantId', asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant || !restaurant.isActive) {
    throw createError('Restaurant not found or inactive', 404);
  }

  const menus = await Menu.find({
    restaurant: req.params.restaurantId,
    isActive: true
  }).populate('restaurant', 'name nameAr logo');

  res.json({
    success: true,
    data: {
      menus
    }
  });
}));

// @route   GET /api/menus/:id/items
// @desc    Get menu items with filtering
// @access  Public
router.get('/:id/items', asyncHandler(async (req, res) => {
  const {
    category,
    isAvailable,
    isPopular,
    dietary,
    search,
    sortBy = 'name',
    sortOrder = 'asc'
  } = req.query;

  const menu = await Menu.findById(req.params.id);
  if (!menu || !menu.isActive) {
    throw createError('Menu not found or inactive', 400);
  }

  let items = [...menu.items];

  // Apply filters
  if (category) {
    const categories = Array.isArray(category) ? category : [category];
    items = items.filter(item => categories.includes(item.category));
  }

  if (isAvailable !== undefined) {
    const available = isAvailable === 'true';
    items = items.filter(item => item.isAvailable === available);
  }

  if (isPopular !== undefined) {
    const popular = isPopular === 'true';
    items = items.filter(item => item.isPopular === popular);
  }

  if (dietary) {
    const dietaryOptions = Array.isArray(dietary) ? dietary : [dietary];
    items = items.filter(item => {
      return dietaryOptions.some(option => {
        switch (option) {
          case 'vegetarian':
            return item.isVegetarian;
          case 'vegan':
            return item.isVegan;
          case 'gluten-free':
            return item.isGlutenFree;
          case 'halal':
            return item.isHalal;
          default:
            return false;
        }
      });
    });
  }

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    items = items.filter(item =>
      searchRegex.test(item.name) ||
      searchRegex.test(item.description) ||
      searchRegex.test(item.category)
    );
  }

  // Sort items
  items.sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (sortOrder === 'desc') {
      return aValue < bValue ? 1 : -1;
    }
    return aValue > bValue ? 1 : -1;
  });

  res.json({
    success: true,
    data: {
      items,
      total: items.length
    }
  });
}));

export default router;
