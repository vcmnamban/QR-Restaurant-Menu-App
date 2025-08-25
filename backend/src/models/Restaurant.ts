import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  nameAr?: string; // Arabic name
  description: string;
  descriptionAr?: string; // Arabic description
  logo?: string;
  coverImage?: string;
  images: string[];
  category: string[];
  cuisine: string[];
  rating: number;
  totalReviews: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  features: string[];
  paymentMethods: string[];
  deliveryOptions: {
    delivery: boolean;
    pickup: boolean;
    dineIn: boolean;
    deliveryFee?: number;
    minimumOrder?: number;
    deliveryRadius?: number;
  };
  isActive: boolean;
  isVerified: boolean;
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Restaurant owner is required']
  },
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  nameAr: {
    type: String,
    trim: true,
    maxlength: [100, 'Arabic restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Restaurant description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  descriptionAr: {
    type: String,
    trim: true,
    maxlength: [1000, 'Arabic description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  images: [{
    type: String
  }],
  category: [{
    type: String,
    required: [true, 'At least one category is required'],
    enum: [
      'Fast Food', 'Fine Dining', 'Casual Dining', 'Cafe', 'Bakery',
      'Pizza', 'Burger', 'Seafood', 'Steakhouse', 'Italian',
      'Chinese', 'Japanese', 'Thai', 'Indian', 'Mexican',
      'Mediterranean', 'Middle Eastern', 'Saudi', 'International'
    ]
  }],
  cuisine: [{
    type: String,
    required: [true, 'At least one cuisine type is required']
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State/Province is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    country: {
      type: String,
      default: 'Saudi Arabia'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^(\+966|966|0)?5[0-9]{8}$/, 'Please enter a valid Saudi phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
    }
  },
  hours: {
    sunday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      isOpen: { type: Boolean, default: true }
    },
    monday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      isOpen: { type: Boolean, default: true }
    },
    tuesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      isOpen: { type: Boolean, default: true }
    },
    wednesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      isOpen: { type: Boolean, default: true }
    },
    thursday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      isOpen: { type: Boolean, default: true }
    },
    friday: {
      open: { type: String, default: '14:00' },
      close: { type: String, default: '23:00' },
      isOpen: { type: Boolean, default: true }
    },
    saturday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      isOpen: { type: Boolean, default: true }
    }
  },
  features: [{
    type: String,
    enum: [
      'WiFi', 'Parking', 'Outdoor Seating', 'Private Dining',
      'Live Music', 'Sports TV', 'Family Friendly', 'Romantic',
      'Business Lunch', 'Happy Hour', 'Late Night', 'Breakfast',
      'Lunch', 'Dinner', 'Brunch', 'Halal', 'Vegetarian',
      'Vegan', 'Gluten Free', 'Wheelchair Accessible'
    ]
  }],
  paymentMethods: [{
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Digital Wallet', 'Bank Transfer']
  }],
  deliveryOptions: {
    delivery: {
      type: Boolean,
      default: false
    },
    pickup: {
      type: Boolean,
      default: true
    },
    dineIn: {
      type: Boolean,
      default: true
    },
    deliveryFee: {
      type: Number,
      min: [0, 'Delivery fee cannot be negative']
    },
    minimumOrder: {
      type: Number,
      min: [0, 'Minimum order cannot be negative']
    },
    deliveryRadius: {
      type: Number,
      min: [0, 'Delivery radius cannot be negative']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  qrCode: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
restaurantSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Virtual for average rating
restaurantSchema.virtual('averageRating').get(function() {
  return this.totalReviews > 0 ? (this.rating / this.totalReviews).toFixed(1) : 0;
});

// Index for better query performance
restaurantSchema.index({ owner: 1 });
restaurantSchema.index({ name: 'text', description: 'text' });
restaurantSchema.index({ category: 1 });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ 'address.city': 1 });
restaurantSchema.index({ rating: -1 });
restaurantSchema.index({ isActive: 1 });
restaurantSchema.index({ isVerified: 1 });

// Update rating when reviews change
restaurantSchema.methods.updateRating = function(newRating: number) {
  this.rating = ((this.rating * this.totalReviews) + newRating) / (this.totalReviews + 1);
  this.totalReviews += 1;
  return this.save();
};

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
