import express from 'express';
import Joi from 'joi';
import { Menu } from '../models/Menu';
import { Restaurant } from '../models/Restaurant';
import { authenticate, authorize, authorizeOwner } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Simple validation schema for testing
const createMenuSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  isActive: Joi.boolean().default(true)
});

// @route   GET /api/menus
// @desc    Get all menus
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const menus = await Menu.find({ isActive: true });
  res.json({
    success: true,
    data: { menus }
  });
}));

// @route   POST /api/menus
// @desc    Create a new menu
// @access  Private
router.post('/', authenticate, authorize('restaurant_owner', 'admin'), asyncHandler(async (req, res) => {
  const { error, value } = createMenuSchema.validate(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const menu = new Menu(value);
  await menu.save();

  res.status(201).json({
    success: true,
    message: 'Menu created successfully',
    data: { menu }
  });
}));

export default router;
