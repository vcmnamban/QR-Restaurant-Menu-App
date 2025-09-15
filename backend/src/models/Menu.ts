import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem {
  name: string;
  nameAr?: string; // Arabic name
  description: string;
  descriptionAr?: string; // Arabic description
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  allergens: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  preparationTime: number; // in minutes
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  customizationOptions?: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
    required: boolean;
    multiple: boolean;
    maxSelections?: number;
  }[];
}

export interface IMenu extends Document {
  restaurant: mongoose.Types.ObjectId;
  name: string;
  nameAr?: string; // Arabic name
  description: string;
  descriptionAr?: string; // Arabic description
  isActive: boolean;
  isDefault: boolean;
  categories: {
    name: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    image?: string;
    isActive: boolean;
    sortOrder: number;
  }[];
  items: IMenuItem[];
  currency: 'SAR' | 'USD' | 'EUR';
  taxRate: number;
  serviceCharge: number;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  nameAr: {
    type: String,
    trim: true,
    maxlength: [100, 'Arabic item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  descriptionAr: {
    type: String,
    trim: true,
    maxlength: [500, 'Arabic description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isHalal: {
    type: Boolean,
    default: true
  },
  allergens: [{
    type: String,
    enum: [
      'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 'Wheat',
      'Fish', 'Shellfish', 'Sesame', 'Mustard', 'Celery',
      'Lupin', 'Sulfites', 'Molluscs'
    ]
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 },
    sugar: { type: Number, min: 0 }
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [180, 'Preparation time cannot exceed 3 hours']
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra-hot'],
    default: 'mild'
  },
  customizationOptions: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        default: 0,
        min: 0
      }
    }],
    required: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxSelections: {
      type: Number,
      min: 1
    }
  }]
});

const menuSchema = new Schema<IMenu>({
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant is required']
  },
  name: {
    type: String,
    required: [true, 'Menu name is required'],
    trim: true,
    maxlength: [100, 'Menu name cannot exceed 100 characters']
  },
  nameAr: {
    type: String,
    trim: true,
    maxlength: [100, 'Arabic menu name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Menu description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  descriptionAr: {
    type: String,
    trim: true,
    maxlength: [500, 'Arabic description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  categories: [{
    name: {
      type: String,
      required: true
    },
    nameAr: String,
    description: String,
    descriptionAr: String,
    image: String,
    isActive: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  }],
  items: [menuItemSchema],
  currency: {
    type: String,
    enum: ['SAR', 'USD', 'EUR'],
    default: 'SAR'
  },
  taxRate: {
    type: Number,
    default: 15, // Saudi VAT rate
    min: [0, 'Tax rate cannot be negative'],
    max: [100, 'Tax rate cannot exceed 100%']
  },
  serviceCharge: {
    type: Number,
    default: 0,
    min: [0, 'Service charge cannot be negative'],
    max: [100, 'Service charge cannot exceed 100%']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items count
menuSchema.virtual('totalItems').get(function() {
  return this.items.length;
});

// Virtual for available items count
menuSchema.virtual('availableItems').get(function() {
  return this.items.filter(item => item.isAvailable).length;
});

// Virtual for popular items
menuSchema.virtual('popularItems').get(function() {
  return this.items.filter(item => item.isPopular);
});

// Index for better query performance
menuSchema.index({ restaurant: 1 });
menuSchema.index({ isActive: 1 });
menuSchema.index({ isDefault: 1 });
menuSchema.index({ 'items.category': 1 });
menuSchema.index({ 'items.isAvailable': 1 });
menuSchema.index({ 'items.isPopular': 1 });

// Ensure only one default menu per restaurant
menuSchema.index({ restaurant: 1, isDefault: 1 }, { unique: true, sparse: true });

// Pre-save middleware to handle default menu
menuSchema.pre('save', async function(next) {
  if (this.isDefault) {
    // Set all other menus for this restaurant to non-default
    await mongoose.model('Menu').updateMany(
      { restaurant: this.restaurant, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

export const Menu = mongoose.model<IMenu>('Menu', menuSchema);

