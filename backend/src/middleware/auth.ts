import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { createError } from './errorHandler';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Access denied. No token provided.', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    // Check if user exists
    const user = await User.findById(decoded.userId).select('_id email role isActive');
    if (!user) {
      throw createError('User not found', 404);
    }

    // Check if user is active
    if (!user.isActive) {
      throw createError('Account is deactivated', 401);
    }

    // Add user info to request
    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(createError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

// Middleware to check if user has specific role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(createError('Authentication required', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(createError('Access denied. Insufficient permissions.', 403));
      return;
    }

    next();
  };
};

// Middleware to check if user owns the resource
export const authorizeOwner = (resourceOwnerField: string = 'owner') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        next(createError('Authentication required', 401));
        return;
      }

      // For admin users, allow access to all resources
      if (req.user.role === 'admin') {
        return next();
      }

      // For restaurant owners, check if they own the resource
      if (req.user.role === 'restaurant_owner') {
        const resourceId = req.params.id || req.params.restaurantId;
        if (!resourceId) {
          next(createError('Resource ID required', 400));
          return;
        }

        // This will be implemented when we create the specific resource models
        // For now, just pass through
        return next();
      }

      // For customers, only allow access to their own resources
      if (req.user.role === 'customer') {
        // Check if the resource belongs to the current user
        const resourceId = req.params.id || req.params.userId;
        if (resourceId && resourceId !== req.user.id) {
          next(createError('Access denied. You can only access your own resources.', 403));
          return;
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    const user = await User.findById(decoded.userId).select('_id email role isActive');
    if (user && user.isActive) {
      req.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email
      };
    }

    next();
  } catch (error) {
    // Continue without authentication on error
    next();
  }
};

