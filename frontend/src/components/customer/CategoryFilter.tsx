import React from 'react';
import { MenuCategory } from '@/types';
import { cn } from '@/utils';

interface CategoryFilterProps {
  categories: MenuCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
      
      <div className="space-y-2">
        {/* All Categories Option */}
        <button
          onClick={() => onSelectCategory('')}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
            selectedCategory === ''
              ? 'bg-primary-100 text-primary-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          All Categories
        </button>

        {/* Individual Categories */}
        {categories
          .filter(category => category.isActive)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((category) => (
            <button
              key={category._id}
              onClick={() => onSelectCategory(category._id)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2',
                selectedCategory === category._id
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {/* Category Color Indicator */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color || '#3B82F6' }}
              />
              
              {/* Category Name */}
              <span className="truncate">{category.name}</span>
              
              {/* Item Count (if available) */}
              {category.itemCount !== undefined && (
                <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {category.itemCount}
                </span>
              )}
            </button>
          ))}
      </div>

      {/* No Categories Message */}
      {categories.filter(category => category.isActive).length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No categories available</p>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
