import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Star,
  Clock,
  Heart,
  Share2,
  Eye,
  Tag
} from 'lucide-react';
import { MenuItem } from '@/types';
import { cn, formatCurrency } from '@/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, notes?: string) => void;
  categoryName: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  categoryName
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item, quantity, notes);
    setQuantity(1);
    setNotes('');
  };

  const getDietaryBadges = () => {
    const badges = [];
    if (item.isVegetarian) badges.push({ text: 'Vegetarian', color: 'bg-green-100 text-green-800' });
    if (item.isVegan) badges.push({ text: 'Vegan', color: 'bg-emerald-100 text-emerald-800' });
    if (item.isGlutenFree) badges.push({ text: 'Gluten Free', color: 'bg-blue-100 text-blue-800' });
    if (item.isHalal) badges.push({ text: 'Halal', color: 'bg-purple-100 text-purple-800' });
    return badges;
  };

  const getSpiceLevel = () => {
    if (!item.spiceLevel) return null;
    const levels = ['Mild', 'Medium', 'Hot', 'Very Hot'];
    const colors = ['bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800'];
    const spiceLevel = Number(item.spiceLevel) || 1;
    return { text: levels[spiceLevel - 1] || 'Mild', color: colors[spiceLevel - 1] || colors[0] };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      {/* Item Image */}
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Tag className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-colors',
            isFavorite 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
          )}
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {categoryName}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white text-primary-600 px-3 py-1 rounded-full text-lg font-bold shadow-sm">
            {formatCurrency(item.price)}
          </span>
        </div>
      </div>

      {/* Item Content */}
      <div className="p-4">
        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {item.name}
          </h3>
          {item.nameAr && (
            <p className="text-sm text-gray-600 font-arabic mb-2">
              {item.nameAr}
            </p>
          )}
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Dietary and Spice Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {getDietaryBadges().map((badge, index) => (
            <span
              key={index}
              className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                badge.color
              )}
            >
              {badge.text}
            </span>
          ))}
          {getSpiceLevel() && (
            <span
              className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                getSpiceLevel()!.color
              )}
            >
              🌶️ {getSpiceLevel()!.text}
            </span>
          )}
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            {item.preparationTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{item.preparationTime} min</span>
              </div>
            )}
            {item.calories && item.calories > 0 && (
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                <span>{item.calories} cal</span>
              </div>
            )}
          </div>
          
          {item.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{item.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            {/* Nutritional Information */}
            {item.nutritionalInfo && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Nutritional Info</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>Protein: {item.nutritionalInfo.protein}g</div>
                  <div>Carbs: {item.nutritionalInfo.carbohydrates}g</div>
                  <div>Fat: {item.nutritionalInfo.fat}g</div>
                  <div>Fiber: {item.nutritionalInfo.fiber}g</div>
                </div>
              </div>
            )}

            {/* Allergens */}
            {item.allergens && item.allergens.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Allergens</h4>
                <div className="flex flex-wrap gap-1">
                  {item.allergens.map((allergen, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Options */}
            {item.customizationOptions && item.customizationOptions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Customization Options</h4>
                <div className="space-y-2">
                  {item.customizationOptions.map((option, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      <span className="font-medium">{option.name}:</span>
                      <div className="ml-2 space-y-1">
                        {option.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex justify-between">
                            <span>{opt.name}</span>
                            {opt.price > 0 && (
                              <span className="text-primary-600">+{formatCurrency(opt.price)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              title={isExpanded ? 'Show less' : 'Show more'}
            >
              <Eye className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleAddToCart}
              className="btn-primary px-4 py-2 text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Notes Input */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Add special instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
